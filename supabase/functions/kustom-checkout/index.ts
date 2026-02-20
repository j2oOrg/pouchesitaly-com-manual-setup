import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type KustomLocale = 'en' | 'it'

interface CustomerInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

interface CartInputItem {
  id: string | number
  name: string
  packSize: number
  price: number
  quantity: number
  image?: string | null
}

interface CreateCheckoutBody {
  operation: 'create_checkout'
  locale?: KustomLocale
  currency?: string
  cart: CartInputItem[]
  customer: CustomerInput
}

interface MarkPaidBody {
  operation: 'mark_paid'
  order_id?: string
  kustom_order_id?: string
  kustom_order_token?: string
}

interface GetOrderBody {
  operation: 'get_order'
  order_id?: string
  kustom_order_id?: string
  kustom_order_token?: string
}

type FunctionBody = CreateCheckoutBody | MarkPaidBody | GetOrderBody

interface CreateCheckoutSession {
  order_id: string
  html_snippet: string
  order_token?: string
  checkout_url?: string
}

const toMinorAmount = (amount: number) => {
  return Math.max(0, Math.round((Number(amount) || 0) * 100))
}

const toMajorAmount = (amountMinor: number) => {
  return Number((Math.max(0, Number(amountMinor) || 0) / 100).toFixed(2))
}

const normalizeCountry = (country: string) => {
  if (!country) return 'IT'
  const normalized = country.trim().toUpperCase()
  return normalized.length === 2 ? normalized : 'IT'
}

