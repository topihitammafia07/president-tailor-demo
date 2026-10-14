import React from 'react';
import { getWhatsAppUrl } from '@/lib/constants';

export function WhyConsultSection() {
  const waUrl = getWhatsAppUrl(
    'Halo President Tailor, saya ingin berkonsultasi langsung mengenai bahan dan model pakaian.'
  );

  const reasons = [
    {
      title: 'Mencegah Kesalahan Memotong Bahan',
      desc: 'Bahan bernilai tinggi seperti batik tulis atau wol membutuhkan analisis cermat sebelum dipotong agar tidak kurang ukuran atau salah alur serat.',
    },
    {
      title: 'Penyesuaian Model dengan Bentuk Fisik',
      desc: 'Tidak semua model di internet cocok untuk setiap bentuk tubuh. Konsultasi membantu menemukan siluet yang paling proporsional untuk Anda.',
    },
    {
      title: 'Kejelasan Anggaran & Transparansi Ongkos',
      desc: 'Anda mendapatkan rincian jelas mengenai biaya pengerjaan sesuai tingkat kerumitan sebelum kain mulai dijahit.',
    },
    {
      title: 'Pencatatan Ukuran yang Rapi & Terdata',
      desc: 'Ukuran Anda tersimpan dalam sistem digital President Tailor, memudahkan pemesanan ulang tanpa harus mengukur ulang seluruh badan.',
    },
  ];

  return (
    <section className="section section-creme" style={{ borderBottom: '1px solid var(--c-border-subtle)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Nilai Konsultasi</span>
          <h2 className="heading-serif section-title">
            Mengapa Konsultasi Langsung Sangat Berarti?
          </h2>
          <p className="section-subtitle" style={{ color: 'var(--c-text-dark-sub)' }}>
            Menjahit pakaian adalah kolaborasi antara kebutuhan Anda dan keahlian tangan penjahit. Konsultasi awal menghilangkan keraguan sebelum kain dipotong.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem',
            marginBottom: '3.5rem',
          }}
        >
          {reasons.map((r, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--c-surface)',
                border: '1px solid var(--c-border-subtle)',
                borderRadius: 'var(--r-md)',
                padding: '2rem',
                boxShadow: 'var(--shadow-subtle)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  color: 'var(--c-gold-dark)',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                }}
              >
                0{idx + 1}.
              </div>

              <h3
                className="heading-serif"
                style={{
                  fontSize: '1.1875rem',
                  color: 'var(--c-text-dark)',
                  marginBottom: '0.75rem',
                  lineHeight: 1.3,
                }}
              >
                {r.title}
              </h3>

              <p style={{ fontSize: '0.9375rem', color: 'var(--c-text-dark-sub)', lineHeight: 1.6 }}>
                {r.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ padding: '0.875rem 2.25rem' }}
          >
            Mulai Diskusi dengan Penjahit via WhatsApp &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
