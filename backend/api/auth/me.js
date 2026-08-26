// backend/api/auth/me.js
// GET /api/auth/me

import { verifyAuth, createSupabaseAdmin, jsonResponse, errorResponse } from '../_lib/supabase.js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'GET') {
    return errorResponse('Method not allowed', 405)
  }

  const { user, error: authError } = await verifyAuth(req)
  if (authError || !user) {
    return errorResponse(authError || 'Unauthorized', 401)
  }

  try {
    const supabase = createSupabaseAdmin()
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    return jsonResponse({
      user,
      profile: profile || {
        id: user.id,
        full_name: user.user_metadata?.full_name || 'User',
        email: user.email,
      }
    })
  } catch (err) {
    return jsonResponse({ user, profile: null })
  }
}
