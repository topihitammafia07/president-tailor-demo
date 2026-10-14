import React from 'react';
import Image from 'next/image';
import { getWhatsAppUrl } from '@/lib/constants';
import { ArrowRight, MessageCircle, Scissors } from 'lucide-react';

export function GallerySection() {
  const waUrl = getWhatsAppUrl(
    'Halo President Tailor, saya ingin melihat referensi contoh jahitan dan konsultasi model pakaian.'
  );

  const galleryItems = [
    {
      category: 'Kategori Jas',
      title: 'Setelan Jas Formal Single-Breasted',
      desc: 'Konstruksi bahu presisi dengan dua kancing depan, rolled lapel berkarakter, dan saku saku simetris.',
      image: '/images/service-jas.jpg',
      tag: 'Koleksi Jas',
    },
    {
      category: 'Kategori Batik',
      title: 'Hem Batik Pola Parang Presisi',
      desc: 'Penyambungan motif simetris di bagian plaket kancing dada dan saku tempel tersamar rapi.',
      image: '/images/service-batik.jpg',
      tag: 'Koleksi Batik',
    },
    {
      category: 'Kategori Celana',
      title: 'Celana Formal Wool-Blend & Side Adjusters',
      desc: 'Jatuhnya pipa celana bersih dengan lipatan vertikal tegas dan kenyamanan pesak melangkah.',
      image: '/images/service-celana.jpg',
      tag: 'Koleksi Celana',
    },
    {
      category: 'Fitting & Ukuran',
      title: 'Sesi Pengukuran Anatomi Personal',
      desc: 'Pencatatan lebih dari 15 titik ukur tubuh untuk memastikan pakaian menyatu alami dengan postur fisik.',
      image: '/images/gallery-fitting.jpg',
      tag: 'Proses Fitting',
    },
    {
      category: 'Craftsmanship',
      title: 'Jahitan Tangan & Milanese Stitching',
      desc: 'Detail tusuk jelujur dan jahitan tangan halus menggunakan benang sutra pilihan pada garis lapel.',
      image: '/images/gallery-craftsmanship.jpg',
      tag: 'Detail Atelier',
    },
    {
      category: 'Atelier Workshop',
      title: 'Meja Potong & Pola Tradisional',
      desc: 'Pola kertas digambar khusus untuk tiap pelanggan di workshop Sukoharjo sebelum kain digunting.',
      image: '/images/hero-atelier.jpg',
      tag: 'Workshop Sukoharjo',
    },
  ];

  return (
    <section id="galeri" className="section section-creme" style={{ borderBottom: '1px solid var(--c-border-subtle)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Etalase Karya & Siluet</span>
          <h2 className="heading-serif section-title">
            Galeri Konsep & Referensi Jahitan
          </h2>
          <p className="section-subtitle" style={{ color: 'var(--c-text-dark-sub)' }}>
            Eksplorasi referensi model dan standar kerapian yang dapat Anda diskusikan bersama penjahit di workshop kami.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '3.5rem',
          }}
        >
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
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
                  height: '240px',
                  backgroundColor: 'var(--c-card-dark)',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(12, 22, 38, 0.7) 0%, transparent 60%)',
                  }}
                />

                {/* Tag Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: 'rgba(12, 22, 38, 0.85)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(212, 175, 55, 0.5)',
                    color: 'var(--c-gold)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--r-sm)',
                  }}
                >
                  {item.tag}
                </div>

                {/* Subtitle overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    left: '1rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--c-gold-light)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Scissors size={12} />
                    <span>{item.category}</span>
                  </span>
                </div>
              </div>

              {/* Text Description */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 className="heading-serif" style={{ fontSize: '1.1875rem', color: 'var(--c-text-dark)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--c-text-dark-sub)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {item.desc}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--c-border-subtle)', paddingTop: '1rem' }}>
                  <a
                    href={getWhatsAppUrl(`Halo President Tailor, saya tertarik berkonsultasi mengenai referensi ${item.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--c-gold-dark)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <span>Konsultasi Model Ini via WA</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bring Your Own Reference Callout */}
        <div
          style={{
            textAlign: 'center',
            backgroundColor: 'var(--c-surface)',
            border: '1px solid var(--c-border-subtle)',
            padding: '2.5rem 2rem',
            borderRadius: 'var(--r-md)',
            maxWidth: '760px',
            margin: '0 auto',
            boxShadow: 'var(--shadow-subtle)',
          }}
        >
          <h3 className="heading-serif" style={{ fontSize: '1.5rem', color: 'var(--c-text-dark)', marginBottom: '0.75rem' }}>
            Memiliki Referensi Model Sendiri?
          </h3>
          <p style={{ fontSize: '0.9375rem', color: 'var(--c-text-dark-sub)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Bawa foto potongan jas, kemeja batik, atau celana yang Anda inginkan dari katalog maupun internet. Kami akan menelaah kesesuaian potongan tersebut dengan karakteristik tubuh dan bahan Anda.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem' }}
          >
            <MessageCircle size={16} />
            <span>Kirim Foto Referensi via WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
