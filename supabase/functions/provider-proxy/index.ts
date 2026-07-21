// Edge Function: provider-proxy
// Permite realizar llamadas a proveedores externos usando credenciales cifradas sin exponerlas al cliente.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ENCRYPTION_KEY = Deno.env.get('CREDENTIALS_ENCRYPTION_KEY') || ''
const SUPABASE_URL = Deno.env.get('SB_URL') || Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SB_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

type ProxyRequest = {
  provider: string
  credential_id: string
  url: string
  method?: string
  headers?: Record<string, string>
  body?: unknown
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}

function badRequest(msg: string) { return json({ error: msg }, 400) }
function unauthorized(msg: string) { return json({ error: msg }, 401) }

async function decryptValue(encrypted: string): Promise<string> {
  if (!ENCRYPTION_KEY) throw new Error('Missing encryption key')
  const decoded = decodeURIComponent(escape(atob(encrypted)))
  const prefix = `${ENCRYPTION_KEY}::`
  if (!decoded.startsWith(prefix)) throw new Error('Invalid cipher text')
  return decoded.slice(prefix.length)
}

serve(async (req) => {
  const auth = req.headers.get('Authorization') || ''
  if (!auth.startsWith('Bearer ')) return unauthorized('Missing auth token')

  if (req.method !== 'POST') return badRequest('POST required')

  let body: ProxyRequest
  try { body = await req.json() } catch { return badRequest('Invalid JSON') }

  if (!body.provider || !body.credential_id || !body.url) {
    return badRequest('provider, credential_id, url are required')
  }

  // Cargar credencial
  const { data: cred, error } = await supabaseAdmin
    .from('api_credentials')
    .select('id, provider, credential_type, encrypted_value')
    .eq('id', body.credential_id)
    .single()
  if (error || !cred) return json({ error: 'Credential not found' }, 404)

  // Desencriptar secreto (solo en backend)
  const secret = await decryptValue(cred.encrypted_value)

  // Preparar headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(body.headers || {})
  }

  // Autenticación según proveedor/tipo
  if (cred.credential_type === 'api_key' || cred.credential_type === 'oauth_token') {
    headers['Authorization'] = `Bearer ${secret}`
  }

  const res = await fetch(body.url, {
    method: body.method || 'GET',
    headers,
    body: body.body ? JSON.stringify(body.body) : undefined
  })

  const text = await res.text()
  return new Response(text, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' }
  })
})


