'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/AppLayout';
import { Card, ErrorAlert } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input, Textarea } from '@/components/Input';
import { api } from '@/lib/api';
import { UserPlus, ArrowLeft, ArrowRight, User, CheckCircle2 } from 'lucide-react';

export default function NewCustomerPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveCustomer = async (andCreateOrder = false) => {
    setError(null);
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('Mohon lengkapi Nama, Nomor Telepon, dan Alamat pelanggan.');
      return;
    }

    if (andCreateOrder) {
      setLoadingOrder(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await api.createCustomer({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      if (andCreateOrder) {
        router.push(`/pesanan/baru?customer_id=${res.data.id}`);
      } else {
        router.push(`/pelanggan/${res.data.id}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal menyimpan data pelanggan baru.');
      }
    } finally {
      setLoading(false);
      setLoadingOrder(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCustomer(false);
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Navigation Breadcrumb / Header */}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
              }}
            >
              <UserPlus size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                Tambah Pelanggan Baru
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.15rem', margin: 0 }}>
                Pencatatan identitas kontak dan alamat domisili pelanggan tetap President Tailor
              </p>
            </div>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        {/* Clean Luxury Form Card */}
        <Card style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Form Section Header */}
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                <User size={17} color="var(--primary)" />
                <span>Identitas & Informasi Kontak</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem', margin: 0 }}>
                Informasi ini akan disalin otomatis sebagai snapshot pada nota cetak setiap pesanan baru.
              </p>
            </div>

            {/* Nama Field */}
            <Input
              label="Nama Lengkap Pelanggan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Bpk. Bambang Wijaya"
              helperText="Gunakan nama lengkap beserta gelar jika diperlukan untuk penulisan nota resmi."
              required
            />

            {/* Nomor Telepon Field */}
            <div style={{ position: 'relative' }}>
              <Input
                label="Nomor Telepon / WhatsApp"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                helperText="Disimpan sebagai teks sesuai buku catatan pelanggan untuk konfirmasi jahitan selesai."
                required
              />
            </div>

            {/* Alamat Field */}
            <Textarea
              label="Alamat Lengkap"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Contoh: Jl. Slamet Riyadi No. 45, Sukoharjo"
              helperText="Alamat domisili pelanggan di Sukoharjo, Solo Raya, atau sekitarnya."
              required
            />

            {/* Action Buttons Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border)',
                marginTop: '0.5rem',
              }}
            >
              <Link href="/pelanggan">
                <Button type="button" variant="secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ArrowLeft size={15} />
                  <span>Batal</span>
                </Button>
              </Link>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <Button
                  type="submit"
                  variant="outline"
                  loading={loading}
                  disabled={loadingOrder}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <CheckCircle2 size={16} />
                  <span>Simpan Pelanggan</span>
                </Button>

                <Button
                  type="button"
                  loading={loadingOrder}
                  disabled={loading}
                  onClick={() => saveCustomer(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 2px 4px rgba(30, 58, 95, 0.2)',
                  }}
                >
                  <span>Simpan & Buat Pesanan</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
