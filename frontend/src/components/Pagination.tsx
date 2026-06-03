import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    if (start > 1) { pages.push(1); if (start > 2) pages.push('...'); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) { if (end < totalPages - 1) pages.push('...'); pages.push(totalPages); }
    return pages;
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} aria-label="Previous page">Prev</button>
      {getVisiblePages().map((page, index) =>
        typeof page === 'number' ? (
          <button key={index} onClick={() => onPageChange(page)} className={page === currentPage ? 'active' : ''} aria-current={page === currentPage ? 'page' : undefined}>{page}</button>
        ) : (
          <span key={index} className="pagination-ellipsis">{page}</span>
        )
      )}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} aria-label="Next page">Next</button>
    </nav>
  );
}