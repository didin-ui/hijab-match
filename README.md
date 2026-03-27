# Eclif Match — AI Hijab Color Matching

Aplikasi web yang membantu pelanggan toko hijab menemukan warna kerudung paling serasi dengan outfit mereka.

## Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Deteksi Warna | Canvas API (client-side, tanpa backend) |
| Color Matching | Euclidean RGB distance (client-side) |
| Katalog Produk | Google Sheets CSV *(sementara)* / hardcoded fallback |
| Backend | Node.js + Express *(disiapkan, belum aktif)* |
| AI Vision | Claude Vision — *menunggu API key* |

---

## Status Saat Ini

> **Mode sementara — tanpa AI, tanpa backend.**
> Deteksi warna dan color matching berjalan 100% di browser menggunakan Canvas API.
> Katalog produk dapat dikelola via Google Sheets tanpa perlu deploy ulang.
> Backend + Claude Vision akan diaktifkan setelah API key tersedia.

---

## Struktur Project

```
eclif_match/
├── backend/                      # Disiapkan, belum digunakan
│   ├── server.js
│   ├── routes/analyze.js
│   ├── data/hijabCatalog.js
│   ├── utils/colorMatching.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Analyzing.jsx     # Pakai Canvas API (bukan AI)
│   │   │   ├── Results.jsx
│   │   │   └── ManualMatch.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx    # Termasuk state catalog
│   │   ├── hooks/
│   │   │   └── useCatalog.js     # Load Google Sheets atau fallback
│   │   ├── utils/
│   │   │   ├── colorExtractor.js # Ekstraksi warna via Canvas
│   │   │   ├── colorMatching.js  # Algoritma matching (client-side)
│   │   │   └── sheetsCatalog.js  # Fetch & parse CSV Google Sheets
│   │   ├── data/
│   │   │   └── hijabCatalog.js   # 25 produk fallback (hardcoded)
│   │   └── config.js             # Baca env var VITE_SHEETS_CSV_URL
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
├── GOOGLE_SHEETS_SETUP.md        # Panduan lengkap setup Google Sheets
└── README.MD
```

---

## Setup & Menjalankan (Mode Sementara)

Hanya perlu menjalankan **frontend** saja — tidak perlu backend.

### 1. Install

```bash
cd frontend
npm install
```

### 2. (Opsional) Hubungkan Google Sheets

```bash
cp .env.example .env
```

Edit `frontend/.env`:
```
VITE_SHEETS_CSV_URL=https://docs.google.com/spreadsheets/d/XXXX/pub?output=csv
```

Panduan lengkap cara publish Google Sheets → lihat [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)

Jika `VITE_SHEETS_CSV_URL` dikosongkan, aplikasi otomatis memakai 25 produk bawaan (hardcoded).

### 3. Jalankan

```bash
cd frontend
npm run dev
# → http://localhost:5173
```

Untuk akses dari perangkat lain di jaringan yang sama, buka URL **Network** yang tampil di terminal (misal `http://192.168.x.x:5173`).

---

## Fitur

- **Beranda** — tagline, CTA upload, indikator sumber katalog (Sheets / lokal)
- **Upload Outfit** — drag & drop / tap / kamera, validasi format & ukuran, preview
- **Analyzing** — ekstraksi warna otomatis via Canvas API, loading screen animasi
- **Your Perfect Match** — detected colors, 4 rekomendasi hijab, tombol Shop This Color, feedback like/dislike, share
- **Manual Match** — pilih warna via color picker, input HEX, atau 10 preset warna populer

---

## Katalog Produk — Google Sheets (Sementara)

Katalog dikelola lewat Google Sheets. Pemilik toko cukup edit spreadsheet — aplikasi mengambil data terbaru otomatis setiap kali dibuka, **tanpa deploy ulang**.

**Prioritas katalog:**
```
Google Sheets CSV  →  berhasil? pakai data Sheets
                   →  gagal / kosong? fallback ke 25 produk hardcoded
```

**Indikator di beranda:**
- Titik biru + "XX produk dari Google Sheets" → terhubung
- Titik abu + "XX produk (katalog lokal)" → pakai fallback

**Format kolom Google Sheets:**

| Kolom | Contoh | Wajib |
|-------|--------|-------|
| `product_id` | `HJB-001` | ✅ |
| `name` | `Sage Mist` | ✅ |
| `color_label` | `Soft Contrast` | ✅ |
| `hex_color` | `#B2C4B0` | ✅ |
| `shop_url` | `https://tokopedia.com/...` | ✅ |
| `price` | `89000` | ✅ |
| `category` | `Voile` | ✅ |
| `stock` | `TRUE` / `FALSE` | ✅ |
| `image_url` | `https://...` | — |
| `tags` | `soft;green;neutral` | — |

Panduan lengkap → [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)

---

## Rencana Selanjutnya

| Phase | Status | Deskripsi |
|-------|--------|-----------|
| **Phase 1 — MVP** | ✅ Selesai | 4 screen, Canvas color detection, 25 produk, Euclidean matching |
| **Google Sheets Catalog** | ✅ Selesai | Pemilik toko kelola produk via spreadsheet |
| **Phase 2 — AI Vision** | ⏳ Menunggu API key | Aktifkan backend + Claude Vision untuk deteksi warna lebih akurat |
| **Phase 3 — Admin Panel** | 🔲 Belum | CRUD produk, Delta E CIEDE2000, analytics |
| **Phase 4 — Growth** | 🔲 Belum | Share sosmed, WooCommerce/Shopify sync, PWA |
