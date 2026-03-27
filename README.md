# Eclif Match — AI Hijab Color Matching

Aplikasi web berbasis AI yang membantu pelanggan toko hijab menemukan warna kerudung paling serasi dengan outfit mereka.

## Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| AI Vision | Claude Vision (claude-opus-4-6) via Anthropic SDK |
| Color Matching | Euclidean RGB distance (Phase 1 MVP) |

---

## Struktur Project

```
eclif_match/
├── backend/
│   ├── server.js            # Entry point Express
│   ├── routes/
│   │   └── analyze.js       # POST /api/analyze & /api/analyze/manual
│   ├── data/
│   │   └── hijabCatalog.js  # 25 produk hijab dengan data warna
│   ├── utils/
│   │   └── colorMatching.js # Algoritma Euclidean RGB matching
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Upload.jsx
    │   │   ├── Analyzing.jsx
    │   │   ├── Results.jsx
    │   │   └── ManualMatch.jsx
    │   ├── context/
    │   │   └── AppContext.jsx
    │   ├── App.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js        # Proxy /api → backend:3001
    ├── tailwind.config.js
    └── package.json
```

---

## Setup & Menjalankan

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Konfigurasi API Key

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Dapatkan API key di: https://console.anthropic.com

### 3. Jalankan

Buka **dua terminal**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# → Running on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → Running on http://localhost:5173
```

Buka browser: **http://localhost:5173**

---

## Fitur MVP (Phase 1)

- **Beranda** — tagline, CTA upload, trust indicators
- **Upload Outfit** — drag & drop / tap, validasi format & ukuran, preview foto, kamera langsung
- **Analyzing** — loading screen animasi dengan progress steps
- **Your Perfect Match** — detected colors, 4 rekomendasi hijab, tombol Shop This Color, feedback like/dislike, share
- **Manual Match** — pilih warna via color picker, input HEX, atau preset warna populer

---

## API Endpoints

### `POST /api/analyze`
Analisa foto outfit dan kembalikan rekomendasi hijab.

- **Body**: `multipart/form-data` dengan field `image` (JPG/PNG/WEBP, maks 5MB)
- **Response**:
```json
{
  "detectedColors": [
    { "name": "Dusty Rose", "hex": "#C8A09A", "rgb": { "r": 200, "g": 160, "b": 154 } }
  ],
  "recommendations": [
    {
      "product_id": "HJB-001",
      "name": "Sage Mist",
      "color_label": "Soft Contrast",
      "hex_color": "#B2C4B0",
      "price": 89000,
      "shop_url": "...",
      "match_score": 42.3
    }
  ]
}
```

### `POST /api/analyze/manual`
Color matching tanpa foto (input HEX manual).

- **Body**: `{ "hex": "#C8A09A" }`
- **Response**: sama dengan `/api/analyze`

---

## Katalog Produk

File: `backend/data/hijabCatalog.js`

Berisi 25 produk dengan data:
- `product_id`, `name`, `color_label`
- `hex_color`, `rgb` — untuk color matching
- `image_url`, `shop_url` — ganti dengan URL produk nyata
- `price`, `category`, `tags`, `stock`

Untuk production: ganti `image_url` dan `shop_url` dengan URL toko sungguhan.

---

## Roadmap

- **Phase 1 (MVP)** ✅ — 4 screen, Claude Vision, 25 produk hardcoded, Euclidean matching
- **Phase 2** — Admin panel, CSV import, Delta E CIEDE2000, analytics
- **Phase 3** — Manual match, WooCommerce/Shopify sync, share sosmed, PWA
