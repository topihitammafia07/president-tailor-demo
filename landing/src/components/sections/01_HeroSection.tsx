import React from 'react';
import Image from 'next/image';
import { getWhatsAppUrl } from '@/lib/constants';
import { Scissors, MessageCircle, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export function HeroSection() {
  const waUrl = getWhatsAppUrl(
    'Halo President Tailor, saya ingin berkonsultasi mengenai pemesanan pakaian pria (jas formal / hem batik / celana panjang).'
  );

  return (
    <section
      className="section section-dark"
      style={{
        paddingTop: '5rem',
        paddingBottom: '5.5rem',
        borderBottom: '1px solid var(--c-slate)',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#0C1626',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '3.5rem',
          }}
        >
          {/* Headline & Pitch */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(197, 160, 89, 0.12)',
                border: '1px solid rgba(197, 160, 89, 0.35)',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                color: 'var(--c-gold)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              <Scissors size={14} color="#D4AF37" />
              <span>Atelier Penjahit Pria Sukoharjo</span>
            </div>

            <h1
              className="heading-serif"
              style={{
                fontSize: 'clamp(2.15rem, 4.5vw, 3.5rem)',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.18,
                marginBottom: '1.25rem',
                letterSpacing: '-0.01em',
              }}
            >
              Kenyamanan Pakaian yang Jatuh Pas Sesuai Postur Tubuh Anda
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
                color: 'var(--c-text-light-sub)',
                lineHeight: 1.7,
                marginBottom: '2rem',
                maxWidth: '540px',
              }}
            >
              Layanan jahit personal untuk setelan jas formal, hem batik berpenyambungan pola simetris, dan celana panjang berpotongan rapi. Diukur langsung secara teliti di Sukoharjo, Jawa Tengah.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
              }}
            >
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  fontSize: '0.95rem',
                  padding: '0.85rem 1.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#D4AF37',
                  color: '#0C1626',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)',
                }}
              >
                <MessageCircle size={18} />
                <span>Konsultasi via WhatsApp</span>
              </a>

              <a
                href="#layanan"
                className="btn btn-secondary"
                style={{
                  fontSize: '0.95rem',
                  padding: '0.85rem 1.6rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <span>Lihat 3 Layanan Utama</span>
                <ArrowRight size={16} />
              </a>
            </div>

            {/* 3 Quick Tailoring Pillars */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '1.25rem',
                marginTop: '2.75rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div>
                <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.95rem', display: 'block', marginBottom: '0.2rem' }}>
                  Setelan Jas
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--c-text-light-muted)' }}>
                  Bahu tegas & proporsional
                </span>
              </div>
              <div>
                <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.95rem', display: 'block', marginBottom: '0.2rem' }}>
                  Hem Batik
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--c-text-light-muted)' }}>
                  Penyambungan motif simetris
                </span>
              </div>
              <div>
                <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.95rem', display: 'block', marginBottom: '0.2rem' }}>
                  Celana Presisi
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--c-text-light-muted)' }}>
                  Jatuh rapi di atas sepatu
                </span>
              </div>
            </div>
          </div>

          {/* Genuine Bespoke Atelier Photography Frame */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(197, 160, 89, 0.3)',
                aspectRatio: '16/10',
                backgroundColor: '#1E2430',
              }}
            >
              <Image
                src="/images/hero-atelier.jpg"
                alt="Workshop Atelier Jahit Pria President Tailor Sukoharjo"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 550px"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(12, 22, 38, 0.75) 0%, rgba(12, 22, 38, 0) 50%)',
                }}
              />
            </div>

            {/* Overlaid Bespoke Floating Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '20px',
                right: '20px',
                backgroundColor: 'rgba(18, 28, 45, 0.92)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(197, 160, 89, 0.4)',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(197, 160, 89, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D4AF37',
                  }}
                >
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Pola Anatomi Tubuh 100% Personal
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--c-text-light-muted)' }}>
                    Bukan konveksi massal • Sesi fitting uji coba
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D4AF37', fontSize: '0.8rem', fontWeight: 600 }}>
                <MapPin size={14} />
                <span>Sukoharjo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
