# UI_UX — President Tailor MVP V1.1

## Design direction
Profesional, cepat digunakan kasir/operator tailor, minimal, mudah dibaca. Bahasa Indonesia. Dashboard berorientasi **operasional pesanan**, bukan laporan marketing/keuangan. Next.js App Router + TypeScript untuk `landing/` dan `internal/`; semua data dan otorisasi berasal dari Laravel API pada `api/`.

## Visual design tokens
| Token | Nilai | Peran |
|---|---|---|
| background | `#F8FAFC` | background dashboard |
| surface | `#FFFFFF` | kartu/form/tabel |
| text-primary | `#0F172A` | konten penting |
| text-secondary | `#475569` | pendukung |
| primary | `#1E3A5F` | navigasi & tombol utama |
| border | `#E2E8F0` | batas |
| success | `#166534` | selesai |
| warning | `#92400E` | diproses |
| error | `#B91C1C` | error |

Gunakan font sistem atau font legal ringan, base 14–16px, line-height ~1.5; spacing 4/8/12/16/24/32; radius 8–12px. Jangan menghasilkan desain gelap/gradient berlebihan, ikon dekoratif yang ramai, atau grafik tanpa data/kebutuhan.

## Kebijakan Visual Bebas Emoji (Phase 9 — MANDATORY)
- **Larangan Total Emoji:** Seluruh emoji (seperti 📊, ✂️, 🧵, 👔, 📋, 💵, ⎙, ✓, dll.) dilarang pada website publik maupun dashboard internal.
- **Konsistensi Ikonografi:** Jika ikon dibutuhkan, gunakan Lucide Icons secara konsisten dan fungsional (misal: `LayoutDashboard`, `TrendingUp`, `Users`, `ShoppingBag`, `CreditCard`, `Printer`, `Calendar`). Jangan menggunakan ikon dekoratif yang berlebihan.

## Navigasi internal (Role-Based)
- **Role Staf:**
  - `Dashboard` (`/dashboard`)
  - `Pelanggan` (`/pelanggan`)
  - `Pesanan` (`/pesanan`)
  - `Keluar`
- **Role Owner:**
  - `Dashboard Bisnis` (`/owner/dashboard`)
  - `Laporan Bisnis` (`/owner/laporan`)
  - `Operasional Pesanan` (`/pesanan`)
  - `Keluar`
- Mobile <1024px: sidebar drawer terkontrol dengan keyboard (focus/escape), konten satu kolom, tabel scroll pada kontainernya saja.
- Lebar uji: 360, 768, 1440px. Kontrol sentuh ~44px, fokus keyboard terlihat, kontras teks >= 4.5:1.
- Route Next: `/login`, `/dashboard`, `/owner/dashboard`, `/owner/laporan`, `/pelanggan`, `/pelanggan/baru`, `/pelanggan/[id]`, `/pesanan`, `/pesanan/baru`, `/pesanan/[id]`, `/pesanan/[id]/nota`.
- Pengguna anonim yang mencoba dashboard diarahkan login, namun **backend** tetap memaksa authorization (401/403).

## Screen contract

### 1. Login
Label email dan password; info kesalahan autentikasi generik; loading state. Redirect otomatis: `owner` -> `/owner/dashboard`, `staff` -> `/dashboard`.

### 2. Dashboard Operasional Staf `/dashboard`
```
President Tailor             [Role Badge] [Keluar]
Dashboard Operasional                         [Buat Pesanan]
[Semua Pesanan]  [Baru]  [Diproses]  [Selesai]
Pesanan Terbaru
Nomor | Pelanggan | Layanan | Tanggal | Status | Bayar | Lihat
```
Banner shortcut khusus ditampilkan bila dibuka oleh akun Owner.

### 3. Dashboard Eksekutif Bisnis Owner `/owner/dashboard`
- Metrik bisnis: Total Pesanan, Pesanan Baru, Diproses, Selesai, Total Nilai Pesanan, Total Pemasukan Riil, Total Piutang Belum Terbayar.
- Filter periode rentang tanggal (Start Date & End Date).
- Grafik tren bulanan (batang proporsional membandingkan Nilai Pesanan vs Realisasi Uang Masuk per bulan).
- Tombol cepat akses ke Laporan Lengkap dan Operasional Pesanan.

### 4. Laporan Bisnis Owner `/owner/laporan`
- Filter periode dengan tombol cepat (Bulan Ini, 3 Bulan Terakhir, Tampilkan).
- Kartu Ringkasan Periode: Total Pesanan, Nilai Pesanan, Uang Masuk Aktual, Sisa Tagihan Piutang.
- Rekap berdasarkan 3 jenis layanan spesifik President Tailor: Jas Formal, Hem Batik, Celana Panjang (jumlah potong & jumlah pesanan).
- Rekap Status Pembayaran: Lunas, Sebagian (DP), Belum Dibayar.
- Tren pendapatan harian dan bulanan.
- Daftar Tagihan Belum Lunas: Tabel pesanan yang memiliki sisa tagihan dengan link langsung untuk penagihan/pembayaran.

