'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, ErrorAlert } from '@/components/Card';

import { ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal masuk ke sistem. Periksa email dan kata sandi Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setError(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: 'var(--bg)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1.25rem',
              borderRadius: 'var(--radius-md)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
            }}
          >
            PT
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            President Tailor
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Masuk ke Dashboard Sistem
          </p>
        </div>

        <Card style={{ padding: '1.75rem' }}>
          {/* Quick-fill Demo Shortcut Chips */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.45rem' }}>
              Pilih Akun Demo (1-Klik):
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('owner@presidenttailor.com', 'password')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #BBF7D0',
                  backgroundColor: '#F0FDF4',
                  color: '#166534',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <ShieldCheck size={14} />
                Akun Owner
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('staff@presidenttailor.com', 'password')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #BFDBFE',
                  backgroundColor: '#EFF6FF',
                  color: '#1E40AF',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <UserCheck size={14} />
                Akun Staf
              </button>
            </div>
          </div>

          {error && <ErrorAlert message={error} />}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <Input
              label="Email Akun"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@presidenttailor.com atau staff@presidenttailor.com"
              required
              autoComplete="username"
            />

            <Input
              label="Kata Sandi"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <Button type="submit" loading={loading} style={{ width: '100%', marginTop: '0.4rem' }}>
              Masuk ke Sistem
            </Button>
          </form>

          <div
            style={{
              marginTop: '1.25rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid var(--border)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              lineHeight: 1.45,
            }}
          >
            <strong>Role Akun:</strong>
            <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
              <li><strong>Owner:</strong> Akses Dashboard Eksekutif & Laporan Keuangan Bisnis.</li>
              <li><strong>Staf:</strong> Operasional pesanan, pelanggan, status jahit, & kasir.</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
