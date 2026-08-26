-- ============================================================
-- DAPAWORK FITNESS APP - SUPABASE DATABASE SCHEMA
-- ============================================================
-- Deploy ke Supabase: SQL Editor → paste & run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE fitness_goal AS ENUM ('weight_loss', 'muscle_gain', 'maintenance');
CREATE TYPE gender_type AS ENUM ('male', 'female');
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
CREATE TYPE workout_status AS ENUM ('planned', 'completed', 'skipped');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE equipment_type AS ENUM (
  'dumbbell', 'mat', 'resistance_band', 'pullup_bar', 'treadmill', 'none'
);
CREATE TYPE muscle_group AS ENUM (
  'chest', 'back', 'shoulders', 'biceps', 'triceps',
  'abs', 'glutes', 'quads', 'hamstrings', 'calves', 'full_body'
);
CREATE TYPE workout_day AS ENUM (
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
);
CREATE TYPE workout_time_slot AS ENUM (
  'morning', 'afternoon', 'evening', 'night'
);

-- ============================================================
-- TABLE: profiles
-- Extends Supabase auth.users — data profil user
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE,
  full_name     TEXT,
  avatar_url    TEXT,
  gender        gender_type,
  age           SMALLINT CHECK (age BETWEEN 10 AND 120),
  height_cm     SMALLINT CHECK (height_cm BETWEEN 50 AND 300),
  weight_kg     NUMERIC(5,2) CHECK (weight_kg BETWEEN 20 AND 500),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Profil lengkap setiap user Dapawork';

-- ============================================================
-- TABLE: user_goals
-- Tujuan fitness user
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_goals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  goal            fitness_goal NOT NULL,
  target_weight   NUMERIC(5,2),    -- kg target (opsional)
  target_date     DATE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.user_goals IS 'Tujuan fitness aktif user';

-- ============================================================
-- TABLE: user_equipment
-- Alat latihan yang dimiliki user
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_equipment (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  equipment   equipment_type NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.user_equipment IS 'Alat latihan yang tersedia untuk user';

-- ============================================================
-- TABLE: workout_schedules
-- Jadwal latihan mingguan user
-- ============================================================

CREATE TABLE IF NOT EXISTS public.workout_schedules (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day         workout_day NOT NULL,
  time_slot   workout_time_slot NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, day)
);

COMMENT ON TABLE public.workout_schedules IS 'Jadwal latihan mingguan per user';

-- ============================================================
-- TABLE: exercises
-- Katalog latihan & gerakan (master data)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.exercises (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  name_id         TEXT,                    -- nama dalam Bahasa Indonesia
  description     TEXT,
  muscle_group    muscle_group NOT NULL,
  secondary_muscles muscle_group[],
  difficulty      difficulty_level NOT NULL DEFAULT 'beginner',
  equipment_needed equipment_type NOT NULL DEFAULT 'none',
  duration_seconds INT,                    -- durasi estimasi per set (detik)
  calories_per_min NUMERIC(5,2),           -- estimasi kalori per menit
  video_url       TEXT,
  thumbnail_url   TEXT,
  instructions    TEXT[],                  -- langkah-langkah gerakan
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.exercises IS 'Katalog semua latihan/gerakan yang tersedia';

-- ============================================================
-- TABLE: workout_sessions
-- Riwayat sesi latihan yang dilakukan user
-- ============================================================

CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_name    TEXT,
  status          workout_status NOT NULL DEFAULT 'planned',
  scheduled_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  started_at      TIMESTAMPTZ,
  finished_at     TIMESTAMPTZ,
  duration_mins   INT,                     -- durasi aktual (menit)
  calories_burned NUMERIC(7,2),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.workout_sessions IS 'Riwayat dan rencana sesi latihan user';

-- ============================================================
-- TABLE: session_exercises
-- Detail latihan dalam satu sesi (many-to-many)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.session_exercises (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id      UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id     UUID NOT NULL REFERENCES public.exercises(id),
  sets_planned    SMALLINT NOT NULL DEFAULT 3,
  reps_planned    SMALLINT NOT NULL DEFAULT 10,
  weight_kg       NUMERIC(5,2),            -- berat yang digunakan
  sets_done       SMALLINT,
  reps_done       SMALLINT,
  duration_secs   INT,
  order_index     SMALLINT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.session_exercises IS 'Detail gerakan latihan dalam setiap sesi';

-- ============================================================
-- TABLE: food_items
-- Database makanan & nutrisi (master data)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.food_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  name_id         TEXT,                    -- nama dalam Bahasa Indonesia
  brand           TEXT,
  serving_size_g  NUMERIC(7,2) NOT NULL DEFAULT 100,
  calories        NUMERIC(7,2) NOT NULL,   -- per serving_size
  protein_g       NUMERIC(6,2),
  carbs_g         NUMERIC(6,2),
  fat_g           NUMERIC(6,2),
  fiber_g         NUMERIC(6,2),
  sugar_g         NUMERIC(6,2),
  sodium_mg       NUMERIC(7,2),
  image_url       TEXT,
  barcode         TEXT UNIQUE,             -- untuk food cam scan
  is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.food_items IS 'Database makanan dan informasi nutrisi';

-- ============================================================
-- TABLE: food_logs
-- Log makanan harian user
-- ============================================================

CREATE TABLE IF NOT EXISTS public.food_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  food_item_id    UUID REFERENCES public.food_items(id),
  food_name       TEXT NOT NULL,           -- fallback jika tidak ada di food_items
  meal_type       meal_type NOT NULL,
  log_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  serving_size_g  NUMERIC(7,2) NOT NULL DEFAULT 100,
  quantity        NUMERIC(4,2) NOT NULL DEFAULT 1,
  calories        NUMERIC(7,2) NOT NULL,
  protein_g       NUMERIC(6,2),
  carbs_g         NUMERIC(6,2),
  fat_g           NUMERIC(6,2),
  photo_url       TEXT,                    -- foto dari Food Cam
  ai_detected     BOOLEAN NOT NULL DEFAULT FALSE,  -- dideteksi oleh AI
  ai_confidence   NUMERIC(4,3),            -- confidence score dari AI (0-1)
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.food_logs IS 'Log makanan harian user';

-- ============================================================
-- TABLE: progress_logs
-- Riwayat berat badan & metrics kesehatan
-- ============================================================

CREATE TABLE IF NOT EXISTS public.progress_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  log_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg       NUMERIC(5,2),
  body_fat_pct    NUMERIC(4,2),            -- persentase lemak tubuh
  muscle_mass_kg  NUMERIC(5,2),
  bmi             NUMERIC(4,2),
  chest_cm        NUMERIC(5,2),
  waist_cm        NUMERIC(5,2),
  hips_cm         NUMERIC(5,2),
  photo_url       TEXT,                    -- foto progress
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, log_date)
);

