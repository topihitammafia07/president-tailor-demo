import React from 'react';
import { BEFORE_ORDER_TIPS, getWhatsAppUrl } from '@/lib/constants';

export function BeforeOrderSection() {
  const waUrl = getWhatsAppUrl(
    'Halo President Tailor, saya ingin berkonsultasi mengenai persiapan pemesanan pakaian.'
  );

  return (
    <section id="sebelum-pesan" className="section section-white" style={{ borderBottom: '1px solid var(--c-border-subtle)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Persiapan Konsultasi</span>
          <h2 className="heading-serif section-title">
            Hal yang Sebaiknya Disiapkan Sebelum Memesan
          </h2>
          <p className="section-subtitle" style={{ color: 'var(--c-text-dark-sub)' }}>
            Agar sesi konsultasi berjalan efektif dan pakaian dapat diselesaikan tepat waktu, perhatikan empat hal praktis berikut.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '3.5rem',
          }}
        >
          {BEFORE_ORDER_TIPS.map((tip, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--c-ivory)',
                border: '1px solid var(--c-border-subtle)',
                borderRadius: 'var(--r-md)',
                padding: '2.25rem',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--c-gold-light)',
                  color: 'var(--c-gold-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  marginBottom: '1.25rem',
                }}
              >
                0{idx + 1}
              </div>

              <h3
                className="heading-serif"
                style={{
                  fontSize: '1.25rem',
                  color: 'var(--c-text-dark)',
                  marginBottom: '0.75rem',
                  lineHeight: 1.3,
                }}
              >
                {tip.title}
              </h3>

              <p style={{ fontSize: '0.9375rem', color: 'var(--c-text-dark-sub)', lineHeight: 1.6 }}>
                {tip.desc}
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
            Konsultasikan Jadwal Anda via WhatsApp &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
