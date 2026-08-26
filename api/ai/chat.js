// api/ai/chat.js
// Vercel Serverless Function — AI Trainer Chat
// Memproxy request ke OpenAI-compatible server

import { verifyAuth, createSupabaseAdmin, jsonResponse, errorResponse } from '../_lib/supabase.js'

export const config = {
  runtime: 'edge', // Edge runtime untuk latensi lebih rendah
}

/**
 * POST /api/ai/chat
 *
 * Body:
 * {
 *   messages: [{ role: "user"|"assistant", content: string }],
 *   stream?: boolean  // default: false
 * }
 *
 * Headers:
 *   Authorization: Bearer <supabase_jwt>
 */
export default async function handler(req) {
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405)
  }

  // --- Auth ---
  const { user, error: authError } = await verifyAuth(req)
  if (authError) return errorResponse(authError, 401)

  let body
  try {
    body = await req.json()
  } catch {
    return errorResponse('Invalid JSON body')
  }

  const { messages, stream = false } = body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return errorResponse('messages array is required')
  }

  // --- Build system prompt berdasarkan profil user ---
  const supabase = createSupabaseAdmin()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, age, height_cm, weight_kg, gender')
    .eq('id', user.id)
    .single()

  const { data: goals } = await supabase
    .from('user_goals')
    .select('goal')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  const systemPrompt = buildSystemPrompt(profile, goals)

  // --- Proxy ke OpenAI-compatible server ---
  const aiBaseUrl = process.env.AI_SERVER_URL  // e.g. https://api.your-server.com/v1
  const aiApiKey  = process.env.AI_API_KEY
  const aiModel   = process.env.AI_MODEL || 'gpt-4o-mini'

  if (!aiBaseUrl) {
    return errorResponse('AI server not configured', 503)
  }

  const requestPayload = {
    model: aiModel,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 1024,
    stream,
  }

  let aiResponse
  try {
    aiResponse = await fetch(`${aiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiApiKey || ''}`,
      },
      body: JSON.stringify(requestPayload),
    })
  } catch (fetchError) {
    console.error('[AI] Fetch error:', fetchError)
    return errorResponse('Failed to connect to AI server', 503)
  }

  if (!aiResponse.ok) {
    const errText = await aiResponse.text()
    console.error('[AI] Server error:', errText)
    return errorResponse('AI server returned an error', 502)
  }

  // --- Streaming response ---
  if (stream) {
    return new Response(aiResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    })
  }

  // --- Non-streaming: simpan ke history & return ---
  const aiData = await aiResponse.json()
  const assistantMessage = aiData.choices?.[0]?.message?.content || ''
  const tokensUsed = aiData.usage?.total_tokens

  // Simpan percakapan ke database (fire and forget)
  const lastUserMessage = messages.at(-1)
  supabase.from('ai_chat_history').insert([
    { user_id: user.id, role: 'user',      content: lastUserMessage.content, tokens_used: null },
    { user_id: user.id, role: 'assistant', content: assistantMessage, tokens_used: tokensUsed },
  ]).then(() => {}).catch(console.error)

  return jsonResponse({
    message: assistantMessage,
    usage: aiData.usage,
  })
}

/**
 * Membangun system prompt berdasarkan profil & goals user
 */
function buildSystemPrompt(profile, goals) {
  const goalMap = {
    weight_loss:  'menurunkan berat badan (program diet)',
    muscle_gain:  'menambah massa otot (bulking)',
    maintenance:  'menjaga kebugaran (maintenance)',
  }

  const profileInfo = profile
    ? `Nama: ${profile.full_name || 'User'}, Usia: ${profile.age || '-'} tahun, Tinggi: ${profile.height_cm || '-'} cm, Berat: ${profile.weight_kg || '-'} kg`
    : 'Profil belum lengkap'

  const goalInfo = goals?.goal
    ? `Tujuan fitness: ${goalMap[goals.goal] || goals.goal}`
    : 'Tujuan belum ditentukan'

  return `Kamu adalah AI Trainer Dapawork, asisten fitness personal yang ahli, suportif, dan antusias. Kamu berbicara dalam Bahasa Indonesia dengan gaya yang ramah namun profesional.

Data User:
- ${profileInfo}
- ${goalInfo}

Tugas kamu:
1. Memberikan saran latihan yang dipersonalisasi sesuai profil dan tujuan user
2. Menjawab pertanyaan tentang nutrisi, latihan, dan gaya hidup sehat
3. Memberikan motivasi dan dorongan semangat
4. Memberikan panduan teknik latihan yang aman dan efektif
5. Membantu membuat program latihan mingguan

Penting:
- Selalu prioritaskan keamanan dan pencegahan cedera
- Rekomendasikan konsultasi dokter untuk kondisi medis khusus
- Berikan jawaban yang spesifik, praktis, dan actionable
- Gunakan emoji secara wajar untuk membuat percakapan lebih menarik`
}
