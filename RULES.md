# RULES — Engineering Standards (Laravel 13 + Next.js)

## 1. Hard boundaries
- `api/`: Laravel 13 / PHP >=8.3 / MySQL, **single source of truth** untuk validasi, auth, bisnis, penyimpanan.
- `landing/`: Next.js App Router, TypeScript strict, publik, statis/prerender bila mungkin.
- `internal/`: Next.js App Router, TypeScript strict, private dashboard memakai Laravel API.
- Jangan gunakan Vite sebagai project frontend terpisah. Next.js internal memakai bundler bawaan Next.js, bukan pengganti stack.
- Jangan akses database dari Next.js. Jangan tulis ulang kalkulasi/otorisasi bisnis di Next. Tidak membuat microservice, CQRS, event bus, Redis, queue, Docker, atau abstractions generik tanpa kebutuhan riil.

## 2. Project layout usulan setelah scaffold
```
api/
  app/Http/{Controllers/Api/V1,Requests,Resources}/
  app/{Models,Policies,Services}/
  database/{migrations,seeders,factories}/
  routes/{api.php,web.php}/
  tests/Feature/
landing/
  src/app/{layout.tsx,page.tsx,globals.css}
  src/components/
internal/
  src/app/{login, dashboard, pelanggan, pesanan}/
  src/{components,features,lib,types}/
```
Boleh ringkas struktur bila lebih sederhana. `features` hanya untuk fitur nyata. Jangan membuat ratusan boilerplate.

## 3. Clean code / SRP / DRY
- Controller tipis, FormRequest per operasi bermakna, Eloquent relationships jelas; service hanya untuk multi-step business operation yang nyata (mis. create order atomik).
- REST response via Laravel API Resources; jangan kirim Eloquent raw beserta hidden internals.
- Dependency injection bila berguna untuk testing; tidak perlu repository layer di atas Eloquent untuk CRUD sederhana.
- React components kecil dan reusable, formulir domain dikelompokkan jelas. Satu typed API client dan central error handling.
- TypeScript `strict: true`; hindari `any`, unsafe casts, data any-catch; gunakan TypeScript types yang mengikuti API shape dan runtime checks untuk input berisiko bila perlu.
- Format/lint kode (Pint, ESLint, TypeScript checker); comments hanya untuk keputusan non-obvious.
- Pakai native form/accessibility, CSS ringan; boleh memakai Tailwind bila disetujui saat scaffold tetapi hindari library UI berat untuk MVP.

## 4. Database / security
- Migrations additive dan reversible, tipe data tepat: phone VARCHAR, `total_price` BIGINT integer Rupiah, status whitelist, FK/unique/index penting.
- Input backend di FormRequest, authorize auth server-side, filter mass assignment, strip unexpected fields.
- Snapshot nama/alamat saat penciptaan order; old orders tak berubah ketika customer diperbaiki.
- DB transaction untuk order dan items; order no dari primary key setelah insert dalam transaction; constrain `order_number` unique.
- Status update valid dari current state; jalankan transaction/row-lock (atau concurrency control ekuivalen) bila perlu untuk cegah stale transitions. 409 untuk conflict.
- `auth:sanctum` pada seluruh endpoint internal, Sanctum SPA stateful cookie + CSRF. Browser `credentials: 'include'`; login CSRF bootstrap; tidak ada JWT/token di localStorage/sessionStorage.
- Rate limit login, generic auth error, session regeneration pada login/logout, HTTPS & HttpOnly/Secure/SameSite sesuai env, CORS whitelist eksplisit.
- Jangan membuat endpoint anonim yang mengekspos pelanggan/nota; hindari PII dalam logs, traces, telemetry, analytics atau seed produksi.
- Jangan jalankan `migrate:fresh`, `db:wipe`, `TRUNCATE` dan sejenisnya pada database klien. Test DB terpisah.

