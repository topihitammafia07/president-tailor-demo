'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  X,
  PlusCircle,
  UserPlus,
  BookOpen,
  Scissors,
  ExternalLink,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile drawer on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isOwner = user?.role === 'owner' || pathname.startsWith('/owner');

  const navGroups: NavGroup[] = isOwner
    ? [
        {
          title: 'Eksekutif & Keuangan',
          items: [
            { label: 'Dashboard Eksekutif', href: '/owner/dashboard', icon: TrendingUp },
            { label: 'Laporan Bisnis & Jasa', href: '/owner/laporan', icon: FileText },
          ],
        },
        {
          title: 'Operasional Workshop',
          items: [
            { label: 'Antrean Staf Workshop', href: '/dashboard', icon: LayoutDashboard },
            { label: 'Kelola Semua Pesanan', href: '/pesanan', icon: ShoppingBag },
            { label: 'Data Pelanggan', href: '/pelanggan', icon: Users },
          ],
        },
        {
          title: 'Aksi Cepat',
          items: [
            { label: 'Buat Pesanan Baru', href: '/pesanan/baru', icon: PlusCircle },
            { label: 'Tambah Pelanggan', href: '/pelanggan/baru', icon: UserPlus },
          ],
        },
        {
          title: 'Bantuan & SOP',
          items: [
            { label: 'Infografis Alur Kerja', href: '/panduan', icon: BookOpen },
          ],
        },
      ]
    : [
        {
          title: 'Navigasi Utama',
          items: [
            { label: 'Dashboard Operasional', href: '/dashboard', icon: LayoutDashboard },
            { label: 'Kelola Pesanan', href: '/pesanan', icon: ShoppingBag },
            { label: 'Data Pelanggan', href: '/pelanggan', icon: Users },
          ],
        },
        {
          title: 'Aksi Cepat Workshop',
          items: [
            { label: 'Buat Pesanan Baru', href: '/pesanan/baru', icon: PlusCircle },
            { label: 'Tambah Pelanggan', href: '/pelanggan/baru', icon: UserPlus },
          ],
        },
        {
          title: 'Bantuan & SOP',
          items: [
            { label: 'Infografis Alur Kerja', href: '/panduan', icon: BookOpen },
          ],
        },
      ];

  const getPageTitle = () => {
    if (pathname.startsWith('/owner/dashboard')) return 'Dashboard Eksekutif Bisnis';
    if (pathname.startsWith('/owner/laporan')) return 'Laporan Finansial & Omzet';
    if (pathname.startsWith('/pesanan/baru')) return 'Buat Pesanan Baru';
    if (pathname.startsWith('/pesanan/')) return 'Detail Buku Pesanan';
    if (pathname.startsWith('/pesanan')) return 'Kelola Semua Pesanan';
    if (pathname.startsWith('/pelanggan/baru')) return 'Pendaftaran Pelanggan Baru';
    if (pathname.startsWith('/pelanggan/')) return 'Detail Profil Pelanggan';
    if (pathname.startsWith('/pelanggan')) return 'Database Pelanggan';
    if (pathname.startsWith('/panduan')) return 'Infografis SOP Workshop';
    return 'Dashboard Operasional Workshop';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      {/* Sleek Dark Luxury Atelier Sidebar */}
      <aside
        className={`no-print sidebar-layout ${mobileMenuOpen ? 'open' : ''}`}
        style={{
          width: '264px',
          backgroundColor: '#0C1626',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 40,
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Brand Crest Header */}
        <div
          style={{
            padding: '1.25rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'rgba(197, 160, 89, 0.16)',
                border: '1px solid rgba(197, 160, 89, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D4AF37',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Scissors size={19} strokeWidth={2.2} />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                  letterSpacing: '0.02em',
                  fontFamily: 'Georgia, serif',
                }}
              >
                President Tailor
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: '#C5A059',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginTop: '0.15rem',
                }}
              >
                {isOwner ? 'Executive Console' : 'Workshop Console'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Tutup menu"
            style={{
              display: 'none',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
            }}
            className="mobile-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Grouped Navigation Links */}
        <nav
          style={{
            padding: '1.25rem 0.85rem',
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#64748B',
                  padding: '0.25rem 0.65rem',
                }}
              >
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 0.85rem',
                      minHeight: '40px',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#F1E3C3' : '#94A3B8',
                      backgroundColor: isActive ? 'rgba(197, 160, 89, 0.14)' : 'transparent',
                      border: isActive ? '1px solid rgba(197, 160, 89, 0.35)' : '1px solid transparent',
                      transition: 'all 0.15s ease',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.color = '#FFFFFF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#94A3B8';
                      }
                    }}
                  >
                    <Icon
                      size={17}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      color={isActive ? '#D4AF37' : '#94A3B8'}
                    />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          padding: '0.1rem 0.45rem',
                          borderRadius: '999px',
                          backgroundColor: '#D4AF37',
                          color: '#0C1626',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card & Logout Footer */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            flexShrink: 0,
            backgroundColor: '#080E1A',
          }}
        >
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(197, 160, 89, 0.2)',
                border: '1px solid #C5A059',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D4AF37',
                fontWeight: 700,
                fontSize: '0.85rem',
                flexShrink: 0,
              }}
            >
              {mounted && user?.name ? user.name.charAt(0).toUpperCase() : (isOwner ? 'O' : 'S')}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {mounted && user?.name ? user.name : (isOwner ? 'Owner President Tailor' : 'Staf Workshop')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                <span
                  style={{
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '999px',
                    backgroundColor: isOwner ? '#FEF3C7' : 'rgba(56, 189, 248, 0.15)',
                    color: isOwner ? '#92400E' : '#38BDF8',
                    border: isOwner ? '1px solid #FDE68A' : '1px solid rgba(56, 189, 248, 0.3)',
                  }}
                >
                  {isOwner ? 'Owner' : 'Staf'}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: '#64748B',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {mounted && user?.email ? user.email : (isOwner ? 'owner@presidenttailor.com' : 'Sesi Aktif')}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.85rem',
              minHeight: '38px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#F87171',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.color = '#EF4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
              e.currentTarget.style.color = '#F87171';
            }}
          >
            <LogOut size={15} />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className="main-content-layout"
        style={{ flex: 1, marginLeft: '264px', display: 'flex', flexDirection: 'column', minWidth: 0 }}
      >
        {/* Desktop Top Header Bar */}
        <header
          className="no-print"
          style={{
            height: '64px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          {/* Breadcrumb / Section Context */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              style={{
                display: 'none',
                minWidth: '40px',
                minHeight: '40px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="mobile-toggle"
            >
              <Menu size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--gold-dark)',
                  backgroundColor: 'var(--gold-light)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  border: '1px solid var(--gold-border)',
                }}
              >
                President Tailor
              </span>
              <span style={{ color: 'var(--border)' }}>/</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {getPageTitle()}
              </span>
            </div>
          </div>

          {/* Right Header Status / Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                backgroundColor: '#FFFFFF',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              title="Buka Website Landing Publik di tab baru"
            >
              <span>Website Publik</span>
              <ExternalLink size={13} color="var(--text-muted)" />
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
              <ShieldCheck size={16} color="var(--gold-dark)" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {mounted && isOwner ? 'Konsol Owner' : 'Staf Workshop'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content with Generous Margins & Clean Layout */}
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
