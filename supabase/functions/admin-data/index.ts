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