## 5. Next.js-specific implementation
- Gunakan **App Router**, `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` hanya saat diperlukan; jangan masukkan semua UI ke satu page component.
- Landing boleh Server Components (static content); metadata resmi hanya dari fakta valid owner. Optimasi gambar setelah foto resmi tersedia.
- Dashboard boleh Client Components untuk form/interaction. Semua data privat di-fetch `cache: 'no-store'` melalui API yang membutuhkan cookie/sesi; tidak render PII via static generation atau cache shared/CDN.
- Server Components/Server Actions/Route Handlers **bukan** tempat menyimpan business logic atau DB; jangan membuat lapisan BFF baru kecuali boundary auth diuji dan didokumentasikan.
- Lindungi tiap API di Laravel; UI guard hanya kemudahan UX, **bukan** satu-satunya kontrol akses.
- Tangani `401`, `419`, `422`, `409`, timeout/network fail; jangan hilangkan input form saat validasi gagal; prevent double submit.
- Web publication hanya dari `landing/`; dashboard harus menghindari indexing (robots noindex) dan caching dokumen privat.

## 6. Auth / deployment topology
**Recommended production:** satu parent domain dengan subdomain:
- `www.<domain>` -> Next.js landing
- `app.<domain>` -> Next.js internal
- `api.<domain>` -> Laravel public root

Sanctum SPA first-party mengharuskan domain SPA dan API memiliki **registrable parent domain yang sama**; set `SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN` (mis. `.<domain>`), `SESSION_SECURE_COOKIE=true`, CORS origins yang tepat dan credentials. Jangan memakai wildcard CORS plus credentials.

**Local development example:** `http://localhost:3000` landing, `http://localhost:3001` internal, `http://localhost:8000` Laravel. Gunakan hostname konsisten (`localhost`, jangan campur dengan `127.0.0.1`), set SANCTUM_STATEFUL_DOMAINS port internal yang sesuai, CORS origin yang tepat, dan session/CSRF tested pada browser sungguhan. App backend `http://localhost:8000` tidak otomatis sama origin dengan dashboard: cross-origin cookie/CORS perlu disetel. Jangan mengasumsikan Next middleware dapat menggantikan auth API.

Jika hosting hanya shared hosting PHP dan tidak mendukung Node.js runtimes, deployment 2 app Next.js harus dievaluasi lebih dahulu. Jangan klaim compatible tanpa verifikasi hosting.

## 7. Performance / reliability
- Pagination server-side default 20 max 100; query customer/order indexes sesuai data query.
- Hindari N+1 (eager-load relation seperlunya), ambil field yang diperlukan, hitungan dashboard query agregat sederhana.
- Jangan berlebihan membuat request: debounce search wajar, batalkan request yang sudah tidak relevan, gunakan cache hanya untuk data non-PII/stabil (misal jenis layanan) bila aman.
- Hindari fitur background job/Redis karena belum diperlukan. Pastikan error DB/sesi tidak membuat data partial.

## 8. UI and quality gates
- Ikuti `UI_UX.md`, warna semantik + teks (bukan warna saja); keyboard focus dan label input nyata.
- Test: `php artisan test`, `vendor/bin/pint --test`; Next tiap app: `npm run lint`, `npx tsc --noEmit`, `npm run build` atau scripts setara hasil scaffold nyata.
- Uji neg: 401/419/422, order tanpa pelanggan, field ukuran kosong, order number immutable, status skip/back, XSS input, race, duplicate submit, public PII leaks, print view.
- Jangan menyatakan test PASS tanpa menjalankan, tidak ada fake test output.
- Semua `*.env`, `node_modules/`, `vendor/`, build output, log rahasia dilarang di commit. Example env aman tanpa secret.

## 9. Production safety
- `APP_DEBUG=false`, HTTPS, only Laravel `public/` docroot, CSP/header security yang sesuai deployment, strict permissions dan secret management.
- DB backup sebelum migrasi, prosedur restore diuji, database test terpisah, catat rollback plan.
- Setiap perubahan hanya dalam workspace; tidak menyentuh situs/DB produksi tanpa perintah user yang jelas.
