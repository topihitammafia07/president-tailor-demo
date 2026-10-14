import React from 'react';
import { FaqAccordion } from '@/components/FaqAccordion';
import { getWhatsAppUrl } from '@/lib/constants';

export function FaqSection() {
  const waUrl = getWhatsAppUrl(
    'Halo President Tailor, saya memiliki pertanyaan seputar jasa jahit yang belum tercantum di FAQ.'
  );

  return (
    <section id="faq" className="section section-creme" style={{ borderBottom: '1px solid var(--c-border-subtle)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Pertanyaan Umum</span>
          <h2 className="heading-serif section-title">
            Hal yang Sering Ditanyakan Calon Pelanggan
          </h2>
          <p className="section-subtitle" style={{ color: 'var(--c-text-dark-sub)' }}>
            Jawaban lugas seputar proses jahit, pemilihan model, pengukuran, dan estimasi waktu di President Tailor Sukoharjo.
          </p>
        </div>

        <FaqAccordion />

        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <p style={{ fontSize: '0.9375rem', color: 'var(--c-text-dark-sub)', marginBottom: '1rem' }}>
            Punya pertanyaan spesifik mengenai bahan atau tanggal acara Anda?
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ padding: '0.75rem 1.75rem' }}
          >
            Tanyakan Langsung via WhatsApp &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
