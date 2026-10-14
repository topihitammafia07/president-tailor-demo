import React from 'react';
import Image from 'next/image';
import { SERVICES, getWhatsAppUrl } from '@/lib/constants';
import { ArrowRight, CheckCircle2, Scissors } from 'lucide-react';

export function ServicesOverviewSection() {
  return (
    <section id="layanan" className="section section-creme" style={{ borderBottom: '1px solid var(--c-border-subtle)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Spesialisasi Utama</span>
          <h2 className="heading-serif section-title">
            Tiga Pilar Layanan Busana Pria
          </h2>
          <p className="section-subtitle" style={{ color: 'var(--c-text-dark-sub)' }}>
            Kami mendedikasikan ketelitian kami pada tiga jenis busana esensial pria untuk menghasilkan kualitas jahitan yang matang, presisi, dan berkarakter.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.25rem',
          }}
        >
          {SERVICES.map((service, idx) => (
            <div
              key={service.id}
              style={{
                backgroundColor: 'var(--c-surface)',
                border: '1px solid var(--c-border-subtle)',
                borderRadius: 'var(--r-md)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-subtle)',
                transition: 'transform 0.25s, box-shadow 0.25s',
              }}
            >
              {/* Image Frame */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '240px',
                  backgroundColor: 'var(--c-card-dark)',
                  overflow: 'hidden',
                }}
              >
                {service.image && (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                )}
                {/* Gradient overlay for luxury contrast */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(12, 22, 38, 0.75) 0%, rgba(12, 22, 38, 0.1) 60%, transparent 100%)',
                  }}
                />
                
                {/* Number Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    backgroundColor: 'rgba(12, 22, 38, 0.85)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    color: 'var(--c-gold)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-serif)',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--r-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Scissors size={13} />
                  <span>Koleksi 0{idx + 1}</span>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1.25rem',
                    right: '1.25rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--c-gold-light)',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.2rem',
                    }}
                  >
                    Bespoke Tailoring
                  </span>
                  <h3
                    className="heading-serif"
                    style={{
                      fontSize: '1.35rem',
                      color: '#FFFFFF',
                      lineHeight: 1.25,
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    }}
                  >
                    {service.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--c-gold-dark)',
                      fontWeight: 600,
                      marginBottom: '0.75rem',
                    }}
                  >
                    {service.subtitle}
                  </p>

                  <p
                    style={{
                      fontSize: '0.9375rem',
                      color: 'var(--c-text-dark-sub)',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem',
                    }}
                  >
                    {service.description}
                  </p>

                  <div style={{ borderTop: '1px solid var(--c-border-light)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                    <strong style={{ fontSize: '0.8125rem', color: 'var(--c-text-dark)', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                      Keunggulan Teknis:
                    </strong>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--c-text-dark-sub)' }}>
                      {service.highlights.slice(0, 3).map((h, hIdx) => (
                        <li key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <CheckCircle2 size={15} style={{ color: 'var(--c-gold-dark)', flexShrink: 0, marginTop: '0.15rem' }} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  style={{
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--c-border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <a
                    href={`#layanan-${service.id}`}
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--c-text-dark)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span>Rincian Spesifikasi</span>
                    <ArrowRight size={14} />
                  </a>
                  <a
                    href={getWhatsAppUrl(`Halo President Tailor, saya ingin berkonsultasi mengenai ${service.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{
                      padding: '0.45rem 0.9rem',
                      fontSize: '0.8125rem',
                    }}
                  >
                    Tanya via WA
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
