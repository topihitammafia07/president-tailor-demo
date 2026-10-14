import React from 'react';
import Image from 'next/image';
import { getWhatsAppUrl } from '@/lib/constants';
import { ArrowRight, CheckCircle2, MessageCircle, Award } from 'lucide-react';

export function JasSpotlightSection() {
  const waUrl = getWhatsAppUrl(
    'Halo President Tailor, saya ingin berkonsultasi mengenai pembuatan Jas Formal (pilihan model, bahan, dan estimasi waktu).'
  );

  return (
    <section id="layanan-jas" className="section section-dark" style={{ borderBottom: '1px solid var(--c-slate)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* Visual Showcase for Jas */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--r-md)',
                overflow: 'hidden',
                aspectRatio: '4 / 4.8',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
                border: '1px solid var(--c-slate)',
                backgroundColor: 'var(--c-card-dark)',
              }}
            >
              <Image
                src="/images/service-jas.jpg"
                alt="Jas Formal Bespoke President Tailor"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(12, 22, 38, 0.85) 0%, rgba(12, 22, 38, 0.2) 50%, transparent 100%)',
                }}
              />

              {/* Floating Bottom Card */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  backgroundColor: 'rgba(12, 22, 38, 0.92)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: 'var(--r-sm)',
                  padding: '1.25rem 1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Award size={14} style={{ color: 'var(--c-gold)' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--c-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Spesifikasi Standar Atelier
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#FFFFFF', margin: 0, lineHeight: 1.5 }}>
                  Konstruksi dada dan bantalan bahu fleksibel yang mengikuti postur tubuh alami tanpa memberi kesan kaku.
                </p>
              </div>
            </div>

            {/* Accent Floating Badge */}
            <div
              style={{
                position: 'absolute',
                top: '-1rem',
                right: '1rem',
                backgroundColor: 'var(--c-gold)',
                color: 'var(--c-navy-dark)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--r-sm)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
              }}
            >
              Hand-Pressed Lapel Roll
            </div>
          </div>

          {/* Text and Consultation Pitch */}
          <div>
            <span className="section-eyebrow">Layanan Unggulan 01</span>
            <h2 className="heading-serif" style={{ fontSize: '2.5rem', color: '#FFFFFF', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              Jas Formal & Acara Khusus
            </h2>
            <p style={{ color: 'var(--c-text-light-sub)', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Sebuah jas berkualitas bukan dinilai dari seberapa mencolok potongannya, melainkan seberapa harmonis jas tersebut menyatu dengan bentuk fisik pemakainya.
            </p>
            <p style={{ color: 'var(--c-text-light-sub)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Kami melayani pembuatan jas pengantin pria (wedding suit), jas dinas resmi instansi, jas wisuda, hingga blazer semi-formal. Anda dapat membawa bahan kain wol/drill sendiri atau berkonsultasi mengenai referensi potongan yang Anda inginkan.
            </p>

            {/* Technical Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--c-gold)', marginTop: '0.2rem', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#FFFFFF', fontSize: '0.9375rem', display: 'block', marginBottom: '0.15rem' }}>
                    Padded Shoulder Seimbang & Ergonomis
                  </strong>
                  <span style={{ color: 'var(--c-text-light-sub)', fontSize: '0.875rem' }}>
                    Menyeimbangkan postur bahu turun atau miring agar tampak tegap proporsional.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--c-gold)', marginTop: '0.2rem', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#FFFFFF', fontSize: '0.9375rem', display: 'block', marginBottom: '0.15rem' }}>
                    Lapel & Dada Rapat Presisi
                  </strong>
                  <span style={{ color: 'var(--c-text-light-sub)', fontSize: '0.875rem' }}>
                    Kerah jas tetap menempel di dada tanpa menganga saat berdiri tegak maupun bergerak.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--c-gold)', marginTop: '0.2rem', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#FFFFFF', fontSize: '0.9375rem', display: 'block', marginBottom: '0.15rem' }}>
                    Furing Dalam Bernapas (Breathable)
                  </strong>
                  <span style={{ color: 'var(--c-text-light-sub)', fontSize: '0.875rem' }}>
                    Furing dijahit bersih dengan saku rahasia di bagian dalam untuk ponsel dan dompet.
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
                <span>Konsultasi Jas via WhatsApp</span>
              </a>
              <a
                href="#alur"
                className="btn btn-secondary"
                style={{ padding: '0.875rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Lihat Alur Pemesanan</span>
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
