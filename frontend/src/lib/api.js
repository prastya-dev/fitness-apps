// frontend/src/lib/api.js
// Client API Helper untuk berinteraksi dengan Backend API (/api/*)

const TOKEN_KEY = 'dapa_auth_token'
const PROFILE_CACHE_KEY = 'dapa_user_profile'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(PROFILE_CACHE_KEY)
}

export function getCachedProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setCachedProfile(profileData) {
  if (profileData) {
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profileData))
  }
}

/**
 * Universal fetch wrapper ke backend /api
 */
export async function apiFetch(path, options = {}) {
  const token = getToken()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const url = `/api${cleanPath}`

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body)
  }

  const response = await fetch(url, config)

  let data
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`
    throw new Error(errorMsg)
  }

  return data
}

/**
 * Kalkulasi Indeks Massa Tubuh (BMI / IMT)
 * BMI = weight (kg) / (height (m) ^ 2)
 */
export function calculateBMI(weightKg, heightCm) {
  const w = parseFloat(weightKg)
  const h = parseFloat(heightCm) / 100

  if (!w || !h || h <= 0) {
    return { bmi: 0, category: 'Tidak Diketahui', color: 'text-slate-400', badgeBg: 'bg-slate-500/20' }
  }

  const bmiValue = (w / (h * h)).toFixed(1)
  const bmi = parseFloat(bmiValue)

  if (bmi < 18.5) {
    return { bmi, category: 'Berat Kurang', color: 'text-amber-400', badgeBg: 'bg-amber-500/20 border-amber-500/30' }
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return { bmi, category: 'Normal / Ideal', color: 'text-emerald-400', badgeBg: 'bg-emerald-500/20 border-emerald-500/30' }
  } else if (bmi >= 25.0 && bmi <= 29.9) {
    return { bmi, category: 'Berat Berlebih', color: 'text-orange-400', badgeBg: 'bg-orange-500/20 border-orange-500/30' }
  } else {
    return { bmi, category: 'Obesitas', color: 'text-rose-400', badgeBg: 'bg-rose-500/20 border-rose-500/30' }
  }
}

/**
 * Format nama Goal ke Bahasa Indonesia
 */
export function formatGoalLabel(goalKey) {
  switch (goalKey) {
    case 'weight_loss':
    case 'Program Diet (Menurunkan Berat Badan)':
      return 'Program Diet (Turun BB)'
    case 'muscle_gain':
    case 'Menambah Massa Otot':
      return 'Menambah Massa Otot'
    case 'maintenance':
    case 'Menjaga Kebugaran':
      return 'Menjaga Kebugaran'
    default:
      return goalKey || 'Menjaga Kebugaran'
  }
}
