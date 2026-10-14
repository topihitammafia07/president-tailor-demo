import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  let bg = '#0C1626';
  let color = '#FFFFFF';
  let border = '1px solid transparent';
  let shadow = '0 1px 2px rgba(0, 0, 0, 0.08)';

  if (variant === 'secondary') {
    bg = '#FFFFFF';
    color = 'var(--text-primary)';
    border = '1px solid var(--border)';
    shadow = '0 1px 2px rgba(0, 0, 0, 0.04)';
  } else if (variant === 'outline') {
    bg = 'transparent';
    color = 'var(--primary)';
    border = '1px solid var(--border)';
    shadow = 'none';
  } else if (variant === 'danger') {
    bg = '#DC2626';
    color = '#FFFFFF';
    shadow = '0 1px 2px rgba(220, 38, 38, 0.2)';
  }

  const padding = size === 'sm' ? '0.35rem 0.85rem' : size === 'lg' ? '0.75rem 1.6rem' : '0.5rem 1.25rem';
  const fontSize = size === 'sm' ? '0.8125rem' : size === 'lg' ? '0.95rem' : '0.875rem';

  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.45rem',
        padding,
        fontSize,
        fontWeight: 600,
        backgroundColor: bg,
        color,
        border,
        borderRadius: 'var(--radius-md)',
        boxShadow: shadow,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.65 : 1,
        minHeight: '40px',
        transition: 'all 0.15s ease',
        letterSpacing: '0.01em',
        ...style,
      }}
      {...props}
    >
      {loading ? 'Memproses...' : children}
    </button>
  );
}