COMMENT ON TABLE public.progress_logs IS 'Riwayat progress berat badan dan ukuran tubuh';

-- ============================================================
-- TABLE: daily_summaries
-- Ringkasan harian (kalori masuk, keluar, langkah)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.daily_summaries (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  summary_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  total_calories_in NUMERIC(7,2) NOT NULL DEFAULT 0,
  total_calories_out NUMERIC(7,2) NOT NULL DEFAULT 0,
  net_calories      NUMERIC(8,2) GENERATED ALWAYS AS (total_calories_in - total_calories_out) STORED,
  steps             INT NOT NULL DEFAULT 0,
  water_ml          INT NOT NULL DEFAULT 0,
  sleep_hours       NUMERIC(4,2),
  workout_count     SMALLINT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, summary_date)
);

COMMENT ON TABLE public.daily_summaries IS 'Ringkasan data harian per user';

-- ============================================================
-- TABLE: ai_chat_history
-- Riwayat percakapan dengan AI Trainer
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_chat_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content     TEXT NOT NULL,
  tokens_used INT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.ai_chat_history IS 'Riwayat chat dengan AI Trainer';

-- ============================================================
-- TABLE: playlists
-- Playlist musik latihan
-- ============================================================

CREATE TABLE IF NOT EXISTS public.playlists (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE,  -- NULL = global
  name          TEXT NOT NULL,
  description   TEXT,
  cover_url     TEXT,
  spotify_url   TEXT,
  youtube_url   TEXT,
  genre         TEXT,
  bpm_range     TEXT,                       -- e.g. "120-140"
  mood          TEXT,                       -- e.g. "energetic", "focus"
  is_public     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.playlists IS 'Playlist musik untuk latihan';

-- ============================================================
-- TABLE: recipes
-- Database resep makanan sehat
-- ============================================================

CREATE TABLE IF NOT EXISTS public.recipes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,  -- NULL = global
  name            TEXT NOT NULL,
  description     TEXT,
  cover_url       TEXT,
  prep_time_mins  INT,
  cook_time_mins  INT,
  servings        SMALLINT NOT NULL DEFAULT 1,
  difficulty      difficulty_level NOT NULL DEFAULT 'beginner',
  calories_per_serving NUMERIC(7,2),
  protein_g       NUMERIC(6,2),
  carbs_g         NUMERIC(6,2),
  fat_g           NUMERIC(6,2),
  fitness_goal    fitness_goal,             -- cocok untuk goal apa
  ingredients     JSONB NOT NULL DEFAULT '[]',   -- [{ name, amount, unit }]
  instructions    TEXT[] NOT NULL DEFAULT '{}',
  tags            TEXT[],
  is_public       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.recipes IS 'Resep makanan sehat untuk fitness';

-- ============================================================
-- INDEXES — Performa Query
-- ============================================================

CREATE INDEX idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX idx_user_goals_active ON public.user_goals(user_id) WHERE is_active = TRUE;
CREATE INDEX idx_workout_sessions_user_date ON public.workout_sessions(user_id, scheduled_date DESC);
CREATE INDEX idx_workout_sessions_status ON public.workout_sessions(user_id, status);
CREATE INDEX idx_food_logs_user_date ON public.food_logs(user_id, log_date DESC);
CREATE INDEX idx_progress_logs_user_date ON public.progress_logs(user_id, log_date DESC);
CREATE INDEX idx_daily_summaries_user_date ON public.daily_summaries(user_id, summary_date DESC);
CREATE INDEX idx_ai_chat_history_user ON public.ai_chat_history(user_id, created_at DESC);
CREATE INDEX idx_exercises_muscle ON public.exercises(muscle_group);
CREATE INDEX idx_exercises_equipment ON public.exercises(equipment_needed);
CREATE INDEX idx_food_items_barcode ON public.food_items(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_recipes_goal ON public.recipes(fitness_goal) WHERE is_public = TRUE;

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create profile saat user baru register
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers: updated_at
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_user_goals_updated_at
  BEFORE UPDATE ON public.user_goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_workout_sessions_updated_at
  BEFORE UPDATE ON public.workout_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_food_logs_updated_at
  BEFORE UPDATE ON public.food_logs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_daily_summaries_updated_at
  BEFORE UPDATE ON public.daily_summaries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: auto-create profile on new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- exercises & food_items: semua user bisa read, hanya admin yang bisa write
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;

-- POLICIES: profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- POLICIES: user_goals
CREATE POLICY "Users manage own goals"
  ON public.user_goals FOR ALL USING (auth.uid() = user_id);

-- POLICIES: user_equipment
CREATE POLICY "Users manage own equipment"
  ON public.user_equipment FOR ALL USING (auth.uid() = user_id);

-- POLICIES: workout_schedules
CREATE POLICY "Users manage own schedules"
  ON public.workout_schedules FOR ALL USING (auth.uid() = user_id);

-- POLICIES: workout_sessions
CREATE POLICY "Users manage own sessions"
  ON public.workout_sessions FOR ALL USING (auth.uid() = user_id);

-- POLICIES: session_exercises
CREATE POLICY "Users manage exercises in own sessions"
  ON public.session_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions ws
      WHERE ws.id = session_id AND ws.user_id = auth.uid()
    )
  );

