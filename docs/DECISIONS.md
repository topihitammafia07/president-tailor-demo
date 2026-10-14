# DECISIONS — Pending / Confirmed

Dokumen ini mencegah agent menebak jawaban owner. Status `PENDING` bukan izin menambah fitur.

| ID | Keputusan | Status | Baseline sementara |
|---|---|---|---|
| A-01 | Siapa user dashboard dan apakah perlu role terpisah? | CONFIRMED | Dua role: `owner` (executive dashboard & business reports) dan `staff` (operasional & pencatatan pembayaran). |
| A-02 | Satu nota boleh beberapa item atau satu jenis? | CONFIRMED | Multi-item didukung (Jas, Hem Batik, Celana Panjang). |
| A-03 | Pesanan berstatus Selesai boleh diedit? | CONFIRMED | Kunci edit data pesanan setelah Selesai; pembayaran tetap dapat dicatat sampai lunas. |
| A-04 | Nama tahap proses produksi owner? | CONFIRMED | Baru -> Diproses -> Selesai. |
| A-05 | Ukuran kertas nota dan format ukuran pakaian aktual? | PENDING | Catatan ukuran teks bebas; print A5/A4 untuk QA sementara. |
| A-06 | No WA resmi, alamat dan materi landing? | PENDING | Jangan karang, CTA nonaktif hingga terverifikasi. |

## Konfirmasi Resmi

### DEC-010: Phase 9 Scope Revision — Owner Dashboard, Business Reporting & Minimal Payment Recording
- **Tanggal:** 2026-10-14
- **Keputusan Eksplisit User:**
  1. Role sistem resmi dipisahkan menjadi dua: `owner` dan `staff`.
  2. Implementasi server-side authorization: endpoint laporan dan executive dashboard hanya dapat diakses oleh role `owner`.
  3. Pencatatan pembayaran minimal pada pesanan: tabel `payments` (nominal, tanggal, metode bayar `tunai`/`transfer_bank`/`qris`, catatan). Pesanan menghitung `total_paid`, `remaining_bill`, dan `payment_status` (`belum_dibayar`, `sebagian`, `lunas`).
  4. Validasi pembayaran: tidak boleh negatif, tidak boleh melebihi sisa tagihan.
  5. Dashboard Owner: metrik total pesanan, pesanan baru/diproses/selesai, nilai pesanan, pemasukan aktual tercatat, piutang, dan tren bulanan.
  6. Laporan Bisnis Owner: rekap periode, rekap 3 jenis layanan (jas, hem batik, celana panjang), rekap pemasukan riil, piutang belum lunas, tren harian dan bulanan. Tanpa laba bersih/HPP.
  7. UI/UX: Seluruh emoji dihapus total dari seluruh website publik dan internal. Gunakan Lucide Icons secara konsisten dan teks yang fungsional.
- **Dampak:** `PRD.md`, `RULES.md`, `UI_UX.md`, `AUDIT.md`, `api/`, `internal/`, `landing/`.
- **Perubahan Diterima:** Ya.

