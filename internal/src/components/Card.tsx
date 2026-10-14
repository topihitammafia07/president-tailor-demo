import React, { ReactNode } from 'react';

export function Card({
  children,
  style,
  className,
  padding = 'md',
}: {
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}) {
  const paddingMap = {
    none: '0',
    sm: '0.85rem 1rem',
    md: '1.25rem',
    lg: '1.75rem',
  };

  return (
    <div
      className={className}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        padding: paddingMap[padding] ?? '1.25rem',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function LoadingSpinner({ text = 'Memuat data...' }: { text?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        gap: '0.75rem',
        color: 'var(--text-secondary)',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span style={{ fontSize: '0.9rem' }}>{text}</span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3rem 1.5rem',
        backgroundColor: 'var(--surface-alt)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--border)',
        margin: '1rem 0',
      }}
    >
      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
        {title}
      </h3>
      {message && (
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1rem' }}>
          {message}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

export function ErrorAlert({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      style={{
        backgroundColor: 'var(--error-bg)',
        border: '1px solid var(--error-border)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.15rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        color: 'var(--error)',
        fontSize: '0.9rem',
        margin: '1rem 0',
      }}
    >
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--error)',
            fontWeight: 700,
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}
