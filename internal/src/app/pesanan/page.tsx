'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/AppLayout';
import { Card, EmptyState, ErrorAlert, LoadingSpinner } from '@/components/Card';
import { Button } from '@/components/Button';
import { StatusBadge } from '@/components/Badge';
import { Pagination } from '@/components/Pagination';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { ShoppingBag, Plus, Search, FileText, ArrowRight } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async (statusVal = '', query = '', pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getOrders({
        status: statusVal || undefined,
        q: query || undefined,
        page: pageNum,
        per_page: 15,
      });
      setOrders(res.data || []);
      if (res.meta) {
        setMeta({
          current_page: res.meta.current_page,
          last_page: res.meta.last_page,
          total: res.meta.total,
          per_page: res.meta.per_page,
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal memuat daftar pesanan.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      loadOrders(statusFilter, search, page);
    }, 250);

    return () => clearTimeout(handler);
  }, [statusFilter, search, page, loadOrders]);

  const handleFilterChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const filterTabs = [
    { label: 'Semua Status', value: '' },
    { label: 'Baru', value: 'baru' },
    { label: 'Diproses', value: 'diproses' },
    { label: 'Selesai', value: 'selesai' },
  ];

  const formatRupiah = (val: number) => {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
  };

  return (
    <AppLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Header */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                }}
              >
                <ShoppingBag size={18} />
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                Kelola Semua Pesanan
              </h1>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              Buku digital pencatatan pesanan, ukuran jahitan, nota cetak, dan progres produksi
            </p>
          </div>

          <Link href="/pesanan/baru">
            <Button size="md" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 2px 4px rgba(30, 58, 95, 0.15)' }}>
              <Plus size={16} />
              <span>Buat Pesanan Baru</span>
            </Button>
          </Link>
        </div>

        {error && <ErrorAlert message={error} onRetry={() => loadOrders(statusFilter, search, page)} />}

        {/* Filter and Search Bar */}
        <Card style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              {/* Status Tabs */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {filterTabs.map((tab) => {
                  const isActive = statusFilter === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => handleFilterChange(tab.value)}
                      style={{
                        padding: '0.45rem 1rem',
                        minHeight: '36px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8125rem',
                        fontWeight: isActive ? 700 : 500,
                        backgroundColor: isActive ? 'var(--primary)' : '#FFFFFF',
                        color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                        border: isActive ? '1px solid var(--primary)' : '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Total Summary */}
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Total:{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{meta.total}</strong> Pesanan
              </div>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Cari nomor nota (PT-...) atau nama pelanggan..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  fontSize: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  minHeight: '42px',
                }}
              />
            </div>
          </div>
        </Card>

        {/* Orders Table */}
        <Card padding="none" style={{ overflow: 'hidden' }}>
          {loading && orders.length === 0 ? (
            <div style={{ padding: '3rem 1rem' }}>
              <LoadingSpinner text="Memuat daftar pesanan..." />
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '2.5rem 1rem' }}>
              <EmptyState
                title={search || statusFilter ? 'Pesanan Tidak Ditemukan' : 'Belum Ada Pesanan'}
                message={
                  search || statusFilter
                    ? 'Tidak ada pesanan yang sesuai dengan filter atau kata kunci pencarian.'
                    : 'Belum ada pesanan yang tercatat di sistem workshop.'
                }
                action={
                  <Link href="/pesanan/baru">
                    <Button size="sm">+ Buat Pesanan Baru</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Nomor Nota</th>
                      <th>Pelanggan</th>
                      <th>Jenis Layanan</th>
                      <th>Nilai Order</th>
                      <th>Status Bayar</th>
                      <th>Status Jahit</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => {
                      const servicesList = o.items && o.items.length > 0
                        ? o.items.map((i) => `${i.service_type?.name || 'Pakaian'} (${i.quantity})`).join(', ')
                        : '-';

                      return (
                        <tr key={o.id}>
                          <td style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                            <Link href={`/pesanan/${o.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                              {o.order_number}
                            </Link>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{o.customer_name_snapshot}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {o.customer_address_snapshot}
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', maxWidth: '240px' }}>
                            {servicesList}
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            {formatRupiah(o.total_price)}
                          </td>
                          <td>
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '999px',
                                letterSpacing: '0.02em',
                                backgroundColor:
                                  o.payment_status === 'lunas'
                                    ? '#DCFCE7'
                                    : o.payment_status === 'sebagian'
                                    ? '#FEF3C7'
                                    : '#FEE2E2',
                                color:
                                  o.payment_status === 'lunas'
                                    ? '#166534'
                                    : o.payment_status === 'sebagian'
                                    ? '#92400E'
                                    : '#991B1B',
                              }}
                            >
                              {o.payment_status === 'lunas'
                                ? 'Lunas'
                                : o.payment_status === 'sebagian'
                                ? 'DP'
                                : 'Belum Bayar'}
                            </span>
                          </td>
                          <td>
                            <StatusBadge status={o.status} />
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                              <Link
                                href={`/pesanan/${o.id}`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  color: 'var(--primary)',
                                  padding: '0.35rem 0.7rem',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: 'var(--primary-light)',
                                  textDecoration: 'none',
                                }}
                              >
                                <span>Detail</span>
                                <ArrowRight size={13} />
                              </Link>
                              <Link
                                href={`/pesanan/${o.id}/nota`}
                                target="_blank"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  color: 'var(--text-secondary)',
                                  padding: '0.35rem 0.6rem',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: '#FFFFFF',
                                  border: '1px solid var(--border)',
                                  textDecoration: 'none',
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

              {/* Luxury Pagination (Max 15 items per page) */}
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                total={meta.total}
                perPage={meta.per_page}
                onPageChange={(newPage) => setPage(newPage)}
                loading={loading}
              />
            </>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
