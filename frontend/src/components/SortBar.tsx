import React from 'react';

export type SortOption = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc';

interface SortBarProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'id-asc', label: 'ID ↑' },
  { value: 'id-desc', label: 'ID ↓' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
];

export function SortBar({ value, onChange }: SortBarProps) {
  return (
    <div className="sort-bar">
      <label htmlFor="sort-select">Sort by:</label>
      <select id="sort-select" value={value} onChange={(e) => onChange(e.target.value as SortOption)}>
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
