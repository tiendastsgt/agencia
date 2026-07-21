// Deno Deploy / Supabase Edge Function for secure credential operations
// Endpoints:
//  - POST /encrypt: { credential_value } -> { encrypted_value }
//  - POST /decrypt: { credential_id } -> 403 (blocked). Only for server-to-server if ever needed.
//  - POST /validate: { credential_id } -> performs provider-specific validation (placeholder)

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

// In Supabase Edge Functions, use Deno.env for secrets (set in Dashboard)
const ENCRYPTION_KEY = Deno.env.get('CREDENTIALS_ENCRYPTION_KEY') || ''
const SUPABASE_URL = Deno.env.get('SB_URL') || Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SB_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

// Minimal Supabase client
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

type Json = Record<string, unknown>

async function json(req: Request): Promise<any> {
  try {
    return await req.json()
  } catch {
    return null
  }
}

function badRequest(message: string) {
  return new Response(JSON.stringify({ error: message }), { status: 400, headers: { 'Content-Type': 'application/json' } })
}

function unauthorized(message: string) {
  return new Response(JSON.stringify({ error: message }), { status: 401, headers: { 'Content-Type': 'application/json' } })
}

function ok(data: Json) {
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } })
}

// Placeholder symmetric encryption (do NOT use in prod; rely on pgcrypto or KMS)
async function encryptValue(value: string): Promise<string> {
  if (!ENCRYPTION_KEY) throw new Error('Missing encryption key')
  // Delegate to database pgcrypto ideally; here we simulate base64 with key tag
  const tagged = `${ENCRYPTION_KEY}::${value}`
  return btoa(unescape(encodeURIComponent(tagged)))
}

async function decryptValue(encrypted: string): Promise<string> {
  if (!ENCRYPTION_KEY) throw new Error('Missing encryption key')
  const decoded = decodeURIComponent(escape(atob(encrypted)))
  const prefix = `${ENCRYPTION_KEY}::`
  if (!decoded.startsWith(prefix)) throw new Error('Invalid cipher text')
  return decoded.slice(prefix.length)
}

async function validateCredential(credentialId: string): Promise<{ valid: boolean; error?: string }> {
  // Fetch credential row (respect RLS by checking owner through jwt if needed; here using admin for simplicity)
  const { data: cred, error } = await supabaseAdmin
    .from('api_credentials')
    .select('id, provider, credential_type, encrypted_value')
    .eq('id', credentialId)
    .single()
  if (error || !cred) return { valid: false, error: 'Credential not found' }

  // Decrypt secret
  const secret = await decryptValue(cred.encrypted_value)

  // Provider-specific simple validation
  try {
    if (cred.provider === 'facebook' || cred.provider === 'instagram') {
      const res = await fetch('https://graph.facebook.com/v18.0/me', {
        headers: { Authorization: `Bearer ${secret}` },
      })
      return { valid: res.ok, error: res.ok ? undefined : `HTTP ${res.status}` }
    }
    if (cred.provider === 'google') {
      const res = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
        headers: { Authorization: `Bearer ${secret}` },
      })
      return { valid: res.ok, error: res.ok ? undefined : `HTTP ${res.status}` }
    }
    if (cred.provider === 'youtube') {
      const res = await fetch('https://www.googleapis.com/youtube/v3/channels?mine=true&part=id', {
        headers: { Authorization: `Bearer ${secret}` },
      })
      return { valid: res.ok, error: res.ok ? undefined : `HTTP ${res.status}` }
    }
    // Default: assume api_key type is not verifiable without provider
    return { valid: true }
  } catch (e) {
    return { valid: false, error: (e as Error).message }
  }
}

serve(async (req) => {
  const url = new URL(req.url)

  const authHeader = req.headers.get('Authorization') || ''
  if (!authHeader.startsWith('Bearer ')) return unauthorized('Missing auth token')

  if (req.method === 'POST' && url.pathname.endsWith('/encrypt')) {
    const body = await json(req)
    if (!body || typeof body.credential_value !== 'string') {
      return badRequest('credential_value is required')
    }
    try {
      const encrypted_value = await encryptValue(body.credential_value)
      return ok({ encrypted_value })
    } catch (e) {
      return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
  }

  if (req.method === 'POST' && url.pathname.endsWith('/decrypt')) {
    return new Response(JSON.stringify({ error: 'Decrypt not allowed from client' }), { status: 403, headers: { 'Content-Type': 'application/json' } })
  }

  if (req.method === 'POST' && url.pathname.endsWith('/validate')) {
    const body = await json(req)
    if (!body || typeof body.credential_id !== 'string') {
      return badRequest('credential_id is required')
    }
    const result = await validateCredential(body.credential_id)
    return ok(result)
  }

  return new Response('Not found', { status: 404 })
})


