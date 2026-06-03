import React from 'react';
import { TypeOption } from '../types';

interface TypeFilterProps {
  types: TypeOption[];
  selected: string;
  onChange: (type: string) => void;
}

export function TypeFilter({ types, selected, onChange }: TypeFilterProps) {
  return (
    <div className="type-filter">
      <label htmlFor="type-select">Filter by type:</label>
      <select
        id="type-select"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All Types</option>
        {types.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}