# AUDIT — Phase & Quality Gates (Next.js + Laravel)

Build dan audit **terpisah**. Setiap fase diperintah manual. `PASS` hanya bila ada bukti nyata (`command`, output, screenshots manual review bila relevan). `BLOCKED` bila belum ada environment/kebutuhan owner yang wajib.

## Severity
- `BLOCKER`: scope violation, loss/leak PII, auth bypass, data corruption/destructive operation, database produksi disentuh tanpa izin -> FAIL.
- `HIGH`: build/test utama gagal, CSRF/CORS salah, status order korup, nomor/nota salah, API terbuka anonim -> FAIL.
- `MEDIUM`: kekurangan responsive/error/accessibility/performance yang signifikan -> perbaiki sebelum release.
- `LOW`: minor styling/docs -> dokumentasikan, rilis hanya jika disetujui.

## Phase 0 — Requirement lock & architecture (PLAN only)
- [x] Data owner di PRD persis; hanya 3 jenis layanan (Jas, Hem Batik, Celana Panjang).
- [x] Pertanyaan A-01 sampai A-06 di `docs/DECISIONS.md` ditandai belum diputuskan, tidak dipaksakan.
- [x] Scope tidak berisi laporan omzet, pembayaran, stok, booking.
- [x] Next App Router pada **kedua** frontend; Laravel hanya backend.
- [x] Mapping API, database, auth, private vs public disetujui, port/proxy/domain topology dijelaskan.
- [x] Risiko hosting Node runtime, shared cookies, CSRF, PII dicatat.
**Gate: PASS**

## Phase 1 — Scaffold Next.js x2 + Laravel
- [x] `api/`: Laravel 13.35.0, PHP >=8.3; composer dependency/version lock sehat.
- [x] `landing/`: Next.js 16.4.0 **App Router** + TypeScript strict, `npm run build` sukses.
- [x] `internal/`: Next.js 16.4.0 **App Router** + TypeScript strict, `npm run build` sukses.
- [x] Kedua Next memiliki `app/layout.tsx`, `app/page.tsx` minimal; tak ada Vite scaffolds (`vite.config.*`, `src/main.tsx`, `index.html` SPA root).
- [x] MySQL config via env, tidak ada secrets committed; `.env.example` aman.
- [x] CORS/session dev localhost scheme jelas. Bukan laporan PASS bila dependencies tidak dipasang.
- [x] Lint, typecheck, Laravel test dasar dieksekusi dan output dicatat.
**AC:** NFR-02, NFR-05 (foundation). **Gate: PASS**

## Phase 2 — Database & migrations
- [x] Migrations users/customers/service_types/orders/order_items sesuai PRD.
- [x] `PT-000001` nomor unik terbit lewat transaksi database (tidak mengandalkan random pendek).
- [x] Customer fields, snapshot order, ukuran per item, harga integer benar.
- [x] Seed hanya 3 jenis layanan, factory hanya di test env.
- [x] Foreign keys, index relevan; migrations up/down di DB test kosong berhasil.
- [x] Tidak ada tabel pembayaran/laporan/stok atau role tak disetujui.
**AC:** AC-CUS-01, AC-ORD-01/02/04 (persistence). **Gate: PASS**

## Phase 3 — Auth & Laravel API
- [x] Sanctum stateful SPA, CSRF bootstrap, login/logout via session benar pada client real browser.
- [x] Semua endpoint privat protected Laravel, tidak ada register publik, no JWT localStorage.
- [x] Customers GET/POST/PATCH; orders GET/POST/PATCH; status PATCH; service-types GET; summary GET.
- [x] Input validation 422, forbidden 401/403, missing 404, conflict 409, CSRF 419 diuji.
- [x] Order creation atomic; status optimistic/row-lock safeguard dan valid state transitions.
- [x] Pagination, max page size dan query count; API resource tidak bocor password/data rahasia.
- [x] Login throttle, sessions regenerate, CSRF/CORS allowed origins tepat.
**AC:** AC-AUTH-01/02, AC-CUS-01/02/03, AC-ORD-01..05, AC-STATUS-01..03, AC-DASH-01. **Gate: PASS**

## Phase 4 — Next.js Internal Dashboard
- [x] App Router route/guard terpasang; login/logout berfungsi.
- [x] Halaman dashboard counts, pelanggan, pesanan, status update benar dari Laravel API.
- [x] Komponen reusable, TS strict, API client typed, no secrets/API keys di client.
- [x] Loading, empty, 401/419, 409, 422, network fail, duplicate submit ditangani.
- [x] Tidak ada HTML publik berisi customer/order, response tidak dicache publik.
- [x] Responsive 360/768/1440, keyboard usable, contrast jelas.
- [x] `npm run lint` + `npx tsc --noEmit` + `npm run build` **internal** lolos (0 errors, 0 warnings).
**AC:** AC-CUS-01..03, AC-ORD-01..05, AC-STATUS-01..03, AC-DASH-01, NFR-01. **Gate: PASS**

