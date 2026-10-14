'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/AppLayout';
import { Card, ErrorAlert, LoadingSpinner } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input, Textarea, CurrencyInput } from '@/components/Input';
import { api } from '@/lib/api';
import { Customer, ServiceType } from '@/types';
import {
  Plus,
  Search,
  Check,
  X,
  Scissors,
  Layers,
  ArrowRight,
  ArrowLeft,
  FileText,
  RotateCcw,
} from 'lucide-react';

interface OrderItemForm {
  service_type_id: number;
  quantity: number;
  measurements_note: string;
}

const MEASUREMENT_TEMPLATES: Record<string, string> = {
  jas: 'Pundak:  cm | Dada:  cm | Pinggang:  cm | Pjg Jas:  cm | Lengan:  cm | Kerah:  cm | Model: Kancing 2, Belahan 2 (Side)',
  batik: 'Pundak:  cm | Dada:  cm | Pjg Kemeja:  cm | Lengan:  cm | Kerah:  cm | Saku: Pas Motif',
  celana: 'Pinggang:  cm | Pinggul:  cm | Pjg Celana:  cm | Paha:  cm | Lutut:  cm | Kaki:  cm | Model: Tanpa Rempel (Flat)',
};

const QUICK_TAGS: Record<string, string[]> = {
  jas: ['Slim Fit', 'Reguler', 'Belahan 2 (Side)', 'Belahan 1 (Tengah)', 'Furing Penuh', 'Kancing 2', 'Bahu Busa Tipis'],
  batik: ['Lengan Panjang', 'Lengan Pendek', 'Motif Pas Depan', 'Kerah Kemeja Kaku', 'Kerah Shanghai', 'Furing Katun'],
  celana: ['Slim Fit', 'Standar/Reguler', 'Tanpa Rempel', 'Rempel 1', 'Saku Bobok', 'Kaki Pensil'],
};

function NewOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams.get('customer_id');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | ''>(
    preselectedCustomerId ? parseInt(preselectedCustomerId, 10) : ''
  );

  const [customerSearch, setCustomerSearch] = useState('');
  const [items, setItems] = useState<OrderItemForm[]>([
    { service_type_id: 1, quantity: 1, measurements_note: '' },
  ]);

  const [totalPrice, setTotalPrice] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick Add Customer Modal state
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [customerModalError, setCustomerModalError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [custRes, servRes] = await Promise.all([
          api.getCustomers('', 1, 100),
          api.getServiceTypes(),
        ]);
        setCustomers(custRes.data);
        setServiceTypes(servRes.data);
        if (servRes.data.length > 0) {
          setItems((prev) =>
            prev.length === 1 && !prev[0].measurements_note
              ? [{ service_type_id: servRes.data[0].id, quantity: 1, measurements_note: '' }]
              : prev
          );
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Gagal memuat opsi data pelanggan dan jenis layanan.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getGarmentKey = (serviceTypeId: number): 'jas' | 'batik' | 'celana' => {
    const st = serviceTypes.find((s) => s.id === serviceTypeId);
    if (!st) return 'jas';
    const slug = st.slug.toLowerCase();
    if (slug.includes('jas')) return 'jas';
    if (slug.includes('batik') || slug.includes('hem')) return 'batik';
    if (slug.includes('celana')) return 'celana';
    return 'jas';
  };

  const selectedCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers.slice(0, 8);
    const q = customerSearch.toLowerCase();
    return customers
      .filter((c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q) || c.address.toLowerCase().includes(q))
      .slice(0, 8);
  }, [customers, customerSearch]);

  const handleAddItem = () => {
    if (serviceTypes.length === 0) return;
    setItems((prev) => [
      ...prev,
      { service_type_id: serviceTypes[0].id, quantity: 1, measurements_note: '' },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof OrderItemForm, value: unknown) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleInsertTemplate = (index: number, serviceTypeId: number) => {
    const key = getGarmentKey(serviceTypeId);
    const template = MEASUREMENT_TEMPLATES[key] || '';
    setItems((prev) => {
      const copy = [...prev];
      const existing = copy[index].measurements_note.trim();
      copy[index].measurements_note = existing ? `${existing}\n${template}` : template;
      return copy;
    });
  };

  const handleAddQuickTag = (index: number, tag: string) => {
    setItems((prev) => {
      const copy = [...prev];
      const existing = copy[index].measurements_note.trim();
      if (!existing) {
        copy[index].measurements_note = `Model: ${tag}`;
      } else if (!existing.includes(tag)) {
        copy[index].measurements_note = `${existing}, ${tag}`;
      }
      return copy;
    });
  };

  const handleCreateNewCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone || !newCustAddress) {
      setCustomerModalError('Harap lengkapi semua kolom data pelanggan.');
      return;
    }

    setSavingCustomer(true);
    setCustomerModalError(null);

    try {
      const res = await api.createCustomer({
        name: newCustName,
        phone: newCustPhone,
        address: newCustAddress,
      });

      const created = res.data;
      setCustomers((prev) => [created, ...prev]);
      setSelectedCustomerId(created.id);
      setShowCustomerModal(false);
      setNewCustName('');
      setNewCustPhone('');
      setNewCustAddress('');
      setCustomerSearch('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan pelanggan baru.';
      setCustomerModalError(msg);
    } finally {
      setSavingCustomer(false);
    }
  };

  const totalItemCount = useMemo(() => {
    return items.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
  }, [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError('Silakan pilih atau tambahkan pelanggan terlebih dahulu.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const priceNum = parseInt(totalPrice.replace(/\D/g, ''), 10);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Total harga harus berupa angka Rupiah yang valid.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const res = await api.createOrder({
        customer_id: Number(selectedCustomerId),
        total_price: priceNum,
        items: items.map((it) => ({
          service_type_id: Number(it.service_type_id),
          quantity: Number(it.quantity) || 1,
          measurements_note: it.measurements_note || undefined,
        })),
      });

      router.push(`/pesanan/${res.data.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal menyimpan pesanan baru.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Mempersiapkan formulir pesanan..." />;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="order-form-grid">
        {/* KOLOM KIRI: INPUT UTAMA (PELANGGAN & ITEM JAHITAN) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>
          {error && <ErrorAlert message={error} />}

          {/* 1. SELEKSI PELANGGAN TERDAFTAR */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700 }}>
                  1
                </span>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Data Pelanggan
                </h2>
              </div>

              {!selectedCustomer && (
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={15} />
                  + Tambah Pelanggan Baru
                </button>
              )}
            </div>

            {/* JIKA PELANGGAN SUDAH TERPILIH (KARTU TERVERIFIKASI) */}
            {selectedCustomer ? (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {selectedCustomer.name}
                      </strong>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: '#DCFCE7',
                          color: '#166534',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                        }}
                      >
                        <Check size={11} /> Terverifikasi
                      </span>
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      <span style={{ fontWeight: 600 }}>{selectedCustomer.phone}</span> • {selectedCustomer.address}
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCustomerId('');
                    setCustomerSearch('');
                  }}
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <RotateCcw size={13} style={{ marginRight: '0.35rem' }} />
                  Ganti Pelanggan
                </Button>
              </div>
            ) : (
              /* JIKA BELUM MEMILIH: PENCARIAN & AUTOCOMPLETE DAFTAR */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ position: 'relative' }}>
                  <Search
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama, telepon, atau alamat pelanggan..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem 0.65rem 2.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      fontSize: '0.9rem',
                      backgroundColor: '#FFFFFF',
                      outline: 'none',
                    }}
                  />
                  {customerSearch && (
                    <button
                      type="button"
                      onClick={() => setCustomerSearch('')}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* HASIL FILTER DAFTAR PELANGGAN */}
                <div
                  style={{
                    maxHeight: '220px',
                    overflowY: 'auto',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#FAFAFA',
                  }}
                >
                  {filteredCustomers.length === 0 ? (
                    <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Tidak menemukan pelanggan dengan kata kunci &quot;{customerSearch}&quot;.
                      <div style={{ marginTop: '0.5rem' }}>
                        <Button type="button" size="sm" onClick={() => setShowCustomerModal(true)}>
                          <Plus size={14} style={{ marginRight: '0.3rem' }} />
                          Daftarkan &quot;{customerSearch}&quot; Sekarang
                        </Button>
                      </div>
                    </div>
                  ) : (
                    filteredCustomers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCustomerId(c.id)}
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid var(--border)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: '#FFFFFF',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-light)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            {c.name}
                          </div>
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            {c.phone} • {c.address}
                          </div>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                          <span>Pilih</span>
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* 2. PAKAIAN & CATATAN UKURAN ANATOMI */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700 }}>
                  2
                </span>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Pakaian & Catatan Ukuran ({items.length} Jenis)
                </h2>
              </div>

              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <Plus size={14} style={{ marginRight: '0.3rem' }} />
                + Tambah Jenis Pakaian
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {items.map((item, idx) => {
                const garmentKey = getGarmentKey(item.service_type_id);
                const quickTags = QUICK_TAGS[garmentKey] || [];

                return (
                  <div
                    key={idx}
                    style={{
                      padding: '1.15rem',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--surface-alt)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                    }}
                  >
                    {/* Header Item */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Item #{idx + 1}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--error)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Hapus Pakaian Ini
                        </button>
                      )}
                    </div>

                    {/* Visual Service Type Pills */}
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                        Pilih Jenis Layanan Busana:
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                        {serviceTypes.map((st) => {
                          const isSelected = item.service_type_id === st.id;
                          const key = st.slug.toLowerCase();
                          const Icon = key.includes('jas') ? Scissors : key.includes('celana') ? Layers : FileText;

                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => handleItemChange(idx, 'service_type_id', st.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                padding: '0.55rem 0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                backgroundColor: isSelected ? 'var(--primary)' : '#FFFFFF',
                                color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                                fontSize: '0.85rem',
                                fontWeight: isSelected ? 700 : 500,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <Icon size={15} />
                              {st.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Qty Counter */}
                    <div style={{ maxWidth: '160px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                        Jumlah (Potong) *
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                        required
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          fontSize: '0.9rem',
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    </div>

                    {/* Catatan Ukuran dengan Quick Template & Tags */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          Catatan Ukuran Buku & Pola:
                        </label>

                        {/* 1-Click Template Inserter */}
                        <button
                          type="button"
                          onClick={() => handleInsertTemplate(idx, item.service_type_id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            backgroundColor: '#FEF3C7',
                            border: '1px solid #FDE68A',
                            color: '#92400E',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <FileText size={12} />
                          + Sisipkan Format Standar
                        </button>
                      </div>

                      <Textarea
                        placeholder="Ketik ukuran atau klik tombol '+ Sisipkan Format Standar' di atas..."
                        value={item.measurements_note}
                        onChange={(e) => handleItemChange(idx, 'measurements_note', e.target.value)}
                        rows={3}
                        style={{ fontSize: '0.85rem' }}
                      />

                      {/* Quick Tag Chips */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pilihan cepat:</span>
                        {quickTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleAddQuickTag(idx, tag)}
                            style={{
                              padding: '0.15rem 0.45rem',
                              borderRadius: '999px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid var(--border)',
                              fontSize: '0.7rem',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'var(--primary)';
                              e.currentTarget.style.color = 'var(--primary)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border)';
                              e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* KOLOM KANAN: STICKY SIDEBAR (TOTAL HARGA & RINGKASAN NOTA) */}
        <div style={{ position: 'sticky', top: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Card Total Biaya */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700 }}>
                3
              </span>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Total Biaya Jahit
              </h2>
            </div>

            <CurrencyInput
              label="Nominal Total Nota (Rp)"
              placeholder="Contoh: 1.500.000"
              value={totalPrice}
              onChangeValue={(_num, formatted) => {
                setTotalPrice(formatted);
              }}
              required
            />

            {/* Quick Estimate Chips */}
            <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {['1.500.000', '1.850.000', '2.500.000'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTotalPrice(preset)}
                  style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: 'var(--surface-alt)',
                    border: '1px solid var(--border)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  Rp {preset}
                </button>
              ))}
            </div>
          </Card>

          {/* Card Ringkasan Nota Pra-Cetak */}
          <Card style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.75rem' }}>
              Ringkasan Nota Pesanan
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Pelanggan:</span>
                <strong style={{ color: selectedCustomer ? 'var(--text-primary)' : 'var(--warning)', textAlign: 'right' }}>
                  {selectedCustomer ? selectedCustomer.name : 'Belum dipilih'}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Jumlah Busana:</span>
                <strong>{totalItemCount} potong ({items.length} jenis)</strong>
              </div>

              <div style={{ borderTop: '1px dashed var(--border)', margin: '0.35rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Total Biaya:</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>
                  {totalPrice ? `Rp ${totalPrice}` : 'Rp 0'}
                </strong>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.35, marginTop: '0.25rem' }}>
                Nomor nota unik (format PT-XXXXXX) akan langsung diterbitkan otomatis saat pesanan disimpan.
              </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Button type="submit" size="lg" loading={submitting} style={{ width: '100%' }}>
                Simpan & Terbitkan Nota
                <ArrowRight size={16} style={{ marginLeft: '0.4rem' }} />
              </Button>
              <Link href="/pesanan" style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', padding: '0.35rem' }}>
                Batal dan Kembali
              </Link>
            </div>
          </Card>
        </div>
      </form>

      {/* MODAL INLINE: TAMBAH PELANGGAN CEPAT (TANPA PINDAH HALAMAN) */}
      {showCustomerModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCustomerModal(false);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Tambah Pelanggan Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomerModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {customerModalError && (
              <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '4px', fontSize: '0.85rem' }}>
                {customerModalError}
              </div>
            )}

            <form onSubmit={handleCreateNewCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <Input
                label="Nama Lengkap Pelanggan *"
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                placeholder="Contoh: Bpk. Bambang Wijaya"
                required
              />

              <Input
                label="Nomor Telepon / WhatsApp *"
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                required
              />

              <Textarea
                label="Alamat Lengkap *"
                value={newCustAddress}
                onChange={(e) => setNewCustAddress(e.target.value)}
                placeholder="Contoh: Jl. Slamet Riyadi No. 45, Sukoharjo"
                rows={2}
                required
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowCustomerModal(false)}>
                  Batal
                </Button>
                <Button type="submit" size="sm" loading={savingCustomer}>
                  Simpan & Pilih Pelanggan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default function NewOrderPage() {
  return (
    <AppLayout>
      <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Buat Pesanan Baru
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Pilih pelanggan, tentukan spesifikasi ukuran busana, dan terbitkan nota fisik workshop.
          </p>
        </div>

        <Suspense fallback={<LoadingSpinner text="Mempersiapkan formulir pesanan..." />}>
          <NewOrderForm />
        </Suspense>
      </div>
    </AppLayout>
  );
}
