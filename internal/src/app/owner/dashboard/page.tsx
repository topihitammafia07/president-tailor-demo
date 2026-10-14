'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { StatusBadge } from '@/components/Badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { OwnerDashboardData } from '@/types';
import {
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  DollarSign,
  ArrowRight,
  Info,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export default function OwnerDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<OwnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchDashboard = async (start?: string, end?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getOwnerDashboard({ start_date: start, end_date: end });
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat ringkasan eksekutif owner.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'owner') {
        router.push('/dashboard');
        return;
      }
      fetchDashboard();
    }
  }, [user, authLoading, router]);

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDashboard(startDate || undefined, endDate || undefined);
  };

  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    fetchDashboard();
  };

  // Demo data state & actions
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoMessage, setDemoMessage] = useState<string | null>(null);

  const handleSeedDemo = async () => {
    setDemoLoading(true);
    setDemoMessage(null);
    try {
      const res = await api.seedDemoData();
      setDemoMessage(res.message || 'Data demo berhasil dimuat.');
      await fetchDashboard(startDate || undefined, endDate || undefined);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data demo.';
      setError(msg);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleResetDemo = async () => {
    if (typeof window !== 'undefined' && !window.confirm('Apakah Anda yakin ingin mereset seluruh data pesanan & pelanggan demo? Tindakan ini akan mengosongkan transaksi agar siap digunakan untuk pesanan riil.')) {
      return;
    }
    setDemoLoading(true);
    setDemoMessage(null);
    try {
      const res = await api.resetDemoData();
      setDemoMessage(res.message || 'Data demo berhasil direset.');
      await fetchDashboard(startDate || undefined, endDate || undefined);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mereset data demo.';
      setError(msg);
    } finally {
      setDemoLoading(false);
    }
  };

  const formatRupiah = (val: number) => {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
  };

  const formatShortRupiah = (val: number) => {
    if (!val || val === 0) return 'Rp 0';
    if (val >= 1000000) {
      const jt = (val / 1000000).toFixed(1).replace('.0', '');
      return `Rp ${jt}jt`;
    }
    if (val >= 1000) {
      return `Rp ${(val / 1000).toFixed(0)}rb`;
    }
    return `Rp ${val}`;
  };

  if (authLoading || (loading && !data)) {
    return (
      <AppLayout>
        <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          Memuat data analitik bisnis President Tailor...
        </div>
      </AppLayout>
    );
  }

  if (error && !data) {
    return (
      <AppLayout>
        <Card>
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <AlertCircle size={40} color="var(--error)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Kendala Memuat Dashboard Owner
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
            <Button onClick={() => fetchDashboard()}>Coba Muat Ulang</Button>
          </div>
        </Card>
      </AppLayout>
    );
  }

  const m = data?.metrics || {
    total_orders: 0,
    orders_baru: 0,
    orders_diproses: 0,
    orders_selesai: 0,
    total_order_value: 0,
    total_revenue_collected: 0,
    total_outstanding_receivables: 0,
  };

  // Find max value in monthly trends for bar scaling
  const maxMonthlyVal = Math.max(
    ...((data?.monthly_trends || []).map((t) => Math.max(t.order_value, t.payment_collected))),
    1000000
  );

  return (
    <AppLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', margin: 0 }}>
              Dashboard Eksekutif Bisnis
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Monitoring kinerja omzet pesanan, realisasi penerimaan uang kas nyata, dan piutang pelanggan President Tailor.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {m.total_orders === 0 ? (
              <Button
                variant="primary"
                onClick={handleSeedDemo}
                loading={demoLoading}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Sparkles size={16} />
                <span>Muat Data Demo</span>
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={handleResetDemo}
                loading={demoLoading}
                title="Hapus data pesanan demo untuk memulai pencatatan riil"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}
              >
                <RotateCcw size={15} />
                <span>Reset Demo</span>
              </Button>
            )}
            <Button variant="secondary" onClick={() => router.push('/owner/laporan')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              <FileText size={16} />
              <span>Buka Laporan Lengkap</span>
            </Button>
          </div>
        </div>

        {/* Demo Message Banner */}
        {demoMessage && (
          <div style={{
            padding: '0.85rem 1.15rem',
            backgroundColor: '#ECFDF5',
            color: '#065F46',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #A7F3D0',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}>
            <CheckCircle2 size={18} color="#059669" />
            <span style={{ fontWeight: 500 }}>{demoMessage}</span>
          </div>
        )}

        {/* Empty State Callout when total orders is 0 */}
        {m.total_orders === 0 && (
          <Card style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', border: '1px dashed #CBD5E1' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div style={{ maxWidth: '650px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Sparkles size={18} color="var(--primary)" />
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    Database Masih Bersih (Belum Ada Transaksi)
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Belum ada pesanan yang tercatat di database live. Untuk melihat simulasi visual grafik omzet, realisasi kas, dan sebaran 3 jenis layanan (Jas, Hem Batik, Celana Panjang), klik tombol di samping untuk memuat data demo realistis.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={handleSeedDemo}
                loading={demoLoading}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Sparkles size={16} />
                <span>Muat Data Demo Sekarang</span>
              </Button>
            </div>
          </Card>
        )}

        {/* Date Filter Card */}
        <Card style={{ padding: '1rem 1.25rem' }}>
          <form
            onSubmit={handleApplyFilter}
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Calendar size={16} />
              </div>
              <span>Filter Periode:</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Mulai Tanggal
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  minHeight: '38px',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  minHeight: '38px',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Button type="submit" size="sm" loading={loading} style={{ minHeight: '38px', padding: '0 1.15rem' }}>
                Terapkan
              </Button>
              {(startDate || endDate) && (
                <Button type="button" variant="secondary" size="sm" onClick={handleResetFilter} style={{ minHeight: '38px' }}>
                  Reset
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Financial Metrics Row */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem' }}>
            Indikator Keuangan Kunci
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Total Order Value */}
            <Card className="metric-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Total Nilai Pesanan (Omzet)
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.4rem 0 0.2rem', letterSpacing: '-0.03em' }}>
                    {formatRupiah(m.total_order_value)}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Akumulasi seluruh nota pesanan yang disepakati dengan pelanggan.
                  </div>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: '#F1F5F9', color: 'var(--primary)' }}>
                  <TrendingUp size={22} />
                </div>
              </div>
            </Card>

            {/* Total Revenue Collected */}
            <Card className="metric-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Pemasukan Kas Riil (Diterima)
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669', margin: '0.4rem 0 0.2rem', letterSpacing: '-0.03em' }}>
                    {formatRupiah(m.total_revenue_collected)}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Uang kas nyata yang sudah dibayarkan pelanggan (Tunai, Transfer, QRIS).
                  </div>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
                  <CreditCard size={22} />
                </div>
              </div>
            </Card>

            {/* Outstanding Receivables */}
            <Card className="metric-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', color: '#D97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Sisa Piutang (Belum Lunas)
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: m.total_outstanding_receivables > 0 ? '#D97706' : 'var(--text-primary)', margin: '0.4rem 0 0.2rem', letterSpacing: '-0.03em' }}>
                    {formatRupiah(m.total_outstanding_receivables)}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Total tagihan tertahan yang perlu dilunasi saat fitting / ambil.
                  </div>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: '#FFFBEB', color: '#D97706' }}>
                  <DollarSign size={22} />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Financial Transparency Notice */}
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
          }}
        >
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }}>
            <Info size={16} />
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Catatan Transparansi Finansial:</strong> Sistem ini menyajikan pencatatan Arus Kas Masuk (Cash Inflow) & Piutang Pelanggan berdasarkan riwayat transaksi nota buku. Sistem <strong>tidak menghitung Laba Bersih / HPP</strong> karena workshop President Tailor belum mencatat biaya bahan kain, benang, maupun biaya operasional lainnya.
          </div>
        </div>

        {/* Operational Metrics Row */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem' }}>
            Status & Volume Produksi Workshop
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
            <Card className="metric-card" style={{ padding: '1.15rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div className="stat-icon-wrapper" style={{ width: '38px', height: '38px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <ShoppingBag size={19} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Pesanan</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.1rem' }}>{m.total_orders}</div>
                </div>
              </div>
            </Card>

            <Card className="metric-card" style={{ padding: '1.15rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div className="stat-icon-wrapper" style={{ width: '38px', height: '38px', backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                  <AlertCircle size={19} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>Pesanan Baru</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563EB', marginTop: '0.1rem' }}>{m.orders_baru}</div>
                </div>
              </div>
            </Card>

            <Card className="metric-card" style={{ padding: '1.15rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div className="stat-icon-wrapper" style={{ width: '38px', height: '38px', backgroundColor: '#FFFBEB', color: '#D97706' }}>
                  <Clock size={19} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase' }}>Sedang Diproses</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#D97706', marginTop: '0.1rem' }}>{m.orders_diproses}</div>
                </div>
              </div>
            </Card>

            <Card className="metric-card" style={{ padding: '1.15rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div className="stat-icon-wrapper" style={{ width: '38px', height: '38px', backgroundColor: '#ECFDF5', color: '#059669' }}>
                  <CheckCircle2 size={19} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Pesanan Selesai</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: '0.1rem' }}>{m.orders_selesai}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Top Unpaid Receivables Table (Follow-up Cepat Piutang) */}
        {data?.top_unpaid_orders && data.top_unpaid_orders.length > 0 && (
          <Card padding="none" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                  Daftar Tagihan Piutang Tertinggi (Butuh Tindak Lanjut Penagihan)
                </h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem', margin: 0 }}>
                  Pelanggan yang masih memiliki sisa tagihan jahitan belum lunas
                </p>
              </div>

              <Link
                href="/owner/laporan"
                style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
              >
                <span>Buka Semua Tagihan di Laporan</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Nomor</th>
                    <th>Pelanggan</th>
                    <th>Total Nota</th>
                    <th>Sudah Bayar</th>
                    <th>Sisa Piutang</th>
                    <th>Status Jahit</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_unpaid_orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                        <Link href={`/pesanan/${order.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {order.order_number}
                        </Link>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {order.customer_name}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {formatRupiah(order.total_price)}
                      </td>
                      <td style={{ color: '#059669', fontWeight: 600 }}>
                        {formatRupiah(order.total_paid)}
                      </td>
                      <td style={{ color: 'var(--error)', fontWeight: 700 }}>
                        {formatRupiah(order.remaining_bill)}
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          href={`/pesanan/${order.id}`}
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--primary)',
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--primary-light)',
                            textDecoration: 'none',
                            display: 'inline-block',
                          }}
                        >
                          Catat Bayar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Monthly Trend Visual Chart (Ringkas & Hemat Ruang) */}
        <Card style={{ padding: '1.25rem 1.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                  Tren Omzet & Penerimaan Kas Bulanan
                </h2>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--bg)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '999px',
                    border: '1px solid var(--border)',
                  }}
                >
                  6 Bulan Terakhir
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: 0 }}>
                Perbandingan nilai pesanan kontrak vs realisasi kas masuk workshop.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.78rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--primary)', borderRadius: '3px', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Nilai Pesanan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#059669', borderRadius: '3px', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Kas Masuk</span>
              </div>
              <Link
                href="/owner/laporan"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  textDecoration: 'none',
                }}
              >
                <span>Detail Laporan</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Compact Vertical Bar Chart */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '0.75rem',
              alignItems: 'flex-end',
              padding: '1rem 0.25rem 0.5rem 0.25rem',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {(data?.monthly_trends || []).map((trend) => {
              const maxBarHeight = 70; // pixels
              const orderH = Math.max(4, Math.round((trend.order_value / maxMonthlyVal) * maxBarHeight));
              const revenueH = Math.max(4, Math.round((trend.payment_collected / maxMonthlyVal) * maxBarHeight));
              const hasActivity = trend.order_value > 0 || trend.payment_collected > 0;

              return (
                <div
                  key={trend.month}
                  title={`${trend.label}\nNilai Pesanan: ${formatRupiah(trend.order_value)}\nKas Masuk: ${formatRupiah(trend.payment_collected)}\nPesanan: ${trend.order_count}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'default',
                  }}
                >
                  {/* Bars container */}
                  <div
                    style={{
                      height: `${maxBarHeight}px`,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      gap: '5px',
                    }}
                  >
                    {/* Order bar */}
                    <div
                      style={{
                        width: '12px',
                        height: `${orderH}px`,
                        backgroundColor: hasActivity ? 'var(--primary)' : '#E2E8F0',
                        borderRadius: '3px 3px 0 0',
                        transition: 'height 0.3s ease',
                      }}
                    />
                    {/* Revenue bar */}
                    <div
                      style={{
                        width: '12px',
                        height: `${revenueH}px`,
                        backgroundColor: hasActivity ? '#059669' : '#E2E8F0',
                        borderRadius: '3px 3px 0 0',
                        transition: 'height 0.3s ease',
                      }}
                    />
                  </div>

                  {/* Label & Value */}
                  <div style={{ textAlign: 'center', width: '100%', paddingTop: '0.25rem' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: hasActivity ? 700 : 500,
                        color: hasActivity ? 'var(--text-primary)' : 'var(--text-muted)',
                      }}
                    >
                      {trend.label.split(' ')[0]}
                    </div>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: hasActivity ? '#059669' : 'var(--text-muted)',
                        marginTop: '0.1rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {hasActivity ? formatShortRupiah(trend.payment_collected) : '-'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
