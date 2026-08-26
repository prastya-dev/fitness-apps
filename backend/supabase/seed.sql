-- ============================================================
-- DAPAWORK - SEED DATA (Data Awal / Contoh)
-- ============================================================
-- Jalankan SETELAH schema.sql berhasil dieksekusi
-- ============================================================

-- ============================================================
-- EXERCISES - Katalog Latihan
-- ============================================================

INSERT INTO public.exercises
  (name, name_id, muscle_group, secondary_muscles, difficulty, equipment_needed,
   duration_seconds, calories_per_min, instructions)
VALUES
  -- CHEST
  ('Push Up', 'Push Up', 'chest', ARRAY['triceps', 'shoulders']::muscle_group[],
   'beginner', 'none', 30, 7.0,
   ARRAY['Posisikan badan lurus seperti papan', 'Turunkan badan hingga dada hampir menyentuh lantai', 'Dorong kembali ke atas', 'Ulangi']),

  ('Dumbbell Bench Press', 'Press Dumbbell Berbaring', 'chest', ARRAY['triceps', 'shoulders']::muscle_group[],
   'intermediate', 'dumbbell', 45, 6.0,
   ARRAY['Berbaring telentang dengan dumbbell di tangan', 'Angkat dumbbell ke atas dada', 'Turunkan perlahan', 'Dorong kembali ke atas']),

  -- BACK
  ('Pull Up', 'Pull Up', 'back', ARRAY['biceps', 'shoulders']::muscle_group[],
   'intermediate', 'pullup_bar', 30, 8.0,
   ARRAY['Pegang bar dengan lebar bahu', 'Angkat badan hingga dagu melewati bar', 'Turunkan perlahan', 'Ulangi']),

  ('Superman', 'Superman', 'back', ARRAY['glutes']::muscle_group[],
   'beginner', 'mat', 30, 4.0,
   ARRAY['Berbaring tengkurap di matras', 'Angkat tangan dan kaki secara bersamaan', 'Tahan 2 detik', 'Turunkan perlahan']),

  -- LEGS
  ('Squat', 'Squat', 'quads', ARRAY['glutes', 'hamstrings']::muscle_group[],
   'beginner', 'none', 30, 6.0,
   ARRAY['Berdiri dengan kaki selebar bahu', 'Turunkan badan seolah duduk di kursi', 'Jaga punggung tetap lurus', 'Kembali ke posisi awal']),

  ('Lunges', 'Lunges', 'quads', ARRAY['glutes', 'hamstrings']::muscle_group[],
   'beginner', 'none', 30, 5.5,
   ARRAY['Berdiri tegak', 'Langkahkan satu kaki ke depan', 'Turunkan lutut belakang mendekati lantai', 'Kembali ke posisi awal']),

  -- ABS
  ('Crunch', 'Crunch', 'abs', NULL,
   'beginner', 'mat', 30, 5.0,
   ARRAY['Berbaring telentang dengan lutut ditekuk', 'Letakkan tangan di belakang kepala', 'Angkat bahu dari lantai', 'Turunkan perlahan']),

  ('Plank', 'Plank', 'abs', ARRAY['shoulders', 'back']::muscle_group[],
   'beginner', 'mat', 60, 4.0,
   ARRAY['Posisi push up', 'Tekuk siku dan tahan dengan lengan bawah', 'Jaga badan lurus', 'Tahan selama mungkin']),

  -- SHOULDERS
  ('Dumbbell Shoulder Press', 'Press Bahu Dumbbell', 'shoulders', ARRAY['triceps']::muscle_group[],
   'intermediate', 'dumbbell', 45, 5.5,
   ARRAY['Duduk atau berdiri dengan dumbbell di bahu', 'Dorong ke atas hingga lengan lurus', 'Turunkan perlahan', 'Ulangi']),

  -- FULL BODY
  ('Burpees', 'Burpees', 'full_body', NULL,
   'intermediate', 'none', 30, 10.0,
   ARRAY['Berdiri tegak', 'Jongkok dan letakkan tangan di lantai', 'Lempar kaki ke belakang (posisi push up)', 'Kembali ke jongkok', 'Lompat ke atas dengan tangan terangkat']);

-- ============================================================
-- FOOD ITEMS - Database Makanan
-- ============================================================

INSERT INTO public.food_items
  (name, name_id, serving_size_g, calories, protein_g, carbs_g, fat_g, fiber_g, is_verified)
VALUES
  -- Protein Sources
  ('Chicken Breast (boiled)', 'Dada Ayam Rebus', 100, 165, 31, 0, 3.6, 0, TRUE),
  ('Egg (whole, boiled)', 'Telur Rebus', 50, 77, 6.3, 0.6, 5.3, 0, TRUE),
  ('Egg White', 'Putih Telur', 33, 17, 3.6, 0.2, 0, 0, TRUE),
  ('Tuna (canned in water)', 'Tuna Kaleng', 100, 116, 26, 0, 1.0, 0, TRUE),
  ('Tempeh', 'Tempe', 100, 193, 18.5, 9.4, 11, 1.4, TRUE),
  ('Tofu', 'Tahu', 100, 76, 8, 1.9, 4.8, 0.3, TRUE),

  -- Carbohydrate Sources
  ('White Rice (cooked)', 'Nasi Putih', 100, 130, 2.7, 28, 0.3, 0.4, TRUE),
  ('Brown Rice (cooked)', 'Nasi Merah', 100, 112, 2.3, 24, 0.9, 1.8, TRUE),
  ('Oats (dry)', 'Oatmeal Kering', 40, 148, 5.5, 26.7, 2.6, 4.0, TRUE),
  ('Sweet Potato (boiled)', 'Ubi Manis Rebus', 100, 86, 1.6, 20, 0.1, 2.5, TRUE),
  ('Banana', 'Pisang', 100, 89, 1.1, 23, 0.3, 2.6, TRUE),

  -- Vegetables
  ('Spinach (raw)', 'Bayam Segar', 100, 23, 2.9, 3.6, 0.4, 2.2, TRUE),
  ('Broccoli (raw)', 'Brokoli Segar', 100, 34, 2.8, 7, 0.4, 2.6, TRUE),
  ('Carrot (raw)', 'Wortel Segar', 100, 41, 0.9, 10, 0.2, 2.8, TRUE),

  -- Healthy Fats
  ('Avocado', 'Alpukat', 100, 160, 2.0, 9, 15, 6.7, TRUE),
  ('Peanut Butter', 'Selai Kacang', 32, 188, 8, 7, 16, 2.0, TRUE),
  ('Almond', 'Almond', 28, 164, 6, 6, 14, 3.5, TRUE);

