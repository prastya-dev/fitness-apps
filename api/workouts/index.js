// api/workouts/index.js
// Vercel Serverless Function — Workout Sessions
//
// GET  /api/workouts        — daftar sesi latihan user
// POST /api/workouts        — buat sesi latihan baru

import { verifyAuth, createSupabaseAdmin, jsonResponse, errorResponse } from '../_lib/supabase.js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const { user, error: authError } = await verifyAuth(req)
  if (authError) return errorResponse(authError, 401)

  const supabase = createSupabaseAdmin()

  // ── GET: Ambil daftar sesi latihan ──────────────────────────
  if (req.method === 'GET') {
    const url = new URL(req.url)
    const limit  = parseInt(url.searchParams.get('limit')  || '20')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const status = url.searchParams.get('status')          // filter opsional

    let query = supabase
      .from('workout_sessions')
      .select(`
        *,
        session_exercises (
          *,
          exercises (name, name_id, muscle_group, thumbnail_url)
        )
      `)
      .eq('user_id', user.id)
      .order('scheduled_date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) query = query.eq('status', status)

    const { data, error } = await query

    if (error) return errorResponse(error.message, 500)
    return jsonResponse({ data, count: data.length, offset })
  }

  // ── POST: Buat sesi latihan baru ─────────────────────────────
  if (req.method === 'POST') {
    let body
    try { body = await req.json() } catch { return errorResponse('Invalid JSON') }

    const { session_name, scheduled_date, exercises } = body

    if (!scheduled_date) return errorResponse('scheduled_date is required')

    // Insert sesi
    const { data: session, error: sessionError } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: user.id,
        session_name: session_name || null,
        scheduled_date,
        status: 'planned',
      })
      .select()
      .single()

    if (sessionError) return errorResponse(sessionError.message, 500)

    // Insert latihan dalam sesi (opsional)
    if (exercises && Array.isArray(exercises) && exercises.length > 0) {
      const exerciseRows = exercises.map((ex, idx) => ({
        session_id:   session.id,
        exercise_id:  ex.exercise_id,
        sets_planned: ex.sets   || 3,
        reps_planned: ex.reps   || 10,
        weight_kg:    ex.weight || null,
        order_index:  idx,
      }))

      const { error: exError } = await supabase
        .from('session_exercises')
        .insert(exerciseRows)

      if (exError) console.error('[workouts] session_exercises error:', exError)
    }

    return jsonResponse({ data: session }, 201)
  }

  return errorResponse('Method not allowed', 405)
}
