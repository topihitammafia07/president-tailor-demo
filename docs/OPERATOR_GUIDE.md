# PANDUAN PENGOPERASIAN SISTEM — President Tailor MVP V1.1

Dokumentasi resmi untuk staf dan operator President Tailor dalam mengoperasikan sistem pencatatan digital pelanggan, pesanan pakaian, pencetakan nota, dan pembaruan progres produksi.

---

## 1. Alur Kerja Harian (Buku Fisik ke Sistem Digital)

Sistem ini dirancang untuk mendigitalkan buku pencatatan manual President Tailor Sukoharjo tanpa mengubah alur kerja esensial penjahitan:

```
[ Pelanggan Datang ] 
       │
       ▼
1. Catat / Cari Pelanggan  ──> (/pelanggan/baru atau /pelanggan)
       │
       ▼
2. Buat Pesanan & Ukuran   ──> (/pesanan/baru)
       │                       - Pilih layanan: Jas / Hem Batik / Celana Panjang
       │                       - Isi detail ukuran & catatan potong
       │                       - Tentukan total biaya jahit
       ▼
3. Cetak Nota Fisik        ──> (/pesanan/[id]/nota)
       │                       - Tekan tombol "Cetak Nota" (Ctrl + P)
       │                       - Berikan rangkap nota kepada pelanggan
       ▼
4. Pembaruan Status Jahit  ──> (/pesanan/[id])
       │                       - Baru ──> Diproses ──> Selesai
       ▼
5. Pengambilan Pakaian
```

---

## 2. Petunjuk Penggunaan Dashboard Internal

Aplikasi Internal dapat diakses melalui browser pada alamat internal:
- **Lokal / Staging:** `http://localhost:3001`
- **Produksi:** `https://internal.presidenttailor.com`

### A. Autentikasi Staf (`/login`)
1. Buka halaman login.
2. Masukkan email dan password staf yang telah terdaftar.
3. Sesi login tersimpan aman secara *cookie-session* berbasis Laravel Sanctum.
4. Klik tombol **Logout** di navigasi kanan atas setelah selesai bertugas.

### B. Membaca Ringkasan Dashboard (`/dashboard`)
Dashboard menampilkan metrik operasional secara aktual:
- **Total Pelanggan:** Jumlah pelanggan yang tercatat.
- **Total Pesanan:** Jumlah keseluruhan transaksi pesanan.
- **Pesanan Baru:** Antrean pesanan yang baru masuk dan belum diproses.
- **Sedang Diproses:** Pesanan yang saat ini sedang dalam proses pemotongan atau penjahitan.
- **Selesai:** Pesanan yang telah selesai dijahit dan siap/telah diambil.

### C. Manajemen Pelanggan (`/pelanggan`)
1. **Mencari Pelanggan:** Gunakan kolom pencarian untuk mencari berdasarkan nama atau nomor telepon.
2. **Pendaftaran Baru (`/pelanggan/baru`):**
   - Masukkan **Nama Lengkap**, **Nomor Telepon/WhatsApp**, dan **Alamat/Kota**.
   - Klik **Simpan Pelanggan**.
3. **Mengubah Data Pelanggan:** Klik detail pelanggan untuk memperbarui alamat atau nomor telepon jika ada perubahan kontak.

### D. Pembuatan Pesanan Baru (`/pesanan/baru`)
1. Pilih pelanggan yang telah terdaftar dari daftar drop-down.
2. Tentukan **Tanggal Target Selesai**.
3. Tambahkan item pesanan (Dapat memuat lebih dari 1 item):
   - **Jenis Layanan:** Pilih dari 3 jenis layanan terdaftar:
     - `Jas Formal`
     - `Hem Batik`
     - `Celana Panjang`
   - **Jumlah (Qty):** Default 1.
   - **Catatan Ukuran & Model:** Masukkan catatan ukuran badan (misal: *Panjang Jas: 72cm, Pundak: 46cm, Dada: 102cm, Pinggang: 90cm, Lengan: 60cm, Kerah: 41cm, Belahan 2*).
4. Masukkan **Total Harga (Rp)** dalam angka bulat (misal: `1500000`).
5. Klik **Simpan Pesanan**.
   - Sistem secara otomatis menerbitkan Nomor Pesanan unik (contoh: `PT-000001`).
   - Sistem merekam snapshot nama dan alamat pelanggan agar arsip pesanan tidak berubah meskipun profil pelanggan diperbarui di kemudian hari.

