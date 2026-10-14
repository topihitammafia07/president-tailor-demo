import React from 'react';
import { PAIN_POINTS, getWhatsAppUrl } from '@/lib/constants';

export function PainPointsSection() {
  const waUrl = getWhatsAppUrl(
    'Halo President Tailor, saya ingin berkonsultasi mengenai solusi pakaian yang sesuai dengan postur tubuh saya.'
  );

  return (
    <section className="section section-white" style={{ borderBottom: '1px solid var(--c-border-subtle)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Solusi Masalah Pakaian</span>
          <h2 className="heading-serif section-title">
            Mengapa Pakaian Siap Pakai Sering Terasa Kurang Pas?
          </h2>
          <p className="section-subtitle" style={{ color: 'var(--c-text-dark-sub)' }}>
            Memilih ukuran S, M, L, atau XL sering mengharuskan Anda berkompromi antara kenyamanan gerak dan kerapian penampilan.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3.5rem',
          }}
        >
          {PAIN_POINTS.map((item, idx) => (
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
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.625rem',
                    backgroundColor: 'rgba(184, 147, 84, 0.12)',
                    color: 'var(--c-gold-dark)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: 'var(--r-sm)',
                    marginBottom: '1rem',
                  }}
                >
                  Kendala Umum #{idx + 1}
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
                  {item.issue}
                </h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--c-text-dark-sub)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {item.detail}
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--c-border-light)',
                  paddingTop: '1rem',
                }}
              >
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--c-gold)', display: 'block', marginBottom: '0.25rem' }}>
                  Pendekatan President Tailor:
                </span>
                <p style={{ fontSize: '0.875rem', color: 'var(--c-text-dark)', fontWeight: 500 }}>
                  {item.solution}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark"
            style={{ padding: '0.75rem 2rem' }}
          >
            Diskusikan Kebutuhan Pakaian Anda via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
