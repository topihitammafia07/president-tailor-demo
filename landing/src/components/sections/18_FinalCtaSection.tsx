import React from 'react';
import Image from 'next/image';
import { BRAND, getWhatsAppUrl } from '@/lib/constants';
import { ArrowRight, MessageCircle, Scissors } from 'lucide-react';

export function FinalCtaSection() {
  const waUrl = getWhatsAppUrl(
    'Halo President Tailor, saya siap berkonsultasi untuk pembuatan pakaian pria saya.'
  );

  return (
    <section
      className="section section-dark"
      style={{
        paddingTop: '6.5rem',
        paddingBottom: '6.5rem',
        borderTop: '1px solid var(--c-slate)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Image of Atelier */}
      <Image
        src="/images/hero-atelier.jpg"
        alt="President Tailor Atelier Sukoharjo"
        fill
        sizes="100vw"
        style={{ objectFit: 'cover', opacity: 0.12 }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, var(--c-navy-dark) 0%, rgba(12, 22, 38, 0.94) 50%, var(--c-navy-dark) 100%)',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid var(--c-gold)',
              padding: '0.45rem 1.25rem',
              borderRadius: '9999px',
              color: 'var(--c-gold)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1.75rem',
            }}
          >
            <Scissors size={14} />
            <span>Langkah Awal Busana Impian Anda</span>
          </div>

          <h2
            className="heading-serif"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
              color: '#FFFFFF',
              lineHeight: 1.2,
              marginBottom: '1.5rem',
            }}
          >
            Tampil Berwibawa dengan Pakaian yang Benar-Benar Pas untuk Anda
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.1875rem)',
              color: 'var(--c-text-light-sub)',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
            }}
          >
            Mulai dengan perbincangan santai seputar model jas, sambungan motif hem batik, atau ukuran celana panjang Anda. Kami siap melayani konsultasi langsung di workshop Sukoharjo.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ fontSize: '1.0625rem', padding: '1rem 2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <MessageCircle size={19} />
              <span>Konsultasi Sekarang via WhatsApp</span>
              <ArrowRight size={18} />
            </a>
          </div>

          <p
            style={{
              marginTop: '2rem',
              fontSize: '0.875rem',
              color: 'var(--c-text-light-muted)',
            }}
          >
            {BRAND.name} Sukoharjo - Tanpa Biaya Konsultasi Awal
          </p>
        </div>
      </div>
    </section>
  );
}
