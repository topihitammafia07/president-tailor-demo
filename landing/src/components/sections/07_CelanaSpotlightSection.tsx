import React from 'react';
import Image from 'next/image';
import { getWhatsAppUrl } from '@/lib/constants';
import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';

export function CelanaSpotlightSection() {
  const waUrl = getWhatsAppUrl(
    'Halo President Tailor, saya ingin berkonsultasi mengenai pembuatan Celana Panjang Presisi.'
  );

  return (
    <section id="layanan-celana-panjang" className="section section-creme" style={{ borderBottom: '1px solid var(--c-border-subtle)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Visual Showcase for Celana */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--r-md)',
                overflow: 'hidden',
                aspectRatio: '4 / 4.8',
                boxShadow: '0 20px 40px rgba(12, 22, 38, 0.15)',
                border: '1px solid var(--c-border-subtle)',
                backgroundColor: 'var(--c-surface)',
              }}
            >
              <Image
                src="/images/service-celana.jpg"
                alt="Celana Panjang Bespoke President Tailor"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(12, 22, 38, 0.85) 0%, rgba(12, 22, 38, 0.15) 50%, transparent 100%)',
                }}
              />

              {/* Floating Bottom Card */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--c-border-light)',
                  borderRadius: 'var(--r-sm)',
                  padding: '1.25rem 1.5rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--c-gold-dark)' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--c-gold-dark)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Anatomi Gerak & Pesak
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--c-text-dark)', margin: 0, lineHeight: 1.5 }}>
                  Kelengkungan pesak disesuaikan presisi sehingga tidak sesak saat duduk dan tidak menggantung saat melangkah.
                </p>
              </div>
            </div>

            {/* Accent Floating Badge */}
            <div
              style={{
                position: 'absolute',
                top: '-1rem',
                right: '1rem',
                backgroundColor: 'var(--c-navy)',
                color: 'var(--c-gold)',
                border: '1px solid var(--c-gold)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--r-sm)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              }}
            >
              Clean Crease & Comfort Fit
            </div>
          </div>

          {/* Right Column: Description & Specifications */}
          <div>
            <span className="section-eyebrow">Layanan Unggulan 03</span>
            <h2 className="heading-serif" style={{ fontSize: '2.5rem', color: 'var(--c-text-dark)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              Celana Panjang Presisi
            </h2>
            <p style={{ color: 'var(--c-text-dark-sub)', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Celana yang baik adalah celana yang terasa nyaman dipakai beraktivitas seharian penuh tanpa perlu sering Anda tarik ke atas saat berdiri.
            </p>
            <p style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Kami melayani pembuatan celana bahan formal setelan jas, celana kerja harian, hingga celana chino semi-formal. Pilihan siluet seperti regular fit yang leluasa atau slim-tapered yang rapi diselaraskan langsung dengan anatomi kaki Anda.
            </p>

            {/* Technical Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--c-gold-dark)', marginTop: '0.2rem', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--c-text-dark)', fontSize: '0.9375rem', display: 'block', marginBottom: '0.15rem' }}>
                    Pesak Proporsional & Bebas Tekanan
                  </strong>
                  <span style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.875rem' }}>
                    Toleransi ruang gerak yang pas, tidak menarik di selangkangan saat duduk di mobil atau kantor.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--c-gold-dark)', marginTop: '0.2rem', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--c-text-dark)', fontSize: '0.9375rem', display: 'block', marginBottom: '0.15rem' }}>
                    Ban Pinggang Kokoh & Opsi Side Adjuster
                  </strong>
                  <span style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.875rem' }}>
                    Menjaga posisi pinggang tetap rapi dan tidak merosot tanpa harus mengandalkan sabuk yang kencang.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--c-gold-dark)', marginTop: '0.2rem', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--c-text-dark)', fontSize: '0.9375rem', display: 'block', marginBottom: '0.15rem' }}>
                    Jatuhnya Pipa Celana & Ujung Kaki Akurat
                  </strong>
                  <span style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.875rem' }}>
                    Garis lipatan vertikal jatuh lurus dan bersih, dengan pilihan no-break atau slight-break di atas sepatu Anda.
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <MessageCircle size={17} />
                <span>Konsultasi Jahit Celana via WA</span>
              </a>
              <a
                href="#ukuran"
                className="btn btn-secondary"
                style={{ padding: '0.875rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Panduan Pengukuran</span>
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
