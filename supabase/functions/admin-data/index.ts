import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get('Origin') || '*'
  const requestedHeaders = req.headers.get('Access-Control-Request-Headers')
  return requestedHeaders
    ? { ...corsHeaders, 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': requestedHeaders, Vary: 'Origin' }
    : { ...corsHeaders, 'Access-Control-Allow-Origin': origin, Vary: 'Origin' }
}

type ImportConflictStrategy = 'skip' | 'update'

type ImportRowAction = 'inserted' | 'updated' | 'skipped' | 'error'

interface ImportProductRowInput {
  row_number?: number
  sku?: string | null
  name?: string
  brand?: string
  strength?: string
  strength_mg?: number
  flavor?: string
  price?: number
  stock_count?: number
  is_active?: boolean
  image?: string | null
  image_2?: string | null
  image_3?: string | null
  description?: string | null
  description_it?: string | null
  popularity?: number
}

interface ExistingProductKey {
  id: string
  name: string
  sku: string | null
}

interface ImportRowResult {
  row_number: number
  action: ImportRowAction
  id: string | null
  name: string | null
  sku: string | null
  message: string
}

const normalizeKey = (value: string | null | undefined) =>
  (value || '').trim().toLowerCase()

const normalizeSku = (value: string | null | undefined) =>
  (value || '').trim().toUpperCase()

const cleanText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')

const toOptionalNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string') return null
  const normalized = value.replace(/[^0-9,.-]/g, '').replace(',', '.')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

const toBoolean = (value: unknown, fallback = true): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return fallback
  const normalized = value.trim().toLowerCase()
  if (['true', '1', 'yes', 'y', 'enabled', 'active'].includes(normalized)) return true
  if (['false', '0', 'no', 'n', 'disabled', 'inactive'].includes(normalized)) return false
  return fallback
}

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value)

const extensionFromContentType = (contentType: string | null) => {
  const normalized = (contentType || '').toLowerCase().split(';')[0].trim()
  if (normalized === 'image/jpeg') return 'jpg'
  if (normalized === 'image/png') return 'png'
  if (normalized === 'image/webp') return 'webp'
  if (normalized === 'image/gif') return 'gif'
  if (normalized === 'image/avif') return 'avif'
  if (normalized === 'image/svg+xml') return 'svg'
  return ''
}

const extensionFromUrl = (url: string) => {
  try {
    const pathname = new URL(url).pathname
    const lastSegment = pathname.split('/').pop() || ''
    const extension = lastSegment.includes('.') ? lastSegment.split('.').pop() || '' : ''
    return extension.replace(/[^a-z0-9]/gi, '').toLowerCase()
  } catch {
    return ''
  }
}

const shouldDownloadImage = (imageUrl: string, supabaseUrl: string) => {
  if (!isHttpUrl(imageUrl)) return false
  if (imageUrl.startsWith(`${supabaseUrl}/storage/v1/object/public/product-images/`)) {
    return false
  }
  return true
}

