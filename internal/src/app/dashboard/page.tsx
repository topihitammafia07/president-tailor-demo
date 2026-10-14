'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/AppLayout';
import { Card, EmptyState, ErrorAlert, LoadingSpinner } from '@/components/Card';
import { Button } from '@/components/Button';
import { StatusBadge } from '@/components/Badge';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { DashboardSummary } from '@/types';
import {
  TrendingUp,
  ArrowRight,
  UserPlus,
  Plus,
  ShoppingBag,
  Clock,
  Scissors,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await api.getDashboardSummary();
      setData(summary);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal memuat ringkasan dashboard.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const formatRupiah = (val: number) => {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
  };

  return (
    <AppLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {user?.role === 'owner' && (
          <div
            style={{
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, #0C1626 0%, #17243B 100%)',
              border: '1px solid rgba(197, 160, 89, 0.35)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(197, 160, 89, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold)',
                  border: '1px solid rgba(197, 160, 89, 0.3)',
                }}
              >
                <TrendingUp size={20} />
              </div>
              <div>
                <strong style={{ color: '#F8FAFC', fontSize: '0.95rem', display: 'block', letterSpacing: '-0.01em' }}>
                  Akses Owner Terbuka (Tinjauan Operasional Staf)
                </strong>
                <span style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>
                  Halaman ini menampilkan antrean jahit dan pencatatan operasional harian. Untuk melihat analitik omzet kas & piutang, buka Dashboard Eksekutif.
                </span>
              </div>
            </div>
            <Link
              href="/owner/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#0C1626',
                backgroundColor: 'var(--gold)',
                padding: '0.55rem 1.15rem',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(197, 160, 89, 0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Dashboard Eksekutif</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {/* Top Header & Fast Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', margin: 0 }}>
              Operasional Workshop
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Pusat pencatatan pelanggan, antrean pola jahit, pembuatan pesanan, cetak nota, dan pelunasan.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/pelanggan/baru">
              <Button variant="secondary" size="md">
                <UserPlus size={16} style={{ marginRight: '0.45rem' }} />
                <span>Pelanggan Baru</span>
              </Button>
            </Link>
            <Link href="/pesanan/baru">
              <Button size="md">
                <Plus size={16} style={{ marginRight: '0.45rem' }} />
                <span>Buat Pesanan</span>
              </Button>
            </Link>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={loadSummary} />}

        {loading ? (
          <LoadingSpinner text="Memuat data operasional workshop..." />
        ) : (
          data && (
            <>
              {/* 5 Metrik Operasional Atelier */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: '1rem',
                }}
              >
                {/* Total Pesanan */}
                <Card className="metric-card" style={{ padding: '1.25rem 1.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Total Pesanan
                      </div>
                      <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.35rem 0 0.15rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                        {data.counts.total}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Semua arsip nota buku
                      </div>
                    </div>
                    <div className="stat-icon-wrapper" style={{ backgroundColor: '#F1F5F9', color: 'var(--primary)' }}>
                      <ShoppingBag size={20} />
                    </div>
                  </div>
                </Card>

                {/* Antrean Baru */}
                <Card className="metric-card" style={{ padding: '1.25rem 1.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Antrean Baru
                      </div>
                      <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#1D4ED8', margin: '0.35rem 0 0.15rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                        {data.counts.baru}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Kain belum dipotong
                      </div>
                    </div>
                    <div className="stat-icon-wrapper" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                      <Clock size={20} />
                    </div>
                  </div>
                </Card>

                {/* Sedang Diproses */}
                <Card className="metric-card" style={{ padding: '1.25rem 1.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Sedang Diproses
                      </div>
                      <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#D97706', margin: '0.35rem 0 0.15rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                        {data.counts.diproses}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Pola potong & jahit
                      </div>
                    </div>
                    <div className="stat-icon-wrapper" style={{ backgroundColor: '#FFFBEB', color: '#D97706' }}>
                      <Scissors size={20} />
                    </div>
                  </div>
                </Card>

                {/* Selesai Jahit */}
                <Card className="metric-card" style={{ padding: '1.25rem 1.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Selesai Jahit
                      </div>
                      <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#059669', margin: '0.35rem 0 0.15rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                        {data.counts.selesai}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Siap fitting / ambil
                      </div>
                    </div>
                    <div className="stat-icon-wrapper" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
                      <CheckCircle2 size={20} />
                    </div>
                  </div>
                </Card>

                {/* Belum Lunas */}
                <Card className="metric-card" style={{ padding: '1.25rem 1.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Belum Lunas
                      </div>
                      <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#DC2626', margin: '0.35rem 0 0.15rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                        {data.counts.belum_lunas ?? 0}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Ada sisa tagihan piutang
                      </div>
                    </div>
                    <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                      <AlertCircle size={20} />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Orders Section with Clean Luxury Table */}
              <Card padding="none" style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                      Pesanan Terbaru Masuk
                    </h2>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem', margin: 0 }}>
                      8 transaksi terakhir beserta status progres jahitan dan posisi pelunasan kas
                    </p>
                  </div>
                  <Link
                    href="/pesanan"
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Buka Semua Pesanan</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>

                {data.recent_orders.length === 0 ? (
                  <div style={{ padding: '2.5rem 1.5rem' }}>
                    <EmptyState
                      title="Belum Ada Pesanan"
                      message="Belum ada pesanan yang tercatat di sistem buku digital workshop."
                      action={
                        <Link href="/pesanan/baru">
                          <Button size="sm">+ Buat Pesanan Baru</Button>
                        </Link>
                      }
                    />
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="clean-table">
                      <thead>
                        <tr>
                          <th>Nomor Nota</th>
                          <th>Pelanggan</th>
                          <th>Layanan</th>
                          <th>Total Biaya</th>
                          <th>Status Jahit</th>
                          <th>Status Bayar</th>
                          <th style={{ textAlign: 'right' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recent_orders.map((order) => {
                          const servicesList = order.items
                            ? order.items.map((i) => `${i.service_type?.name || 'Pakaian'} (${i.quantity})`).join(', ')
                            : '-';

                          const payStatus = order.payment_status || 'belum_dibayar';
                          const isLunas = payStatus === 'lunas';
                          const isDP = payStatus === 'sebagian';
                          const remaining = Number(order.remaining_bill ?? (order.total_price - (order.total_paid || 0)));

                          return (
                            <tr key={order.id}>
                              <td style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                                <Link href={`/pesanan/${order.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                  {order.order_number}
                                </Link>
                              </td>
                              <td>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.customer_name_snapshot}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {order.customer_address_snapshot || '-'}
                                </div>
                              </td>
                              <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', maxWidth: '220px' }}>
                                {servicesList}
                              </td>
                              <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                {formatRupiah(order.total_price)}
                              </td>
                              <td>
                                <StatusBadge status={order.status} />
                              </td>
                              <td>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '999px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.02em',
                                    backgroundColor: isLunas ? '#DCFCE7' : isDP ? '#FEF3C7' : '#FEE2E2',
                                    color: isLunas ? '#166534' : isDP ? '#92400E' : '#991B1B',
                                  }}
                                >
                                  {isLunas ? 'Lunas' : isDP ? 'DP (Sebagian)' : 'Belum Bayar'}
                                </span>
                                {!isLunas && remaining > 0 && (
                                  <div style={{ fontSize: '0.725rem', color: 'var(--error)', marginTop: '0.2rem', fontWeight: 600 }}>
                                    Sisa: {formatRupiah(remaining)}
                                  </div>
                                )}
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                                  <Link
                                    href={`/pesanan/${order.id}`}
                                    style={{
                                      fontSize: '0.8rem',
                                      fontWeight: 600,
                                      color: 'var(--primary)',
                                      padding: '0.35rem 0.7rem',
                                      borderRadius: 'var(--radius-sm)',
                                      backgroundColor: 'var(--primary-light)',
                                      textDecoration: 'none',
                                      transition: 'background-color 0.15s ease',
                                    }}
                                  >
                                    Detail & Bayar
                                  </Link>
                                  <Link
                                    href={`/pesanan/${order.id}/nota`}
                                    target="_blank"
                                    style={{
                                      fontSize: '0.8rem',
                                      fontWeight: 500,
                                      color: 'var(--text-secondary)',
                                      padding: '0.35rem 0.6rem',
                                      borderRadius: 'var(--radius-sm)',
                                      border: '1px solid var(--border)',
                                      backgroundColor: '#FFFFFF',
                                      textDecoration: 'none',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.25rem',
                                    }}
                                  >
                                    <FileText size={13} />
                                    <span>Nota</span>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </>
          )
        )}
      </div>
    </AppLayout>
  );
}

