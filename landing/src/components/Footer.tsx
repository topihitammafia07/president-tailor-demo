import React from 'react';
import { BRAND, SERVICES, getWhatsAppUrl } from '@/lib/constants';

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--c-obsidian)',
        color: 'var(--c-text-light)',
        borderTop: '1px solid var(--c-slate)',
        paddingTop: '4.5rem',
        paddingBottom: '3rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Brand Info */}
          <div>
            <span
              className="heading-serif"
              style={{
                fontSize: '1.625rem',
                fontWeight: 700,
                color: '#FFFFFF',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              {BRAND.name}
            </span>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--c-gold)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              {BRAND.tagline}
            </p>
            <p
              style={{
                fontSize: '0.9375rem',
                color: 'var(--c-text-light-sub)',
                lineHeight: 1.6,
                maxWidth: '340px',
              }}
            >
              Dedikasi pada ketelitian jahitan manual, presisi pola tubuh, dan kenyamanan pemakaian pria untuk berbagai momentum penting Anda.
            </p>
          </div>

          {/* Layanan Utama */}
          <div>
            <h3
              style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                marginBottom: '1.25rem',
              }}
            >
              Layanan Utama
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#layanan-${s.id}`}
                    style={{
                      color: 'var(--c-text-light-sub)',
                      fontSize: '0.9375rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Jam & Lokasi Workshop */}
          <div>
            <h3
              style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                marginBottom: '1.25rem',
              }}
            >
              Workshop Sukoharjo
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.9375rem', color: 'var(--c-text-light-sub)' }}>
              <div>
                <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '0.2rem' }}>Alamat:</strong>
                <span>{BRAND.address}</span>
              </div>
              <div>
                <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '0.2rem' }}>Jam Operasional:</strong>
                <span>{BRAND.hours}</span>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <a
                  href={getWhatsAppUrl('Halo President Tailor, saya ingin menanyakan jadwal kunjungan ke workshop.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--c-gold)',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Hubungi via WhatsApp
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--c-slate)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.875rem',
            color: 'var(--c-text-light-muted)',
          }}
        >
          <p>&copy; {new Date().getFullYear()} {BRAND.name}. Hak cipta dilindungi undang-undang.</p>
          <p>Penjahit Pria Berkualitas di Sukoharjo, Jawa Tengah.</p>
        </div>
      </div>
    </footer>
  );
}
