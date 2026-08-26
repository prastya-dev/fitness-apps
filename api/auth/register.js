// api/auth/register.js
// POST /api/auth/register

import { createClient } from '@supabase/supabase-js'
import { createSupabaseAdmin, jsonResponse, errorResponse } from '../_lib/supabase.js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405)
  }

  let body
  try {
    body = await req.json()
  } catch {
    return errorResponse('Invalid JSON payload')
  }

  const { email, password, full_name } = body
  if (!email || !password) {
    return errorResponse('Email and password are required')
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return errorResponse('Server configuration error: missing Supabase credentials', 500)
  }

  const supabase = createClient(url, anonKey)
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { full_name: full_name?.trim() || '' }
    }
  })

  if (error) {
    return errorResponse(error.message, 400)
  }

  // Admin client untuk buat profil di database
  if (data.user) {
    try {
      const adminSupabase = createSupabaseAdmin()
      await adminSupabase.from('profiles').upsert({
        id: data.user.id,
        full_name: full_name?.trim() || 'User',
      }, { onConflict: 'id' })
    } catch (e) {
      console.error('[register] Failed to upsert profile:', e)
    }
  }

  return jsonResponse({
    token: data.session?.access_token || null,
    user: data.user,
    session: data.session,
  })
}
