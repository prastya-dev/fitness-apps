// api/workouts/[id].js
// Vercel Serverless Function — Single Workout Session
//
// GET    /api/workouts/:id   — detail sesi latihan
// PATCH  /api/workouts/:id   — update sesi (status, kalori, durasi, dll)
// DELETE /api/workouts/:id   — hapus sesi

import { verifyAuth, createSupabaseAdmin, jsonResponse, errorResponse } from '../_lib/supabase.js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const { user, error: authError } = await verifyAuth(req)
  if (authError) return errorResponse(authError, 401)

  const url = new URL(req.url)
  // Ambil ID dari path: /api/workouts/[id]
  const pathParts = url.pathname.split('/')
  const id = pathParts[pathParts.length - 1]

  if (!id) return errorResponse('Session ID is required')

  const supabase = createSupabaseAdmin()

  // ── GET ────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select(`
        *,
        session_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) return errorResponse('Session not found', 404)
    return jsonResponse({ data })
  }

  // ── PATCH: Update sesi ─────────────────────────────────────
  if (req.method === 'PATCH') {
    let body
    try { body = await req.json() } catch { return errorResponse('Invalid JSON') }

    const allowedFields = ['status', 'session_name', 'started_at', 'finished_at', 'duration_mins', 'calories_burned', 'notes']
    const updates = {}
    for (const key of allowedFields) {
      if (body[key] !== undefined) updates[key] = body[key]
    }

    if (Object.keys(updates).length === 0) return errorResponse('No fields to update')

    const { data, error } = await supabase
      .from('workout_sessions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) return errorResponse(error.message, 500)
    return jsonResponse({ data })
  }

  // ── DELETE ─────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('workout_sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) return errorResponse(error.message, 500)
    return jsonResponse({ success: true })
  }

  return errorResponse('Method not allowed', 405)
}
