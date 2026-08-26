# Backend — Supabase Schema

## Setup

### 1. Buat Project Supabase

1. Buka [supabase.com](https://supabase.com) dan buat project baru
2. Catat **Project URL** dan **API Keys** dari Settings → API

### 2. Jalankan Schema

Di Supabase Dashboard → **SQL Editor**:

```sql
-- Langkah 1: Jalankan schema
\i schema.sql

-- Langkah 2: (Opsional) Jalankan seed data
\i seed.sql
```

### 3. Setup Storage Buckets

Di Supabase Dashboard → **Storage**, buat bucket:
- `avatars` (public)
- `food-photos` (private)
- `progress-photos` (private)

## Struktur Database

| Tabel | Deskripsi |
|-------|-----------|
| `profiles` | Profil user (extends auth.users) |
| `user_goals` | Tujuan fitness aktif |
| `user_equipment` | Alat latihan yang dimiliki |
| `workout_schedules` | Jadwal latihan mingguan |
| `workout_sessions` | Riwayat sesi latihan |
| `session_exercises` | Detail gerakan per sesi |
| `exercises` | Katalog latihan (master data) |
| `food_items` | Database makanan & nutrisi |
| `food_logs` | Log makanan harian |
| `progress_logs` | Riwayat berat & ukuran tubuh |
| `daily_summaries` | Ringkasan kalori & langkah harian |
| `ai_chat_history` | Riwayat chat AI Trainer |
| `playlists` | Playlist musik latihan |
| `recipes` | Resep makanan sehat |

## Security

- Semua tabel menggunakan **Row Level Security (RLS)**
- User hanya bisa mengakses data milik sendiri
- `exercises`, `food_items`, `playlists`, `recipes` publik bisa dibaca semua user
- API routes menggunakan **service_role key** (di server) dengan validasi JWT
