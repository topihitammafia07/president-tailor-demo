'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/AppLayout';
import { Card, EmptyState, ErrorAlert, LoadingSpinner } from '@/components/Card';
import { Button } from '@/components/Button';
import { Pagination } from '@/components/Pagination';
import { api } from '@/lib/api';
import { Customer } from '@/types';
import { Users, Plus, Search, ExternalLink } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
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

  const loadCustomers = useCallback(async (query = '', pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getCustomers(query, pageNum, 15);
      setCustomers(res.data || []);
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
        setError('Gagal memuat data pelanggan.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when search or page changes
  useEffect(() => {
    const handler = setTimeout(() => {
      loadCustomers(search, page);
    }, 250);

    return () => clearTimeout(handler);
  }, [search, page, loadCustomers]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1); // reset to page 1 on search
  };

  return (
    <AppLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Header Section */}
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
                <Users size={18} />
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                Data Pelanggan
              </h1>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              Daftar kontak dan alamat pelanggan tetap President Tailor Sukoharjo
            </p>
          </div>

          <Link href="/pelanggan/baru">
            <Button size="md" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 2px 4px rgba(30, 58, 95, 0.15)' }}>
              <Plus size={16} />
              <span>Tambah Pelanggan</span>
            </Button>
          </Link>
        </div>

        {error && <ErrorAlert message={error} onRetry={() => loadCustomers(search, page)} />}

        {/* Search & Counter Filter Card */}
        <Card style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
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
                placeholder="Cari nama atau nomor telepon..."
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

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Total Terdaftar:{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{meta.total}</strong> Pelanggan
            </div>
          </div>
        </Card>

        {/* Table Card */}
        <Card padding="none" style={{ overflow: 'hidden' }}>
          {loading && customers.length === 0 ? (
            <div style={{ padding: '3rem 1rem' }}>
              <LoadingSpinner text="Memuat data pelanggan..." />
            </div>
          ) : customers.length === 0 ? (
            <div style={{ padding: '2.5rem 1rem' }}>
              <EmptyState
                title={search ? 'Pelanggan Tidak Ditemukan' : 'Belum Ada Pelanggan'}
                message={
                  search
                    ? `Tidak ada data yang cocok dengan kata kunci "${search}".`
                    : 'Belum ada data pelanggan yang tersimpan dalam sistem.'
                }
                action={
                  <Link href="/pelanggan/baru">
                    <Button size="sm">+ Tambah Pelanggan Pertama</Button>
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
                      <th>Nama Pelanggan</th>
                      <th>Nomor Telepon</th>
                      <th>Alamat Lengkap</th>
                      <th style={{ textAlign: 'center' }}>Riwayat Pesanan</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>
                          <Link
                            href={`/pelanggan/${c.id}`}
                            style={{ color: 'var(--primary)', textDecoration: 'none' }}
                          >
                            {c.name}
                          </Link>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {c.phone}
                        </td>
                        <td style={{ color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: 1.4 }}>
                          {c.address}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.2rem 0.65rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              borderRadius: '999px',
                              backgroundColor: (c.orders_count ?? 0) > 0 ? '#EFF6FF' : '#F1F5F9',
                              color: (c.orders_count ?? 0) > 0 ? '#1D4ED8' : 'var(--text-muted)',
                            }}
                          >
                            {c.orders_count ?? 0} pesanan
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link
                            href={`/pelanggan/${c.id}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              color: 'var(--primary)',
                              padding: '0.35rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--primary-light)',
                              textDecoration: 'none',
                              transition: 'opacity 0.15s ease',
                            }}
                          >
                            <span>Lihat / Edit</span>
                            <ExternalLink size={13} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Luxury Pagination Component (Max 15 items per page) */}
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
