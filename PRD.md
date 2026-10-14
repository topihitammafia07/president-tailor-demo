# PRD — President Tailor MVP V1.1

**Status:** Baseline dari informasi owner; sejumlah keputusan teknis ditandai *asumsi*, wajib dikonfirmasi sebelum tahap yang terdampak. **Stack:** Next.js (`landing/`, `internal/`) + Laravel 13 (`api/`) + MySQL.

## 1. Sumber kebutuhan langsung dari owner
Pernyataan owner yang diterima:
- Pesanan yang paling banyak: **jas, hem batik, celana panjang**.
- Catatan **buku** berisi: **nomor pesanan, nama, alamat, nomor telepon, pesanan, ukuran**.
- Catatan **nota** berisi: **nomor pesanan, nama, alamat, pesanan, total harga**.
- Kendala/harapan: **update proses produksi**, **pencatatan data customer**.
- **Laporan pendapatan belum ada**; ini adalah kondisi saat ini, **bukan permintaan membangun laporan keuangan**.

Tidak ada informasi owner tentang dimensi ukuran jahit, pembayaran DP, jumlah pekerja, data produk/kain, tarif, nama admin, atau hosting. Jangan memperlakukan asumsi sebagai fakta.

## 2. Sasaran MVP
Menggantikan buku/nota manual menjadi data yang bisa dicari dan digunakan ulang; status produksi dapat diperbarui staf. Landing page sebatas kehadiran digital sederhana, bukan kanal transaksi. Keberhasilan dinilai dari alur operasional, bukan angka statistik marketing.

## 3. Persona, peran, dan otorisasi (Revisi Resmi Phase 9 — DEC-010)
- **Role `staff` (Operator):** Memasukkan data pelanggan, membuat pesanan & ukuran, mencetak nota, memperbarui status produksi, dan mencatat pembayaran riil (DP maupun pelunasan).
- **Role `owner` (Pemilik Usaha):** Memantau dashboard eksekutif (omzet nilai pesanan, realisasi pemasukan riil, sisa piutang, status pesanan, grafik tren) serta mengakses laporan bisnis mendalam (rekap per layanan jas/hem batik/celana, rekap pembayaran, tren harian/bulanan, dan daftar piutang). Memiliki hak akses penuh operasional.
- **Otorisasi Server-Side:** Endpoint laporan dan eksekutif dilindungi Gate Laravel (`access-owner-reports`) dan middleware `EnsureUserIsOwner` (403 Forbidden bila diakses staf).
- Pelanggan **tidak** login dan **tidak** memesan online.
- Akun bootstrap dibuat melalui seeder/CLI aman, tanpa registrasi publik. Default development: `owner@presidenttailor.com` dan `staff@presidenttailor.com`.

## 4. Scope wajib dan acceptance criteria

### P-01 Database pelanggan
- Create, list, search berdasarkan nama/no. telepon, detail, edit.
- Form: nama, alamat, no. telepon. Telepon disimpan sebagai string, bukan angka.
- Pelanggan dapat memiliki riwayat pesanan (tampil dari relasi saat buka detail).
- Tidak ada penghapusan permanen pelanggan melalui UI V1.
- **AC-CUS-01**: staf login dapat menyimpan pelanggan valid dan melihatnya di daftar/pencarian.
- **AC-CUS-02**: nama/alamat/telepon dapat diedit, tanpa merusak nota/order terdahulu.
- **AC-CUS-03**: pelanggan tanpa pesanan tetap valid; detail menampilkan empty state.

### P-02 Pesanan + ukuran
- Input: pelanggan terdaftar, jenis layanan jas/hem batik/celana panjang, catatan ukuran sesuai yang dicatat owner, total harga untuk nota.
- Nomor pesanan unik dibuat sistem, contoh `PT-000001`; tidak dapat diedit manual.
- Setiap pesanan punya sedikitnya satu entri jenis layanan. Dukungan jumlah item dan multi-item adalah **asumsi teknis A-02** untuk memungkinkan lebih dari satu pakaian pada satu nota; jika owner menghendaki satu jenis per nota, batasi UI sesuai keputusan, tanpa mengganti arsitektur data secara destruktif.
- Catatan ukuran berbentuk teks bebas **per item pesanan**, bukan ukuran global pelanggan. Jangan membuat field lingkar dada/pinggang atau template ukuran tanpa sampel buku asli.
- Total harga dimasukkan manual sebagai jumlah integer Rupiah, tanpa katalog harga, tanpa pembayaran.
- Simpan nama dan alamat pelanggan saat pesanan dibuat sebagai *snapshot* supaya nota lama tetap sesuai data saat transaksi.
- Data pesanan dapat dibuka dan diperbaiki sebelum status `Selesai`; aturan koreksi order selesai harus diputuskan owner (A-03); jangan buat tombol hapus.
- **AC-ORD-01**: satu pesanan valid menghasilkan nomor unik dan detail lengkap.
- **AC-ORD-02**: ukuran tiap item tidak tertukar saat pesanan diedit atau dilihat lagi.
- **AC-ORD-03**: total harga pada detail dan nota sama dengan nilai tersimpan.
- **AC-ORD-04**: edit profil pelanggan tidak mengubah snapshot pada pesanan lama.
- **AC-ORD-05**: input salah menghasilkan validasi aman dan pesanan tidak tersimpan sebagian.

