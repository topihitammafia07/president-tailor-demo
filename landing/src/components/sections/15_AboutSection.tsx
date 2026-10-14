import React from 'react';
import { getWhatsAppUrl } from '@/lib/constants';

export function AboutSection() {
  const waUrl = getWhatsAppUrl(
    'Halo President Tailor, saya ingin menanyakan informasi tentang workshop President Tailor di Sukoharjo.'
  );

  return (
    <section id="tentang" className="section section-white" style={{ borderBottom: '1px solid var(--c-border-subtle)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* Brand Storytelling */}
          <div>
            <span className="section-eyebrow">Mengenal Kami</span>
            <h2 className="heading-serif" style={{ fontSize: '2.375rem', color: 'var(--c-text-dark)', marginBottom: '1.25rem', lineHeight: 1.25 }}>
              Ketelitian Jahitan Tradisional untuk Kebutuhan Busana Masa Kini
            </h2>
            <p style={{ color: 'var(--c-text-dark-sub)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              President Tailor berakar dari kecintaan pada seni potong dan jahit pakaian pria di Sukoharjo, Jawa Tengah. Kami meyakini bahwa pakaian yang terbaik bukan yang paling mahal, melainkan pakaian yang membuat pemakainya merasa percaya diri, nyaman, dan berwibawa.
            </p>
            <p style={{ color: 'var(--c-text-dark-sub)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              Di tengah maraknya pakaian cepat saji (fast-fashion), kami mempertahankan proses pengukuran personal, pengujian kenyamanan pola, serta kerapian furing dalam. Setiap helai pakaian yang selesai adalah cerminan dari penghargaan kami terhadap kepercayaan pelanggan.
            </p>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark"
              style={{ padding: '0.75rem 1.75rem' }}
            >
              Hubungi Workshop President Tailor
            </a>
          </div>

          {/* Core Values Card */}
          <div>
            <div
              style={{
                backgroundColor: 'var(--c-ivory)',
                border: '1px solid var(--c-border-subtle)',
                borderRadius: 'var(--r-md)',
                padding: '2.5rem',
                borderLeft: '4px solid var(--c-gold)',
              }}
            >
              <h3 className="heading-serif" style={{ fontSize: '1.375rem', color: 'var(--c-text-dark)', marginBottom: '1.25rem' }}>
                Prinsip Kerja Kami
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9375rem' }}>
                <div>
                  <strong style={{ color: 'var(--c-text-dark)', display: 'block', marginBottom: '0.2rem' }}>
                    1. Kejujuran terhadap Bahan
                  </strong>
                  <p style={{ color: 'var(--c-text-dark-sub)' }}>
                    Kami menyampaikan saran terbuka jika ada bahan kain yang kurang cocok untuk model tertentu demi hasil akhir terbaik.
                  </p>
                </div>

                <div>
                  <strong style={{ color: 'var(--c-text-dark)', display: 'block', marginBottom: '0.2rem' }}>
                    2. Presisi Garis Pola
                  </strong>
                  <p style={{ color: 'var(--c-text-dark-sub)' }}>
                    Menghindari jalan pintas dalam memotong kain. Motif batik dijaga keselarasan polanya dari kerah sampai saku.
                  </p>
                </div>

                <div>
                  <strong style={{ color: 'var(--c-text-dark)', display: 'block', marginBottom: '0.2rem' }}>
                    3. Pengarsipan Ukuran Digital
                  </strong>
                  <p style={{ color: 'var(--c-text-dark-sub)' }}>
                    Data ukuran Anda tersimpan rapi untuk memudahkan penyesuaian pesanan di masa mendatang.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
