import React from 'react';
import { Layers, Scissors, ShieldCheck, Ruler } from 'lucide-react';

export function DetailsCraftSection() {
  const details = [
    {
      icon: Scissors,
      title: 'Kerapian Kerah & Lapel',
      desc: 'Kerah kemeja atau lapel jas dibentuk dengan kain keras berkualitas agar tetap tegak dan tidak melekuk kendur setelah dicuci.',
    },
    {
      icon: Ruler,
      title: 'Kupnat & Garis Potongan Tubuh',
      desc: 'Penempatan kupnat depan dan belakang disesuaikan dengan kurva punggung dan dada agar pakaian tidak menggelembung.',
    },
    {
      icon: ShieldCheck,
      title: 'Saku Paspol & Saku Tempel Presisi',
      desc: 'Bukaan saku dijahit rata dan kokoh dengan jahitan pengunci di setiap ujung sudut agar tidak mudah robek.',
    },
    {
      icon: Layers,
      title: 'Kerapian Jahitan Tepi & Furing',
      desc: 'Bagian dalam pakaian dikerjakan sama rapinya dengan bagian luar, memberikan kenyamanan sentuhan langsung pada kulit Anda.',
    },
  ];

  return (
    <section className="section section-dark" style={{ borderBottom: '1px solid var(--c-slate)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Ketelitian Pengerjaan</span>
          <h2 className="heading-serif section-title" style={{ color: '#FFFFFF' }}>
            Detail yang Menentukan Kualitas Akhir
          </h2>
          <p className="section-subtitle" style={{ color: 'var(--c-text-light-sub)' }}>
            Kualitas sebuah pakaian terlihat dari elemen-elemen kecil yang dikerjakan secara cermat, presisi, dan sabar.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem',
          }}
        >
          {details.map((d, idx) => {
            const Icon = d.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--c-card-dark)',
                  border: '1px solid var(--c-slate)',
                  borderRadius: 'var(--r-md)',
                  padding: '2.25rem',
                  borderTop: '3px solid var(--c-gold)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--r-sm)',
                    backgroundColor: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--c-gold)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Icon size={20} />
                </div>

                <h3
                  className="heading-serif"
                  style={{
                    fontSize: '1.25rem',
                    color: '#FFFFFF',
                    marginBottom: '0.875rem',
                    lineHeight: 1.3,
                  }}
                >
                  {d.title}
                </h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--c-text-light-sub)', lineHeight: 1.6, margin: 0 }}>
                  {d.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
