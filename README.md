# President Tailor — Next.js + Laravel Antigravity Master Kit

**Isi ZIP:** spesifikasi + aturan workspace + struktur folder kosong. **Belum merupakan source code aplikasi atau aplikasi yang sudah diuji.** Tujuan paket: mengunci PRD/stack/fase agar Antigravity membangun MVP dengan konsisten.

## Struktur
```
president-tailor-next-laravel/
├── AGENTS.md              # Instruksi utama AI agent
├── PRD.md                 # Kebutuhan owner, AC, data, API
├── RULES.md               # Clean code, keamanan, arsitektur
├── UI_UX.md               # Standar desain, layar, nota
├── AUDIT.md               # Phase 0–8 + quality gates
├── README.md              # Panduan menjalankan agent
├── .gitignore
├── .agents/
│   └── rules/
│       ├── architecture.md
│       └── security.md
├── docs/
│   └── DECISIONS.md       # Asumsi vs keputusan owner
├── api/                   # Laravel 13 dibuat Phase 1
├── landing/               # Next.js App Router dibuat Phase 1
└── internal/              # Next.js App Router dibuat Phase 1
```

## Stack tetap
- `api`: Laravel 13, PHP >=8.3, MySQL 8+, REST, Sanctum cookie session + CSRF.
- `landing`: Next.js App Router + TypeScript (public website).
- `internal`: Next.js App Router + TypeScript (private dashboard).
- **Tidak memakai React + Vite sebagai aplikasi frontend terpisah.** React tetap dipakai di dalam Next.js.

## Cara pakai di Windows / Antigravity
1. Ekstrak ZIP menjadi satu folder lokal baru. **Jangan gabungkan dengan repo produksi.**
2. Buka folder **root** `president-tailor-next-laravel` di Antigravity agar `AGENTS.md` dan `.agents/rules/*.md` terdeteksi.
3. Mulai dengan **PLAN Phase 0**. Validasi `docs/DECISIONS.md` dan topology hosting.
4. Perintahkan **BUILD Phase 1**, lalu **AUDIT Phase 1** setelah selesai. Berhenti bila BLOCKED/FAIL; lanjut jika PASS.
5. Ulangi fase satu per satu hingga Phase 8. Build dan audit tidak boleh berjalan sekaligus secara otomatis.

## Prompt Antigravity — awal
```
Baca AGENTS.md, PRD.md, RULES.md, UI_UX.md, AUDIT.md dan docs/DECISIONS.md.
Gunakan stack wajib: Laravel 13 di api/, Next.js App Router + TypeScript di landing/ dan internal/.
Jalankan PLAN PHASE 0. Kunci kebutuhan owner, putuskan rancangan sederhana,
daftarkan asumsi yang belum terjawab, cek risiko autentikasi Sanctum lintas subdomain,
dan rancang database dan API tanpa coding. Laporkan sesuai template AGENTS.md.
Jangan lanjut Phase 1 tanpa perintah saya.
```

## Prompt BUILD saat Phase 0 sudah dievaluasi
```
BUILD PHASE 1 sesuai AGENTS.md dan AUDIT.md.
Scaffold Laravel 13 di api/, Next.js App Router TypeScript di landing/ dan internal/.
Jangan gunakan Vite project, jangan mengubah scope PRD.
Jalankan checks aktual; tampilkan file berubah, command/output, dan blocker.
Jangan masuk Phase 2. Jangan menyentuh production.
```

## Prompt audit generik
```
AUDIT PHASE [N]. Jangan edit source code.
Periksa PRD.md, RULES.md, UI_UX.md, acceptance criteria dan checklist AUDIT.md.
Jalankan tes non-destruktif yang relevan, tampilkan bukti actual PASS/FAIL/BLOCKED,
severity temuan, rekomendasi FIX. Jangan melanjutkan phase.
```

## Prompt fix generik
```
FIX PHASE [N] hanya untuk temuan audit yang terkonfirmasi.
Jangan menambah scope/fitur. Jalankan tes ulang dan catat perubahan aktual.
Jangan melanjutkan Phase [N+1] tanpa perintah.
```

## Contoh scaffold yang seharusnya dijalankan Antigravity pada Phase 1
> Jalankan **hanya** di folder project baru yang kosong. Periksa versi tooling dan flags CLI sebelum eksekusi; perintah di bawah adalah referensi, bukan bukti telah dijalankan.

```powershell
composer create-project laravel/laravel api "^13.0"
npx create-next-app@latest landing --typescript --eslint --app --src-dir --use-npm --no-tailwind
npx create-next-app@latest internal --typescript --eslint --app --src-dir --use-npm --no-tailwind
```

Jika folder `api`, `landing` atau `internal` sudah ada sebagai placeholder kosong, pindahkan/hapus **hanya** `.gitkeep` di folder bersangkutan dengan aman sebelum scaffold, jangan menghapus file pekerjaan user. Pin dan rekam versi Next.js aktual di package-lock.json setelah inisialisasi.

### Contoh alamat pengembangan lokal
- Landing: `http://localhost:3000`
- Internal: `http://localhost:3001`
- Laravel API: `http://localhost:8000`

Gunakan hostname konsisten dan validasi Sanctum stateful/CORS/CSRF saat aplikasi hidup. Host berbeda atau port berbeda bukan jaminan cookies bekerja tanpa konfigurasi.

### Rekomendasi produksi
Domain sendiri atau subdomain dengan parent domain yang sama: `www.domain`, `app.domain`, `api.domain`. **Hosting harus mendukung dua Next.js runtimes serta PHP dan DB** atau deployment terpisah yang kompatibel. Jangan membuat klaim shared hosting biasa pasti bisa.

## Scope yang dikunci
Pelanggan (nama, alamat, telepon), order (no, layanan, ukuran, harga), nota (no, nama, alamat, pesanan, total), update status, counts dashboard, landing sederhana. **Belum termasuk** laporan pendapatan, DP, booking, stok, tracking pelanggan, pembagian penjahit, atau finansial.

## Link rujukan resmi
- Antigravity workspace rules: https://www.antigravity.google/docs/rules/
- Laravel 13 deployment & PHP requirement: https://laravel.com/docs/13.x/deployment
- Laravel Sanctum SPA auth: https://laravel.com/docs/13.x/sanctum
- Next.js App Router: https://nextjs.org/docs/app
