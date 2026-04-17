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

const jsonResponse = (req: Request, body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(req),
      'Content-Type': 'application/json',
    },
  })

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value)

const extensionFromContentType = (contentType: string | null) => {
  const normalized = (contentType || '').toLowerCase().split(';')[0].trim()
  if (normalized === 'image/jpeg') return 'jpg'
  if (normalized === 'image/png') return 'png'
  if (normalized === 'image/webp') return 'webp'
  return 'png'
}

interface RemoveBgRequest {
  imageUrl?: string
  size?: string
  format?: 'png' | 'jpg' | 'jpeg' | 'webp'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: getCorsHeaders(req) })
  }

  if (req.method !== 'POST') {
    return jsonResponse(req, { error: 'Method not allowed' }, 405)
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SB_PUBLISHABLE_KEY')
    const removeBgApiKey = Deno.env.get('REMOVE_BG_API_KEY')

    if (!supabaseUrl || !anonKey) {
      return jsonResponse(req, { error: 'Missing Supabase environment variables' }, 500)
    }

    if (!removeBgApiKey) {
      return jsonResponse(req, { error: 'Missing REMOVE_BG_API_KEY secret' }, 500)
    }

    const authHeader = req.headers.get('Authorization')
    const accessToken = authHeader?.replace(/^Bearer\s+/i, '').trim()

    if (!accessToken) {
      return jsonResponse(req, { error: 'Missing access token' }, 401)
    }

    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: authHeader!,
        },
      },
    })

    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser(accessToken)

    if (userError || !user) {
      return jsonResponse(req, { error: 'Unauthorized' }, 401)
    }

    const { data: adminRole, error: roleError } = await supabaseUser
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (roleError) {
      return jsonResponse(req, { error: roleError.message }, 500)
    }

    if (!adminRole) {
      return jsonResponse(req, { error: 'Admin access required' }, 403)
    }

    const body = (await req.json()) as RemoveBgRequest
    const imageUrl = body.imageUrl?.trim()
    const size = body.size?.trim() || 'auto'
    const requestedFormat = (body.format || 'png').toLowerCase()

    if (!imageUrl || !isHttpUrl(imageUrl)) {
      return jsonResponse(req, { error: 'A valid public imageUrl is required' }, 400)
    }

    const formData = new FormData()
    formData.append('image_url', imageUrl)
    formData.append('size', size)
    formData.append('format', requestedFormat)

    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': removeBgApiKey,
      },
      body: formData,
    })

    if (!removeBgResponse.ok) {
      const errorText = await removeBgResponse.text()
      return jsonResponse(
        req,
        { error: `remove.bg request failed (${removeBgResponse.status}): ${errorText}` },
        502,
      )
    }

    const contentType = removeBgResponse.headers.get('content-type') || 'image/png'
    const fileExtension = extensionFromContentType(contentType)
    const filePath = `products/processed/${crypto.randomUUID()}.${fileExtension}`
    const imageBuffer = await removeBgResponse.arrayBuffer()
    const imageBlob = new Blob([imageBuffer], { type: contentType })

    const { error: uploadError } = await supabaseUser.storage
      .from('product-images')
      .upload(filePath, imageBlob, {
        contentType,
        upsert: false,
      })

    if (uploadError) {
      return jsonResponse(req, { error: uploadError.message }, 500)
    }

    const { data: publicUrlData } = supabaseUser.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return jsonResponse(req, {
      success: true,
      url: publicUrlData.publicUrl,
      filePath,
      contentType,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown remove.bg error'
    return jsonResponse(req, { error: message }, 500)
  }
})
