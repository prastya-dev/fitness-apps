// backend/api/profile/index.js
// GET & PUT /api/profile

import { verifyAuth, createSupabaseAdmin, jsonResponse, errorResponse } from '../_lib/supabase.js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const { user, error: authError } = await verifyAuth(req)
  if (authError || !user) {
    return errorResponse(authError || 'Unauthorized', 401)
  }

  const supabase = createSupabaseAdmin()

  // GET: Fetch profile & goals
  if (req.method === 'GET') {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      const { data: goals } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle()

      return jsonResponse({
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || user.user_metadata?.full_name || 'User',
        gender: profile?.gender || 'male',
        age: profile?.age || 25,
        height_cm: profile?.height_cm || 170,
        weight_kg: profile?.weight_kg || 65,
        goal: goals?.goal || 'muscle_gain',
        target_weight: goals?.target_weight || 70,
        avatar_url: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || 'Felix'}`,
        updated_at: profile?.updated_at || new Date().toISOString(),
      })
    } catch (err) {
      return errorResponse(err.message, 500)
    }
  }

  // PUT / POST: Update profile & goals
  if (req.method === 'PUT' || req.method === 'POST') {
    let body
    try {
      body = await req.json()
    } catch {
      return errorResponse('Invalid JSON payload')
    }

    const {
      full_name,
      gender,
      age,
      height_cm,
      weight_kg,
      goal,
      target_weight,
      avatar_url,
    } = body

    try {
      const profileUpdates = {
        id: user.id,
        updated_at: new Date().toISOString(),
      }

      if (full_name !== undefined) profileUpdates.full_name = full_name
      if (gender !== undefined) profileUpdates.gender = gender
      if (age !== undefined) profileUpdates.age = Number(age)
      if (height_cm !== undefined) profileUpdates.height_cm = Number(height_cm)
      if (weight_kg !== undefined) profileUpdates.weight_kg = Number(weight_kg)
      if (avatar_url !== undefined) profileUpdates.avatar_url = avatar_url

      const { data: updatedProfile, error: profileErr } = await supabase
        .from('profiles')
        .upsert(profileUpdates, { onConflict: 'id' })
        .select()
        .single()

      if (profileErr) {
        console.error('[profile] Profile upsert error:', profileErr)
      }

      if (goal || target_weight) {
        const goalUpdates = {
          user_id: user.id,
          goal: goal || 'muscle_gain',
          target_weight: target_weight ? Number(target_weight) : null,
          is_active: true,
          updated_at: new Date().toISOString(),
        }

        await supabase
          .from('user_goals')
          .upsert(goalUpdates, { onConflict: 'user_id' })
      }

      return jsonResponse({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          full_name: updatedProfile?.full_name || full_name || user.user_metadata?.full_name,
          gender: updatedProfile?.gender || gender || 'male',
          age: updatedProfile?.age || age || 25,
          height_cm: updatedProfile?.height_cm || height_cm || 170,
          weight_kg: updatedProfile?.weight_kg || weight_kg || 65,
          goal: goal || 'muscle_gain',
          target_weight: target_weight || 70,
          avatar_url: updatedProfile?.avatar_url || avatar_url,
        }
      })
    } catch (err) {
      return errorResponse(err.message, 500)
    }
  }

  return errorResponse('Method not allowed', 405)
}