-- ============================================================
-- RECIPES - Resep Sehat
-- ============================================================

INSERT INTO public.recipes
  (name, description, prep_time_mins, cook_time_mins, servings,
   difficulty, calories_per_serving, protein_g, carbs_g, fat_g,
   fitness_goal, ingredients, instructions, tags, is_public)
VALUES
  (
    'High Protein Bowl Ayam',
    'Bowl protein tinggi dengan nasi merah, dada ayam, dan sayuran segar.',
    10, 20, 1, 'beginner', 420, 38, 45, 8,
    'muscle_gain',
    '[
      {"name": "Dada ayam", "amount": "150", "unit": "g"},
      {"name": "Nasi merah", "amount": "150", "unit": "g"},
      {"name": "Brokoli", "amount": "100", "unit": "g"},
      {"name": "Wortel", "amount": "50", "unit": "g"},
      {"name": "Kecap rendah sodium", "amount": "1", "unit": "sdm"},
      {"name": "Bawang putih", "amount": "2", "unit": "siung"}
    ]'::jsonb,
    ARRAY[
      'Marinasi dada ayam dengan bawang putih dan kecap selama 15 menit',
      'Kukus atau panggang ayam hingga matang',
      'Rebus brokoli dan wortel 3-4 menit',
      'Susun nasi merah, ayam, dan sayuran dalam bowl',
      'Sajikan dengan tambahan saus sesuai selera'
    ],
    ARRAY['high-protein', 'meal-prep', 'muscle-gain'],
    TRUE
  ),
  (
    'Overnight Oats Diet',
    'Sarapan rendah kalori tinggi serat, cocok untuk program diet.',
    5, 0, 1, 'beginner', 310, 14, 52, 7,
    'weight_loss',
    '[
      {"name": "Oatmeal", "amount": "40", "unit": "g"},
      {"name": "Susu rendah lemak", "amount": "150", "unit": "ml"},
      {"name": "Greek yogurt", "amount": "100", "unit": "g"},
      {"name": "Pisang", "amount": "1", "unit": "buah"},
      {"name": "Madu", "amount": "1", "unit": "sdt"}
    ]'::jsonb,
    ARRAY[
      'Campur oatmeal dan susu dalam jar',
      'Tambahkan greek yogurt dan aduk rata',
      'Tutup dan simpan di kulkas semalaman',
      'Saat disajikan, tambahkan irisan pisang dan madu'
    ],
    ARRAY['diet', 'breakfast', 'meal-prep', 'no-cook'],
    TRUE
  ),
  (
    'Salad Protein Tempe',
    'Salad segar dengan tempe panggang sebagai sumber protein nabati.',
    10, 15, 2, 'beginner', 280, 18, 22, 14,
    'maintenance',
    '[
      {"name": "Tempe", "amount": "200", "unit": "g"},
      {"name": "Bayam segar", "amount": "100", "unit": "g"},
      {"name": "Tomat cherry", "amount": "100", "unit": "g"},
      {"name": "Alpukat", "amount": "1/2", "unit": "buah"},
      {"name": "Lemon", "amount": "1/2", "unit": "buah"},
      {"name": "Olive oil", "amount": "1", "unit": "sdm"}
    ]'::jsonb,
    ARRAY[
      'Potong tempe kotak kecil dan panggang hingga kecokelatan',
      'Cuci dan keringkan bayam',
      'Halve tomat cherry',
      'Potong alpukat',
      'Campur semua bahan dalam bowl',
      'Siram dengan perasan lemon dan olive oil'
    ],
    ARRAY['vegan', 'salad', 'high-protein', 'maintenance'],
    TRUE
  );

-- ============================================================
-- PLAYLISTS - Playlist Latihan
-- ============================================================

INSERT INTO public.playlists
  (name, description, genre, bpm_range, mood, is_public)
VALUES
  ('Pump It Up 🔥', 'Lagu-lagu EDM berenergi tinggi untuk sesi latihan intensif', 'EDM/Electronic', '128-140', 'energetic', TRUE),
  ('Morning Flow 🌅', 'Musik chill untuk pemanasan dan latihan ringan di pagi hari', 'Acoustic/Chill', '80-100', 'focus', TRUE),
  ('Hip Hop Gains 💪', 'Hip hop hits untuk angkat beban dan latihan kekuatan', 'Hip Hop', '90-110', 'energetic', TRUE),
  ('Cardio Burn 🏃', 'Track dengan tempo tinggi untuk sesi cardio dan HIIT', 'Pop/Dance', '140-160', 'high_energy', TRUE),
  ('Zen Stretch 🧘', 'Musik tenang untuk pendinginan dan stretching', 'Ambient', '60-80', 'calm', TRUE);
