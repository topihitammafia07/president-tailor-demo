'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/AppLayout';
import {
  UserCheck,
  Scissors,
  Printer,
  Clock,
  CheckCircle2,
  PlusCircle,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Check,
  Workflow,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Lock,
  Ruler,
} from 'lucide-react';

interface GarmentMeasurementSpec {
  id: number;
  label: string;
  code: string;
  color: string;
  colorName: string;
  colorBg: string;
  colorBorder: string;
  tolerance: string;
  standard: string;
  tailorTip: string;
}

const garmentSpecs: Record<'jas' | 'batik' | 'celana', {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  silhouetteDesc: string;
  lines: GarmentMeasurementSpec[];
}> = {
  jas: {
    code: 'JAS-01',
    title: 'Jas Formal Eksekutif',
    subtitle: 'Konstruksi Furing Penuh & Bantalan Pundak',
    description: 'Jas formal membutuhkan ketelitian toleransi gerak dan lekuk pinggang (waist drop) agar nyaman saat dikancingkan tanpa merusak siluet tegak.',
    silhouetteDesc: 'Siluet 2-Button Single Breasted dengan Notch Lapel & Chest Welt Pocket',
    lines: [
      {
        id: 1,
        label: 'Lebar Pundak / Bahu',
        code: 'BAHU',
        color: '#EF4444',
        colorName: 'Merah Koral',
        colorBg: '#FEF2F2',
        colorBorder: '#FCA5A5',
        tolerance: 'Pas Tulang (0 cm)',
        standard: 'Diukur mendatar dari ujung tulang bahu kiri ke kanan melewati tengkuk leher belakang.',
        tailorTip: 'Hindari melebihkan ukuran karena busa padding bahu jas sudah memberi ketebalan 1–1.2 cm.',
      },
      {
        id: 2,
        label: 'Lingkar Dada (Chest)',
        code: 'DADA',
        color: '#0284C7',
        colorName: 'Biru Langit',
        colorBg: '#F0F9FF',
        colorBorder: '#BAE6FD',
        tolerance: '+4 s.d. 6 cm',
        standard: 'Melingkari dada terlebar tepat di bawah ketiak saat posisi berdiri tegak dan bernapas santai.',
        tailorTip: 'Kelonggaran 4–6 cm wajib agar kancing tidak tertarik membentuk lipatan silang (huruf X).',
      },
      {
        id: 3,
        label: 'Lingkar Pinggang / Perut',
        code: 'PINGGANG',
        color: '#D97706',
        colorName: 'Emas Amber',
        colorBg: '#FFFBEB',
        colorBorder: '#FDE68A',
        tolerance: '+4 s.d. 5 cm',
        standard: 'Melingkari perut/pusar setinggi posisi kancing utama jas untuk membentuk kelangsingan (waist drop).',
        tailorTip: 'Gunakan toleransi +3 cm untuk potongan Slim Fit atau +5 cm untuk siluet Klasik Eksekutif.',
      },
      {
        id: 4,
        label: 'Panjang Lengan Jas',
        code: 'LENGAN',
        color: '#10B981',
        colorName: 'Hijau Zamrud',
        colorBg: '#ECFDF5',
        colorBorder: '#A7F3D0',
        tolerance: '1.5 cm di atas pangkal jempol',
        standard: 'Dari sudut puncak tulang bahu luar melintasi siku hingga tepat di tonjolan tulang pergelangan tangan.',
        tailorTip: 'Ujung lengan jas diposisikan 1–1.5 cm lebih pendek agar manset kemeja putih menyembul rapi.',
      },
      {
        id: 5,
        label: 'Panjang Badan Jas',
        code: 'PANJANG',
        color: '#8B5CF6',
        colorName: 'Ungu Violet',
        colorBg: '#F5F3FF',
        colorBorder: '#DDD6FE',
        tolerance: 'Batas ruas jempol tangan',
        standard: 'Diukur vertikal dari jahitan kerah belakang (tengkuk leher) lurus ke bawah hingga batas lipatan pantat.',
        tailorTip: 'Patokan proporsi sempurna: bagian belakang jas menutupi lengkungan pantat secara simetris.',
      },
      {
        id: 6,
        label: 'Belahan Vent & Bukaan Bawah',
        code: 'VENT',
        color: '#EC4899',
        colorName: 'Merah Muda',
        colorBg: '#FDF2F8',
        colorBorder: '#FBCFE8',
        tolerance: 'Tinggi Vent 22–25 cm',
        standard: 'Pilihan belahan belakang: Double Vent (samping kanan-kiri), Single Vent (tengah), atau Polos.',
        tailorTip: 'Double vent memberikan fleksibilitas maksimal saat duduk atau memasukkan tangan ke saku celana.',
      },
    ],
  },
  batik: {
    code: 'BATIK-02',
    title: 'Hem Kemeja Batik',
    subtitle: 'Penyelarasan Motif Dada & Saku Tempel',
    description: 'Keindahan kemeja batik pesanan tailor diukur dari kontinuitas corak motif batik antara belahan depan dan saku tanpa terpotong.',
    silhouetteDesc: 'Siluet Kemeja Pria dengan Kerah Standar, Saku Dada Kiri & Placket Kancing',
    lines: [
      {
        id: 1,
        label: 'Lingkar Kerah (Neck Collar)',
        code: 'KERAH',
        color: '#EF4444',
        colorName: 'Merah Koral',
        colorBg: '#FEF2F2',
        colorBorder: '#FCA5A5',
        tolerance: '+1.5–2 cm (1 jari telunjuk)',
        standard: 'Melingkari pangkal leher terendah dengan meteran menempel nyaman tanpa menekan.',
        tailorTip: 'Sertakan ruang gerak 1 ruas jari telunjuk agar leher tidak tercekik saat kancing kerah atas ditutup.',
      },
      {
        id: 2,
        label: 'Lebar Pundak / Bahu',
        code: 'PUNDAK',
        color: '#0284C7',
        colorName: 'Biru Langit',
        colorBg: '#F0F9FF',
        colorBorder: '#BAE6FD',
        tolerance: 'Pas Tulang Pundak',
        standard: 'Dari ujung tulang bahu kiri lurus mendatar ke ujung bahu kanan melintasi punggung atas.',
        tailorTip: 'Titik jahitan bahu wajib presisi agar motif pada sambungan lengan tampak seimbang.',
      },
      {
        id: 3,
        label: 'Lingkar Dada / Badan',
        code: 'BADAN',
        color: '#D97706',
        colorName: 'Emas Amber',
        colorBg: '#FFFBEB',
        colorBorder: '#FDE68A',
        tolerance: '+6 s.d. 8 cm (Kain Katun)',
        standard: 'Melingkari bagian dada terlebar tepat di bawah ketiak saat posisi bernapas santai.',
        tailorTip: 'Kain batik katun mori/primisima tidak elastis (non-stretch), wajib toleransi minimal +6 cm.',
      },
      {
        id: 4,
        label: 'Penyelarasan Motif Saku',
        code: 'SAKU',
        color: '#10B981',
        colorName: 'Hijau Zamrud',
        colorBg: '#ECFDF5',
        colorBorder: '#A7F3D0',
        tolerance: 'Presisi Pola (Offset 0 mm)',
        standard: 'Kotak saku tempel dada kiri dipotong mengikuti kelanjutan corak/alur motif batik kain badan.',
        tailorTip: 'Tanda kualitas tailor profesional: motif saku tempel menyatu seperti tidak ada sambungan.',
      },
      {
        id: 5,
        label: 'Panjang Baju Hem',
        code: 'PANJANG',
        color: '#8B5CF6',
        colorName: 'Ungu Violet',
        colorBg: '#F5F3FF',
        colorBorder: '#DDD6FE',
        tolerance: 'Tengah resleting celana',
        standard: 'Dari sambungan pundak tertinggi lurus ke bawah hingga batas panjang hem yang diinginkan.',
        tailorTip: 'Untuk batik yang dipakai di luar celana (untucked), panjang jatuh tepat di pertengahan golbi celana.',
      },
      {
        id: 6,
        label: 'Panjang Lengan (Pendek / Panjang)',
        code: 'LENGAN',
        color: '#EC4899',
        colorName: 'Merah Muda',
        colorBg: '#FDF2F8',
        colorBorder: '#FBCFE8',
        tolerance: 'Lengan Pendek / Panjang',
        standard: 'Lengan pendek: batas atas siku. Lengan panjang: ujung pergelangan + manset 6 cm berkancing.',
        tailorTip: 'Lingkar manset lengan panjang disesuaikan lingkar tangan + toleransi 3 cm agar jam tangan leluasa.',
      },
    ],
  },
  celana: {
    code: 'CELANA-03',
    title: 'Celana Panjang Formal',
    subtitle: 'Presisi Kedalaman Pesak & Garis Jatuh Lipit',
    description: 'Kenyamanan utama celana formal ditentukan oleh ukuran pesak (selangkangan) dan garis jatuhnya kain lurus sejajar dengan sepatu.',
    silhouetteDesc: 'Siluet Trousers Formal dengan Ban Pinggang, Garis Setrika Lipit & Saku Samping',
    lines: [
      {
        id: 1,
        label: 'Lingkar Pinggang (Waistband)',
        code: 'PINGGANG',
        color: '#EF4444',
        colorName: 'Merah Koral',
        colorBg: '#FEF2F2',
        colorBorder: '#FCA5A5',
        tolerance: '+1–2 cm (Ruang Bernapas)',
        standard: 'Melingkari bagian pinggang pada posisi biasa sabuk atau ban pinggang bertengger.',
        tailorTip: 'Tanyakan kebiasaan pelanggan: apakah memakai celana setinggi pusar atau di bawah pinggul.',
      },
      {
        id: 2,
        label: 'Lingkar Pinggul / Pantat (Seat)',
        code: 'PINGGUL',
        color: '#0284C7',
        colorName: 'Biru Langit',
        colorBg: '#F0F9FF',
        colorBorder: '#BAE6FD',
        tolerance: '+4 s.d. 6 cm',
        standard: 'Melingkari bagian pantat/bokong paling tebal secara mendatar melingkar.',
        tailorTip: 'Toleransi ini mencegah kantong samping celana merekah (flaring pockets) saat berdiri tegak.',
      },
      {
        id: 3,
        label: 'Pisak / Pesak (Crotch / Rise)',
        code: 'PESAK',
        color: '#D97706',
        colorName: 'Emas Amber',
        colorBg: '#FFFBEB',
        colorBorder: '#FDE68A',
        tolerance: 'Kunci Kenyamanan Duduk',
        standard: 'Dari batas atas ban pinggang depan melewati selangkangan menuju ban pinggang belakang.',
        tailorTip: 'Pesak yang terlalu sempit akan menjepit saat duduk, sedangkan terlalu dalam akan membuat paha kedodoran.',
      },
      {
        id: 4,
        label: 'Lingkar Paha & Lutut',
        code: 'PAHA',
        color: '#10B981',
        colorName: 'Hijau Zamrud',
        colorBg: '#ECFDF5',
        colorBorder: '#A7F3D0',
        tolerance: '+4 s.d. 6 cm',
        standard: 'Melingkari paha teratas di bawah pangkal selangkangan dan keliling lutut saat berdiri.',
        tailorTip: 'Pastikan pelanggan dapat berjongkok dan menaiki anak tangga tanpa kain terasa tertarik kencang.',
      },
      {
        id: 5,
        label: 'Panjang Celana (Outseam)',
        code: 'PANJANG',
        color: '#8B5CF6',
        colorName: 'Ungu Violet',
        colorBg: '#F5F3FF',
        colorBorder: '#DDD6FE',
        tolerance: 'Half Break / No Break',
        standard: 'Dari garis atas ban pinggang samping luar lurus ke bawah hingga batas atas hak sepatu formal.',
        tailorTip: 'Gaya eksekutif modern menggunakan Half-break (kain membentuk satu gelombang lipit halus di depan sepatu).',
      },
      {
        id: 6,
        label: 'Lebar Kaki Bawah & Lipit',
        code: 'BUKAAN',
        color: '#EC4899',
        colorName: 'Merah Muda',
        colorBg: '#FDF2F8',
        colorBorder: '#FBCFE8',
        tolerance: 'Diameter 19–21 cm',
        standard: 'Lebar lingkar bukaan bawah pipa celana serta pilihan model depan (Flat Front polos / Pleated lipit).',
        tailorTip: 'Lebar bukaan bawah wajib proporsional dengan panjang sepatu agar celana tidak tenggelam di atas sepatu.',
      },
    ],
  },
};

