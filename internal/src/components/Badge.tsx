import React from 'react';
import { OrderStatus } from '@/types';

interface BadgeProps {
  status: OrderStatus | string;
}

export function StatusBadge({ status }: BadgeProps) {
  let label = status;
  let bg = 'var(--surface-alt)';
  let color = 'var(--text-secondary)';
  let border = 'var(--border)';
  let dot = '#94A3B8';

  switch (status) {
    case 'baru':
      label = 'Baru';
      bg = '#F1F5F9';
      color = '#334155';
      border = '#CBD5E1';
      dot = '#64748B';
      break;
    case 'diproses':
      label = 'Diproses';
      bg = '#FFFBEB';
      color = '#B45309';
      border = '#FDE68A';
      dot = '#D97706';
      break;
    case 'selesai':
      label = 'Selesai';
      bg = '#ECFDF5';
      color = '#047857';
      border = '#A7F3D0';
      dot = '#059669';
      break;
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.2rem 0.65rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        lineHeight: 1.25,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: dot,
          flexShrink: 0,
        }}
      />
      <span>{label}</span>
    </span>
  );
}
