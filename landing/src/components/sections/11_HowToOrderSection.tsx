import React from 'react';
import { ORDER_STEPS, getWhatsAppUrl } from '@/lib/constants';

export function HowToOrderSection() {
  const waUrl = getWhatsAppUrl(
    'Halo President Tailor, saya ingin memulai konsultasi pemesanan pakaian.'
  );

  return (
    <section id="alur" className="section section-white" style={{ borderBottom: '1px solid var(--c-border-subtle)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Alur Kerja Nyata</span>
          <h2 className="heading-serif section-title">
            Proses Pemesanan Pakaian Anda
          </h2>
          <p className="section-subtitle" style={{ color: 'var(--c-text-dark-sub)' }}>
            Dari perbincangan awal hingga pakaian siap dikenakan, berikut tahapan pengerjaan di President Tailor Sukoharjo.
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
          {ORDER_STEPS.map((s, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--c-ivory)',
                border: '1px solid var(--c-border-subtle)',
                borderRadius: 'var(--r-md)',
                padding: '2.25rem',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: 'var(--c-gold)',
                  lineHeight: 1,
                  marginBottom: '1rem',
                }}
              >
                {s.step}
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
                {s.title}
              </h3>

              <p style={{ fontSize: '0.9375rem', color: 'var(--c-text-dark-sub)', lineHeight: 1.6 }}>
                {s.desc}
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
            Mulai Langkah 1: Konsultasi via WhatsApp &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