### P-03 Update produksi
- Tahap minimum rancangan: `Baru` -> `Diproses` -> `Selesai` (**asumsi A-04**, validasi istilah dan transisi dengan owner).
- Selesai berarti pekerjaan jahitan selesai, **bukan** otomatis lunas/diambil pelanggan.
- Status ditampilkan pada daftar/detail dan dapat diubah oleh staf login.
- **AC-STATUS-01**: perubahan status valid tersimpan dan ditampilkan konsisten.
- **AC-STATUS-02**: status tidak valid, mundur, atau lompat ditolak server.
- **AC-STATUS-03**: dua update hampir bersamaan tidak menghasilkan state korup/tidak konsisten.

### P-04 Nota cetak
- Isi **persis kebutuhan nota owner**: nomor pesanan, nama, alamat, pesanan (jenis pakaian), total harga.
- Cetak via print stylesheet browser, tanpa generator PDF backend atau printer integrasi khusus.
- Jangan bocorkan catatan ukuran/nomor telepon ke nota bila tidak diminta; keduanya tetap di dashboard/buku digital.
- **AC-NOTA-01**: nota lama tetap menampilkan nama/alamat snapshot dan total harga yang sama.
- **AC-NOTA-02**: tampilan print tidak memuat menu dashboard, tombol interaktif, dan tidak terpotong di ukuran kertas target yang disepakati.

### P-05 Dashboard operasional
- Angka: jumlah seluruh pesanan, Baru, Diproses, Selesai (dihitung server dari data aktual).
- Daftar pesanan terbaru, pencarian, dan filter status; tidak ada pendapatan, laba, grafik omzet, stok, atau KPI penjualan.
- **AC-DASH-01**: data kosong menampilkan angka nol dan empty state; hitungan benar setelah update pesanan.

### P-06 Landing publik
- Profil singkat `President Tailor`, jasa yang disampaikan owner: jas, hem batik, celana panjang, CTA kontak setelah no. WhatsApp **resmi** diverifikasi.
- Jangan tampilkan alamat detail/foto/harga/testimoni/jam buka fiktif; no. WA kosong: CTA nonaktif dengan pesan konfigurasi belum tersedia sampai data benar diberikan.
- Landing tidak memiliki checkout, booking, halaman portal pelanggan, atau form penyerahan data pelanggan.
- **AC-WEB-01**: publik dapat melihat layanan nyata, halaman responsif, metadata SEO, tanpa akses ke data pelanggan.

### P-07 Auth & perlindungan data
- Dashboard hanya staf terautentikasi, login/logout, tanpa daftar akun publik.
- Laravel Sanctum berbasis cookie session; CSRF diterapkan; seluruh API customer/order/status dan nota privat dilindungi auth di Laravel.
- **AC-AUTH-01**: anonim mendapat 401 untuk endpoint privat dan tidak menerima data bisnis.
- **AC-AUTH-02**: sesi login/logout bekerja, rate limit login diterapkan, CSRF request mengubah data diverifikasi.

### P-08 Pencatatan Pembayaran Minimal (Phase 9 — DEC-010)
- Pencatatan pembayaran per pesanan: nominal uang (decimal), tanggal bayar, metode bayar (`tunai`, `transfer_bank`, `qris`), dan catatan opsional.
- Perhitungan dinamis pada pesanan: `total_paid` (akumulasi pembayaran valid), `remaining_bill` (`total_price` - `total_paid`), dan `payment_status` (`belum_dibayar`, `sebagian`, `lunas`).
- Aturan validasi: nominal harus positif (> 0), tidak boleh melebihi sisa tagihan, dan pesanan yang sudah lunas tidak dapat menerima pembayaran baru.
- Integritas data: row-locking transaction (`lockForUpdate`) untuk mencegah race condition atau double recording.
- **AC-PAY-01**: Staf/Owner dapat mencatat pembayaran bertahap (DP) dan status otomatis menjadi `sebagian`.
- **AC-PAY-02**: Pembayaran yang melunasi sisa tagihan otomatis mengubah status pesanan menjadi `lunas` dan sisa tagihan menjadi Rp 0.
- **AC-PAY-03**: Upaya input nominal negatif, 0, atau melebihi sisa tagihan ditolak server dengan kode 422.
- **AC-PAY-04**: Pesanan yang sudah lunas menolak penambahan pembayaran baru (422).

