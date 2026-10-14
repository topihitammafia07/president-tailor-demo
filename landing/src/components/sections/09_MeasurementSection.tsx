import React from 'react';
import Image from 'next/image';
import { getWhatsAppUrl } from '@/lib/constants';
import { CheckCircle2, MessageCircle, Ruler } from 'lucide-react';

export function MeasurementSection() {
  const waUrl = getWhatsAppUrl(
    'Halo President Tailor, saya ingin berkonsultasi mengenai proses pengukuran pakaian.'
  );

  return (
    <section id="ukuran" className="section section-creme" style={{ borderBottom: '1px solid var(--c-border-subtle)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* Explanation */}
          <div>
            <span className="section-eyebrow">Presisi Pengukuran</span>
            <h2 className="heading-serif" style={{ fontSize: '2.375rem', color: 'var(--c-text-dark)', marginBottom: '1.25rem', lineHeight: 1.25 }}>
              Pengukuran Personal Adalah Fondasi Kenyamanan Sejati
            </h2>
            <p style={{ color: 'var(--c-text-dark-sub)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Dua orang dengan berat dan tinggi badan yang sama bisa memiliki postur tubuh yang sangat berbeda. Ada bahu yang cenderung condong ke depan, lekukan punggung alami, atau lingkar perut yang memerlukan ruang bernapas lebih leluasa.
            </p>
            <p style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Di President Tailor Sukoharjo, setiap titik ukuran dicatat secara seksama ke dalam sistem internal kami. Catatan anatomi Anda tersimpan rapi sehingga untuk pemesanan berikutnya Anda tidak perlu mengulang proses dari awal.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <CheckCircle2 size={17} style={{ color: 'var(--c-gold-dark)' }} />
                <span style={{ fontSize: '0.9375rem', color: 'var(--c-text-dark)', fontWeight: 500 }}>
                  Lebih dari 15 parameter titik ukur fisik
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <CheckCircle2 size={17} style={{ color: 'var(--c-gold-dark)' }} />
                <span style={{ fontSize: '0.9375rem', color: 'var(--c-text-dark)', fontWeight: 500 }}>
                  Penyesuaian toleransi gerak berdiri dan duduk
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <CheckCircle2 size={17} style={{ color: 'var(--c-gold-dark)' }} />
                <span style={{ fontSize: '0.9375rem', color: 'var(--c-text-dark)', fontWeight: 500 }}>
                  Tersimpan digital untuk kemudahan pesanan berikutnya
                </span>
              </div>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '0.875rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <MessageCircle size={17} />
              <span>Jadwalkan Pengukuran via WhatsApp</span>
            </a>
          </div>

          {/* Measurement Visual Showcase with Fitting Photo & Spec Overlay */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--r-md)',
                overflow: 'hidden',
                aspectRatio: '4 / 4.6',
                boxShadow: '0 20px 40px rgba(12, 22, 38, 0.15)',
                border: '1px solid var(--c-border-subtle)',
                backgroundColor: 'var(--c-surface)',
              }}
            >
              <Image
                src="/images/gallery-fitting.jpg"
                alt="Sesi Pengukuran Busana Personal President Tailor"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(12, 22, 38, 0.9) 0%, rgba(12, 22, 38, 0.2) 50%, transparent 100%)',
                }}
              />

              {/* Floating Bottom Card: Measurement Points */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.25rem',
                  left: '1.25rem',
                  right: '1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.96)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--c-border-light)',
                  borderRadius: 'var(--r-sm)',
                  padding: '1.25rem',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <Ruler size={15} style={{ color: 'var(--c-gold-dark)' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--c-gold-dark)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Titik Pengukuran Utama
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8125rem' }}>
                  <div style={{ backgroundColor: 'var(--c-ivory)', padding: '0.4rem 0.6rem', borderRadius: 'var(--r-sm)' }}>
                    <strong style={{ display: 'block', color: 'var(--c-text-dark)', fontSize: '0.75rem' }}>Bahu & Pundak</strong>
                    <span style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.6875rem' }}>Garis jatuh jas & kemeja</span>
                  </div>
                  <div style={{ backgroundColor: 'var(--c-ivory)', padding: '0.4rem 0.6rem', borderRadius: 'var(--r-sm)' }}>
                    <strong style={{ display: 'block', color: 'var(--c-text-dark)', fontSize: '0.75rem' }}>Dada & Perut</strong>
                    <span style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.6875rem' }}>Ruang napas & gerak</span>
                  </div>
                  <div style={{ backgroundColor: 'var(--c-ivory)', padding: '0.4rem 0.6rem', borderRadius: 'var(--r-sm)' }}>
                    <strong style={{ display: 'block', color: 'var(--c-text-dark)', fontSize: '0.75rem' }}>Lengan & Manset</strong>
                    <span style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.6875rem' }}>Panjang presisi jam tangan</span>
                  </div>
                  <div style={{ backgroundColor: 'var(--c-ivory)', padding: '0.4rem 0.6rem', borderRadius: 'var(--r-sm)' }}>
                    <strong style={{ display: 'block', color: 'var(--c-text-dark)', fontSize: '0.75rem' }}>Pesak & Kaki</strong>
                    <span style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.6875rem' }}>Kenyamanan duduk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accent Floating Badge */}
            <div
              style={{
                position: 'absolute',
                top: '-1rem',
                left: '1rem',
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
              15+ Titik Ukur Presisi
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
