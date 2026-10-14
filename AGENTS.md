# AGENTS — President Tailor MVP V1.1 (Next.js + Laravel)

Instruksi utama untuk coding agent Google Antigravity. Berlaku untuk seluruh workspace. **Dokumen ini adalah spesifikasi kerja, bukan aplikasi siap jalan.**

## Tujuan proyek
Digitalisasi pencatatan buku dan nota President Tailor, Sukoharjo: pelanggan, pesanan, ukuran pakaian, status produksi. Jenis layanan yang teridentifikasi: **jas, hem batik, celana panjang**. Website publik sederhana dan dashboard internal menggunakan Next.js; data bisnis dan API dikelola Laravel.

## Sumber kebenaran, urutan prioritas
1. Persetujuan perubahan scope secara eksplisit dari user, dicatat ke `PRD.md` dan `docs/DECISIONS.md`.
2. `PRD.md` — perilaku sistem, data, scope, acceptance criteria.
3. `RULES.md` — arsitektur, keamanan, pemeliharaan dan performa.
4. `UI_UX.md` — perilaku antarmuka dan desain.
5. `AUDIT.md` — urutan fase, bukti pengujian dan release gate.
6. Dokumentasi resmi versi framework yang dipasang.

Jika konflik, **jangan memilih sendiri** lalu mengubah scope. Beri label `NEEDS_DECISION` dan lanjutkan hanya pekerjaan yang tidak terdampak.

## Stack wajib (jangan diganti diam-diam)
- `api/` — **Laravel 13**, PHP >= 8.3, MySQL 8+, REST API, validation FormRequest, Resources, Policy/Gate, Sanctum session-cookie/CSRF.
- `landing/` — **Next.js App Router + TypeScript**, halaman publik ringan, SEO dasar, tanpa form order publik.
- `internal/` — **Next.js App Router + TypeScript**, dashboard privat, form pelanggan/pesanan, nota cetak, status produksi.
- Node.js versi LTS kompatibel dengan versi Next.js stabil saat inisialisasi; catat versi di README/lockfile. Jangan mendadak mengganti ke Vite/React SPA murni, Inertia, Blade untuk frontend bisnis, atau Next API sebagai sumber data.
- Domain logic dan database **hanya** di Laravel; Next.js tidak mengakses MySQL langsung. Next Route Handler/proxy boleh dipakai hanya jika benar-benar dibutuhkan dan didokumentasikan, bukan menduplikasi otorisasi Laravel.

## Batasan scope yang tidak boleh dilanggar
Implementasi **hanya** mencakup:
- Dua role pengguna: `owner` (dashboard eksekutif & laporan bisnis) dan `staff` (operasional pesanan, pelanggan, status produksi, pencatatan pembayaran).
- Autentikasi Laravel Sanctum session-cookie/CSRF dengan server-side authorization (Gate & Middleware).
- Data pelanggan (nama, alamat, no. telepon), pesanan (nomor, snapshot pelanggan, jasa, ukuran, total harga), nota cetak, dan progres produksi.
- Pencatatan pembayaran minimal pada pesanan: nominal decimal, tanggal bayar, metode bayar (`tunai`, `transfer_bank`, `qris`), catatan, validasi anti-overpayment dan non-negatif.
- Dashboard Owner: metrik total pesanan, breakdown status, nilai pesanan, pemasukan riil tercatat, piutang, dan tren bulanan.
- Laporan Bisnis Owner: filter rentang tanggal, rekap 3 jenis layanan (jas, hem batik, celana panjang), rekap pemasukan riil vs piutang, tren harian dan bulanan, serta daftar tagihan belum lunas.
- UI/UX Bebas Emoji: Seluruh emoji dihapus total dari website publik dan internal; gunakan Lucide Icons secara konsisten dan teks fungsional.

Tetap **out of scope**: payment gateway online pihak ketiga, kalkulasi laba bersih/HPP (belum ada data biaya/pengeluaran), booking/fitting online, stok bahan/kain, penggajian, penugasan penjahit, multi-cabang, customer portal publik, pesan WhatsApp otomatis, atau role kompleks tambahan.

Tidak ada data bisnis yang boleh dikarang: alamat lengkap, nomor WA, logo, foto, harga layanan spesifik, daftar ukuran standar, identitas owner, atau testimoni fiktif.

## Operating modes
- `PLAN PHASE N`: baca konteks, buat rencana, **jangan edit file aplikasi**.
- `BUILD PHASE N`: implementasikan hanya fase N, jalankan checks, dokumentasikan perubahan dan hasil aktual.
- `AUDIT PHASE N`: review artefak + jalankan pemeriksaan non-destruktif; jangan edit kode.
- `FIX PHASE N`: perbaiki temuan hasil audit fase N saja dan uji ulang.
- `RELEASE`: hanya setelah seluruh gate PASS, backup/restore teruji, dan ada izin deployment eksplisit.

**Satu fase tiap instruksi.** Jika fase belum diuji atau terhalang, status `BLOCKED`, bukan `PASS`. Dilarang mengeksekusi tindakan produksi, membagikan file/credential asli, menjalankan migrate:fresh pada data berisi, atau deploy tanpa konfirmasi eksplisit.

## Definition of Done
- Acceptance criteria yang terkait fase terbukti dengan pengujian.
- API Laravel memvalidasi input, auth/authorization server-side, transaksi konsisten, response aman.
- TypeScript strict, komponen Next modular, tidak ada mocked business data di produksi.
- UI responsif; states loading, kosong, sukses, error; nota siap print.
- Lint/typecheck/test/build dijalankan dengan output aktual (bukan klaim).
- `AUDIT.md` dan `docs/DECISIONS.md` tetap sinkron bila ada keputusan.

## Format laporan agen
```
PHASE: [0-8] — [judul]
MODE: PLAN | BUILD | AUDIT | FIX
STATUS: PASS | FAIL | BLOCKED
SCOPE/AC: [ID PRD]
CHANGED FILES: [...] (kosong saat PLAN/AUDIT)
CHECKS: [perintah + ringkasan output aktual]
FINDINGS: [level + lokasi + risiko + perbaikan]
DECISIONS NEEDED: [...]
NEXT: [opsi fase berikutnya; belum dieksekusi]
```

Selalu utamakan Bahasa Indonesia untuk teks produk dan komunikasi kerja.