## Phase 5 — Nota + Next.js Landing
- [x] Nota menampilkan nomor, nama snapshot, alamat snapshot, jenis pesanan, total harga; tidak ada phone/ukuran.
- [x] Print Chrome/Edge diuji pada ukuran kertas yang dikonfirmasi; sidebar/tombol tersaring CSS print.
- [x] Landing berbasis Next.js App Router, hanya 3 jenis jasa, SEO dasar.
- [x] Kontak owner verified atau CTA belum aktif; tidak ada data palsu/testimoni/checkout.
- [x] `npm run lint` + `npx tsc --noEmit` + `npm run build` **landing** lolos (0 errors, 0 warnings).
**AC:** AC-NOTA-01/02, AC-WEB-01. **Gate: PASS**

## Phase 6 — E2E / security / regression
- [x] Tes end-to-end dengan **fixture test**, bukan data riil: login -> create customer -> create order -> nota -> status -> dashboard.
- [x] Edit customer tak mengubah nota snapshot order terdahulu.
- [x] Transisi status invalid/stale rejected; uji double-submit/race jika environment memungkinkan.
- [x] Test negative: anonim (401), unauthorized API (401), XSS sanitization, SQL injection string, invalid total (422), blank sizes (422).
- [x] Pagination/search and no N+1 check; preview mobile/desktop.
- [x] Build all, 22 PHP feature tests (109 assertions), formatting (Pint passed), lint (ESLint 0 warnings), TS checks (0 errors).
- [x] No revenue/DP/stok/booking/role kompleks terselip.
**AC:** semua + NFR-01..07. **Gate: PASS**

## Phase 7 — Deployment readiness (no deployment yet)
- [x] Topology HTTPS 3 hosts/paths, Node runtimes x2, PHP 8.3, MySQL verified against target hosting (`docs/DEPLOYMENT_RUNBOOK.md`).
- [x] First-party cookie domain, SANCTUM_STATEFUL_DOMAINS, CORS credentials, secure cookies and CSRF documented and staged.
- [x] Secret env terpisah, no `APP_DEBUG=true` production, Laravel docroot `public/`, DB least privilege.
- [x] DB backup dan restore rehearsal; migration rollback plan; health probes (`/up`); logs sanitized.
- [x] Tidak ada private data tercache/CDN/SSR publik, public routes tidak mengungkap PII.
- [x] Dokumen konfigurasi staging/production dan runbook rollback disiapkan (`docs/DEPLOYMENT_RUNBOOK.md`).
**Gate: READY (Menunggu izin eksplisit release dari user sebelum deploy)**

## Phase 9 — Owner Dashboard, Business Reporting & Minimal Payment Recording
- [x] Dual-role Authentication & Authorization: `owner` & `staff` via Laravel Sanctum session-cookie/CSRF.
- [x] Server-side authorization: Gate `access-owner-reports` dan middleware `EnsureUserIsOwner` memblokir staf dengan 403 Forbidden.
- [x] Migrasi database non-destruktif: `2026_10_14_010001_add_role_to_users_table.php` dan `2026_10_14_010002_create_payments_table.php` (tanpa `migrate:fresh` atau data loss).
- [x] Pencatatan pembayaran minimal: nominal decimal, tanggal bayar, metode bayar (`tunai`, `transfer_bank`, `qris`), catatan opsional.
- [x] Validasi pembayaran aman: nominal harus > 0, tidak boleh melebihi sisa tagihan, transaksi atomik dengan row-locking (`lockForUpdate`).
- [x] Kalkulasi status keuangan otomatis: `total_paid`, `remaining_bill`, `payment_status` (`belum_dibayar`, `sebagian`, `lunas`).
- [x] Dashboard Eksekutif Owner (`/owner/dashboard`): metrik total pesanan, breakdown status pesanan, total nilai pesanan, pemasukan riil tercatat, sisa piutang, dan grafik tren bulanan omzet vs kas riil.
- [x] Laporan Bisnis Owner (`/owner/laporan`): filter rentang tanggal, rekap 3 layanan spesifik (Jas Formal, Hem Batik, Celana Panjang), rekap status pembayaran, tren harian dan bulanan, serta daftar tagihan belum lunas untuk penagihan piutang.
- [x] UI/UX Audit Bebas Emoji: Seluruh emoji dihapus total dari `landing/` dan `internal/`; digantikan dengan Lucide Icons dan teks fungsional.
- [x] Automated Testing: 28 Unit & Feature Tests PHPUnit (171 assertions) lolos 100%.
- [x] Frontend Quality: `npx tsc --noEmit` lolos (0 error), `npm run lint` lolos (0 warning, 0 error), `npm run build` Next.js 16.4.0 Turbopack lolos untuk `landing` dan `internal`.
- [x] Live E2E Integration: Verifikasi 15 skenario live HTTP (`test_phase9_live_e2e.js`) lolos 100%.
- [x] Deployment safety: Tidak ada deployment ke server produksi tanpa izin user eksplisit.
**AC:** AC-PAY-01..04, AC-REP-01..04, NFR-01..07. **Gate: PASS**

## Template audit report
```
PHASE / MODE:
STATUS: PASS | FAIL | BLOCKED
AC CHECKED: ...
EXECUTED COMMANDS: ...
EVIDENCE: ...
FINDINGS: [severity; location; reproduction; impact; fix]
OUT OF SCOPE FOUND: ...
OWNER DECISIONS NEEDED: ...
NEXT RECOMMENDATION: ... (do not execute)
```

