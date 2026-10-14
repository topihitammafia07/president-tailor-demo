import React from 'react';
import { BRAND, getWhatsAppUrl } from '@/lib/constants';

export function LocationContactSection() {
  const waUrl = getWhatsAppUrl(
    'Halo President Tailor, saya ingin menanyakan rute dan panduan lokasi workshop di Sukoharjo.'
  );

  return (
    <section id="kontak" className="section section-white" style={{ borderBottom: '1px solid var(--c-border-subtle)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* Contact Details */}
          <div>
            <span className="section-eyebrow">Workshop & Kunjungan</span>
            <h2 className="heading-serif" style={{ fontSize: '2.25rem', color: 'var(--c-text-dark)', marginBottom: '1.25rem', lineHeight: 1.25 }}>
              Kunjungi Workshop Kami di Sukoharjo
            </h2>
            <p style={{ color: 'var(--c-text-dark-sub)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Kami melayani pengukuran langsung di tempat dan diskusi bahan secara tatap muka. Agar kami dapat memberikan perhatian penuh, kami sarankan memberi kabar via WhatsApp sebelum berkunjung.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--c-gold-light)',
                    color: 'var(--c-gold-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--c-text-dark)', marginBottom: '0.2rem' }}>
                    Lokasi Workshop:
                  </strong>
                  <span style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.9375rem' }}>
                    {BRAND.address}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--c-gold-light)',
                    color: 'var(--c-gold-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--c-text-dark)', marginBottom: '0.2rem' }}>
                    Jam Operasional:
                  </strong>
                  <span style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.9375rem' }}>
                    {BRAND.hours}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--c-gold-light)',
                    color: 'var(--c-gold-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--c-text-dark)', marginBottom: '0.2rem' }}>
                    Kanal Konsultasi:
                  </strong>
                  <span style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.9375rem' }}>
                    WhatsApp Resmi President Tailor
                  </span>
                </div>
              </div>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '0.875rem 2rem' }}
            >
              Hubungi Sebelum Berkunjung &rarr;
            </a>
          </div>

          {/* Location Map / Direction Visual Card */}
          <div>
            <div
              style={{
                backgroundColor: 'var(--c-creme)',
                border: '1px solid var(--c-border-subtle)',
                borderRadius: 'var(--r-md)',
                padding: '2.5rem',
                boxShadow: 'var(--shadow-card)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--c-gold-light)',
                  color: 'var(--c-gold-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
              </div>

              <h3 className="heading-serif" style={{ fontSize: '1.5rem', color: 'var(--c-text-dark)', marginBottom: '0.75rem' }}>
                Akses Mudah di Sukoharjo
              </h3>

              <p style={{ fontSize: '0.9375rem', color: 'var(--c-text-dark-sub)', lineHeight: 1.6, marginBottom: '2rem' }}>
                Workshop kami mudah dijangkau dari pusat kota Sukoharjo maupun perbatasan Solo Selatan. Tempat nyaman dan tenang untuk berdiskusi ukuran dan model pakaian pria Anda.
              </p>

              <div style={{ backgroundColor: 'var(--c-surface)', padding: '1.25rem', borderRadius: 'var(--r-sm)', border: '1px solid var(--c-border-light)', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.8125rem', textTransform: 'uppercase', color: 'var(--c-gold-dark)', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                  Panduan Menuju Lokasi
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--c-text-dark)' }}>
                  Kirimkan pesan via WhatsApp untuk mendapatkan tautan titik koordinat Google Maps terkini.
                </span>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-dark"
                style={{ width: '100%' }}
              >
                Minta Titik Lokasi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
