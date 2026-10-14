import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage?: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function Pagination({
  currentPage,
  lastPage,
  total,
  perPage = 15,
  onPageChange,
  loading = false,
}: PaginationProps) {
  if (total <= 0 || lastPage <= 1) {
    return null;
  }

  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (lastPage <= 7) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', lastPage);
      } else if (currentPage >= lastPage - 2) {
        pages.push(1, '...', lastPage - 3, lastPage - 2, lastPage - 1, lastPage);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.875rem 1.25rem',
        borderTop: '1px solid var(--border)',
        backgroundColor: '#FFFFFF',
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
      }}
    >
      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
        Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{from}-{to}</strong> dari{' '}
        <strong style={{ color: 'var(--text-primary)' }}>{total}</strong> data
        {perPage && <span style={{ color: 'var(--text-muted)' }}> (maks. {perPage}/hal)</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        {/* Prev Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.4rem 0.75rem',
            minHeight: '34px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            backgroundColor: '#FFFFFF',
            color: currentPage <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
            cursor: currentPage <= 1 || loading ? 'not-allowed' : 'pointer',
            opacity: currentPage <= 1 ? 0.6 : 1,
            transition: 'all 0.15s ease',
          }}
        >
          <ChevronLeft size={15} />
          <span>Sebelumnya</span>
        </button>

        {/* Page Number Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  style={{
                    padding: '0 0.4rem',
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  …
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                disabled={loading || isActive}
                style={{
                  minWidth: '34px',
                  height: '34px',
                  padding: '0 0.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: 'var(--radius-sm)',
                  border: isActive ? '1px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: isActive ? 'var(--primary)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--text-primary)',
                  cursor: isActive || loading ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 1px 3px rgba(30, 58, 95, 0.2)' : 'none',
                }}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage || loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.4rem 0.75rem',
            minHeight: '34px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            backgroundColor: '#FFFFFF',
            color: currentPage >= lastPage ? 'var(--text-muted)' : 'var(--text-primary)',
            cursor: currentPage >= lastPage || loading ? 'not-allowed' : 'pointer',
            opacity: currentPage >= lastPage ? 0.6 : 1,
            transition: 'all 0.15s ease',
          }}
        >
          <span>Selanjutnya</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
