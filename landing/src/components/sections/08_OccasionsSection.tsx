import React from 'react';
import { OCCASIONS, getWhatsAppUrl } from '@/lib/constants';

export function OccasionsSection() {
  return (
    <section className="section section-white" style={{ borderBottom: '1px solid var(--c-border-subtle)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Inspirasi Penggunaan</span>
          <h2 className="heading-serif section-title">
            Pakaian Sesuai dengan Momen Anda
          </h2>
          <p className="section-subtitle" style={{ color: 'var(--c-text-dark-sub)' }}>
            Setiap acara menuntut tingkat formalitas dan kenyamanan yang berbeda. Diskusikan konteks acara Anda agar pakaian dirancang tepat guna.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem',
          }}
        >
          {OCCASIONS.map((occ, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--c-ivory)',
                border: '1px solid var(--c-border-subtle)',
                borderRadius: 'var(--r-md)',
                padding: '2.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--c-gold-dark)',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  {occ.subtitle}
                </span>

                <h3
                  className="heading-serif"
                  style={{
                    fontSize: '1.375rem',
                    color: 'var(--c-text-dark)',
                    marginBottom: '1rem',
                  }}
                >
                  {occ.title}
                </h3>

                <p style={{ fontSize: '0.9375rem', color: 'var(--c-text-dark-sub)', lineHeight: 1.6 }}>
                  {occ.description}
                </p>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--c-border-light)' }}>
                <a
                  href={getWhatsAppUrl(`Halo President Tailor, saya membutuhkan pakaian untuk ${occ.title}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--c-gold-dark)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  Konsultasi Acara Ini &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