-- POLICIES: food_logs
CREATE POLICY "Users manage own food logs"
  ON public.food_logs FOR ALL USING (auth.uid() = user_id);

-- POLICIES: progress_logs
CREATE POLICY "Users manage own progress"
  ON public.progress_logs FOR ALL USING (auth.uid() = user_id);

-- POLICIES: daily_summaries
CREATE POLICY "Users manage own daily summaries"
  ON public.daily_summaries FOR ALL USING (auth.uid() = user_id);

-- POLICIES: ai_chat_history
CREATE POLICY "Users manage own chat history"
  ON public.ai_chat_history FOR ALL USING (auth.uid() = user_id);

-- POLICIES: exercises (public read)
CREATE POLICY "Anyone can read exercises"
  ON public.exercises FOR SELECT USING (TRUE);

-- POLICIES: food_items (public read)
CREATE POLICY "Anyone can read food items"
  ON public.food_items FOR SELECT USING (TRUE);

-- POLICIES: playlists (public + personal)
CREATE POLICY "Users can view public playlists or own playlists"
  ON public.playlists FOR SELECT
  USING (is_public = TRUE OR auth.uid() = user_id);
CREATE POLICY "Users manage own playlists"
  ON public.playlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own playlists"
  ON public.playlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own playlists"
  ON public.playlists FOR DELETE USING (auth.uid() = user_id);

-- POLICIES: recipes (public + personal)
CREATE POLICY "Users can view public recipes or own recipes"
  ON public.recipes FOR SELECT
  USING (is_public = TRUE OR auth.uid() = user_id);
CREATE POLICY "Users manage own recipes"
  ON public.recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own recipes"
  ON public.recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own recipes"
  ON public.recipes FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS (jalankan di Supabase Dashboard → Storage)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('avatars',  'avatars',  true),
--   ('food-photos', 'food-photos', false),
--   ('progress-photos', 'progress-photos', false);