const parseJson = (raw: string) => {
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const getRequestId = () => {
  try {
    return crypto.randomUUID()
  } catch {
    return `local-${Date.now()}-${Math.floor(Math.random() * 10000)}`
  }
}

const getNotes = (notes: unknown) => {
  const parsed = parseJson(String(notes || ''))
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
}

const buildAuthHeader = (merchantId: string, sharedSecret: string) => {
  return `Basic ${btoa(`${merchantId}:${sharedSecret}`)}`
}

const successResponse = (data: Record<string, unknown>, requestId?: string) => {
  const responseBody = requestId
    ? { success: true, data, request_id: requestId }
    : { success: true, data }
  return new Response(JSON.stringify(responseBody), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

const errorResponse = (message: string, status = 400, requestId?: string) => {
  const responseBody = requestId
    ? { success: false, error: message, request_id: requestId }
    : { success: false, error: message }
  return new Response(JSON.stringify(responseBody), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

const mapKustomStatusToOrderStatus = (
  remoteStatus?: string,
): 'pending' | 'processing' | 'cancelled' | 'refunded' => {
  const status = (remoteStatus || '').toLowerCase()

  if (
    status === 'authorized' ||
    status === 'captured' ||
    status === 'paid' ||
    status === 'closed' ||
    status === 'completed' ||
    status === 'checkout_complete'
  ) {
    return 'processing'
  }

  if (status === 'cancelled' || status === 'canceled' || status === 'expired' || status === 'failed') {
    return 'cancelled'
  }

  if (status === 'refunded') {
    return 'refunded'
  }

  return 'pending'
}

const callKustomApi = async (
  path: string,
  request: RequestInit & { headers?: Record<string, string> },
  merchantId: string,
  sharedSecret: string,
  apiBaseUrl: string,
  requestId: string,
) => {
  const auth = buildAuthHeader(merchantId, sharedSecret)
  const headers = {
    Authorization: auth,
    Accept: 'application/json',
    ...(request.headers || {}),
  }

  const startedAt = Date.now()
  console.debug(
    `[kustom-checkout][${requestId}] outbound request`,
    {
      path,
      method: request.method ?? 'GET',
      hasBody: !!request.body,
    },
  )

  const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}${path}`, {
    ...request,
    headers,
  })
  const raw = await response.text()

  let responseJson: unknown = null
  if (raw) {
    try {
      responseJson = JSON.parse(raw)
    } catch {
      responseJson = null
    }
  }

  if (!response.ok) {
    const detail = typeof responseJson === 'object' && responseJson
      ? JSON.stringify(responseJson)
      : raw || 'No response body'

    console.error(
      `[kustom-checkout][${requestId}] outbound request failed`,
      {
        status: response.status,
        detail,
      },
    )

    throw new Error(
      `Kustom API error (${response.status}): ${detail}`,
    )
  }

  console.debug(
    `[kustom-checkout][${requestId}] outbound response`,
    {
      path,
      status: response.status,
      tookMs: Date.now() - startedAt,
      bodyType: responseJson === null ? 'null' : typeof responseJson,
    },
  )

  return responseJson
}

const createCheckout = async (
  body: CreateCheckoutBody,
  supabaseAdmin: ReturnType<typeof createClient>,
  requestId = getRequestId(),
) => {
  const merchantId = Deno.env.get('KUSTOM_PLAYGROUND_MERCHANT_ID')
  const sharedSecret = Deno.env.get('KUSTOM_PLAYGROUND_SHARED_SECRET')
  const apiBaseUrl = Deno.env.get('KUSTOM_API_BASE_URL') || 'https://api.playground.kustom.co'
  const siteBaseUrl = Deno.env.get('SITE_BASE_URL') || 'http://localhost:3000'

  if (!merchantId || !sharedSecret) {
    console.error(`[kustom-checkout][${requestId}] missing merchant credentials`)
    return errorResponse('KUSTOM_PLAYGROUND_MERCHANT_ID or KUSTOM_PLAYGROUND_SHARED_SECRET is missing', 500, requestId)
  }

  const { customer, locale = 'it', currency = 'EUR', cart = [] } = body
  if (!customer?.email || !cart.length) {
    console.error(`[kustom-checkout][${requestId}] invalid payload`, { email: !!customer?.email, cartLength: cart.length })
    return errorResponse('Missing customer email or empty cart', 400, requestId)
  }

  console.info(`[kustom-checkout][${requestId}] create_checkout start`, {
    locale,
    currency,
    cartLength: cart.length,
  })

  const sanitizedCart = cart
    .filter((item) => item.price >= 0 && item.quantity > 0 && !!item.name)
    .map((item) => ({
      id: `${item.id}`,
      name: item.name,
      packSize: Math.max(1, Number(item.packSize) || 1),
      price: Number(item.price) || 0,
      quantity: Math.max(1, Number(item.quantity) || 1),
      image: item.image || null,
    }))
  if (!sanitizedCart.length) {
    console.error(`[kustom-checkout][${requestId}] sanitized cart empty`, { cartLength: cart.length })
    return errorResponse('Cart data is invalid', 400, requestId)
  }

  const orderLines = sanitizedCart.map((item) => {
    const unitPrice = toMinorAmount(item.price)
    const totalAmount = unitPrice * item.quantity

    return {
      type: 'physical',
      reference: `item-${item.id}-${item.packSize}`,
      name: `${item.name} (${item.packSize} pcs)`,
      quantity: item.quantity,
      quantity_unit: 'pcs',
      unit_price: unitPrice,
      tax_rate: 0,
      total_amount: totalAmount,
      total_discount_amount: 0,
      total_tax_amount: 0,
      image_url: item.image || undefined,
    }
  })

  const subtotal = orderLines.reduce((sum, line) => sum + line.total_amount, 0)
  const total = subtotal
  const orderAmount = toMajorAmount(total)
  const shippingAmount = toMajorAmount(0)

  const orderNumber = `PO-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 8)}`
  const customerName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
  const purchaseCountry = normalizeCountry(customer.country)
  const shippingAddress = {
    email: customer.email,
    given_name: customer.firstName,
    family_name: customer.lastName,
    street_address: customer.address,
    city: customer.city,
    postal_code: customer.postalCode,
    country: purchaseCountry,
    phone: customer.phone,
  }

  const initialNotes = {
    created_at: new Date().toISOString(),
    processor: 'kustom-playground',
    checkout: {
      order_number: orderNumber,
      cart_size: sanitizedCart.length,
    },
  }

  const { data: orderInsertData, error: orderInsertError } = await supabaseAdmin
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_email: customer.email,
      customer_name: customerName || null,
      customer_phone: customer.phone || null,
      shipping_address: shippingAddress,
      items: sanitizedCart,
      subtotal: orderAmount,
      shipping_cost: shippingAmount,
      total: orderAmount,
      status: 'pending',
      notes: JSON.stringify(initialNotes),
    })
    .select('id, order_number')
    .single()

  if (orderInsertError || !orderInsertData) {
    console.error(`[kustom-checkout][${requestId}] order insert failed`, { error: orderInsertError?.message })
    return errorResponse('Could not create order record', 400, requestId)
  }

  console.debug(`[kustom-checkout][${requestId}] order inserted`, {
    orderId: orderInsertData.id,
    orderNumber: orderInsertData.order_number,
  })

  const payload = {
    locale: locale === 'it' ? 'it-IT' : 'en-US',
    purchase_country: purchaseCountry,
    purchase_currency: currency,
    order_amount: total,
    order_tax_amount: 0,
    merchant_urls: {
      terms: `${siteBaseUrl}/terms`,
      checkout: `${siteBaseUrl}/checkout`,
      confirmation: `${siteBaseUrl}/checkout/confirmation`,
      push: `${siteBaseUrl}/checkout/return`,
    },
    order_lines: orderLines,
    merchant_reference1: orderNumber,
    billing_address: shippingAddress,
    shipping_address: shippingAddress,
  }

  let checkoutResponse: CreateCheckoutSession | null = null
  try {
    checkoutResponse = (await callKustomApi(
      '/checkout/v3/orders',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      merchantId,
      sharedSecret,
      apiBaseUrl,
      requestId,
    )) as CreateCheckoutSession | null
  } catch (error) {
    console.error(`[kustom-checkout][${requestId}] kustom checkout creation failed`, {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    await supabaseAdmin
      .from('orders')
      .update({
        status: 'cancelled',
        notes: JSON.stringify({
          ...getNotes(orderInsertData.notes),
          processor: 'kustom-playground',
          checkout_failed_at: new Date().toISOString(),
          checkout_error: error instanceof Error ? error.message : 'Unknown error',
        }),
      })
      .eq('id', orderInsertData.id)

    throw error
  }

  if (!checkoutResponse?.html_snippet || !checkoutResponse?.order_id) {
    console.error(`[kustom-checkout][${requestId}] invalid checkout response`, {
      hasOrderId: !!checkoutResponse?.order_id,
      hasHtmlSnippet: !!checkoutResponse?.html_snippet,
    })
    return errorResponse('Unexpected response from Kustom checkout API', 400, requestId)
  }

  const updatedNotes = {
    ...initialNotes,
    processor: 'kustom-playground',
    created_order_id: orderInsertData.id,
    kustom_order_id: checkoutResponse.order_id,
    kustom_order_token: checkoutResponse.order_token || null,
    checkout_snippet_created_at: new Date().toISOString(),
  }

  await supabaseAdmin
    .from('orders')
    .update({
      notes: JSON.stringify(updatedNotes),
    })
    .eq('id', orderInsertData.id)

  console.info(`[kustom-checkout][${requestId}] create_checkout complete`, {
    orderId: orderInsertData.id,
    kustomOrderId: checkoutResponse.order_id,
  })

  return successResponse({
    order_id: orderInsertData.id,
    order_number: orderInsertData.order_number,
    kustom_order_id: checkoutResponse.order_id,
    kustom_order_token: checkoutResponse.order_token || '',
    html_snippet: checkoutResponse.html_snippet,
    checkout_url: checkoutResponse.checkout_url || '',
    status: 'pending',
  }, requestId)
}

const markPaid = async (
  body: MarkPaidBody,
  supabaseAdmin: ReturnType<typeof createClient>,
  requestId = getRequestId(),
) => {
  const merchantId = Deno.env.get('KUSTOM_PLAYGROUND_MERCHANT_ID')
  const sharedSecret = Deno.env.get('KUSTOM_PLAYGROUND_SHARED_SECRET')
  const apiBaseUrl = Deno.env.get('KUSTOM_API_BASE_URL') || 'https://api.playground.kustom.co'

  if (!merchantId || !sharedSecret) {
    console.error(`[kustom-checkout][${requestId}] missing merchant credentials`)
    return errorResponse('KUSTOM_PLAYGROUND_MERCHANT_ID or KUSTOM_PLAYGROUND_SHARED_SECRET is missing', 500, requestId)
  }

  if (!body.order_id) {
    console.error(`[kustom-checkout][${requestId}] missing order_id in mark_paid`)
    return errorResponse('Missing order_id', 400, requestId)
  }

  console.info(`[kustom-checkout][${requestId}] mark_paid start`, { orderId: body.order_id })

  const { data: orderData, error: orderFetchError } = await supabaseAdmin
    .from('orders')
    .select('id, order_number, notes')
    .eq('id', body.order_id)
    .maybeSingle()

  if (orderFetchError || !orderData) {
    console.error(`[kustom-checkout][${requestId}] order not found`, { orderId: body.order_id })
    return errorResponse('Order not found', 404, requestId)
  }

  const notes = getNotes(orderData.notes)
  const knownKustom = notes.kustom as
    | { order_id?: string; order_token?: string; orderId?: string; orderToken?: string }
    | undefined
  const kustomOrderId = body.kustom_order_id || knownKustom?.order_id || notes.kustom_order_id || notes.kustomOrderId
  const kustomOrderToken =
    body.kustom_order_token ||
    (notes as Record<string, unknown>)?.kustom_order_token ||
    (notes as Record<string, unknown>)?.kustomOrderToken

  if (typeof kustomOrderId !== 'string' || !kustomOrderId) {
    console.error(`[kustom-checkout][${requestId}] missing kustom_order_id`)
    return errorResponse('Missing Kustom order id', 400, requestId)
  }

  const orderPath = `/checkout/v3/orders/${encodeURIComponent(kustomOrderId)}`
  const remoteResponse = await callKustomApi(
    kustomOrderToken && typeof kustomOrderToken === 'string'
      ? `${orderPath}?token=${encodeURIComponent(kustomOrderToken)}`
      : orderPath,
    { method: 'GET', headers: {} },
    merchantId,
    sharedSecret,
    apiBaseUrl,
    requestId,
  )

  const remoteStatus = typeof remoteResponse === 'object' && remoteResponse && 'status' in remoteResponse
    ? String((remoteResponse as { status?: unknown }).status || '')
    : ''
  const mappedStatus = mapKustomStatusToOrderStatus(remoteStatus)
  const paymentConfirmed = mappedStatus === 'processing'

  const mergedNotes = {
    ...notes,
    processor: 'kustom-playground',
    kustom_last_poll_at: new Date().toISOString(),
    kustom_order_id: kustomOrderId,
    ...(typeof kustomOrderToken === 'string' && kustomOrderToken ? { kustom_order_token: kustomOrderToken } : {}),
    kustom_status: remoteStatus || 'unknown',
    kustom_order_payload: remoteResponse,
  }

  await supabaseAdmin
    .from('orders')
    .update({
      status: mappedStatus,
      notes: JSON.stringify(mergedNotes),
    })
    .eq('id', orderData.id)

  return successResponse({
    order_id: orderData.id,
    order_number: orderData.order_number,
    status: mappedStatus,
    payment_confirmed: paymentConfirmed,
    kustom_status: remoteStatus || 'unknown',
    confirmation_data: remoteResponse,
  }, requestId)
}

const getOrder = async (
  body: GetOrderBody,
  supabaseAdmin: ReturnType<typeof createClient>,
  requestId = getRequestId(),
) => {
  if (!body.order_id) {
    return errorResponse('Missing order_id', 400, requestId)
  }

  console.info(`[kustom-checkout][${requestId}] get_order start`, { orderId: body.order_id })

  const { data: orderData, error: orderFetchError } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', body.order_id)
    .maybeSingle()

  if (orderFetchError || !orderData) {
    console.error(`[kustom-checkout][${requestId}] get_order not found`, { orderId: body.order_id })
    return errorResponse('Order not found', 404, requestId)
  }

  return successResponse({
    order: orderData,
  }, requestId)
}

Deno.serve(async (req) => {
  const requestId = getRequestId()
  console.info(`[kustom-checkout][${requestId}] incoming`, {
    method: req.method,
    url: req.url,
  })

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !serviceRoleKey) {
      console.error(`[kustom-checkout][${requestId}] missing supabase env`)
      return errorResponse('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing', 500, requestId)
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
    const body = (await req.json()) as FunctionBody

    if (!body?.operation) {
      return errorResponse('Missing operation', 400, requestId)
    }

    switch (body.operation) {
      case 'create_checkout': {
        const result = await createCheckout(body, supabaseAdmin, requestId)
        return result
      }
      case 'mark_paid': {
        const result = await markPaid(body, supabaseAdmin, requestId)
        return result
      }
      case 'get_order': {
        const result = await getOrder(body, supabaseAdmin, requestId)
        return result
      }
      default:
        console.error(`[kustom-checkout][${requestId}] unknown operation`, { operation: body.operation })
        return errorResponse(`Unknown operation: ${body.operation}`, 400, requestId)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[kustom-checkout][${requestId}] unhandled`, message)
    return errorResponse(`Kustom checkout function failed: ${message}`, 500, requestId)
  }
})