### 5. Pelanggan `/pelanggan`
Judul, CTA `Tambah Pelanggan`, search nama/telepon, tabel `Nama | Nomor telepon | Alamat | Aksi`. Detail menunjukkan informasi dasar dan riwayat pesanan; mode edit jelas. Jangan hard-delete data pelanggan.

### 6. Pesanan `/pesanan`
Search nomor pesanan/nama, filter status produksi, kolom Status Pembayaran (`Lunas`, `DP`, `Belum Bayar`), tabel nomor/pelanggan/jenis/tanggal/produksi/bayar/aksi, paginasi.

### 7. Form pesanan `/pesanan/baru`
```
Pelanggan: [Cari/pilih pelanggan] [Tambah pelanggan]
Pesanan:
  [Jenis layanan] [Jumlah] [Catatan ukuran teks]
  [+ Tambah item]
Total harga (Rp) [................]
[Kembali] [Simpan pesanan]
```
Catatan ukuran **free text**, tidak merekayasa pola ukuran jas/celana. Total harga manual. ID nomor otomatis setelah simpan, tidak editable. Validasi inline + error state, jangan reset form saat API 422.

### 8. Detail pesanan & Pencatatan Pembayaran `/pesanan/[id]`
- Nomor unik, data pelanggan snapshot, list jenis dan ukuran, total harga, status produksi.
- Ringkasan Keuangan: Total Tagihan, Terbayar, Sisa Tagihan, Badge Status Pembayaran.
- Form Pencatatan Pembayaran: Nominal (Rp), Tanggal, Metode (`Tunai`, `Transfer Bank`, `QRIS`), Catatan.
- Tabel Riwayat Pembayaran: Tanggal, Nominal, Metode, Catatan, Waktu Pencatatan.
- Validasi: Nominal tidak boleh melebihi sisa tagihan, tidak boleh negatif. Pesanan yang sudah lunas mengunci form pembayaran.
- Aksi `Cetak Nota`; `Mulai Proses` dari Baru dan `Tandai Selesai` dari Diproses. Selesai bukan pembayaran/pengambilan. Hindari tombol `Hapus`.


### 7. Nota browser print
```
                PRESIDENT TAILOR
No. Pesanan : PT-000001
Nama        : [snapshot]
Alamat      : [snapshot]
Pesanan     : [jas / hem batik / celana panjang; jumlah]
Total Harga : Rp [harga]
```
Persis 5 kelompok informasi dari nota manual: no pesanan, nama, alamat, pesanan, total harga. **Jangan cetak telepon atau ukuran**. CSS `@media print` menyembunyikan navigasi, print button, status internal; desain bersih hitam-putih; kertas A5/A4 diuji, spesifikasi pasti mengikuti A-05.

## Public landing `landing/`
- Hero: `President Tailor` dan copy netral, tanpa janji berlebihan.
- Layanan: Jas, Hem Batik, Celana Panjang.
- Bagian kontak setelah nomor WA verified. Bila tidak ada nomor, jangan membuat link WA dummy atau CTA rusak saat publikasi.
- SEO: title, description, semantic headings; jangan mencantumkan harga, review, rating, foto hasil, alamat lengkap, jam operasional fiktif.
- Tidak ada booking/order form, portal pelanggan atau halaman status publik.

## Component behavior
- Input berlabel permanen, helper text seperlunya, error di bawah field.
- Button satu primary tiap konteks; no duplicate click while pending.
- List loading/success/empty/error; 401/419 arahkan login dan tampilkan penjelasan singkat.
- Status selalu teks+warna, bukan warna saja.
- Search tidak membanjiri API (debounce sekitar 300ms saat diperlukan); pagination terlihat.
- Konfirmasi saat tandai pesanan `Selesai` bila berlaku.
- Data tidak di-hardcode di dashboard kecuali fixtures test jelas ditandai.

## UI acceptance
- [ ] Login dan state sesi benar; error aman.
- [ ] Desktop sidebar dan mobile drawer berfungsi.
- [ ] Input customer/order aman dan layak pakai pada ponsel.
- [ ] Setelah create/edit muncul data benar dari API.
- [ ] Status dan counts konsisten.
- [ ] Nota hanya lima kelompok data owner, print test tanpa elemen dashboard.
- [ ] Landing tidak tampilkan data palsu atau akses dashboard privat.
- [ ] Empty/loading/409/419/422/network failure ditangani.
