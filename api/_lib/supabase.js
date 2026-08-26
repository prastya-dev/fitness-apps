// api/_lib/supabase.js
// Supabase admin client untuk digunakan di API routes

import { createClient } from '@supabase/supabase-js'

export function createSupabaseAdmin() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars')
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

export async function verifyAuth(req) {
  const authHeader = req.headers?.authorization || (req.headers?.get ? req.headers.get('authorization') : null)
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return { user: null, error: 'Missing authorization token' }
  }

  const supabase = createSupabaseAdmin()
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return { user: null, error: 'Invalid or expired token' }
  }

  return { user, error: null }
}

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

export function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status)
}
