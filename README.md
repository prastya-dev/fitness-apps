# Dapawork Fitness App

Aplikasi fitness personal dengan AI Trainer, food logging, progress tracking, dan lebih banyak lagi.

## Struktur Proyek

```
dawork/
├── frontend/                  # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/        # UI components (Tab screens)
│   │   ├── pages/             # Route pages (Login, Dashboard, dll)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # API + Database + Deployment config
│   ├── api/                   # Vercel Serverless Functions
│   │   ├── _lib/
│   │   │   └── supabase.js    # Shared: auth verify, admin client
│   │   ├── ai/
│   │   │   └── chat.js        # POST /api/ai/chat
│   │   ├── workouts/
│   │   │   ├── index.js       # GET/POST /api/workouts
│   │   │   └── [id].js        # GET/PATCH/DELETE /api/workouts/:id
│   │   ├── food/
│   │   │   └── log.js         # GET/POST/DELETE /api/food/log
│   │   └── progress/
│   │       └── index.js       # GET/POST /api/progress
│   ├── supabase/
│   │   ├── schema.sql         # Schema database lengkap (14 tabel + RLS)
│   │   └── seed.sql           # Data awal
│   ├── vercel.json            # Konfigurasi deployment Vercel
│   ├── .env.example           # Template environment variables
│   └── README.md              # Panduan backend
│
├── .gitignore
└── README.md
```

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/ai/chat` | Chat dengan AI Trainer |
| `GET` | `/api/workouts` | Daftar sesi latihan |
| `POST` | `/api/workouts` | Buat sesi latihan |
| `GET` | `/api/workouts/:id` | Detail sesi latihan |
| `PATCH` | `/api/workouts/:id` | Update sesi latihan |
| `DELETE` | `/api/workouts/:id` | Hapus sesi latihan |
| `GET` | `/api/food/log?date=YYYY-MM-DD` | Log makanan per hari |
| `POST` | `/api/food/log` | Tambah log makanan |
| `DELETE` | `/api/food/log?id=uuid` | Hapus log makanan |
| `GET` | `/api/progress?range=30` | Riwayat progress |
| `POST` | `/api/progress` | Catat progress baru |

> Semua endpoint memerlukan header `Authorization: Bearer <supabase_jwt_token>`

## Quick Start

### 1. Setup Database (Supabase)
1. Buat project di [supabase.com](https://supabase.com)
2. SQL Editor → jalankan `backend/supabase/schema.sql`
3. SQL Editor → jalankan `backend/supabase/seed.sql`

### 2. Environment Variables
```bash
cp backend/.env.example backend/.env
cp backend/.env.example frontend/.env.local
# Isi dengan kredensial Supabase & AI server Anda
```

### 3. Jalankan Frontend Lokal
```bash
cd frontend
npm install
npm run dev
```

### 4. Deploy ke Vercel
```bash
# Dari root project (vercel.json ada di backend/)
vercel --prod

# Tambah secrets
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add AI_SERVER_URL
vercel env add AI_API_KEY
```

## Tech Stack
- **Frontend**: React 19, Vite 8, TailwindCSS 4, Framer Motion
- **Backend**: Vercel Serverless Functions (Edge Runtime)
- **Database**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **AI**: OpenAI-compatible API (self-hosted)
- **Deployment**: Vercel
# fitness-apps
