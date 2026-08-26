// api/food/log.js
// Vercel Serverless Function — Food Logging
//
// GET    /api/food/log?date=YYYY-MM-DD   — log makanan pada tanggal tertentu
// POST   /api/food/log                   — tambah log makanan baru
// DELETE /api/food/log?id=<uuid>         — hapus log

import { verifyAuth, createSupabaseAdmin, jsonResponse, errorResponse } from '../_lib/supabase.js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const { user, error: authError } = await verifyAuth(req)
  if (authError) return errorResponse(authError, 401)

  const supabase = createSupabaseAdmin()
  const url = new URL(req.url)

  // ── GET: Ambil log makanan berdasarkan tanggal ──────────────
  if (req.method === 'GET') {
    const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('food_logs')
      .select('*, food_items(name, name_id, image_url)')
      .eq('user_id', user.id)
      .eq('log_date', date)
      .order('created_at', { ascending: true })

    if (error) return errorResponse(error.message, 500)

    // Hitung total nutrisi
    const totals = data.reduce((acc, log) => ({
      calories: acc.calories + (log.calories * log.quantity),
      protein:  acc.protein  + ((log.protein_g  || 0) * log.quantity),
      carbs:    acc.carbs    + ((log.carbs_g    || 0) * log.quantity),
      fat:      acc.fat      + ((log.fat_g      || 0) * log.quantity),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

    return jsonResponse({ data, totals, date })
  }

  // ── POST: Tambah log makanan ────────────────────────────────
  if (req.method === 'POST') {
    let body
    try { body = await req.json() } catch { return errorResponse('Invalid JSON') }

    const { food_name, meal_type, calories, protein_g, carbs_g, fat_g,
            food_item_id, serving_size_g, quantity, log_date, photo_url,
            ai_detected, ai_confidence } = body

    if (!food_name) return errorResponse('food_name is required')
    if (!meal_type) return errorResponse('meal_type is required (breakfast/lunch/dinner/snack)')
    if (calories === undefined || calories === null) return errorResponse('calories is required')

    const { data, error } = await supabase
      .from('food_logs')
      .insert({
        user_id:       user.id,
        food_item_id:  food_item_id || null,
        food_name,
        meal_type,
        log_date:      log_date || new Date().toISOString().split('T')[0],
        serving_size_g: serving_size_g || 100,
        quantity:       quantity || 1,
        calories,
        protein_g:     protein_g  || null,
        carbs_g:       carbs_g    || null,
        fat_g:         fat_g      || null,
        photo_url:     photo_url  || null,
        ai_detected:   ai_detected   || false,
        ai_confidence: ai_confidence || null,
      })
      .select()
      .single()

    if (error) return errorResponse(error.message, 500)

    // Update daily_summaries (upsert)
    await updateDailySummary(supabase, user.id, data.log_date)

    return jsonResponse({ data }, 201)
  }

  // ── DELETE: Hapus log ───────────────────────────────────────
  if (req.method === 'DELETE') {
    const id = url.searchParams.get('id')
    if (!id) return errorResponse('id query param is required')

    // Ambil tanggal log sebelum dihapus (untuk update summary)
    const { data: existing } = await supabase
      .from('food_logs')
      .select('log_date')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    const { error } = await supabase
      .from('food_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) return errorResponse(error.message, 500)

    if (existing) await updateDailySummary(supabase, user.id, existing.log_date)

    return jsonResponse({ success: true })
  }

  return errorResponse('Method not allowed', 405)
}

/**
 * Recalculate dan upsert daily_summaries untuk user + tanggal tertentu
 */
async function updateDailySummary(supabase, userId, date) {
  const { data: logs } = await supabase
    .from('food_logs')
    .select('calories, quantity')
    .eq('user_id', userId)
    .eq('log_date', date)

  const totalCaloriesIn = logs?.reduce((sum, l) => sum + l.calories * l.quantity, 0) || 0

  await supabase
    .from('daily_summaries')
    .upsert({
      user_id:           userId,
      summary_date:      date,
      total_calories_in: totalCaloriesIn,
    }, { onConflict: 'user_id,summary_date', ignoreDuplicates: false })
}
