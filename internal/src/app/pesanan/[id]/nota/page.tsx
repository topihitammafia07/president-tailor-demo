'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { Button } from '@/components/Button';
import { ErrorAlert, LoadingSpinner } from '@/components/Card';
import { Printer, ArrowLeft } from 'lucide-react';

export default function NotaPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getOrder(id);
        setOrder(res.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Gagal memuat data nota.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <LoadingSpinner text="Mempersiapkan nota cetak..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '1rem' }}>
        <ErrorAlert message={error || 'Pesanan tidak ditemukan'} />
        <Link href="/pesanan">
          <Button variant="secondary">Kembali ke Pesanan</Button>
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(order.total_price);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '2rem 1rem' }}>
      {/* Top Action Bar (hidden on print) */}
      <div
        className="no-print"
        style={{
          maxWidth: '650px',
          margin: '0 auto 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          href={`/pesanan/${id}`}
          style={{
            fontSize: '0.85rem',
            color: 'var(--primary)',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={15} />
          <span>Kembali ke Detail Pesanan</span>
        </Link>
        <Button onClick={handlePrint} size="md">
          <Printer size={16} style={{ marginRight: '0.4rem' }} />
          Cetak Nota Sekarang
        </Button>
      </div>

      {/* Nota Sheet (Paper format A5/A4 printable) */}
      <div
        className="nota-print-container"
        style={{
          maxWidth: '650px',
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '4px',
          padding: '2.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          color: '#0F172A',
          fontFamily: 'serif',
        }}
      >
        {/* Header Nota */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #000000', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '0.1em', margin: 0 }}>
            PRESIDENT TAILOR
          </h1>
          <p style={{ fontSize: '0.9rem', margin: '0.35rem 0 0', fontStyle: 'italic', fontFamily: 'sans-serif' }}>
            Penjahit Jas, Hem Batik, & Celana Panjang — Sukoharjo
          </p>
        </div>

        {/* 5 Kelompok Informasi Resmi Owner */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '1rem', lineHeight: 1.6 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
            <strong>No. Pesanan</strong>
            <span>: {order.order_number}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
            <strong>Nama Pelanggan</strong>
            <span>: {order.customer_name_snapshot}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
            <strong>Alamat</strong>
            <span>: {order.customer_address_snapshot}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
            <strong>Pesanan</strong>
            <div>
              : {order.items && order.items.length > 0 ? (
                order.items.map((it, idx) => (
                  <span key={it.id || idx}>
                    {idx > 0 && ', '}
                    {it.service_type?.name || 'Pakaian'} ({it.quantity} potong)
                  </span>
                ))
              ) : (
                'Jahitan pakaian'
              )}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr',
              marginTop: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px dashed #94A3B8',
              fontSize: '1.15rem',
            }}
          >
            <strong>Total Harga</strong>
            <span style={{ fontWeight: 800 }}>: {formattedPrice}</span>
          </div>
        </div>

        {/* Footer Nota Tanda Terima */}
        <div
          style={{
            marginTop: '3.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            textAlign: 'center',
            fontSize: '0.9rem',
          }}
        >
          <div>
            <div>Tanda Terima Pelanggan</div>
            <div style={{ marginTop: '4rem', borderTop: '1px solid #000000', width: '150px' }}>
              ({order.customer_name_snapshot})
            </div>
          </div>

          <div>
            <div>Sukoharjo, {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div>Hormat Kami,</div>
            <div style={{ marginTop: '3rem', borderTop: '1px solid #000000', width: '150px' }}>
              President Tailor
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
