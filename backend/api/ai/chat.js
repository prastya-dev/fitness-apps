// backend/api/ai/chat.js
// Vercel Serverless Function — AI Trainer Chat

import { verifyAuth, createSupabaseAdmin, jsonResponse, errorResponse } from '../_lib/supabase.js'

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405)
  }

  let user = null
  try {
    const authRes = await verifyAuth(req)
    user = authRes?.user
  } catch (e) {
    console.warn('[AI] Auth check error:', e)
  }

  let body
  try {
    body = await req.json()
  } catch {
    return errorResponse('Invalid JSON body')
  }

  const { messages, user_context } = body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return errorResponse('messages array is required')
  }

  const lastUserMsg = messages.filter(m => m.sender === 'user' || m.role === 'user').pop()?.text ||
                     messages.filter(m => m.role === 'user').pop()?.content || ''

  let profile = user_context || {}
  let goals = { goal: user_context?.goal || 'muscle_gain' }

  if (user?.id) {
    try {
      const supabase = createSupabaseAdmin()
      const { data: dbProf } = await supabase
        .from('profiles')
        .select('full_name, age, height_cm, weight_kg, gender')
        .eq('id', user.id)
        .maybeSingle()

      const { data: dbGoals } = await supabase
        .from('user_goals')
        .select('goal, target_weight')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle()

      if (dbProf) profile = { ...profile, ...dbProf }
      if (dbGoals) goals = { ...goals, ...dbGoals }
    } catch (e) {
      console.warn('[AI] DB profile fetch warning:', e)
    }
  }

  const aiBaseUrl = process.env.AI_SERVER_URL
  const aiApiKey  = process.env.AI_API_KEY
  const aiModel   = process.env.AI_MODEL || 'gpt-4o-mini'

  if (aiBaseUrl && aiApiKey) {
    try {
      const systemPrompt = buildSystemPrompt(profile, goals)
      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.role || (m.sender === 'user' ? 'user' : 'assistant'),
          content: m.content || m.text || ''
        }))
      ]

      const aiResponse = await fetch(`${aiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiApiKey}`,
        },
        body: JSON.stringify({
          model: aiModel,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 800,
        }),
      })

      if (aiResponse.ok) {
        const aiData = await aiResponse.json()
        const assistantMessage = aiData.choices?.[0]?.message?.content
        if (assistantMessage) {
          return jsonResponse({ message: assistantMessage })
        }
      }
    } catch (err) {
      console.warn('[AI] External AI fetch failed, fallback to smart trainer generator:', err.message)
    }
  }

  const smartReply = generatePersonalizedReply(lastUserMsg, profile, goals)

  return jsonResponse({
    message: smartReply,
    usage: { total_tokens: 150 }
  })
}

function buildSystemPrompt(profile, goals) {
  return `Kamu adalah AI Trainer Dapawork, asisten personal fitness ahli, ramah, dan memotivasi.
Data Pengguna:
- Nama: ${profile.full_name || 'Pengguna'}
- Usia: ${profile.age || 25} tahun
- TB: ${profile.height_cm || 170} cm, BB: ${profile.weight_kg || 65} kg
- Target BB: ${goals.target_weight || 70} kg
- Goal: ${goals.goal || 'menambah massa otot'}

Berikan saran spesifik, praktis, dan menyemangati dalam Bahasa Indonesia.`
}

function generatePersonalizedReply(question, profile, goals) {
  const name = profile.full_name ? profile.full_name.split(' ')[0] : 'Kak'
  const weight = profile.weight_kg || 65
  const height = profile.height_cm || 170
  const age = profile.age || 25
  const targetW = profile.target_weight || 70
  const q = question.toLowerCase()

  const hM = height / 100
  const bmi = (weight / (hM * hM)).toFixed(1)

  if (q.includes('makan') || q.includes('diet') || q.includes('kalori') || q.includes('protein') || q.includes('nutrisi')) {
    const proteinTarget = Math.round(weight * 1.8)
    return `Halo ${name}! Untuk profil kamu (BB: ${weight}kg, TB: ${height}cm, Usia: ${age} thn), berikut rekomendasi nutrisimu:

1. **Target Protein**: Sekitar **${proteinTarget} gram/hari** untuk mendukung pemulihan & pembentukan otot.
2. **Kebutuhan Air**: Minimal 2.5 - 3 Liter per hari.
3. **Pola Makan**: Sertakan sumber protein berkualitas seperti dada ayam, telur, tempe/tahu, dan daging sapi tanpa lemak.

Ada menu makanan tertentu yang ingin kamu tanyakan hari ini, ${name}? 💪`
  }

  if (q.includes('latihan') || q.includes('workout') || q.includes('otot') || q.includes('program') || q.includes('jadwal')) {
    return `Keren banget semangatnya, ${name}! Dengan BB ${weight}kg dan target ${targetW}kg, ini rekomendasi alur latihan mingguanmu:

- **Hari 1**: Push (Dada, Bahu, Triceps) - Push Up, Shoulder Press
- **Hari 2**: Pull (Punggung, Biceps) - Pull Up / Dumbbell Row
- **Hari 3**: Rest & Stretch / Kardio Ringan
- **Hari 4**: Legs & Core (Kaki, Perut) - Squat, Lunge, Plank

Lakukan 3-4 set dengan 8-12 repetisi. Pastikan teknik gerakan sudah benar untuk mencegah cedera ya!`
  }

  if (q.includes('target') || q.includes('turun') || q.includes('naik') || q.includes('bb') || q.includes('berat')) {
    const diff = Math.abs(targetW - weight).toFixed(1)
    const direction = targetW >= weight ? 'menaikkan' : 'menurunkan'
    return `Saat ini BB kamu adalah **${weight}kg** dengan indeks massa tubuh (BMI) **${bmi}**. 

Untuk ${direction} berat badan sebesar **${diff}kg** hingga mencapai target **${targetW}kg**:
- Konsistensi latihan beban 3-4 kali seminggu.
- Atur surplus/defisit kalori secara terukur (sekitar 300-500 kkal dari kalori harian).
- Tidur cukup 7-8 jam per hari untuk proses pemulihan hormon.

Semangat terus, ${name}! Progres kecil setiap hari akan menghasilkan perubahan besar 🔥`
  }

  return `Halo ${name}! Terima kasih sudah berkonsultasi denganku hari ini. 

Sebagai AI Trainer personalmu, aku mencatat datamu:
• **BB / TB**: ${weight} kg / ${height} cm (BMI: ${bmi})
• **Usia**: ${age} Tahun
• **Target BB**: ${targetW} kg

Ada hal khusus yang ingin kamu tanyakan? Kamu bisa menanyakan program latihan, rekomendasi nutrisi, atau panduan gaya hidup sehat!`
}
