'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { OwnerReportData } from '@/types';
import {
  Calendar,
  CreditCard,
  AlertCircle,
  Scissors,
  ArrowLeft,
} from 'lucide-react';
import { Pagination } from '@/components/Pagination';

export default function OwnerReportPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [report, setReport] = useState<OwnerReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [unpaidPage, setUnpaidPage] = useState(1);

  const fetchReports = async (start?: string, end?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getOwnerReports({ start_date: start, end_date: end });
      setReport(res);
      if (res.period) {
        setStartDate(res.period.start_date);
        setEndDate(res.period.end_date);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat rekap laporan bisnis.';
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
      fetchReports();
    }
  }, [user, authLoading, router]);

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports(startDate || undefined, endDate || undefined);
  };

  const formatRupiah = (val: number) => {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
  };

  if (authLoading || (loading && !report)) {
    return (
      <AppLayout>
        <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          Memuat rekap laporan bisnis dari basis data...
        </div>
      </AppLayout>
    );
  }

  if (error && !report) {
    return (
      <AppLayout>
        <Card>
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <AlertCircle size={40} color="var(--error)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Kendala Memuat Laporan Bisnis
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
            <Button onClick={() => fetchReports()}>Coba Muat Ulang</Button>
          </div>
        </Card>
      </AppLayout>
    );
  }

  const s = report?.summary || {
    total_orders: 0,
    total_order_value: 0,
    payments_collected: 0,
    total_outstanding_receivables: 0,
  };

  return (
    <AppLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Navigation & Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <button
                onClick={() => router.push('/owner/dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  padding: 0,
                }}
              >
                <ArrowLeft size={16} style={{ marginRight: '0.25rem' }} />
                Kembali ke Dashboard
              </button>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
              Laporan Kinerja Bisnis
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Rekapitulasi pesanan, klasifikasi jenis jahitan, dan penerimaan kas aktual berdasarkan periode.
            </p>
          </div>
        </div>

        {/* Date Filter Card */}
        <Card style={{ padding: '1rem 1.25rem' }}>
          <form onSubmit={handleApplyFilter} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Calendar size={16} />
              </div>
              <span>Rentang Periode Laporan:</span>
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

            <Button type="submit" size="sm" loading={loading} style={{ minHeight: '38px', padding: '0 1.25rem' }}>
              Terapkan Periode
            </Button>
          </form>
        </Card>

        {/* Financial Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <Card className="metric-card" style={{ padding: '1.25rem 1.35rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Total Pesanan Dibuat
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.35rem 0 0.15rem', letterSpacing: '-0.02em' }}>
              {s.total_orders} Pesanan
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Dalam periode terpilih
            </div>
          </Card>

          <Card className="metric-card" style={{ padding: '1.25rem 1.35rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Total Nilai Pesanan
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary)', margin: '0.35rem 0 0.15rem', letterSpacing: '-0.02em' }}>
              {formatRupiah(s.total_order_value)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Nilai komitmen kontrak jahit
            </div>
          </Card>

          <Card className="metric-card" style={{ padding: '1.25rem 1.35rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Pemasukan Kas Diterima
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#059669', margin: '0.35rem 0 0.15rem', letterSpacing: '-0.02em' }}>
              {formatRupiah(s.payments_collected)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Realisasi pembayaran masuk
            </div>
          </Card>

          <Card className="metric-card" style={{ padding: '1.25rem 1.35rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Sisa Tagihan Belum Lunas
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: s.total_outstanding_receivables > 0 ? '#D97706' : '#64748B', margin: '0.35rem 0 0.15rem', letterSpacing: '-0.02em' }}>
              {formatRupiah(s.total_outstanding_receivables)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Piutang pesanan periode ini
            </div>
          </Card>
        </div>

        {/* Breakdown by Service Type (Jas, Hem Batik, Celana Panjang) */}
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Scissors size={18} />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Rekapitulasi Berdasarkan Jenis Jahitan
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {(report?.service_breakdown || []).map((srv) => (
              <div
                key={srv.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem 1.35rem',
                  backgroundColor: '#F8FAFC',
                }}
              >
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>{srv.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.85rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Jumlah Potong Pakaian:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{srv.item_count} potong</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.35rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Jumlah Pesanan Terkait:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{srv.order_count} pesanan</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Breakdown by Payment Status */}
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <CreditCard size={18} />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Distribusi Status Pelunasan Pesanan
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.15rem 1.25rem', border: '1px solid #BBF7D0', borderRadius: 'var(--radius-md)', backgroundColor: '#F0FDF4' }}>
              <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>LUNAS</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#166534', margin: '0.35rem 0 0.15rem' }}>
                {report?.payment_status_breakdown.lunas || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#166534' }}>Pesanan dibayar penuh</div>
            </div>

            <div style={{ padding: '1.15rem 1.25rem', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)', backgroundColor: '#FEFCE8' }}>
              <div style={{ fontSize: '0.75rem', color: '#854D0E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>SEBAGIAN (DP)</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#854D0E', margin: '0.35rem 0 0.15rem' }}>
                {report?.payment_status_breakdown.sebagian || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#854D0E' }}>Pesanan telah bayar uang muka</div>
            </div>

            <div style={{ padding: '1.15rem 1.25rem', border: '1px solid #FECDD3', borderRadius: 'var(--radius-md)', backgroundColor: '#FFF1F2' }}>
              <div style={{ fontSize: '0.75rem', color: '#9F1239', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>BELUM DIBAYAR</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#9F1239', margin: '0.35rem 0 0.15rem' }}>
                {report?.payment_status_breakdown.belum_dibayar || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9F1239' }}>Pesanan belum ada pembayaran</div>
            </div>
          </div>
        </Card>

        {/* Unpaid / Outstanding Orders Table */}
        <Card padding="none" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                Daftar Piutang & Pesanan Belum Lunas
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem', margin: 0 }}>
                Arsip pesanan yang masih memiliki sisa tagihan untuk monitoring tindak lanjut penyerahan pakaian.
              </p>
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Total: {(report?.unpaid_orders || []).length} Pesanan
            </span>
          </div>

          {(report?.unpaid_orders || []).length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Seluruh pesanan pada periode ini telah terlunasi secara penuh.
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>No. Pesanan</th>
                    <th>Pelanggan</th>
                    <th>Status Jahit</th>
                    <th>Total Biaya</th>
                    <th>Terbayar</th>
                    <th>Sisa Tagihan</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {(report?.unpaid_orders || [])
                    .slice((unpaidPage - 1) * 15, unpaidPage * 15)
                    .map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                        <Link href={`/pesanan/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {item.order_number}
                        </Link>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.customer_name}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            backgroundColor:
                              item.status === 'selesai'
                                ? '#ECFDF5'
                                : item.status === 'diproses'
                                ? '#FFFBEB'
                                : '#EFF6FF',
                            color:
                              item.status === 'selesai'
                                ? '#059669'
                                : item.status === 'diproses'
                                ? '#D97706'
                                : '#2563EB',
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {formatRupiah(item.total_price)}
                      </td>
                      <td style={{ color: '#059669', fontWeight: 600 }}>
                        {formatRupiah(item.total_paid)}
                      </td>
                      <td style={{ fontWeight: 700, color: '#D97706' }}>
                        {formatRupiah(item.remaining_bill)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => router.push(`/pesanan/${item.id}`)}
                          style={{
                            backgroundColor: 'var(--primary-light)',
                            border: 'none',
                            color: 'var(--primary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          Lihat Pesanan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination for unpaid orders (Max 15 items per page) */}
            <Pagination
              currentPage={unpaidPage}
              lastPage={Math.ceil((report?.unpaid_orders?.length || 0) / 15) || 1}
              total={report?.unpaid_orders?.length || 0}
              perPage={15}
              onPageChange={(newPage) => setUnpaidPage(newPage)}
              loading={loading}
            />
            </>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
