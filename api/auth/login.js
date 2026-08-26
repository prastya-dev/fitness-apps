// api/auth/login.js
// POST /api/auth/login

import { createClient } from '@supabase/supabase-js'
import { jsonResponse, errorResponse } from '../_lib/supabase.js'

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

  const { email, password } = body
  if (!email || !password) {
    return errorResponse('Email and password are required')
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return errorResponse('Server configuration error: missing Supabase credentials', 500)
  }

  const supabase = createClient(url, anonKey)
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) {
    return errorResponse(error.message, 400)
  }

  return jsonResponse({
    token: data.session?.access_token,
    user: data.user,
    session: data.session,
  })
}
