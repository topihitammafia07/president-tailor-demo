'use client';

import React, { useEffect, useState, use, useCallback } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/AppLayout';
import { Card, ErrorAlert, LoadingSpinner } from '@/components/Card';
import { Button } from '@/components/Button';
import { CurrencyInput } from '@/components/Input';
import { StatusBadge } from '@/components/Badge';
import { SuccessModal, ConfirmModal } from '@/components/Modal';
import { api } from '@/lib/api';
import { Order, Payment } from '@/types';
import {
  Printer,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  Clock,
  Scissors,
  AlertCircle,
  ShieldCheck,
  FileText,
  Layers,
  ExternalLink,
  X,
  ArrowLeft,
} from 'lucide-react';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Payment Form state
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payMethod, setPayMethod] = useState<'tunai' | 'transfer_bank' | 'qris'>('tunai');
  const [payNotes, setPayNotes] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Center Modal Popups state
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    title: string;
    message?: string;
    amount?: number;
    amountLabel?: string;
    details?: { label: string; value: string }[];
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
  } | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    status: 'diproses' | 'selesai';
  } | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [orderRes, payRes] = await Promise.all([
        api.getOrder(id),
        api.getPayments(id).catch(() => ({ data: [] })),
      ]);
      setOrder(orderRes.data);
      setPayments(payRes.data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal memuat detail pesanan.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const requestStatusUpdate = (newStatus: 'diproses' | 'selesai') => {
    if (newStatus === 'selesai') {
      setConfirmModal({
        isOpen: true,
        status: 'selesai',
      });
      return;
    }
    executeStatusUpdate(newStatus);
  };

  const executeStatusUpdate = async (newStatus: 'diproses' | 'selesai') => {
    setUpdatingStatus(true);
    setError(null);
    setSuccess(null);
    setConfirmModal(null);

    try {
      const res = await api.updateOrderStatus(id, newStatus);
      setOrder(res.data);
      setSuccessModal({
        isOpen: true,
        title: 'Status Produksi Berhasil Diperbarui',
        message: `Pesanan ${res.data.order_number} berhasil diperbarui menjadi status '${newStatus === 'selesai' ? 'Selesai Jahit' : 'Sedang Diproses'}'.`,
        details: [
          { label: 'Nomor Pesanan', value: res.data.order_number },
          { label: 'Status Baru', value: newStatus === 'selesai' ? 'Selesai' : 'Diproses' },
          { label: 'Kunci Perubahan', value: newStatus === 'selesai' ? 'Terkunci Permanen' : 'Dapat Diedit' },
        ],
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal memperbarui status pesanan.');
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawDigits = payAmount.replace(/\D/g, '');
    const amountNum = parseInt(rawDigits, 10);

    if (!amountNum || amountNum <= 0) {
      setPaymentError('Nominal pembayaran harus lebih dari 0.');
      return;
    }

    const currentRemaining = order?.remaining_bill ?? 0;
    if (amountNum > currentRemaining) {
      setPaymentError(`Nominal tidak boleh melebihi sisa tagihan (Rp ${currentRemaining.toLocaleString('id-ID')}).`);
      return;
    }

    setSubmittingPayment(true);
    setPaymentError(null);

    try {
      await api.createPayment(id, {
        amount: amountNum,
        payment_date: payDate,
        payment_method: payMethod,
        notes: payNotes || undefined,
      });

      const remainingAfter = Math.max(0, currentRemaining - amountNum);
      const methodLabel = payMethod === 'tunai' ? 'Tunai / Cash' : payMethod === 'transfer_bank' ? 'Transfer Bank' : 'QRIS';

      setSuccessModal({
        isOpen: true,
        title: 'Pembayaran Berhasil Dicatat',
        message: `Pembayaran kas masuk untuk pesanan ${order?.order_number || ''} berhasil disimpan ke sistem.`,
        amount: amountNum,
        amountLabel: 'Nominal Pembayaran Diterima',
        details: [
          { label: 'Nomor Pesanan', value: order?.order_number || '' },
          { label: 'Metode Pembayaran', value: methodLabel },
          { label: 'Tanggal Bayar', value: payDate },
          { label: 'Sisa Tagihan Sekarang', value: remainingAfter === 0 ? 'LUNAS (Rp 0)' : `Rp ${remainingAfter.toLocaleString('id-ID')}` },
        ],
        secondaryActionLabel: 'Buka Nota Fisik ↗',
        onSecondaryAction: () => {
          window.open(`/pesanan/${id}/nota`, '_blank');
        },
      });

      setShowPaymentForm(false);
      setPayAmount('');
      setPayNotes('');
      // Reload updated order and payment history
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mencatat pembayaran.';
      setPaymentError(msg);
    } finally {
      setSubmittingPayment(false);
    }
  };

  const formatRupiah = (val: number) => {
    return 'Rp ' + Number(val || 0).toLocaleString('id-ID');
  };  return (
    <AppLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top Header & Breadcrumb */}
        <div>
          <Link
            href="/pesanan"
            style={{
              fontSize: '0.85rem',
              color: 'var(--primary)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginBottom: '0.5rem',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={15} />
            <span>Kembali ke Daftar Pesanan</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                {order ? order.order_number : 'Memuat...'}
              </h1>
              {order && (
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <StatusBadge status={order.status} />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      backgroundColor:
                        order.payment_status === 'lunas'
                          ? '#DCFCE7'
                          : order.payment_status === 'sebagian'
                          ? '#FEF3C7'
                          : '#FEE2E2',
                      color:
                        order.payment_status === 'lunas'
                          ? '#166534'
                          : order.payment_status === 'sebagian'
                          ? '#92400E'
                          : '#991B1B',
                    }}
                  >
                    {order.payment_status === 'lunas'
                      ? 'Lunas'
                      : order.payment_status === 'sebagian'
                      ? 'Sebagian (DP)'
                      : 'Belum Bayar'}
                  </span>
                </div>
              )}
            </div>

            {order && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <a
                  href={`/pesanan/${id}/nota`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="outline" size="sm">
                    <Printer size={15} style={{ marginRight: '0.4rem' }} />
                    Cetak Nota Fisik
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={loadData} />}
        {success && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              border: '1px solid var(--success-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
            }}
          >
            {success}
          </div>
        )}

        {loading ? (
          <LoadingSpinner text="Memuat data pesanan..." />
        ) : (
          order && (
            <>
              {/* 1. Alur & Panduan Operasional Terpadu Workshop */}
              {(() => {
                const isBaru = order.status === 'baru';
                const isDiproses = order.status === 'diproses';
                const isSelesai = order.status === 'selesai';
                const hasPiutang = (order.remaining_bill ?? 0) > 0;
                const isLunas = !hasPiutang;

                let activeStep = 1;
                if (isDiproses) activeStep = 2;
                else if (isSelesai && hasPiutang) activeStep = 3;
                else if (isSelesai && isLunas) activeStep = 4;

                const cleanPhone = (order.customer?.phone || '').replace(/\D/g, '');
                const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
                const waText = encodeURIComponent(
                  `Halo ${order.customer_name_snapshot}, pesanan jahitan nomor ${order.order_number} di President Tailor telah selesai dikerjakan dan siap diambil. ${
                    hasPiutang
                      ? `Sisa tagihan yang perlu diselesaikan saat pengambilan adalah Rp ${(order.remaining_bill ?? 0).toLocaleString('id-ID')}. `
                      : 'Pembayaran telah lunas. '
                  }Silakan datang ke workshop kami. Terima kasih.`
                );

                return (
                  <Card>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {/* Stepper Header */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Alur Tahapan Operasional Workshop
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Tahap {activeStep} dari 4
                          </span>
                        </div>

                        {/* Visual 4-Step Progress Line */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                          {[
                            { step: 1, label: '1. Antrean Baru', icon: Clock },
                            { step: 2, label: '2. Proses Jahit', icon: Scissors },
                            { step: 3, label: '3. Siap Diambil / Pelunasan', icon: AlertCircle },
                            { step: 4, label: '4. Selesai & Lunas', icon: CheckCircle2 },
                          ].map((s) => {
                            const isCurrent = activeStep === s.step;
                            const isDone = activeStep > s.step;
                            const Icon = s.icon;
                            return (
                              <div
                                key={s.step}
                                style={{
                                  padding: '0.6rem 0.5rem',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: isCurrent
                                    ? 'var(--primary-light)'
                                    : isDone
                                    ? '#F0FDF4'
                                    : '#F8FAFC',
                                  border: isCurrent
                                    ? '2px solid var(--primary)'
                                    : isDone
                                    ? '1px solid #BBF7D0'
                                    : '1px solid var(--border)',
                                  textAlign: 'center',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}
                              >
                                <Icon
                                  size={16}
                                  color={isCurrent ? 'var(--primary)' : isDone ? '#166534' : 'var(--text-muted)'}
                                  strokeWidth={isCurrent || isDone ? 2.2 : 1.8}
                                />
                                <span
                                  style={{
                                    fontSize: '0.72rem',
                                    fontWeight: isCurrent ? 700 : isDone ? 600 : 500,
                                    color: isCurrent ? 'var(--primary)' : isDone ? '#166534' : 'var(--text-muted)',
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {s.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action & Guidance Banner */}
                      <div
                        style={{
                          padding: '0.9rem 1.15rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor:
                            isBaru
                              ? '#EFF6FF'
                              : isDiproses
                              ? '#FFFBEB'
                              : isSelesai && hasPiutang
                              ? '#FEF3C7'
                              : '#F0FDF4',
                          border:
                            isBaru
                              ? '1px solid #BFDBFE'
                              : isDiproses
                              ? '1px solid #FDE68A'
                              : isSelesai && hasPiutang
                              ? '1px solid #F59E0B'
                              : '1px solid #BBF7D0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '0.85rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', maxWidth: '640px' }}>
                          {isBaru && <Clock size={20} color="#1D4ED8" style={{ marginTop: '0.15rem', flexShrink: 0 }} />}
                          {isDiproses && <Scissors size={20} color="#D97706" style={{ marginTop: '0.15rem', flexShrink: 0 }} />}
                          {isSelesai && hasPiutang && <AlertCircle size={20} color="#B45309" style={{ marginTop: '0.15rem', flexShrink: 0 }} />}
                          {isSelesai && isLunas && <CheckCircle2 size={20} color="#166534" style={{ marginTop: '0.15rem', flexShrink: 0 }} />}

                          <div>
                            <strong
                              style={{
                                display: 'block',
                                fontSize: '0.92rem',
                                color:
                                  isBaru
                                    ? '#1E40AF'
                                    : isDiproses
                                    ? '#92400E'
                                    : isSelesai && hasPiutang
                                    ? '#92400E'
                                    : '#166534',
                              }}
                            >
                              {isBaru && 'Tahap 1: Antrean Baru — Kain Siap Dipotong'}
                              {isDiproses && 'Tahap 2: Sedang Dikerjakan di Meja Jahit'}
                              {isSelesai && hasPiutang && 'Tahap 3: Busana Siap Diambil — Menunggu Pelunasan Sisa Tagihan'}
                              {isSelesai && isLunas && 'Tahap 4: Pesanan Selesai Dikerjakan & Lunas (100%)'}
                            </strong>
                            <p
                              style={{
                                fontSize: '0.825rem',
                                margin: '0.2rem 0 0',
                                color:
                                  isBaru
                                    ? '#1E3A8A'
                                    : isDiproses
                                    ? '#78350F'
                                    : isSelesai && hasPiutang
                                    ? '#78350F'
                                    : '#14532D',
                                lineHeight: 1.4,
                              }}
                            >
                              {isBaru && 'Pesanan telah tercatat di buku digital. Klik tombol "Mulai Proses Jahit" saat penjahit mulai mengerjakan pakaian.'}
                              {isDiproses && 'Pakaian sedang dijahit. Setelah proses penjahitan selesai disetrika dan lulus QC, klik "Tandai Selesai Dikerjakan" untuk memindahkan ke status siap fitting/ambil.'}
                              {isSelesai && hasPiutang && `Pakaian selesai dijahit. Terdapat sisa tagihan sebesar Rp ${(order.remaining_bill ?? 0).toLocaleString('id-ID')} yang belum dilunasi. Hubungi pelanggan untuk konfirmasi pengambilan pakaian dan catat pelunasan kas saat penyerahan.`}
                              {isSelesai && isLunas && 'Seluruh jahitan selesai dan pembayaran telah lunas. Pakaian siap diserahkan kepada pelanggan dan arsip pesanan telah terkunci permanen.'}
                            </p>
                          </div>
                        </div>

                        {/* Contextual Action Buttons */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          {isBaru && (
                            <Button
                              size="md"
                              loading={updatingStatus}
                              onClick={() => requestStatusUpdate('diproses')}
                              style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                            >
                              <Scissors size={15} style={{ marginRight: '0.4rem' }} />
                              Mulai Proses Jahit
                            </Button>
                          )}

                          {isDiproses && (
                            <Button
                              size="md"
                              loading={updatingStatus}
                              onClick={() => requestStatusUpdate('selesai')}
                              style={{ backgroundColor: '#059669', color: '#FFFFFF' }}
                            >
                              <CheckCircle2 size={15} style={{ marginRight: '0.4rem' }} />
                              Tandai Selesai Dikerjakan
                            </Button>
                          )}

                          {isSelesai && hasPiutang && (
                            <>
                              <Button
                                size="md"
                                onClick={() => {
                                  setShowPaymentForm(true);
                                  setPayAmount((order.remaining_bill ?? 0).toLocaleString('id-ID'));
                                }}
                                style={{ backgroundColor: '#D97706', color: '#FFFFFF' }}
                              >
                                <CreditCard size={15} style={{ marginRight: '0.4rem' }} />
                                Catat Pelunasan Masuk
                              </Button>

                              {waPhone && (
                                <a
                                  href={`https://wa.me/${waPhone}?text=${waText}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0.55rem 0.85rem',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: '#25D366',
                                    color: '#FFFFFF',
                                    fontSize: '0.825rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                  }}
                                >
                                  <MessageSquare size={15} />
                                  Kirim WhatsApp
                                </a>
                              )}
                            </>
                          )}

                          {isSelesai && isLunas && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontWeight: 700, fontSize: '0.875rem' }}>
                              <ShieldCheck size={18} />
                              Siap Diserahkan ke Pelanggan
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })()}

              {/* 2-Column Master-Detail Layout */}
              <div className="order-detail-grid">
                {/* Kolom Kiri: Spesifikasi Busana & Pelanggan */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Card Rincian Pakaian & Catatan Ukuran */}
                  <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                          Rincian Pakaian & Catatan Ukuran Buku
                        </h2>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Spesifikasi anatomi jahitan tersimpan dari buku ukur fisik
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                        }}
                      >
                        {order.items?.length || 0} Jenis Pakaian
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {order.items?.map((item, idx) => {
                        const sName = (item.service_type?.name || '').toLowerCase();
                        const isJas = sName.includes('jas');
                        const isBatik = sName.includes('batik') || sName.includes('hem');
                        const ItemIcon = isJas ? Scissors : isBatik ? FileText : Layers;

                        return (
                          <div
                            key={item.id || idx}
                            style={{
                              padding: '1rem',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: '#FFFFFF',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.65rem',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: 'var(--primary-light)',
                                    color: 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <ItemIcon size={16} />
                                </div>
                                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                  {item.service_type?.name || 'Pakaian'}
                                </span>
                              </div>
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  backgroundColor: '#F1F5F9',
                                  color: 'var(--text-secondary)',
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: 'var(--radius-sm)',
                                }}
                              >
                                {item.quantity} Potong
                              </span>
                            </div>

                            <div>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Catatan Ukuran Buku Digital:
                              </span>
                              <div
                                style={{
                                  fontSize: '0.85rem',
                                  color: 'var(--text-primary)',
                                  whiteSpace: 'pre-wrap',
                                  backgroundColor: '#F8FAFC',
                                  padding: '0.75rem 0.85rem',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid var(--border)',
                                  fontFamily: 'monospace',
                                  lineHeight: 1.55,
                                }}
                              >
                                {item.measurements_note || 'Tidak ada catatan ukuran khusus.'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Card Data Pelanggan Snapshot */}
                  <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                          Data Pelanggan (Snapshot Transaksi)
                        </h2>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Data pemesan saat nota diterbitkan (tidak berubah walau profil diedit)
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: '#DCFCE7',
                          color: '#166534',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                        }}
                      >
                        Snapshot Resmi Nota
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '1rem',
                            flexShrink: 0,
                          }}
                        >
                          {(order.customer_name_snapshot || 'P').charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'block' }}>
                            {order.customer_name_snapshot}
                          </strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Pelanggan Terdaftar
                          </span>
                        </div>
                        {order.customer_id && (
                          <Link
                            href={`/pelanggan/${order.customer_id}`}
                            style={{
                              fontSize: '0.78rem',
                              color: 'var(--primary)',
                              fontWeight: 700,
                              textDecoration: 'none',
                              padding: '0.35rem 0.65rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--primary-light)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            Profil
                            <ExternalLink size={12} />
                          </Link>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                        <div style={{ padding: '0.65rem 0.75rem', backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                            Kontak Telepon / WA
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                              {order.customer?.phone || 'Tidak tercatat'}
                            </span>
                            {order.customer?.phone && (
                              <a
                                href={`https://wa.me/${order.customer.phone.replace(/\D/g, '').replace(/^0/, '62')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: '0.72rem',
                                  color: '#059669',
                                  backgroundColor: '#DCFCE7',
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '4px',
                                  fontWeight: 700,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}
                              >
                                <MessageSquare size={11} />
                                WA
                              </a>
                            )}
                          </div>
                        </div>

                        <div style={{ padding: '0.65rem 0.75rem', backgroundColor: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                            Alamat Snapshot Nota
                          </span>
                          <span style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.2rem', lineHeight: 1.35 }}>
                            {order.customer_address_snapshot}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Kolom Kanan: Sticky Kasir & Keuangan */}
                <div className="sticky-panel">
                  {/* Card Status Pembayaran & Tagihan */}
                  <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        Ringkasan Kas & Tagihan
                      </h2>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                          backgroundColor:
                            order.payment_status === 'lunas'
                              ? '#DCFCE7'
                              : order.payment_status === 'sebagian'
                              ? '#FEF3C7'
                              : '#FEE2E2',
                          color:
                            order.payment_status === 'lunas'
                              ? '#166534'
                              : order.payment_status === 'sebagian'
                              ? '#92400E'
                              : '#991B1B',
                        }}
                      >
                        {order.payment_status === 'lunas'
                          ? 'Lunas'
                          : order.payment_status === 'sebagian'
                          ? 'Sebagian (DP)'
                          : 'Belum Dibayar'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Total Biaya Jahit:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{formatRupiah(order.total_price)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Total Telah Dibayar:</span>
                        <strong style={{ color: '#059669' }}>{formatRupiah(order.total_paid ?? 0)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', alignItems: 'baseline' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Sisa Tagihan:</span>
                        <strong
                          style={{
                            color: (order.remaining_bill ?? 0) > 0 ? '#D97706' : '#166534',
                            fontSize: '1.15rem',
                            fontWeight: 800,
                          }}
                        >
                          {(order.remaining_bill ?? 0) === 0 ? 'LUNAS (Rp 0)' : formatRupiah(order.remaining_bill ?? 0)}
                        </strong>
                      </div>
                    </div>

                    {/* Quick Action Button in Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                      {(order.remaining_bill ?? 0) > 0 && !showPaymentForm && (
                        <Button
                          size="md"
                          onClick={() => {
                            setShowPaymentForm(true);
                            setPayAmount((order.remaining_bill ?? 0).toLocaleString('id-ID'));
                          }}
                          style={{ width: '100%' }}
                        >
                          <CreditCard size={15} style={{ marginRight: '0.4rem' }} />
                          Catat Pembayaran Masuk
                        </Button>
                      )}

                      <a
                        href={`/pesanan/${id}/nota`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', width: '100%' }}
                      >
                        <Button variant="outline" size="sm" style={{ width: '100%' }}>
                          <Printer size={14} style={{ marginRight: '0.4rem' }} />
                          Buka & Cetak Nota Fisik ↗
                        </Button>
                      </a>
                    </div>
                  </Card>

                  {/* Form Pencatatan Pembayaran Kas (Expandable di Sidebar) */}
                  {showPaymentForm && (order.remaining_bill ?? 0) > 0 && (
                    <Card>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                            Catat Pembayaran Kas
                          </h3>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Maks. {formatRupiah(order.remaining_bill ?? 0)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPaymentForm(false)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '0.2rem',
                          }}
                          title="Tutup form"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {paymentError && (
                        <div style={{ padding: '0.5rem 0.65rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                          {paymentError}
                        </div>
                      )}

                      <form onSubmit={handleCreatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div>
                          <CurrencyInput
                            label="Nominal Pembayaran (Rp)"
                            placeholder={`Maks ${(order.remaining_bill ?? 0).toLocaleString('id-ID')}`}
                            value={payAmount}
                            onChangeValue={(_num, formatted) => {
                              setPayAmount(formatted);
                              if (paymentError) setPaymentError(null);
                            }}
                            required
                          />

                          {/* Quick-Fill Helpers */}
                          <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => setPayAmount((order.remaining_bill ?? 0).toLocaleString('id-ID'))}
                              style={{
                                padding: '0.2rem 0.5rem',
                                borderRadius: '999px',
                                backgroundColor: 'var(--primary-light)',
                                color: 'var(--primary)',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                border: '1px solid var(--border)',
                                cursor: 'pointer',
                              }}
                            >
                              Bayar Penuh: Rp {(order.remaining_bill ?? 0).toLocaleString('id-ID')}
                            </button>
                            {order.remaining_bill === order.total_price && (
                              <button
                                type="button"
                                onClick={() => setPayAmount(Math.round(order.total_price / 2).toLocaleString('id-ID'))}
                                style={{
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '999px',
                                  backgroundColor: '#FEF3C7',
                                  color: '#92400E',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  border: '1px solid #FDE68A',
                                  cursor: 'pointer',
                                }}
                              >
                                DP 50%: Rp {Math.round(order.total_price / 2).toLocaleString('id-ID')}
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                            Tanggal Pembayaran *
                          </label>
                          <input
                            type="date"
                            value={payDate}
                            onChange={(e) => setPayDate(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.65rem',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.85rem',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                            Metode Pembayaran *
                          </label>
                          <select
                            value={payMethod}
                            onChange={(e) => setPayMethod(e.target.value as 'tunai' | 'transfer_bank' | 'qris')}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.65rem',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.85rem',
                            }}
                          >
                            <option value="tunai">Tunai / Cash</option>
                            <option value="transfer_bank">Transfer Bank</option>
                            <option value="qris">QRIS</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                            Catatan Transaksi (Opsional)
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: DP 50%, pelunasan pas fitting"
                            value={payNotes}
                            onChange={(e) => setPayNotes(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.65rem',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.85rem',
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <Button type="button" variant="secondary" size="sm" onClick={() => setShowPaymentForm(false)}>
                            Batal
                          </Button>
                          <Button type="submit" size="sm" loading={submittingPayment}>
                            Simpan Pembayaran
                          </Button>
                        </div>
                      </form>
                    </Card>
                  )}

                  {/* Card Riwayat Pembayaran Tercatat */}
                  <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        Riwayat Pembayaran ({payments.length})
                      </h3>
                    </div>

                    {payments.length === 0 ? (
                      <div style={{ padding: '1.25rem 0.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                        Belum ada riwayat pembayaran yang tercatat.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {payments.map((p) => (
                          <div
                            key={p.id}
                            style={{
                              padding: '0.65rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: '#F8FAFC',
                              border: '1px solid var(--border)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.3rem',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                {p.payment_date}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  textTransform: 'uppercase',
                                  backgroundColor: '#E2E8F0',
                                  color: 'var(--text-secondary)',
                                  padding: '0.1rem 0.4rem',
                                  borderRadius: '3px',
                                }}
                              >
                                {p.payment_method.replace('_', ' ')}
                              </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: p.notes ? 'normal' : 'italic' }}>
                                {p.notes || 'Tanpa catatan'}
                              </span>
                              <strong style={{ fontSize: '0.92rem', fontWeight: 700, color: '#059669' }}>
                                {formatRupiah(p.amount)}
                              </strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </>
          )
        )}

        {/* Center Success Pop-up with Green Checkmark */}
        {successModal && (
          <SuccessModal
            isOpen={successModal.isOpen}
            onClose={() => setSuccessModal(null)}
            title={successModal.title}
            message={successModal.message}
            amount={successModal.amount}
            amountLabel={successModal.amountLabel}
            details={successModal.details}
            primaryActionLabel="Selesai & Tutup"
            secondaryActionLabel={successModal.secondaryActionLabel}
            onSecondaryAction={successModal.onSecondaryAction}
          />
        )}

        {/* Center Confirmation Dialog (Replaces native window.confirm) */}
        {confirmModal && (
          <ConfirmModal
            isOpen={confirmModal.isOpen}
            onClose={() => setConfirmModal(null)}
            onConfirm={() => executeStatusUpdate(confirmModal.status)}
            loading={updatingStatus}
            title="Konfirmasi Penyelesaian Jahit"
            message="Apakah seluruh proses penjahitan busana dan pemeriksaan kualitas (QC) untuk pesanan ini telah selesai dikerjakan? Status pesanan akan dikunci setelah ditandai selesai."
            confirmLabel="Ya, Tandai Selesai"
            cancelLabel="Kembali"
          />
        )}
      </div>
    </AppLayout>
  );
}
