import React, { useState, useRef, useEffect } from 'react';
import { TypeOption } from '../types';

interface TypeFilterProps {
  types: TypeOption[];
  selected: string[];
  onChange: (types: string[]) => void;
}

export function TypeFilter({ types, selected, onChange }: TypeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleType = (typeName: string) => {
    if (selected.includes(typeName)) {
      onChange(selected.filter(t => t !== typeName));
    } else {
      onChange([...selected, typeName]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectedCount = selected.length;

  return (
    <div className="type-filter" ref={containerRef}>
      <label>Filter by type:</label>
      <div className="type-dropdown">
        <button
          type="button"
          className="type-dropdown-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>
            {selectedCount === 0
              ? 'All Types'
              : `${selectedCount} type${selectedCount > 1 ? 's' : ''} selected`
            }
          </span>
          <span className={`arrow ${isOpen ? 'up' : 'down'}`}>▼</span>
        </button>
        {isOpen && (
          <div className="type-dropdown-menu">
            <div className="type-dropdown-header">
              <button type="button" className="clear-types" onClick={clearAll}>
                Clear all
              </button>
            </div>
            <div className="type-checkbox-list">
              {types.map((type) => {
                const isSelected = selected.includes(type.name);
                return (
                  <label key={type.name} className="type-checkbox-item">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleType(type.name)}
                    />
                    <span className={`type-badge type-${type.name}`}>
                      {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}