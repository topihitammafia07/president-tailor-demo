import React, { InputHTMLAttributes, TextareaHTMLAttributes, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, id, style, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id || props.name || generatedId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}
        >
          {label}
          {props.required && <span style={{ color: 'var(--error)', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        style={{
          width: '100%',
          padding: '0.65rem 0.85rem',
          minHeight: '44px',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
          backgroundColor: 'var(--surface)',
          color: 'var(--text-primary)',
          fontSize: '0.95rem',
          outline: 'none',
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ fontSize: '0.8125rem', color: 'var(--error)' }}>{error}</span>}
      {helperText && !error && (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{helperText}</span>
      )}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({ label, error, helperText, id, style, ...props }: TextareaProps) {
  const generatedId = useId();
  const textareaId = id || props.name || generatedId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={textareaId}
          style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}
        >
          {label}
          {props.required && <span style={{ color: 'var(--error)', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        style={{
          width: '100%',
          padding: '0.65rem 0.85rem',
          minHeight: '80px',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
          backgroundColor: 'var(--surface)',
          color: 'var(--text-primary)',
          fontSize: '0.95rem',
          outline: 'none',
          resize: 'vertical',
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ fontSize: '0.8125rem', color: 'var(--error)' }}>{error}</span>}
      {helperText && !error && (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{helperText}</span>
      )}
    </div>
  );
}

export interface CurrencyInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value: string | number;
  onChangeValue: (num: number, formatted: string) => void;
  maxAmount?: number;
  style?: React.CSSProperties;
}

export function CurrencyInput({
  label,
  error,
  helperText,
  id,
  name,
  placeholder = '0',
  required,
  disabled,
  value,
  onChangeValue,
  style,
}: CurrencyInputProps) {
  const generatedId = useId();
  const inputId = id || name || generatedId;

  // Format value to string with thousand dot separator if numeric
  const displayValue = React.useMemo(() => {
    if (value === '' || value === null || value === undefined) return '';
    if (typeof value === 'number') {
      return value === 0 ? '' : value.toLocaleString('id-ID');
    }
    const clean = String(value).replace(/\D/g, '');
    return clean ? Number(clean).toLocaleString('id-ID') : '';
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      onChangeValue(0, '');
      return;
    }
    const num = parseInt(raw, 10);
    const formatted = num.toLocaleString('id-ID');
    onChangeValue(num, formatted);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}
        >
          {label}
          {required && <span style={{ color: 'var(--error)', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            position: 'absolute',
            left: '0.85rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        >
          Rp
        </span>
        <input
          id={inputId}
          name={name}
          type="text"
          inputMode="numeric"
          disabled={disabled}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          required={required}
          style={{
            width: '100%',
            padding: '0.65rem 0.85rem 0.65rem 2.6rem',
            minHeight: '44px',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
            backgroundColor: disabled ? 'var(--bg)' : 'var(--surface)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            fontWeight: 600,
            outline: 'none',
            ...style,
          }}
        />
      </div>
      {error && <span style={{ fontSize: '0.8125rem', color: 'var(--error)' }}>{error}</span>}
      {helperText && !error && (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{helperText}</span>
      )}
    </div>
  );
}
