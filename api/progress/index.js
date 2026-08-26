// api/progress/index.js
// Vercel Serverless Function — Progress Tracking
//
// GET  /api/progress?range=7|30|90|all   — riwayat progress berat badan
// POST /api/progress                     — catat progress baru

import { verifyAuth, createSupabaseAdmin, jsonResponse, errorResponse } from '../_lib/supabase.js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const { user, error: authError } = await verifyAuth(req)
  if (authError) return errorResponse(authError, 401)

  const supabase = createSupabaseAdmin()
  const url = new URL(req.url)

  // ── GET: Ambil riwayat progress ─────────────────────────────
  if (req.method === 'GET') {
    const range = url.searchParams.get('range') || '30'  // hari
    const type  = url.searchParams.get('type')  || 'weight' // weight|calories|steps

    let query = supabase
      .from('progress_logs')
      .select('id, log_date, weight_kg, body_fat_pct, muscle_mass_kg, bmi, waist_cm, notes')
      .eq('user_id', user.id)
      .order('log_date', { ascending: true })

    if (range !== 'all') {
      const fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - parseInt(range))
      query = query.gte('log_date', fromDate.toISOString().split('T')[0])
    }

    const { data: progressData, error: progressError } = await query
    if (progressError) return errorResponse(progressError.message, 500)

    // Juga ambil daily_summaries untuk kalori & langkah
    let summaryData = []
    if (type === 'calories' || type === 'steps') {
      const { data: summaries } = await supabase
        .from('daily_summaries')
        .select('summary_date, total_calories_in, total_calories_out, net_calories, steps')
        .eq('user_id', user.id)
        .order('summary_date', { ascending: true })

      summaryData = summaries || []
    }

    // Hitung statistik
    const weights = progressData.filter(p => p.weight_kg).map(p => p.weight_kg)
    const stats = weights.length > 0 ? {
      current:  weights.at(-1),
      start:    weights[0],
      change:   parseFloat((weights.at(-1) - weights[0]).toFixed(2)),
      min:      Math.min(...weights),
      max:      Math.max(...weights),
      avg:      parseFloat((weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(2)),
    } : null

    return jsonResponse({
      progress: progressData,
      summaries: summaryData,
      stats,
      range,
    })
  }

  // ── POST: Catat progress baru ───────────────────────────────
  if (req.method === 'POST') {
    let body
    try { body = await req.json() } catch { return errorResponse('Invalid JSON') }

    const { log_date, weight_kg, body_fat_pct, muscle_mass_kg,
            chest_cm, waist_cm, hips_cm, photo_url, notes } = body

    // Hitung BMI otomatis jika ada berat & tinggi
    let bmi = null
    if (weight_kg) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('height_cm')
        .eq('id', user.id)
        .single()

      if (profile?.height_cm) {
        const heightM = profile.height_cm / 100
        bmi = parseFloat((weight_kg / (heightM * heightM)).toFixed(2))
      }

      // Update berat di profile juga
      await supabase
        .from('profiles')
        .update({ weight_kg })
        .eq('id', user.id)
    }

    const { data, error } = await supabase
      .from('progress_logs')
      .upsert({
        user_id:        user.id,
        log_date:       log_date || new Date().toISOString().split('T')[0],
        weight_kg:      weight_kg     || null,
        body_fat_pct:   body_fat_pct  || null,
        muscle_mass_kg: muscle_mass_kg || null,
        bmi,
        chest_cm:       chest_cm  || null,
        waist_cm:       waist_cm  || null,
        hips_cm:        hips_cm   || null,
        photo_url:      photo_url || null,
        notes:          notes     || null,
      }, { onConflict: 'user_id,log_date' })
      .select()
      .single()

    if (error) return errorResponse(error.message, 500)
    return jsonResponse({ data }, 201)
  }

  return errorResponse('Method not allowed', 405)
}