const downloadAndUploadImage = async (
  supabaseAdmin: ReturnType<typeof createClient>,
  supabaseUrl: string,
  imageUrl: string | null,
): Promise<{ url: string | null; warning: string | null }> => {
  if (!imageUrl) return { url: null, warning: null }
  const trimmed = imageUrl.trim()
  if (!trimmed) return { url: null, warning: null }

  if (!shouldDownloadImage(trimmed, supabaseUrl)) {
    return { url: trimmed, warning: null }
  }

  try {
    const response = await fetch(trimmed, { redirect: 'follow' })
    if (!response.ok) {
      return { url: trimmed, warning: `Image download failed with status ${response.status}` }
    }

    const contentType = response.headers.get('content-type')
    const contentTypeIsImage = (contentType || '').toLowerCase().startsWith('image/')
    if (!contentTypeIsImage) {
      return { url: trimmed, warning: 'Image URL did not return an image content-type' }
    }

    const extension = extensionFromContentType(contentType) || extensionFromUrl(trimmed) || 'jpg'
    const filePath = `products/import/${crypto.randomUUID()}.${extension}`
    const buffer = await response.arrayBuffer()

    const { error: uploadError } = await supabaseAdmin.storage
      .from('product-images')
      .upload(filePath, buffer, { contentType: contentType || 'image/jpeg', upsert: false })

    if (uploadError) {
      return { url: trimmed, warning: `Image upload failed: ${uploadError.message}` }
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return { url: publicUrlData.publicUrl, warning: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown image download error'
    return { url: trimmed, warning: message }
  }
}

Deno.serve(async (req) => {
  const responseCorsHeaders = getCorsHeaders(req)

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: responseCorsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Create admin client with service role
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    const { operation, table, data, match } = await req.json()

    // Validate required fields
    if (!operation) {
      return new Response(
        JSON.stringify({ error: 'Missing operation' }),
        { status: 400, headers: { ...responseCorsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Whitelist allowed tables for safety (only check for table-based operations)
    const allowedTables = ['products', 'user_roles', 'profiles', 'pages', 'page_blocks', 'menu_items', 'page_metadata']
    if (operation !== 'rpc' && (!table || !allowedTables.includes(table))) {
      return new Response(
        JSON.stringify({ error: `Table '${table}' is not allowed or missing` }),
        { status: 403, headers: { ...responseCorsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let result
    
    switch (operation) {
      case 'insert': {
        if (!data) {
          return new Response(
            JSON.stringify({ error: 'Missing data for insert' }),
            { status: 400, headers: { ...responseCorsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        const { data: insertedData, error } = await supabaseAdmin
          .from(table)
          .insert(data)
          .select()
        
        if (error) throw error
        result = insertedData
        break
      }
      
      case 'update': {
        if (!data || !match) {
          return new Response(
            JSON.stringify({ error: 'Missing data or match criteria for update' }),
            { status: 400, headers: { ...responseCorsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        let query = supabaseAdmin.from(table).update(data)
        
        // Apply match conditions
        for (const [key, value] of Object.entries(match)) {
          query = query.eq(key, value)
        }
        
        const { data: updatedData, error } = await query.select()
        if (error) throw error
        result = updatedData
        break
      }
      
      case 'delete': {
        if (!match) {
          return new Response(
            JSON.stringify({ error: 'Missing match criteria for delete' }),
            { status: 400, headers: { ...responseCorsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        let query = supabaseAdmin.from(table).delete()
        
        // Apply match conditions
        for (const [key, value] of Object.entries(match)) {
          query = query.eq(key, value)
        }
        
        const { data: deletedData, error } = await query.select()
        if (error) throw error
        result = deletedData
        break
      }
      
      case 'select': {
        let query = supabaseAdmin.from(table).select('*')
        
        if (match) {
          for (const [key, value] of Object.entries(match)) {
            query = query.eq(key, value)
          }
        }
        
        const { data: selectedData, error } = await query
        if (error) throw error
        result = selectedData
        break
      }

      case 'rpc': {
        // For special operations
        if (data?.function === 'get_user_by_email') {
          const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()
          if (error) throw error
          const user = users.users.find(u => u.email === data.email)
          result = user ? { id: user.id, email: user.email } : null
        } else if (data?.function === 'list_users') {
          const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()
          if (error) throw error
          result = users.users.map(u => ({ id: u.id, email: u.email, created_at: u.created_at }))
        } else if (data?.function === 'assign_admin_role') {
          // First get the user by email
          const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
          if (listError) throw listError
          const user = users.users.find(u => u.email === data.email)
          if (!user) {
            return new Response(
              JSON.stringify({ error: `User with email '${data.email}' not found` }),
              { status: 404, headers: { ...responseCorsHeaders, 'Content-Type': 'application/json' } }
            )
          }
          // Insert admin role
          const { data: roleData, error: roleError } = await supabaseAdmin
            .from('user_roles')
            .insert({ user_id: user.id, role: 'admin' })
            .select()
          if (roleError) throw roleError
          result = { user: { id: user.id, email: user.email }, role: roleData }
        } else if (data?.function === 'create_admin_user') {
          // Create a new user with email and password
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: data.email,
            password: data.password,
            email_confirm: true,
            user_metadata: { full_name: data.full_name }
          })
          if (createError) throw createError
          
          // Assign admin role
          const { data: roleData, error: roleError } = await supabaseAdmin
            .from('user_roles')
            .insert({ user_id: newUser.user.id, role: 'admin' })
            .select()
          if (roleError) throw roleError
          
          result = { user: { id: newUser.user.id, email: newUser.user.email }, role: roleData }
        } else if (data?.function === 'update_user_password') {
          // Update user password
          const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            data.user_id,
            { password: data.password }
          )
          if (updateError) throw updateError
          result = { user: { id: updatedUser.user.id, email: updatedUser.user.email }, success: true }
        } else if (data?.function === 'remove_admin_role') {
          // Remove admin role from user
          const { error: deleteError } = await supabaseAdmin
            .from('user_roles')
            .delete()
            .eq('user_id', data.user_id)
            .eq('role', 'admin')
          if (deleteError) throw deleteError
          result = { success: true }
        } else if (data?.function === 'list_admin_users') {
          // Get all admin users with their details
          const { data: adminRoles, error: rolesError } = await supabaseAdmin
            .from('user_roles')
            .select('user_id')
            .eq('role', 'admin')
          if (rolesError) throw rolesError
          
          const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
          if (usersError) throw usersError
          
          const adminUserIds = new Set(adminRoles.map(r => r.user_id))
          const adminUsers = users.users
            .filter(u => adminUserIds.has(u.id))
            .map(u => ({ 
              id: u.id, 
              email: u.email, 
              created_at: u.created_at,
              full_name: u.user_metadata?.full_name || null
            }))
          result = adminUsers
        } else if (data?.function === 'import_products') {
          const strategy: ImportConflictStrategy = data?.conflict_strategy === 'update' ? 'update' : 'skip'
          const rowsInput = Array.isArray(data?.rows) ? data.rows as ImportProductRowInput[] : []

          if (rowsInput.length === 0) {
            return new Response(
              JSON.stringify({ error: 'No rows provided for import' }),
              { status: 400, headers: { ...responseCorsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          if (rowsInput.length > 5000) {
            return new Response(
              JSON.stringify({ error: 'Too many rows. Maximum 5000 rows per import.' }),
              { status: 400, headers: { ...responseCorsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          const { data: existingProducts, error: existingError } = await supabaseAdmin
            .from('products')
            .select('id, name, sku')

          if (existingError) throw existingError

          const existingBySku = new Map<string, ExistingProductKey>()
          const existingByName = new Map<string, ExistingProductKey>()

          for (const product of existingProducts || []) {
            const skuKey = normalizeSku(product.sku)
            const nameKey = normalizeKey(product.name)
            if (skuKey && !existingBySku.has(skuKey)) {
              existingBySku.set(skuKey, product as ExistingProductKey)
            }
            if (nameKey && !existingByName.has(nameKey)) {
              existingByName.set(nameKey, product as ExistingProductKey)
            }
          }

          const seenSku = new Map<string, number>()
          const seenName = new Map<string, number>()
          const rowResults: ImportRowResult[] = []
          const summary = {
            total: rowsInput.length,
            inserted: 0,
            updated: 0,
            skipped: 0,
            errors: 0,
          }

          for (let index = 0; index < rowsInput.length; index += 1) {
            const rawRow = rowsInput[index]
            const rowNumber = Number.isFinite(rawRow.row_number) ? Number(rawRow.row_number) : index + 2

            const name = cleanText(rawRow.name)
            const brand = cleanText(rawRow.brand)
            const sku = cleanText(rawRow.sku)
            const strength = cleanText(rawRow.strength) || 'Regular'
            const flavor = cleanText(rawRow.flavor) || 'Mint'
            const price = toOptionalNumber(rawRow.price)
            const strengthMg = toOptionalNumber(rawRow.strength_mg)
            const stockCount = toOptionalNumber(rawRow.stock_count)
            const popularity = toOptionalNumber(rawRow.popularity)
            const isActive = toBoolean(rawRow.is_active, true)
            const description = cleanText(rawRow.description) || null
            const descriptionIt = cleanText(rawRow.description_it) || null
            const image = cleanText(rawRow.image) || null
            const image2 = cleanText(rawRow.image_2) || null
            const image3 = cleanText(rawRow.image_3) || null

            if (!name || !brand || price === null) {
              summary.errors += 1
              rowResults.push({
                row_number: rowNumber,
                action: 'error',
                id: null,
                name: name || null,
                sku: sku || null,
                message: 'Missing required fields (name, brand, and valid price are required).',
              })
              continue
            }

            const skuKey = normalizeSku(sku)
            const nameKey = normalizeKey(name)
            const duplicateSkuRow = skuKey ? seenSku.get(skuKey) : undefined
            const duplicateNameRow = nameKey ? seenName.get(nameKey) : undefined

            if (duplicateSkuRow || duplicateNameRow) {
              summary.skipped += 1
              rowResults.push({
                row_number: rowNumber,
                action: 'skipped',
                id: null,
                name,
                sku: sku || null,
                message: duplicateSkuRow
                  ? `Duplicate SKU in CSV (first seen in row ${duplicateSkuRow}).`
                  : `Duplicate product name in CSV (first seen in row ${duplicateNameRow}).`,
              })
              continue
            }

            if (skuKey) seenSku.set(skuKey, rowNumber)
            if (nameKey) seenName.set(nameKey, rowNumber)

            const skuMatch = skuKey ? existingBySku.get(skuKey) : undefined
            const nameMatch = nameKey ? existingByName.get(nameKey) : undefined

            if (skuMatch && nameMatch && skuMatch.id !== nameMatch.id) {
              summary.skipped += 1
              rowResults.push({
                row_number: rowNumber,
                action: 'skipped',
                id: null,
                name,
                sku: sku || null,
                message: 'Conflict is ambiguous: SKU matches one product and name matches another.',
              })
              continue
            }

            const existingMatch = skuMatch || nameMatch
            if (existingMatch && strategy === 'skip') {
              summary.skipped += 1
              rowResults.push({
                row_number: rowNumber,
                action: 'skipped',
                id: existingMatch.id,
                name,
                sku: sku || null,
                message: skuMatch
                  ? `Conflict on SKU with existing product "${existingMatch.name}".`
                  : `Conflict on name with existing product "${existingMatch.name}".`,
              })
              continue
            }

            const uploadedImage = await downloadAndUploadImage(supabaseAdmin, supabaseUrl, image)
            const uploadedImage2 = await downloadAndUploadImage(supabaseAdmin, supabaseUrl, image2)
            const uploadedImage3 = await downloadAndUploadImage(supabaseAdmin, supabaseUrl, image3)
            const warnings = [uploadedImage.warning, uploadedImage2.warning, uploadedImage3.warning].filter(Boolean)

            const productPayload = {
              sku: sku || null,
              name,
              brand,
              strength,
              strength_mg: Math.max(1, Math.round(strengthMg ?? 6)),
              flavor,
              price: Number((price ?? 0).toFixed(2)),
              stock_count: Math.max(0, Math.round(stockCount ?? 0)),
              is_active: isActive,
              image: uploadedImage.url,
              image_2: uploadedImage2.url,
              image_3: uploadedImage3.url,
              description,
              description_it: descriptionIt,
              popularity: Math.min(100, Math.max(1, Math.round(popularity ?? 50))),
            }

            try {
              if (existingMatch && strategy === 'update') {
                const { data: updatedRow, error: updateError } = await supabaseAdmin
                  .from('products')
                  .update(productPayload)
                  .eq('id', existingMatch.id)
                  .select('id, name, sku')
                  .single()

                if (updateError) throw updateError

                const updatedProduct = updatedRow as ExistingProductKey
                const updatedSkuKey = normalizeSku(updatedProduct.sku)
                const updatedNameKey = normalizeKey(updatedProduct.name)
                if (updatedSkuKey) existingBySku.set(updatedSkuKey, updatedProduct)
                if (updatedNameKey) existingByName.set(updatedNameKey, updatedProduct)

                summary.updated += 1
                rowResults.push({
                  row_number: rowNumber,
                  action: 'updated',
                  id: updatedProduct.id,
                  name: updatedProduct.name,
                  sku: updatedProduct.sku,
                  message: warnings.length > 0 ? `Updated with image warnings: ${warnings.join(' | ')}` : 'Updated existing product.',
                })
              } else {
                const { data: insertedRow, error: insertError } = await supabaseAdmin
                  .from('products')
                  .insert(productPayload)
                  .select('id, name, sku')
                  .single()

                if (insertError) throw insertError

                const insertedProduct = insertedRow as ExistingProductKey
                const insertedSkuKey = normalizeSku(insertedProduct.sku)
                const insertedNameKey = normalizeKey(insertedProduct.name)
                if (insertedSkuKey) existingBySku.set(insertedSkuKey, insertedProduct)
                if (insertedNameKey) existingByName.set(insertedNameKey, insertedProduct)

                summary.inserted += 1
                rowResults.push({
                  row_number: rowNumber,
                  action: 'inserted',
                  id: insertedProduct.id,
                  name: insertedProduct.name,
                  sku: insertedProduct.sku,
                  message: warnings.length > 0 ? `Inserted with image warnings: ${warnings.join(' | ')}` : 'Inserted new product.',
                })
              }
            } catch (rowError) {
              summary.errors += 1
              const message = rowError instanceof Error ? rowError.message : 'Unknown import error'
              rowResults.push({
                row_number: rowNumber,
                action: 'error',
                id: null,
                name,
                sku: sku || null,
                message,
              })
            }
          }

          result = { summary, rows: rowResults }
        } else {
          return new Response(
            JSON.stringify({ error: 'Unknown RPC function' }),
            { status: 400, headers: { ...responseCorsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break
      }
      
      default:
        return new Response(
          JSON.stringify({ error: `Unknown operation: ${operation}` }),
          { status: 400, headers: { ...responseCorsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...responseCorsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Admin data error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...responseCorsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
