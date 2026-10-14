'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BRAND, getWhatsAppUrl } from '@/lib/constants';
import { Scissors, Menu, X, MessageCircle } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo & Tailor Crest */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: 'rgba(197, 160, 89, 0.15)',
              border: '1px solid #C5A059',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D4AF37',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(197, 160, 89, 0.2)',
            }}
          >
            <Scissors size={18} strokeWidth={2} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                color: '#FFFFFF',
                lineHeight: 1.15,
                margin: 0,
                padding: 0,
              }}
            >
              {BRAND.name}
            </span>
            <span
              style={{
                fontSize: '0.625rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                fontWeight: 600,
                marginTop: '0.2rem',
                lineHeight: 1,
              }}
            >
              {BRAND.city} • Atelier Bespoke
            </span>
          </div>
        </Link>

        {/* Essential Navigation Links Only */}
        <nav className="navbar-nav">
          <a href="#layanan" className="navbar-link">
            Layanan
          </a>
          <a href="#galeri" className="navbar-link">
            Galeri Karya
          </a>
          <a href="#kontak" className="navbar-link">
            Lokasi Workshop
          </a>
        </nav>

        {/* WhatsApp Call to Action Button */}
        <div className="navbar-cta">
          <a
            href={getWhatsAppUrl('Halo President Tailor, saya ingin berkonsultasi mengenai pemesanan busana (jas / hem batik / celana panjang).')}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-btn"
          >
            <MessageCircle size={15} />
            <span>Konsultasi WhatsApp</span>
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Buka menu navigasi"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(197, 160, 89, 0.3)',
            borderRadius: 'var(--r-sm)',
            cursor: 'pointer',
            color: '#FFFFFF',
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '76px',
            left: 0,
            right: 0,
            borderTop: '1px solid rgba(197, 160, 89, 0.2)',
            borderBottom: '1px solid rgba(197, 160, 89, 0.3)',
            backgroundColor: '#0C1626',
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
          className="mobile-drawer"
        >
          <a
            href="#layanan"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 500, color: '#FFFFFF', textDecoration: 'none' }}
          >
            Layanan
          </a>
          <a
            href="#galeri"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 500, color: '#FFFFFF', textDecoration: 'none' }}
          >
            Galeri Karya
          </a>
          <a
            href="#kontak"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 500, color: '#FFFFFF', textDecoration: 'none' }}
          >
            Lokasi Workshop
          </a>

          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <a
              href={getWhatsAppUrl('Halo President Tailor, saya ingin berkonsultasi mengenai pemesanan busana.')}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                backgroundColor: '#D4AF37',
                color: '#0C1626',
                borderRadius: 'var(--r-sm)',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={16} />
              <span>Konsultasi WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
