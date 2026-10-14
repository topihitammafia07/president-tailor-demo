import React from 'react';
import { getWhatsAppUrl } from '@/lib/constants';

export function WhatsAppFloatingButton() {
  const waUrl = getWhatsAppUrl('Halo President Tailor, saya ingin berkonsultasi mengenai pemesanan pakaian.');

  return (
    <aside
      aria-label="Tombol cepat WhatsApp"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99,
      }}
    >
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp dengan President Tailor"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          minWidth: '52px',
          minHeight: '52px',
          padding: '0.75rem 1.25rem',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          borderRadius: '9999px',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.9375rem',
          transition: 'all 0.25s ease',
        }}
        className="wa-floating-btn"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span className="wa-text">Konsultasi WhatsApp</span>
      </a>
    </aside>
  );
}
