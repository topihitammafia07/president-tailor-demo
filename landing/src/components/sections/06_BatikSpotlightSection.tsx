import React from 'react';
import Image from 'next/image';
import { getWhatsAppUrl } from '@/lib/constants';
import { ArrowRight, CheckCircle2, MessageCircle, Scissors } from 'lucide-react';

export function BatikSpotlightSection() {
  const waUrl = getWhatsAppUrl(
    'Halo President Tailor, saya ingin berkonsultasi mengenai pembuatan Hem Batik berpola rapi.'
  );

  return (
    <section id="layanan-hem-batik" className="section section-white" style={{ borderBottom: '1px solid var(--c-border-subtle)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Description & Technical Strengths */}
          <div>
            <span className="section-eyebrow">Layanan Unggulan 02</span>
            <h2 className="heading-serif" style={{ fontSize: '2.5rem', color: 'var(--c-text-dark)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              Hem Batik Pola Presisi
            </h2>
            <p style={{ color: 'var(--c-text-dark-sub)', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Kain batik bukan sekadar lembaran bahan tekstil, melainkan karya seni yang memiliki ritme dan alur motif sakral. Kesalahan dalam memotong kain batik dapat membuat corak terpotong canggung di bagian kancing dada.
            </p>
            <p style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Di President Tailor, kami membedah dan memetakan pola kain batik terlebih dahulu sebelum gunting menyentuh bahan. Kami memastikan motif dada menyatu simetris dari sisi kiri ke kanan, serta saku depan menyatu alami mengikuti latar belakang motif.
            </p>

            {/* Technical Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--c-gold-dark)', marginTop: '0.2rem', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--c-text-dark)', fontSize: '0.9375rem', display: 'block', marginBottom: '0.15rem' }}>
                    1. Sambungan Pola Plaket Kancing Dada
                  </strong>
                  <span style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.875rem' }}>
                    Motif dada tidak terpotong acak. Plaket kancing menutup presisi sehingga corak utama tetap terbaca utuh.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--c-gold-dark)', marginTop: '0.2rem', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--c-text-dark)', fontSize: '0.9375rem', display: 'block', marginBottom: '0.15rem' }}>
                    2. Saku Depan Tersamar (Pocket Matching)
                  </strong>
                  <span style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.875rem' }}>
                    Saku tempel dibuat tepat mengikuti alur gambar di baliknya tanpa merusak kesatuan pola batik berharga.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--c-gold-dark)', marginTop: '0.2rem', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--c-text-dark)', fontSize: '0.9375rem', display: 'block', marginBottom: '0.15rem' }}>
                    3. Lapisan Furing Katun Adem & Sejuk
                  </strong>
                  <span style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.875rem' }}>
                    Furing dalam menggunakan katun halus yang menyerap keringat dan tidak membuat kain menempel saat cuaca terik.
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
                <span>Konsultasi Jahit Batik via WA</span>
              </a>
              <a
                href="#sebelum-pesan"
                className="btn btn-secondary"
                style={{ padding: '0.875rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Panduan Membawa Bahan</span>
                <ArrowRight size={15} />
              </a>
            </div>
          </div>

          {/* Right Column: Visual Showcase for Batik */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--r-md)',
                overflow: 'hidden',
                aspectRatio: '4 / 4.8',
                boxShadow: '0 20px 40px rgba(12, 22, 38, 0.15)',
                border: '1px solid var(--c-border-subtle)',
                backgroundColor: 'var(--c-creme)',
              }}
            >
              <Image
                src="/images/service-batik.jpg"
                alt="Hem Batik Pola Presisi President Tailor"
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
                  <Scissors size={14} style={{ color: 'var(--c-gold-dark)' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--c-gold-dark)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Teknik Bedah Pola Kain
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--c-text-dark)', margin: 0, lineHeight: 1.5 }}>
                  Pemotongan terencana memastikan alur motif parang atau tumpal menyatu harmonis pada garis tengah dada.
                </p>
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
              Simetris Plaket & Saku
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
