'use client';

import React, { useEffect, useState, use, useCallback } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/AppLayout';
import { Card, EmptyState, ErrorAlert, LoadingSpinner } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input, Textarea } from '@/components/Input';
import { StatusBadge } from '@/components/Badge';
import { api } from '@/lib/api';
import { Customer } from '@/types';
import {
  User,
  ArrowLeft,
  ArrowRight,
  Plus,
  ShoppingBag,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Edit fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const loadCustomer = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getCustomer(id);
      setCustomer(res.data);
      setName(res.data.name);
      setPhone(res.data.phone);
      setAddress(res.data.address);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal memuat profil pelanggan.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.updateCustomer(id, {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      setCustomer(res.data);
      setSuccess('Data profil pelanggan berhasil diperbarui. Snapshot nota pesanan lama tetap aman.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal memperbarui data pelanggan.');
      }
    } finally {
      setSaving(false);
    }
  };

  const formatRupiah = (val: number) => {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
  };

  return (
    <AppLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/pelanggan"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              color: 'var(--primary)',
              fontWeight: 600,
              marginBottom: '0.75rem',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={15} />
            <span>Kembali ke Data Pelanggan</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                }}
              >
                <User size={20} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                  {customer ? customer.name : 'Detail & Edit Pelanggan'}
                </h1>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.15rem', margin: 0 }}>
                  Kelola informasi kontak dan pantau seluruh riwayat pesanan jahitan
                </p>
              </div>
            </div>

            <Link href={`/pesanan/baru?customer_id=${id}`}>
              <Button size="md" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 2px 4px rgba(30, 58, 95, 0.15)' }}>
                <Plus size={16} />
                <span>Buat Pesanan Pelanggan Ini</span>
              </Button>
            </Link>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={loadCustomer} />}

        {success && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              border: '1px solid var(--success-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {loading ? (
          <div style={{ padding: '3rem 1rem' }}>
            <LoadingSpinner text="Memuat profil pelanggan..." />
          </div>
        ) : (
          customer && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
              {/* Profile Edit Form Card */}
              <Card style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <User size={18} color="var(--primary)" />
                    <span>Ubah Informasi Pelanggan</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem', margin: 0 }}>
                    Perubahan data pelanggan tidak mengubah teks snapshot pada nota pesanan lama yang sudah terbit.
                  </p>
                </div>

                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <Input
                    label="Nama Lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <Input
                    label="Nomor WhatsApp / Telepon"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />

                  <Textarea
                    label="Alamat Domisili"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                    <Button
                      type="submit"
                      loading={saving}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 2px 4px rgba(30, 58, 95, 0.15)',
                        width: '100%',
                      }}
                    >
                      <CheckCircle2 size={16} />
                      <span>Simpan Perubahan Profil</span>
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Order History Card */}
              <Card style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <ShoppingBag size={18} color="var(--primary)" />
                    <span>Riwayat Pesanan</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '999px',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                    }}
                  >
                    {customer.orders?.length ?? 0} Pesanan
                  </span>
                </div>

                {!customer.orders || customer.orders.length === 0 ? (
                  <EmptyState
                    title="Belum Ada Pesanan"
                    message="Pelanggan ini belum memiliki riwayat pesanan yang tercatat."
                    action={
                      <Link href={`/pesanan/baru?customer_id=${id}`}>
                        <Button size="sm">+ Buat Pesanan Pertama</Button>
                      </Link>
                    }
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {customer.orders.map((o) => {
                      const services = o.items && o.items.length > 0
                        ? o.items.map((i) => i.service_type?.name || 'Pakaian').join(', ')
                        : 'Layanan Jahit';

                      return (
                        <div
                          key={o.id}
                          style={{
                            padding: '0.85rem 1rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                {o.order_number}
                              </span>
                              <StatusBadge status={o.status} />
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                              {services} • <strong style={{ color: 'var(--text-primary)' }}>{formatRupiah(o.total_price)}</strong>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Link
                              href={`/pesanan/${o.id}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'var(--primary)',
                                padding: '0.3rem 0.6rem',
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
                                padding: '0.3rem 0.6rem',
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
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>
          )
        )}
      </div>
    </AppLayout>
  );
}