### P-09 Dashboard Eksekutif & Laporan Bisnis Owner (Phase 9 — DEC-010)
- **Dashboard Owner (`/owner/dashboard`):** Menampilkan metrik total pesanan, breakdown pesanan baru/diproses/selesai, total nilai pesanan, total realisasi pemasukan riil, total piutang belum terbayar, dan tren bulanan (omzet pesanan vs uang masuk riil). Filter rentang tanggal tersedia.
- **Laporan Bisnis Owner (`/owner/laporan`):** Rekap jumlah pesanan per jenis layanan (jas, hem batik, celana panjang), breakdown status pembayaran (`lunas`, `sebagian`, `belum_dibayar`), tren pendapatan harian dan bulanan, serta tabel daftar pesanan belum lunas untuk penagihan piutang.
- Otorisasi server-side: Hanya role `owner` yang diizinkan mengakses data laporan ini (Gate `access-owner-reports`).
- **AC-REP-01**: Hanya role `owner` yang dapat mengakses `/api/v1/owner/dashboard` dan `/api/v1/owner/reports`; role `staff` ditolak dengan kode 403.
- **AC-REP-02**: Perhitungan total pemasukan riil hanya didasarkan pada pembayaran yang benar-benar tercatat, terpisah jelas dari total nilai pesanan.
- **AC-REP-03**: Rekap layanan menampilkan pemesanan 3 jenis jasa aktual (jas, hem batik, celana panjang) secara konsisten dari database.
- **AC-REP-04**: Filter rentang tanggal menyaring data pesanan dan pembayaran secara akurat sesuai periode yang dipilih.

## 5. Out of scope (tidak dibuat)
Payment gateway online pihak ketiga (Midtrans/Xendit dll), perhitungan laba bersih / HPP / biaya operasional (belum ada data pengeluaran/HPP kain), inventory/stok kain, supplier, jadwal fitting online, reminder WhatsApp otomatis, chatbot AI publik, registrasi pelanggan online, POS barcode scanner, penggajian penjahit, multi cabang.

## 6. Alur utama
1. Staf/Owner login di dashboard internal.
2. Tambah/cari pelanggan: nama, alamat, telepon.
3. Buat pesanan: pilih pelanggan, jenis layanan (Jas, Hem Batik, Celana Panjang) dan catatan ukuran, total harga.
4. Sistem menyimpan secara atomik dan memberikan nomor pesanan unik (contoh `PT-000001`).
5. Staf cetak nota fisik untuk pelanggan.
6. Staf mencatat pembayaran bertahap (DP) atau pelunasan saat transaksi atau fitting.
7. Staf memperbarui progres produksi sampai selesai.
8. Owner mengakses `/owner/dashboard` dan `/owner/laporan` untuk memonitor perkembangan bisnis, pemasukan riil, serta piutang.

## 7. Data model kontrak V1.2

Tabel inti:

| Tabel | Kolom utama | Catatan |
|---|---|---|
| `users` | id, name, email, password, role (`owner`/`staff`), timestamps | Akun internal hanya via proses admin/seeder aman |
| `customers` | id, name, address, phone, timestamps | phone sebagai VARCHAR/string |
| `service_types` | id, slug, name, timestamps | seed `jas`, `hem-batik`, `celana-panjang` |
| `orders` | id, order_number (unique), customer_id, customer_name_snapshot, customer_address_snapshot, status, total_price, timestamps | `total_price` BIGINT/decimal Rupiah |
| `order_items` | id, order_id, service_type_id, quantity, measurements_note, timestamps | `quantity` default 1; catatan ukuran teks bebas |
| `payments` | id, order_id, amount (decimal 12,2), payment_date (date), payment_method (`tunai`/`transfer_bank`/`qris`), notes, timestamps | Relasi FK ke `orders`, pencatatan pembayaran riil |

- `orders.customer_id` foreign key restrict delete.
- `order_number` dibuat dari ID tersimpan dalam transaksi (`PT-000001`); unique index; immutable.
- Indeks: customers phone/name search, orders order_number unique, customer_id, status, created_at, order_items order_id, payments order_id, payment_date.
- Perhitungan `total_paid`, `remaining_bill`, dan `payment_status` dievaluasi dari relasi `payments`.

## 8. API contract (semua internal, JSON)

