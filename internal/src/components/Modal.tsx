'use client';

import React, { useEffect } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';
import { Button } from './Button';

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  amount?: number | string;
  amountLabel?: string;
  details?: { label: string; value: string }[];
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  amount,
  amountLabel = 'Nominal Pembayaran',
  details,
  primaryActionLabel = 'Tutup & Lanjutkan',
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: SuccessModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrimary = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      onClose();
    }
  };

  return (
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
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          border: '1px solid var(--border)',
          padding: '2rem 1.75rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Dismiss X button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Tutup"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
          }}
        >
          <X size={18} />
        </button>

        {/* Green Checkmark Icon (Tanda Centang Hijau di Tengah) */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: '#DCFCE7',
            border: '3px solid #BBF7D0',
            boxShadow: '0 0 0 6px #F0FDF4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            flexShrink: 0,
          }}
        >
          <Check size={36} color="#15803D" strokeWidth={3} />
        </div>

        {/* Modal Title */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '0 0 0.4rem',
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>

        {/* Message */}
        {message && (
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: '0 0 1rem',
              lineHeight: 1.5,
            }}
          >
            {message}
          </p>
        )}

        {/* Amount Box */}
        {amount !== undefined && (
          <div
            style={{
              width: '100%',
              backgroundColor: 'var(--bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '0.9rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {amountLabel}
            </div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--primary)',
                marginTop: '0.2rem',
              }}
            >
              {typeof amount === 'number'
                ? `Rp ${amount.toLocaleString('id-ID')}`
                : amount}
            </div>
          </div>
        )}

        {/* Details list */}
        {details && details.length > 0 && (
          <div
            style={{
              width: '100%',
              backgroundColor: 'var(--bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
              textAlign: 'left',
            }}
          >
            {details.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.825rem',
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginTop: '0.25rem' }}>
          <Button
            type="button"
            onClick={handlePrimary}
            style={{ width: '100%', minHeight: '44px', fontWeight: 700 }}
          >
            {primaryActionLabel}
          </Button>

          {secondaryActionLabel && onSecondaryAction && (
            <Button
              type="button"
              variant="outline"
              onClick={onSecondaryAction}
              style={{ width: '100%', minHeight: '40px' }}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Ya, Konfirmasi',
  cancelLabel = 'Batal',
  loading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
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
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          border: '1px solid var(--border)',
          padding: '2rem 1.75rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            border: '2px solid var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <HelpCircle size={32} color="var(--primary)" />
        </div>

        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '0 0 0.5rem',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            margin: '0 0 1.5rem',
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            loading={loading}
            style={{ flex: 1 }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