### E. Pencetakan Nota (`/pesanan/[id]/nota`)
1. Buka detail pesanan, lalu klik tautan/tombol **Lihat / Cetak Nota**.
2. Nota menampilkan:
   - Nomor Nota / Pesanan (misal: `PT-000001`)
   - Tanggal Pesanan & Tanggal Estimasi Selesai
   - Nama & Alamat Pelanggan (Snapshot)
   - Rincian Layanan & Jumlah Item
   - Total Biaya Jahit
   - Kolom tanda tangan penerima & kasir
3. **Privasi Nota:** Nomor telepon dan rincian ukuran fisik badan sengaja **tidak dicetak** pada nota sesuai standar privasi pelanggan.
4. Tekan tombol **Cetak Nota** atau gunakan shortcut browser `Ctrl + P`:
   - Tata letak otomatis menyesuaikan ukuran kertas (A4 atau A5 portrait).
   - Tombol cetak, navigasi, dan elemen antarmuka otomatis tersembunyi saat dicetak ke printer.

### F. Pembaruan Status Produksi (`/pesanan/[id]`)
Alur status produksi pakaian memiliki aturan transisi yang baku:
- **Baru** ➔ Pesanan baru diterima.
- **Diproses** ➔ Kain sedang dipotong atau dijahit oleh penjahit.
- **Selesai** ➔ Pakaian telah selesai disetrika, diperiksa kualitasnya, dan siap diserahkan.

> **PENTING (Kunci Integritas Data):**
> Begitu status pesanan diubah menjadi **Selesai**, data rincian pesanan dan total harga dikunci secara permanen dan tidak dapat disunting kembali untuk mencegah manipulasi arsip.

### G. Pencatatan Pembayaran Pesanan (`/pesanan/[id]`)
Sistem mendukung pencatatan pembayaran nyata (DP maupun pelunasan):
1. Buka detail pesanan yang bersangkutan.
2. Lihat **Informasi Keuangan**:
   - Total Biaya Jahit
   - Sudah Dibayar
   - Sisa Tagihan
   - Status Pembayaran: `Belum Bayar`, `DP (Sebagian)`, atau `Lunas`.
3. Untuk mencatat uang masuk:
   - Klik tombol **Catat Pembayaran**.
   - Masukkan **Nominal Pembayaran (Rp)**. Sistem memvalidasi agar nominal tidak negatif dan tidak melebihi sisa tagihan.
   - Pilih **Metode Pembayaran**: `Tunai`, `Transfer Bank`, atau `QRIS`.
   - Masukkan **Tanggal Pembayaran** dan Catatan (misal: "DP via BCA", "Pelunasan tunai").
   - Klik **Simpan Pembayaran**.
4. Pembayaran akan tercatat secara permanen di tabel riwayat pembayaran dan langsung memperbarui sisa tagihan serta status pembayaran pesanan.
5. Setelah pesanan lunas (sisa tagihan Rp 0), form pembayaran otomatis terkunci.

### H. Panduan Interaktif & Infografis Alur Kerja (`/panduan`)
Sistem menyediakan halaman visual interaktif khusus di aplikasi internal:
1. Akses melalui menu **Infografis Alur Kerja** pada sidebar navigasi atau kartu panduan di dashboard.
2. Memuat **5 Tahapan Siklus Operasional**:
   - Pendaftaran / Pencarian Pelanggan
   - Pengukuran & Pembuatan Pesanan (Jas, Hem Batik, Celana)
   - Penerbitan Nota Fisik & Uang Muka (DP)
   - Pengerjaan & Update Progres Jahit (Baru ➔ Diproses ➔ Selesai)
   - Fitting, Pelunasan & Pengambilan Pakaian
3. Memuat matriks perbandingan status produksi jahit vs status pembayaran dan ringkasan ukuran 3 spesialisasi layanan.

---

## 3. Panduan Khusus Pemilik Usaha (Owner)

Akun Owner memiliki akses ke metrik bisnis dan laporan keuangan riil:
- **Kredensial Default Development:** `owner@presidenttailor.com` / `owner123`

### A. Dashboard Eksekutif Bisnis (`/owner/dashboard`)
1. **Ringkasan Indikator Kunci (KPI):**
   - **Total Nilai Pesanan:** Total omzet dari nilai kontrak pesanan.
   - **Pemasukan Tercatat:** Uang kas nyata yang sudah diterima melalui pembayaran valid.
   - **Sisa Piutang Pelanggan:** Total tagihan pesanan yang belum dibayarkan oleh pelanggan.
   - **Statistik Produksi:** Total pesanan, pesanan baru, sedang diproses, dan selesai.