| Method | Endpoint | Kegunaan | Privasi & Role |
|---|---|---|---|
| GET | `/api/v1/me` | sesi user aktif & role | auth (`staff` & `owner`) |
| GET | `/api/v1/service-types` | daftar jenis layanan | auth (`staff` & `owner`) |
| GET/POST | `/api/v1/customers` | list, cari, buat | auth (`staff` & `owner`) |
| GET/PATCH | `/api/v1/customers/{id}` | detail, edit | auth (`staff` & `owner`) |
| GET/POST | `/api/v1/orders` | list, filter, buat | auth (`staff` & `owner`) |
| GET/PATCH | `/api/v1/orders/{id}` | detail, koreksi sebelum selesai | auth (`staff` & `owner`) |
| PATCH | `/api/v1/orders/{id}/status` | update status produksi | auth (`staff` & `owner`) |
| GET/POST | `/api/v1/orders/{id}/payments`| riwayat & tambah pembayaran | auth (`staff` & `owner`) |
| GET | `/api/v1/dashboard/summary` | ringkasan counts operasional | auth (`staff` & `owner`) |
| GET | `/api/v1/owner/dashboard` | ringkasan eksekutif bisnis | auth (`owner` only - Gate 403) |
| GET | `/api/v1/owner/reports` | laporan bisnis & keuangan riil | auth (`owner` only - Gate 403) |

- Login/logout memakai endpoint Laravel **web middleware session** (`/login`, `/logout`) dengan Sanctum CSRF cookie endpoint `/sanctum/csrf-cookie`.
- Endpoint `/api/v1/owner/*` dilindungi Gate `access-owner-reports` dan middleware `EnsureUserIsOwner`. Staf yang mencoba mengakses langsung menerima 403 Forbidden.
- Nota dapat dicetak dari **detail pesanan yang sudah diambil via API privat**, melalui route Next `internal` `/pesanan/[id]/nota` (client-side auth guard). Tidak perlu endpoint nota publik; API resource order menyuplai snapshot yang diperlukan untuk print.
- Request error: 401 anonymous, 403 unauthorized, 404 missing, 409 status conflict, 419 CSRF/session, 422 validation. Jangan bocorkan SQL/internal details.
- List paginated; `q` search dibatasi panjangnya, status enum whitelist. Backend menentukan nilai resmi dan tidak menerima `order_number` dari client.
- Total dan ukuran tidak boleh dimanipulasi menjadi field pembayaran/tarif otomatis.

## 9. NFR dan acceptance nonfungsional
- `NFR-01` Responsif 360px/768px/1440px, form nyaman dipakai desktop dan ponsel.
- `NFR-02` Validasi server, output escaped, tidak ada akses anonim, CSRF, rate limiting, secure session di produksi.
- `NFR-03` Konsistensi: transaksi atomik, nomor unik, transisi status aman dan idempotensi konflik ditangani.
- `NFR-04` Performant: pagination default 20 (max 100), query efisien, no N+1; no charts dan bundel berat tidak perlu.
- `NFR-05` Test API feature/security, frontend lint/typecheck/build, smoke UI/print, backup & restore sebelum deploy.
- `NFR-06` Data pribadi tidak masuk log, analytics, screenshot publik, atau mock production; `APP_DEBUG=false` produksi.
- `NFR-07` Tanggal/waktu `Asia/Jakarta`, format Rupiah integer di UI, penyimpanan timestamp UTC konsisten bila digunakan di server.

## 10. Keputusan yang perlu dikunci di Phase 0
- **A-01** Akun dashboard: satu tipe staff atau perlu beda akses owner/admin?
- **A-02** Satu nota bisa memuat lebih dari satu jenis/jumlah pakaian atau satu jenis saja?
- **A-03** Koreksi pesanan setelah status `Selesai`: dilarang atau memerlukan mekanisme khusus?
- **A-04** Istilah status proses produksi yang dipakai di workshop?
- **A-05** Ukuran/kertas nota yang digunakan (A5/thermal/manual), foto contoh nota; format ukuran aktual.
- **A-06** Nomor WA dan konten publik resmi untuk landing.

Jika user belum memberi jawaban, **jangan menambah fitur**; jalankan fase yang tidak bergantung pada keputusan dan dokumentasikan fallback yang paling konservatif pada `docs/DECISIONS.md`. Keputusan wajib sebelum fitur terkait dinyatakan selesai.

## 11. Change control
Setiap usulan fitur di luar scope dicatat sebagai backlog (bukan dibangun). Ubah PRD, API, UI, tests dan estimasi scope hanya setelah user menyetujuinya. Acceptance criteria V1 harus tetap terlacak sampai release.
