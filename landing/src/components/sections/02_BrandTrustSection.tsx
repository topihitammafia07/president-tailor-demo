import React from 'react';

export function BrandTrustSection() {
  return (
    <section className="section section-creme" style={{ borderBottom: '1px solid var(--c-border-subtle)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          <div>
            <span className="section-eyebrow">Nilai Keahlian Lokal</span>
            <h2 className="heading-serif" style={{ fontSize: '2rem', marginBottom: '1.25rem', color: 'var(--c-text-dark)' }}>
              Pakaian yang Menghormati Postur Tubuh Anda
            </h2>
            <p style={{ color: 'var(--c-text-dark-sub)', lineHeight: 1.7, marginBottom: '1rem' }}>
              President Tailor hadir di Sukoharjo dengan prinsip dasar tailoring tradisional: tidak ada dua tubuh yang benar-benar sama. Pakaian siap pakai sering kali memaksa tubuh beradaptasi pada standar ukuran massal yang kaku.
            </p>
            <p style={{ color: 'var(--c-text-dark-sub)', lineHeight: 1.7 }}>
              Melalui pengukuran personal langsung dan proses pengerjaan bertahap, kami memastikan setiap helai pakaian memiliki garis bahu yang presisi, lingkar pinggang yang pas, serta jatuhnya kain yang memberikan kenyamanan saat beraktivitas.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--c-surface)',
              border: '1px solid var(--c-border-subtle)',
              borderRadius: 'var(--r-md)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-subtle)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
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
                  01
                </div>
                <div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--c-text-dark)', marginBottom: '0.25rem' }}>
                    Spesialis Pakaian Pria
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--c-text-dark-sub)' }}>
                    Fokus pada 3 layanan utama: jas formal, hem batik, dan celana panjang presisi.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem' }}>
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
                  02
                </div>
                <div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--c-text-dark)', marginBottom: '0.25rem' }}>
                    Ketelitian Ukuran Manual
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--c-text-dark-sub)' }}>
                    Pencatatan rincian anatomi bahu, dada, panjang tangan, hingga kemiringan pesak celana.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem' }}>
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
                  03
                </div>
                <div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--c-text-dark)', marginBottom: '0.25rem' }}>
                    Workshop Nyata di Sukoharjo
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--c-text-dark-sub)' }}>
                    Dapat dikunjungi langsung untuk konsultasi model dan pengukuran tanpa perantara.
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