2. **Filter Periode:** Owner dapat menentukan tanggal awal dan tanggal akhir untuk melihat performa bisnis pada kurun waktu tertentu.
3. **Visualisasi Tren Bulanan:** Grafik batang proporsional membandingkan Nilai Pesanan vs Pemasukan Kas Riil per bulan selama 6 bulan terakhir.

### B. Halaman Laporan Bisnis (`/owner/laporan`)
Halaman khusus untuk audit dan evaluasi performa bisnis yang mendalam:
1. **Rekap Jenis Layanan:**
   - Memetakan performa 3 jenis spesialisasi President Tailor: **Jas Formal**, **Hem Batik**, dan **Celana Panjang**.
   - Menampilkan jumlah pesanan dan total pakaian (pcs) yang dipesan.
2. **Rekap Status Pembayaran:**
   - Menampilkan proporsi pesanan yang sudah `Lunas`, `Sebagian (DP)`, dan `Belum Dibayar`.
3. **Tren Pendapatan:**
   - Rekap pendapatan harian dalam periode terpilih.
   - Rekap pendapatan bulanan historis.
4. **Daftar Tagihan Belum Lunas (Follow-up Piutang):**
   - Menampilkan tabel pesanan yang masih memiliki sisa tagihan.
   - Memudahkan staf dan owner untuk menagih sisa pembayaran saat fitting atau pengambilan pakaian.

---

## 4. Prosedur Rutin Backup & Recovery Database

Untuk menjaga keamanan data riwayat pelanggan dan pesanan dari kerusakan hardware atau kehilangan data:

### A. Jadwal Backup Harian
Jalankan dump MySQL setiap hari saat penutupan workshop:
```bash
# Perintah Dump di Server / Terminal Lokal
mysqldump -u [db_user] -p[db_password] president_tailor > backup_pt_$(date +%Y%m%d).sql
```
Simpan file hasil backup pada media penyimpanan terpisah (misal: external drive atau backup cloud terenkripsi).

### B. Prosedur Pemulihan Darurat (Disaster Recovery)
Jika terjadi kerusakan database dan perlu memulihkan data:
```bash
# 1. Pastikan database bersih atau baru dibuat
mysql -u [db_user] -p[db_password] -e "CREATE DATABASE IF NOT EXISTS president_tailor;"

# 2. Pulihkan data dari file backup terakhir
mysql -u [db_user] -p[db_password] president_tailor < backup_pt_YYYYMMDD.sql
```

---

## 5. Matriks Keputusan Bisnis & Status Baseline (Phase 9)

Sesuai dokumen `docs/DECISIONS.md`, berikut adalah baseline operasional yang saat ini diterapkan pada sistem:

| ID | Aspek Bisnis | Baseline yang Diterapkan |
|---|---|---|
| **A-01** | Akses User & Role | Dua role terpisah: `owner` (laporan bisnis & monitoring eksekutif) dan `staff` (operasional & pencatatan pembayaran). |
| **A-02** | Rincian Item Nota | Satu pesanan mendukung beberapa item pakaian (Jas, Hem Batik, Celana Panjang). |
| **A-03** | Koreksi Pesanan | Pengeditan pesanan dikunci setelah pesanan berstatus `Selesai`; pembayaran tetap dapat dicatat sampai lunas. |
| **A-04** | Tahapan Produksi | 3 tahap: `Baru` ➔ `Diproses` ➔ `Selesai`. |
| **A-05** | Format Kertas Nota | Desain responsif print ramah A4 dan A5 portrait; catatan ukuran teks bebas. |
| **A-06** | Kontak & Landing Page | Landing page menampilkan 3 layanan resmi (Jas, Batik, Celana) bebas emoji dengan tombol konsultasi WhatsApp terpusat. |

---

## 6. Batasan Scope Sistem (Out-of-Scope)

Untuk menjaga kesederhanaan dan keandalan sistem, sistem ini secara sengaja **tidak** menyertakan:
- Payment gateway online pihak ketiga (Midtrans/Xendit dll).
- Kalkulasi laba bersih / HPP / biaya operasional (karena belum ada pencatatan biaya kain/benang/operasional).
- Manajemen stok kain dan inventaris benang/kancing.
- Sistem booking/fitting berjadwal daring publik.
- Penugasan penjahit internal dan penggajian otomatis.

