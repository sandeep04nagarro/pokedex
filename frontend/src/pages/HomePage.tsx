import React, { useState, useEffect } from 'react';
import { usePokemonList } from '../hooks/usePokemonList';
import { usePokemon } from '../context/PokemonContext';
import { SearchBar } from '../components/SearchBar';
import { TypeFilter } from '../components/TypeFilter';
import { SortBar } from '../components/SortBar';
import { PokemonGrid } from '../components/PokemonGrid';
import { Pagination } from '../components/Pagination';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import * as api from '../services/api';
import { TypeOption } from '../types';

export function HomePage() {
  const { pokemon, loading, error, page, totalPages, setPage, searchQuery, setSearchQuery, selectedTypes, setSelectedTypes, sortBy, setSortBy } = usePokemonList();
  const { recentlyViewed } = usePokemon();
  const [types, setTypes] = useState<TypeOption[]>([]);

  useEffect(() => {
    api.getTypes().then(setTypes).catch(() => {});
  }, []);

  return (
    <div className="home-page">
      <RecentlyViewed pokemon={recentlyViewed} />
      <div className="controls">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <TypeFilter types={types} selected={selectedTypes} onChange={setSelectedTypes} />
        <SortBar value={sortBy} onChange={setSortBy} />
      </div>
      {error && <ErrorMessage message={error} />}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <PokemonGrid pokemon={pokemon} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}