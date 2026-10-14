'use client';

import React, { useState } from 'react';
import { FAQS } from '@/lib/constants';

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        const answerId = `faq-answer-${idx}`;

        return (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--c-surface)',
              border: '1px solid var(--c-border-subtle)',
              borderRadius: 'var(--r-md)',
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              aria-controls={answerId}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '1.0625rem',
                fontWeight: 600,
                color: 'var(--c-text-dark)',
                gap: '1rem',
              }}
            >
              <span>{faq.q}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: isOpen ? 'var(--c-gold-light)' : 'var(--c-creme)',
                  color: isOpen ? 'var(--c-gold-dark)' : 'var(--c-text-dark)',
                  flexShrink: 0,
                  transition: 'transform 0.2s, background-color 0.2s',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  fontSize: '0.875rem',
                }}
                aria-hidden="true"
              >
                ▼
              </span>
            </button>

            {isOpen && (
              <div
                id={answerId}
                style={{
                  padding: '0 1.5rem 1.25rem 1.5rem',
                  color: 'var(--c-text-dark-sub)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.65,
                  borderTop: '1px solid rgba(229, 223, 192, 0.4)',
                  paddingTop: '1rem',
                }}
              >
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