export default function PanduanInfografisPage() {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [activeGarment, setActiveGarment] = useState<'jas' | 'batik' | 'celana'>('jas');
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const stages = [
    {
      id: 1,
      number: '01',
      title: 'Pelanggan',
      action: 'Identifikasi & Kontak',
      icon: UserCheck,
      desc: 'Pencarian data lama atau pendaftaran kontak baru dengan sistem penguncian snapshot profil.',
      detailCard: {
        headline: 'Tahap 1: Identifikasi & Pendaftaran Pelanggan',
        subheadline: 'Mencegah duplikasi data dan mengunci arsip pesanan secara permanen.',
        operatorAction: 'Tanyakan nama atau nomor HP pelanggan. Cari di kolom pencarian. Jika baru, klik "+ Tambah Pelanggan".',
        systemBehavior: 'Sistem merekam nama dan alamat sebagai snapshot pesanan, sehingga pembaruan profil di kemudian hari tidak merusak keaslian nota lama.',
        featureBadge: 'Snapshot Identity Lock',
      },
    },
    {
      id: 2,
      number: '02',
      title: 'Ukuran & Desain',
      action: '3 Layanan Utama',
      icon: Scissors,
      desc: 'Pencatatan ukuran fisik fleksibel untuk Jas Formal, Hem Batik, atau Celana Panjang.',
      detailCard: {
        headline: 'Tahap 2: Pengukuran & Pembuatan Pesanan',
        subheadline: 'Multi-item pakaian dalam satu nota pesanan dengan catatan ukuran teks bebas.',
        operatorAction: 'Pilih layanan (Jas / Batik / Celana), catat ukuran badan dan detail model pada kolom teks bebas, lalu tentukan total harga kesepakatan.',
        systemBehavior: 'Sistem mendukung kombinasi beberapa pakaian sekaligus dalam satu nomor pesanan resmi (misal PT-000001) dengan tanggal target selesai.',
        featureBadge: 'Free-form Measurements',
      },
    },
    {
      id: 3,
      number: '03',
      title: 'Nota & Kas DP',
      action: 'Cetak & Pembayaran',
      icon: Printer,
      desc: 'Penerbitan rangkap nota fisik dan pencatatan uang muka via Tunai, Transfer, atau QRIS.',
      detailCard: {
        headline: 'Tahap 3: Penerbitan Nota & Pembayaran DP',
        subheadline: 'Perlindungan privasi pelanggan dan validasi anti-overpayment.',
        operatorAction: 'Buka nota dan tekan cetak (Ctrl + P) untuk pelanggan. Catat pembayaran uang muka jika pelanggan menitipkan DP.',
        systemBehavior: 'Nomor telepon dan ukuran fisik sengaja tidak dicetak di nota demi privasi. Validasi otomatis menolak nominal DP yang melebihi total tagihan.',
        featureBadge: 'Privacy & Anti-Overpayment',
      },
    },
    {
      id: 4,
      number: '04',
      title: 'Produksi Jahit',
      action: 'Baru ➔ Proses ➔ Selesai',
      icon: Clock,
      desc: 'Pembaruan bertahap pengerjaan workshop dan penguncian otomatis saat pakaian selesai.',
      detailCard: {
        headline: 'Tahap 4: Proses Pengerjaan Jahit & QC',
        subheadline: 'Sinkronisasi antrean fisik kain dengan status digital yang dipantau Owner.',
        operatorAction: 'Ubah status ke "Diproses" saat kain mulai dipotong. Ubah ke "Selesai" setelah pakaian disetrika halus dan lolos uji kerapian.',
        systemBehavior: 'Begitu status menjadi "Selesai", rincian pesanan dan total harga dikunci permanen untuk mencegah manipulasi arsip keuangan.',
        featureBadge: 'Permanent Audit Lock',
      },
    },
    {
      id: 5,
      number: '05',
      title: 'Fitting & Lunas',
      action: 'Penyerahan Busana',
      icon: CheckCircle2,
      desc: 'Uji coba pakaian, pelunasan sisa piutang hingga Rp 0, dan penutupan transaksi.',
      detailCard: {
        headline: 'Tahap 5: Fitting, Pelunasan & Serah Terima',
        subheadline: 'Penyelesaian saldo piutang dan penutupan formulir pembayaran.',
        operatorAction: 'Pelanggan mencoba busana di ruang fitting. Periksa kolom sisa tagihan. Catat pelunasan hingga sisa tagihan Rp 0 sebelum pakaian diserahkan.',
        systemBehavior: 'Setelah status menjadi Lunas, form pembayaran otomatis tertutup dan transaksi tercatat permanen di riwayat kas.',
        featureBadge: 'Zero Balance Clearance',
      },
    },
  ];

  const currentStageData = stages.find((s) => s.id === activeStage) || stages[0];

  const faqs = [
    {
      q: 'Kapan data pesanan dikunci dan tidak bisa disunting?',
      a: 'Selama status masih "Baru" atau "Diproses", staf bebas mengubah item dan harga. Begitu status diubah menjadi "Selesai", sistem mengunci seluruh rincian dan harga secara permanen untuk integritas pembukuan.',
    },
    {
      q: 'Mengapa nomor telepon dan ukuran badan tidak dicetak pada nota pelanggan?',
      a: 'Nota cetak berfungsi sebagai bukti transaksi finansial dan tanda terima fisik. Ukuran badan dan nomor telepon dirahasiakan untuk melindungi privasi pelanggan serta menjaga standar rahasia workshop President Tailor.',
    },
    {
      q: 'Apakah bisa menerima pembayaran gabungan (sebagian Transfer, sisanya Tunai)?',
      a: 'Bisa. Staf dapat mencatat pembayaran berulang kali pada nomor nota yang sama. Misalnya DP via Transfer Bank/QRIS, lalu pelunasan via Tunai saat fitting. Sistem otomatis menghitung akumulasi dan sisa tagihan.',
    },
    {
      q: 'Bagaimana sistem mencegah kesalahan kelebihan bayar kasir?',
      a: 'Backend Laravel memiliki validasi anti-overpayment ketat: nominal tidak boleh negatif, tidak boleh 0, dan tidak boleh melebihi sisa tagihan pesanan saat ini.',
    },
  ];

  return (
    <AppLayout>
      <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* HEADER SECTION (Executive Tailor Aesthetics) */}
        <div
          style={{
            backgroundColor: '#1E3A5F',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 2.25rem',
            boxShadow: '0 8px 24px -4px rgba(30, 58, 95, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <ShieldCheck size={13} />
                SOP Digital Workshop
              </span>
              <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>President Tailor Sukoharjo</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.3px' }}>
              Infografis Alur Kerja & Spesifikasi Jahit
            </h1>
            <p style={{ color: '#E2E8F0', fontSize: '0.92rem', maxWidth: '680px', marginTop: '0.4rem', lineHeight: 1.5 }}>
              Panduan interaktif visual untuk staf kasir dan penjahit: siklus 5 tahap pencatatan transaksi,
              anatomi ukuran busana, dan sinkronisasi status produksi dengan arus kas.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href="/pesanan/baru"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#FFFFFF',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <PlusCircle size={17} />
              + Buat Pesanan Baru
            </Link>
            <Link
              href="/pelanggan/baru"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              <UserPlus size={17} />
              + Tambah Pelanggan
            </Link>
          </div>
        </div>

        {/* 1. INTERACTIVE PIPELINE TIMELINE (Visual Flowchart) */}
        <section
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                BAGIAN 1 — SIKLUS TRANSAKSI
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                Pipeline 5 Tahapan Alur Kerja
              </h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Klik simpul untuk melihat simulasi tindakan & sistem
            </span>
          </div>

          {/* Stepper Track */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.85rem',
              position: 'relative',
            }}
          >
            {stages.map((st) => {
              const Icon = st.icon;
              const isSelected = activeStage === st.id;

              return (
                <button
                  key={st.id}
                  onClick={() => setActiveStage(st.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '1.15rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg)',
                    color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                    boxShadow: isSelected ? '0 6px 16px rgba(30, 58, 95, 0.2)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    minHeight: '125px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.65rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'var(--primary-light)',
                        color: isSelected ? '#FFFFFF' : 'var(--primary)',
                      }}
                    >
                      {st.number}
                    </span>
                    <Icon size={18} color={isSelected ? '#FFFFFF' : 'var(--text-secondary)'} />
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.25 }}>{st.title}</div>
                  <div style={{ fontSize: '0.75rem', color: isSelected ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-muted)', marginTop: '0.3rem' }}>
                    {st.action}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Interactive Stage Inspector */}
          <div
            style={{
              marginTop: '1.75rem',
              backgroundColor: 'var(--bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                  Simulasi Operasional — Tahap {currentStageData.number}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, marginTop: '0.15rem' }}>
                  {currentStageData.detailCard.headline}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {currentStageData.detailCard.subheadline}
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <ShieldCheck size={14} />
                {currentStageData.detailCard.featureBadge}
              </span>
            </div>

            {/* Dual Comparison: Operator vs Sistem */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.25rem' }}>
              <div
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                  <Scissors size={15} />
                  Tindakan Staf di Workshop
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {currentStageData.detailCard.operatorAction}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                  <Workflow size={15} />
                  Otomatisasi Sistem Digital
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {currentStageData.detailCard.systemBehavior}
                </p>
              </div>
            </div>

            {/* Quick Link Shortcut */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link
                href={activeStage === 1 ? '/pelanggan/baru' : activeStage === 2 ? '/pesanan/baru' : '/pesanan'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  textDecoration: 'none',
                }}
              >
                Buka Layar Tindakan Tahap Ini <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* 2. VISUAL GARMENT ANATOMY (Interactive Tailor Workbench) */}
        <section
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  BAGIAN 2 — STANDAR TEKNIS LAYANAN
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                  6 Parameter Warna Teridentifikasi
                </span>
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                Anatomi Pengukuran 3 Layanan Teridentifikasi
              </h2>
            </div>

            {/* Garment Selector Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg)', padding: '0.35rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <button
                onClick={() => {
                  setActiveGarment('jas');
                  setHoveredLine(null);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: activeGarment === 'jas' ? 'var(--primary)' : 'transparent',
                  color: activeGarment === 'jas' ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                Jas Formal
              </button>
              <button
                onClick={() => {
                  setActiveGarment('batik');
                  setHoveredLine(null);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: activeGarment === 'batik' ? 'var(--primary)' : 'transparent',
                  color: activeGarment === 'batik' ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                Hem Batik
              </button>
              <button
                onClick={() => {
                  setActiveGarment('celana');
                  setHoveredLine(null);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: activeGarment === 'celana' ? 'var(--primary)' : 'transparent',
                  color: activeGarment === 'celana' ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                Celana Panjang
              </button>
            </div>
          </div>

          {/* Workbench Grid Layout: Left Blueprint SVG + Right Interactive Legend Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(300px, 360px) 1fr',
              gap: '2rem',
              alignItems: 'start',
              backgroundColor: 'var(--bg)',
              borderRadius: 'var(--radius-md)',
              padding: '1.75rem',
              border: '1px solid var(--border)',
            }}
          >
            {/* LEFT COLUMN: Technical Blueprint SVG */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Canvas Header Tag */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '340px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <Ruler size={13} color="var(--primary)" /> Canvas Cetak Pola
                </div>
                {hoveredLine !== null && (
                  <button
                    onClick={() => setHoveredLine(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Reset Sorotan
                  </button>
                )}
              </div>

              {/* The SVG Blueprint Sheet */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '340px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <svg
                  width="100%"
                  height="400"
                  viewBox="0 0 340 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ display: 'block' }}
                >
                  <defs>
                    {/* CAD Blueprint Micro-Grid */}
                    <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="0.8" />
                    </pattern>
                    {/* Active Line Glow Filter */}
                    <filter id="lineGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Grid Background */}
                  <rect width="340" height="400" fill="#FAFCFF" />
                  <rect width="340" height="400" fill="url(#cadGrid)" />

                  {/* Corner CAD Registration Crosses */}
                  <path d="M 15 10 L 15 20 M 10 15 L 20 15" stroke="#CBD5E1" strokeWidth="1" />
                  <path d="M 325 10 L 325 20 M 320 15 L 330 15" stroke="#CBD5E1" strokeWidth="1" />
                  <path d="M 15 380 L 15 390 M 10 385 L 20 385" stroke="#CBD5E1" strokeWidth="1" />
                  <path d="M 325 380 L 325 390 M 320 385 L 330 385" stroke="#CBD5E1" strokeWidth="1" />

                  {/* 1. JAS FORMAL BLUEPRINT */}
                  {activeGarment === 'jas' && (
                    <g>
                      {/* Body Fabric Silhouette */}
                      <path
                        d="M 65 75 L 125 55 L 215 55 L 275 75 L 255 155 L 235 230 L 240 315 L 170 320 L 100 315 L 105 230 L 85 155 Z"
                        fill="#F8FAFC"
                        stroke="#1E293B"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                      />
                      {/* Left Sleeve */}
                      <path
                        d="M 65 75 L 48 180 L 55 295 L 82 300 L 78 185 L 85 155"
                        fill="#F1F5F9"
                        stroke="#1E293B"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      {/* Right Sleeve */}
                      <path
                        d="M 275 75 L 292 180 L 285 295 L 258 300 L 262 185 L 255 155"
                        fill="#F1F5F9"
                        stroke="#1E293B"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      {/* Inner Shirt Collar & Tie */}
                      <polygon points="135,55 170,145 205,55" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
                      <line x1="170" y1="90" x2="170" y2="145" stroke="#94A3B8" strokeWidth="3" />
                      {/* Notch Lapels */}
                      <path d="M 125 55 L 115 105 L 105 118 L 170 205 L 170 55" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.8" />
                      <path d="M 215 55 L 225 105 L 235 118 L 170 205 L 170 55" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.8" />
                      {/* Chest Welt Pocket */}
                      <rect x="105" y="145" width="32" height="7" rx="1.5" transform="rotate(-3 105 145)" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
                      {/* Waist Flap Pockets */}
                      <rect x="96" y="240" width="38" height="9" rx="1.5" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.5" />
                      <rect x="206" y="240" width="38" height="9" rx="1.5" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.5" />
                      {/* Buttons */}
                      <circle cx="170" cy="210" r="3.5" fill="#1E293B" />
                      <circle cx="170" cy="245" r="3.5" fill="#1E293B" />
                      {/* Vent Seam */}
                      <line x1="170" y1="275" x2="170" y2="320" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 2" />

                      {/* --- 6 COLORED MEASUREMENT LINES --- */}

                      {/* Line 1: Bahu (Merah #EF4444) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 1 ? null : 1)}
                        onMouseEnter={() => setHoveredLine(1)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="65"
                          y1="70"
                          x2="275"
                          y2="70"
                          stroke="#EF4444"
                          strokeWidth={hoveredLine === 1 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 1 ? 1 : 0.25}
                          filter={hoveredLine === 1 ? 'url(#lineGlow)' : undefined}
                        />
                        <line x1="65" y1="62" x2="65" y2="78" stroke="#EF4444" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 1 ? 1 : 0.25} />
                        <line x1="275" y1="62" x2="275" y2="78" stroke="#EF4444" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 1 ? 1 : 0.25} />
                        {/* Pin 1 */}
                        <circle cx="170" cy="46" r={hoveredLine === 1 ? 14 : 11} fill="#EF4444" filter={hoveredLine === 1 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 1 && <circle cx="170" cy="46" r="18" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="170" y="46" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">1</text>
                      </g>

                      {/* Line 2: Dada (Biru #0284C7) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 2 ? null : 2)}
                        onMouseEnter={() => setHoveredLine(2)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="82"
                          y1="158"
                          x2="258"
                          y2="158"
                          stroke="#0284C7"
                          strokeWidth={hoveredLine === 2 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 2 ? 1 : 0.25}
                          filter={hoveredLine === 2 ? 'url(#lineGlow)' : undefined}
                        />
                        <line x1="82" y1="150" x2="82" y2="166" stroke="#0284C7" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 2 ? 1 : 0.25} />
                        <line x1="258" y1="150" x2="258" y2="166" stroke="#0284C7" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 2 ? 1 : 0.25} />
                        {/* Pin 2 */}
                        <circle cx="268" cy="158" r={hoveredLine === 2 ? 14 : 11} fill="#0284C7" filter={hoveredLine === 2 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 2 && <circle cx="268" cy="158" r="18" fill="none" stroke="#0284C7" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="268" y="158" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">2</text>
                      </g>

                      {/* Line 3: Pinggang (Amber #D97706) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 3 ? null : 3)}
                        onMouseEnter={() => setHoveredLine(3)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="102"
                          y1="225"
                          x2="238"
                          y2="225"
                          stroke="#D97706"
                          strokeWidth={hoveredLine === 3 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 3 ? 1 : 0.25}
                          filter={hoveredLine === 3 ? 'url(#lineGlow)' : undefined}
                        />
                        <line x1="102" y1="217" x2="102" y2="233" stroke="#D97706" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 3 ? 1 : 0.25} />
                        <line x1="238" y1="217" x2="238" y2="233" stroke="#D97706" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 3 ? 1 : 0.25} />
                        {/* Pin 3 */}
                        <circle cx="74" cy="225" r={hoveredLine === 3 ? 14 : 11} fill="#D97706" filter={hoveredLine === 3 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 3 && <circle cx="74" cy="225" r="18" fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="74" y="225" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">3</text>
                      </g>

                      {/* Line 4: Lengan (Hijau #10B981) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 4 ? null : 4)}
                        onMouseEnter={() => setHoveredLine(4)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="290"
                          y1="78"
                          x2="298"
                          y2="295"
                          stroke="#10B981"
                          strokeWidth={hoveredLine === 4 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 4 ? 1 : 0.25}
                          filter={hoveredLine === 4 ? 'url(#lineGlow)' : undefined}
                        />
                        <line x1="275" y1="75" x2="298" y2="78" stroke="#10B981" strokeWidth="1.5" opacity={hoveredLine === null || hoveredLine === 4 ? 1 : 0.25} />
                        <line x1="285" y1="295" x2="308" y2="295" stroke="#10B981" strokeWidth="1.5" opacity={hoveredLine === null || hoveredLine === 4 ? 1 : 0.25} />
                        {/* Pin 4 */}
                        <circle cx="312" cy="185" r={hoveredLine === 4 ? 14 : 11} fill="#10B981" filter={hoveredLine === 4 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 4 && <circle cx="312" cy="185" r="18" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="312" y="185" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">4</text>
                      </g>

                      {/* Line 5: Panjang Jas (Ungu #8B5CF6) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 5 ? null : 5)}
                        onMouseEnter={() => setHoveredLine(5)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="36"
                          y1="55"
                          x2="36"
                          y2="320"
                          stroke="#8B5CF6"
                          strokeWidth={hoveredLine === 5 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 5 ? 1 : 0.25}
                          filter={hoveredLine === 5 ? 'url(#lineGlow)' : undefined}
                        />
                        <line x1="125" y1="55" x2="26" y2="55" stroke="#8B5CF6" strokeWidth="1.5" opacity={hoveredLine === null || hoveredLine === 5 ? 1 : 0.25} />
                        <line x1="100" y1="320" x2="26" y2="320" stroke="#8B5CF6" strokeWidth="1.5" opacity={hoveredLine === null || hoveredLine === 5 ? 1 : 0.25} />
                        {/* Pin 5 */}
                        <circle cx="22" cy="185" r={hoveredLine === 5 ? 14 : 11} fill="#8B5CF6" filter={hoveredLine === 5 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 5 && <circle cx="22" cy="185" r="18" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="22" y="185" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">5</text>
                      </g>

                      {/* Line 6: Vent & Bukaan Bawah (Pink #EC4899) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 6 ? null : 6)}
                        onMouseEnter={() => setHoveredLine(6)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="100"
                          y1="342"
                          x2="240"
                          y2="342"
                          stroke="#EC4899"
                          strokeWidth={hoveredLine === 6 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 6 ? 1 : 0.25}
                          filter={hoveredLine === 6 ? 'url(#lineGlow)' : undefined}
                        />
                        <line x1="170" y1="342" x2="170" y2="322" stroke="#EC4899" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 6 ? 1 : 0.25} />
                        {/* Pin 6 */}
                        <circle cx="170" cy="364" r={hoveredLine === 6 ? 14 : 11} fill="#EC4899" filter={hoveredLine === 6 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 6 && <circle cx="170" cy="364" r="18" fill="none" stroke="#EC4899" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="170" y="364" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">6</text>
                      </g>
                    </g>
                  )}

                  {/* 2. HEM BATIK BLUEPRINT */}
                  {activeGarment === 'batik' && (
                    <g>
                      {/* Body Fabric Silhouette */}
                      <path
                        d="M 65 80 L 130 55 L 210 55 L 275 80 L 260 145 L 245 230 L 250 320 L 170 328 L 90 320 L 95 230 L 80 145 Z"
                        fill="#F8FAFC"
                        stroke="#1E293B"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                      />
                      {/* Left Sleeve (Short) */}
                      <path d="M 65 80 L 45 155 L 50 190 L 82 195 L 80 145" fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.8" />
                      <rect x="47" y="185" width="34" height="8" rx="1" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.2" />
                      {/* Right Sleeve (Short) */}
                      <path d="M 275 80 L 295 155 L 290 190 L 258 195 L 260 145" fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.8" />
                      <rect x="259" y="185" width="34" height="8" rx="1" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.2" />
                      {/* Collar */}
                      <path d="M 130 55 L 120 88 L 163 85 L 170 85 L 177 85 L 220 88 L 210 55 Q 170 65 130 55 Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.8" />
                      {/* Front Placket & Buttons */}
                      <rect x="163" y="85" width="14" height="240" fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.5" />
                      <circle cx="170" cy="110" r="3" fill="#1E293B" />
                      <circle cx="170" cy="150" r="3" fill="#1E293B" />
                      <circle cx="170" cy="190" r="3" fill="#1E293B" />
                      <circle cx="170" cy="230" r="3" fill="#1E293B" />
                      <circle cx="170" cy="270" r="3" fill="#1E293B" />
                      {/* Pocket with Batik Pattern Guide */}
                      <rect x="105" y="145" width="42" height="48" rx="2" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
                      <path d="M 108 158 Q 118 152 128 158 T 144 158" stroke="#94A3B8" strokeWidth="1.2" fill="none" />
                      <path d="M 108 172 Q 118 166 128 172 T 144 172" stroke="#94A3B8" strokeWidth="1.2" fill="none" />
                      <path d="M 108 185 Q 118 179 128 185 T 144 185" stroke="#94A3B8" strokeWidth="1.2" fill="none" />

                      {/* --- 6 COLORED MEASUREMENT LINES --- */}

                      {/* Line 1: Lingkar Kerah (Merah #EF4444) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 1 ? null : 1)}
                        onMouseEnter={() => setHoveredLine(1)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <path
                          d="M 125 72 Q 170 90 215 72"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth={hoveredLine === 1 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 1 ? 1 : 0.25}
                          filter={hoveredLine === 1 ? 'url(#lineGlow)' : undefined}
                        />
                        {/* Pin 1 */}
                        <circle cx="170" cy="40" r={hoveredLine === 1 ? 14 : 11} fill="#EF4444" filter={hoveredLine === 1 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 1 && <circle cx="170" cy="40" r="18" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="170" y="40" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">1</text>
                      </g>

                      {/* Line 2: Pundak / Bahu (Biru #0284C7) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 2 ? null : 2)}
                        onMouseEnter={() => setHoveredLine(2)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="65"
                          y1="76"
                          x2="275"
                          y2="76"
                          stroke="#0284C7"
                          strokeWidth={hoveredLine === 2 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 2 ? 1 : 0.25}
                          filter={hoveredLine === 2 ? 'url(#lineGlow)' : undefined}
                        />
                        <line x1="65" y1="68" x2="65" y2="84" stroke="#0284C7" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 2 ? 1 : 0.25} />
                        <line x1="275" y1="68" x2="275" y2="84" stroke="#0284C7" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 2 ? 1 : 0.25} />
                        {/* Pin 2 */}
                        <circle cx="285" cy="62" r={hoveredLine === 2 ? 14 : 11} fill="#0284C7" filter={hoveredLine === 2 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 2 && <circle cx="285" cy="62" r="18" fill="none" stroke="#0284C7" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="285" y="62" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">2</text>
                      </g>

                      {/* Line 3: Dada / Badan (Amber #D97706) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 3 ? null : 3)}
                        onMouseEnter={() => setHoveredLine(3)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="80"
                          y1="155"
                          x2="260"
                          y2="155"
                          stroke="#D97706"
                          strokeWidth={hoveredLine === 3 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 3 ? 1 : 0.25}
                          filter={hoveredLine === 3 ? 'url(#lineGlow)' : undefined}
                        />
                        <line x1="80" y1="147" x2="80" y2="163" stroke="#D97706" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 3 ? 1 : 0.25} />
                        <line x1="260" y1="147" x2="260" y2="163" stroke="#D97706" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 3 ? 1 : 0.25} />
                        {/* Pin 3 */}
                        <circle cx="272" cy="155" r={hoveredLine === 3 ? 14 : 11} fill="#D97706" filter={hoveredLine === 3 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 3 && <circle cx="272" cy="155" r="18" fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="272" y="155" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">3</text>
                      </g>

                      {/* Line 4: Presisi Motif Saku (Hijau #10B981) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 4 ? null : 4)}
                        onMouseEnter={() => setHoveredLine(4)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <rect
                          x="101"
                          y="141"
                          width="50"
                          height="56"
                          rx="4"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth={hoveredLine === 4 ? 3 : 1.8}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 4 ? 1 : 0.25}
                          filter={hoveredLine === 4 ? 'url(#lineGlow)' : undefined}
                        />
                        {/* Pin 4 */}
                        <circle cx="86" cy="144" r={hoveredLine === 4 ? 14 : 11} fill="#10B981" filter={hoveredLine === 4 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 4 && <circle cx="86" cy="144" r="18" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="86" y="144" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">4</text>
                      </g>

                      {/* Line 5: Panjang Baju Hem (Ungu #8B5CF6) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 5 ? null : 5)}
                        onMouseEnter={() => setHoveredLine(5)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="34"
                          y1="55"
                          x2="34"
                          y2="328"
                          stroke="#8B5CF6"
                          strokeWidth={hoveredLine === 5 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 5 ? 1 : 0.25}
                          filter={hoveredLine === 5 ? 'url(#lineGlow)' : undefined}
                        />
                        <line x1="130" y1="55" x2="24" y2="55" stroke="#8B5CF6" strokeWidth="1.5" opacity={hoveredLine === null || hoveredLine === 5 ? 1 : 0.25} />
                        <line x1="90" y1="328" x2="24" y2="328" stroke="#8B5CF6" strokeWidth="1.5" opacity={hoveredLine === null || hoveredLine === 5 ? 1 : 0.25} />
                        {/* Pin 5 */}
                        <circle cx="20" cy="190" r={hoveredLine === 5 ? 14 : 11} fill="#8B5CF6" filter={hoveredLine === 5 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 5 && <circle cx="20" cy="190" r="18" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="20" y="190" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">5</text>
                      </g>

                      {/* Line 6: Panjang Lengan Pendek (Pink #EC4899) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 6 ? null : 6)}
                        onMouseEnter={() => setHoveredLine(6)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="282"
                          y1="84"
                          x2="298"
                          y2="190"
                          stroke="#EC4899"
                          strokeWidth={hoveredLine === 6 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 6 ? 1 : 0.25}
                          filter={hoveredLine === 6 ? 'url(#lineGlow)' : undefined}
                        />
                        {/* Pin 6 */}
                        <circle cx="312" cy="138" r={hoveredLine === 6 ? 14 : 11} fill="#EC4899" filter={hoveredLine === 6 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 6 && <circle cx="312" cy="138" r="18" fill="none" stroke="#EC4899" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="312" y="138" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">6</text>
                      </g>
                    </g>
                  )}

                  {/* 3. CELANA PANJANG BLUEPRINT */}
                  {activeGarment === 'celana' && (
                    <g>
                      {/* Waistband */}
                      <rect x="95" y="55" width="150" height="20" rx="3" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" />
                      {/* Belt loops */}
                      <line x1="108" y1="55" x2="108" y2="75" stroke="#1E293B" strokeWidth="1.5" />
                      <line x1="135" y1="55" x2="135" y2="75" stroke="#1E293B" strokeWidth="1.5" />
                      <line x1="170" y1="55" x2="170" y2="75" stroke="#1E293B" strokeWidth="1.5" />
                      <line x1="205" y1="55" x2="205" y2="75" stroke="#1E293B" strokeWidth="1.5" />
                      <line x1="232" y1="55" x2="232" y2="75" stroke="#1E293B" strokeWidth="1.5" />
                      {/* Trouser Legs */}
                      <path
                        d="M 95 75 L 85 135 L 98 235 L 88 345 L 138 345 L 148 235 L 170 148 L 192 235 L 202 345 L 252 345 L 242 235 L 255 135 L 245 75 Z"
                        fill="#F8FAFC"
                        stroke="#1E293B"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                      />
                      {/* Fly Zipper */}
                      <path d="M 170 75 L 170 128 Q 170 138 180 138" fill="none" stroke="#1E293B" strokeWidth="1.8" />
                      {/* Side Pocket Slits */}
                      <line x1="102" y1="75" x2="90" y2="128" stroke="#1E293B" strokeWidth="2" />
                      <line x1="238" y1="75" x2="250" y2="128" stroke="#1E293B" strokeWidth="2" />
                      {/* Center Front Crease Lines (Lipit Setrika) */}
                      <line x1="113" y1="95" x2="113" y2="340" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" />
                      <line x1="227" y1="95" x2="227" y2="340" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" />

                      {/* --- 6 COLORED MEASUREMENT LINES --- */}

                      {/* Line 1: Lingkar Pinggang (Merah #EF4444) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 1 ? null : 1)}
                        onMouseEnter={() => setHoveredLine(1)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="90"
                          y1="50"
                          x2="250"
                          y2="50"
                          stroke="#EF4444"
                          strokeWidth={hoveredLine === 1 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 1 ? 1 : 0.25}
                          filter={hoveredLine === 1 ? 'url(#lineGlow)' : undefined}
                        />
                        <line x1="90" y1="42" x2="90" y2="58" stroke="#EF4444" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 1 ? 1 : 0.25} />
                        <line x1="250" y1="42" x2="250" y2="58" stroke="#EF4444" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 1 ? 1 : 0.25} />
                        {/* Pin 1 */}
                        <circle cx="170" cy="30" r={hoveredLine === 1 ? 14 : 11} fill="#EF4444" filter={hoveredLine === 1 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 1 && <circle cx="170" cy="30" r="18" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="170" y="30" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">1</text>
                      </g>

                      {/* Line 2: Pinggul / Pantat (Biru #0284C7) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 2 ? null : 2)}
                        onMouseEnter={() => setHoveredLine(2)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="80"
                          y1="125"
                          x2="260"
                          y2="125"
                          stroke="#0284C7"
                          strokeWidth={hoveredLine === 2 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 2 ? 1 : 0.25}
                          filter={hoveredLine === 2 ? 'url(#lineGlow)' : undefined}
                        />
                        <line x1="80" y1="117" x2="80" y2="133" stroke="#0284C7" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 2 ? 1 : 0.25} />
                        <line x1="260" y1="117" x2="260" y2="133" stroke="#0284C7" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 2 ? 1 : 0.25} />
                        {/* Pin 2 */}
                        <circle cx="272" cy="125" r={hoveredLine === 2 ? 14 : 11} fill="#0284C7" filter={hoveredLine === 2 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 2 && <circle cx="272" cy="125" r="18" fill="none" stroke="#0284C7" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="272" y="125" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">2</text>
                      </g>

                      {/* Line 3: Pesak / Rise (Amber #D97706) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 3 ? null : 3)}
                        onMouseEnter={() => setHoveredLine(3)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="170"
                          y1="55"
                          x2="170"
                          y2="148"
                          stroke="#D97706"
                          strokeWidth={hoveredLine === 3 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 3 ? 1 : 0.25}
                          filter={hoveredLine === 3 ? 'url(#lineGlow)' : undefined}
                        />
                        <line x1="160" y1="55" x2="180" y2="55" stroke="#D97706" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 3 ? 1 : 0.25} />
                        <line x1="160" y1="148" x2="180" y2="148" stroke="#D97706" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 3 ? 1 : 0.25} />
                        {/* Pin 3 */}
                        <circle cx="188" cy="100" r={hoveredLine === 3 ? 14 : 11} fill="#D97706" filter={hoveredLine === 3 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 3 && <circle cx="188" cy="100" r="18" fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="188" y="100" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">3</text>
                      </g>

                      {/* Line 4: Paha & Lutut (Hijau #10B981) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 4 ? null : 4)}
                        onMouseEnter={() => setHoveredLine(4)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="172"
                          y1="175"
                          x2="248"
                          y2="175"
                          stroke="#10B981"
                          strokeWidth={hoveredLine === 4 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 4 ? 1 : 0.25}
                          filter={hoveredLine === 4 ? 'url(#lineGlow)' : undefined}
                        />
                        <line x1="172" y1="167" x2="172" y2="183" stroke="#10B981" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 4 ? 1 : 0.25} />
                        <line x1="248" y1="167" x2="248" y2="183" stroke="#10B981" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 4 ? 1 : 0.25} />
                        {/* Pin 4 */}
                        <circle cx="260" cy="175" r={hoveredLine === 4 ? 14 : 11} fill="#10B981" filter={hoveredLine === 4 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 4 && <circle cx="260" cy="175" r="18" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="260" y="175" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">4</text>
                      </g>

                      {/* Line 5: Panjang Celana Outseam (Ungu #8B5CF6) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 5 ? null : 5)}
                        onMouseEnter={() => setHoveredLine(5)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="52"
                          y1="55"
                          x2="52"
                          y2="345"
                          stroke="#8B5CF6"
                          strokeWidth={hoveredLine === 5 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 5 ? 1 : 0.25}
                          filter={hoveredLine === 5 ? 'url(#lineGlow)' : undefined}
                        />
                        <line x1="95" y1="55" x2="42" y2="55" stroke="#8B5CF6" strokeWidth="1.5" opacity={hoveredLine === null || hoveredLine === 5 ? 1 : 0.25} />
                        <line x1="88" y1="345" x2="42" y2="345" stroke="#8B5CF6" strokeWidth="1.5" opacity={hoveredLine === null || hoveredLine === 5 ? 1 : 0.25} />
                        {/* Pin 5 */}
                        <circle cx="34" cy="195" r={hoveredLine === 5 ? 14 : 11} fill="#8B5CF6" filter={hoveredLine === 5 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 5 && <circle cx="34" cy="195" r="18" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="34" y="195" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">5</text>
                      </g>

                      {/* Line 6: Bukaan Kaki Bawah (Pink #EC4899) */}
                      <g
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => setHoveredLine(hoveredLine === 6 ? null : 6)}
                        onMouseEnter={() => setHoveredLine(6)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <line
                          x1="202"
                          y1="362"
                          x2="252"
                          y2="362"
                          stroke="#EC4899"
                          strokeWidth={hoveredLine === 6 ? 3.5 : 2.2}
                          strokeDasharray="4 2"
                          opacity={hoveredLine === null || hoveredLine === 6 ? 1 : 0.25}
                          filter={hoveredLine === 6 ? 'url(#lineGlow)' : undefined}
                        />
                        <line x1="202" y1="354" x2="202" y2="370" stroke="#EC4899" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 6 ? 1 : 0.25} />
                        <line x1="252" y1="354" x2="252" y2="370" stroke="#EC4899" strokeWidth="2" opacity={hoveredLine === null || hoveredLine === 6 ? 1 : 0.25} />
                        {/* Pin 6 */}
                        <circle cx="227" cy="380" r={hoveredLine === 6 ? 14 : 11} fill="#EC4899" filter={hoveredLine === 6 ? 'url(#lineGlow)' : undefined} />
                        {hoveredLine === 6 && <circle cx="227" cy="380" r="18" fill="none" stroke="#EC4899" strokeWidth="2" strokeDasharray="3 2" />}
                        <text x="227" y="380" textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="10" fontWeight="800">6</text>
                      </g>
                    </g>
                  )}
                </svg>
              </div>

              {/* Caption & Interactive Help */}
              <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>
                  {garmentSpecs[activeGarment].silhouetteDesc}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'inline-block' }}>
                  Arahkan kursor atau klik nomor pin <strong>①–⑥</strong> untuk menyorot garis
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: Color-Coded Measurement Cards (Keterangan Setiap Garis) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Garment Header Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {garmentSpecs[activeGarment].code}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {garmentSpecs[activeGarment].title}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    • {garmentSpecs[activeGarment].subtitle}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0.5rem 0 0' }}>
                  {garmentSpecs[activeGarment].description}
                </p>
              </div>

              {/* 6 Color-Coded Breakdown Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '0.85rem',
                }}
              >
                {garmentSpecs[activeGarment].lines.map((line) => {
                  const isHovered = hoveredLine === line.id;
                  const isDimmed = hoveredLine !== null && !isHovered;

                  return (
                    <div
                      key={line.id}
                      onClick={() => setHoveredLine(hoveredLine === line.id ? null : line.id)}
                      onMouseEnter={() => setHoveredLine(line.id)}
                      onMouseLeave={() => setHoveredLine(null)}
                      style={{
                        padding: '1rem',
                        backgroundColor: isHovered ? line.colorBg : '#FFFFFF',
                        borderRadius: 'var(--radius-md)',
                        border: isHovered ? `2px solid ${line.color}` : '1px solid var(--border)',
                        boxShadow: isHovered ? `0 4px 14px ${line.color}30` : 'var(--shadow-sm)',
                        transform: isHovered ? 'translateY(-2px)' : 'none',
                        opacity: isDimmed ? 0.45 : 1,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.45rem',
                      }}
                    >
                      {/* Top Bar: Number Pin Badge + Color Tag + Tolerance Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: line.color,
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              flexShrink: 0,
                            }}
                          >
                            {line.id}
                          </span>
                          <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: line.color, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block' }}>
                              Garis {line.colorName}
                            </span>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                              {line.label}
                            </div>
                          </div>
                        </div>

                        {/* Tolerance Pill */}
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '999px',
                            backgroundColor: isHovered ? '#FFFFFF' : line.colorBg,
                            color: line.color,
                            border: `1px solid ${line.colorBorder}`,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {line.tolerance}
                        </span>
                      </div>

                      {/* Cara Ukur / Prosedur */}
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                        {line.standard}
                      </p>

                      {/* Tailor Tip / Toleransi */}
                      <div
                        style={{
                          fontSize: '0.74rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.4,
                          paddingLeft: '0.5rem',
                          borderLeft: `2.5px solid ${line.color}`,
                          marginTop: '0.15rem',
                        }}
                      >
                        <strong>Catatan Bengkel:</strong> {line.tailorTip}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Master Tailor Pro-Tip Advisory Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  borderLeft: '4px solid var(--primary)',
                }}
              >
                <Scissors size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)' }}>
                    Prinsip Pemotongan Kain President Tailor Sukoharjo
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0', lineHeight: 1.45 }}>
                    Seluruh toleransi di atas dicatat saat fitting awal. Jika pelanggan menginginkan kenyamanan khusus (seperti bahu miring sebelah, perut buncit, atau kebiasaan memakai celana di pinggang tinggi), tuliskan detail tersebut pada kolom catatan teks bebas formulir pesanan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. STATUS MATRIX & CASH FLOW (Interactive Decision Flow) */}
        <section
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              BAGIAN 3 — SINKRONISASI ARUS DATA
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              Korelasi Status Produksi Jahit vs Arus Kas Keuangan
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Panduan bagi staf kasir dan penjahit agar perubahan status di sistem selaras dengan fisik kain dan posisi piutang.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {/* Status Baru */}
            <div
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Fase 1</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '999px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                  Status: Baru
                </span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Kain Masuk Rak Antrean</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Kain telah diterima di workshop dan nota diterbitkan. Penjahit belum memotong pola kain.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <DollarSign size={14} color="var(--error)" />
                Kas: <strong>Belum Bayar / DP Sebagian</strong>
              </div>
            </div>

            {/* Status Diproses */}
            <div
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--warning-border)',
                backgroundColor: 'var(--bg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Fase 2</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '999px', backgroundColor: 'var(--warning-bg)', color: 'var(--warning)' }}>
                  Status: Diproses
                </span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Pemotongan & Perakitan Busana</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Penjahit sedang memotong kain, memasang furing, merakit pola, dan menjahit kancing.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} color="var(--warning)" />
                Kas: <strong>DP Masuk, Sisa Piutang Dilunasi Fitting</strong>
              </div>
            </div>

            {/* Status Selesai */}
            <div
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--success-border)',
                backgroundColor: 'var(--bg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Fase 3</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '999px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Lock size={12} /> Status: Selesai
                </span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Fitting, Lunas & Diserahkan</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Pakaian lolos QC kerapian, dicoba pas di tubuh pelanggan, dan rincian nota dikunci permanen.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Check size={14} color="var(--success)" strokeWidth={3} />
                Kas: <strong>Wajib Lunas (Sisa Rp 0)</strong>
              </div>
            </div>
          </div>
        </section>

        {/* 4. COMPACT INTERACTIVE FAQ ACCORDION */}
        <section
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              BAGIAN 4 — ATURAN OPERASIONAL
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              Pertanyaan & Aturan Penting Operator
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: isOpen ? 'var(--bg)' : '#FFFFFF',
                    overflow: 'hidden',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 1.25rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
