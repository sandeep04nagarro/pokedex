import { useState, useEffect, useCallback, useMemo } from 'react';
import { Pokemon } from '../types';
import * as api from '../services/api';
import { SortOption } from '../components/SortBar';

interface UsePokemonListResult {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
}

function sortPokemon(pokemon: Pokemon[], sort: SortOption): Pokemon[] {
  const sorted = [...pokemon];
  switch (sort) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'id-desc':
      return sorted.sort((a, b) => b.id - a.id);
    case 'id-asc':
    default:
      return sorted.sort((a, b) => a.id - b.id);
  }
}

export function usePokemonList(): UsePokemonListResult {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('id-asc');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchPokemon = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (debouncedSearch) {
        const result = await api.searchPokemon(debouncedSearch, page);
        let filtered = result.data;
        if (selectedTypes.length > 0) {
          filtered = filtered.filter((p) =>
            selectedTypes.some(type => p.types.includes(type.toLowerCase()))
          );
        }
        setPokemon(filtered);
        setTotalPages(result.totalPages);
      } else if (selectedTypes.length > 0) {
        const result = await api.getPokemonByMultipleTypes(selectedTypes, page);
        setPokemon(result.data);
        setTotalPages(result.totalPages);
      } else {
        const result = await api.getPokemonList(page);
        setPokemon(result.data);
        setTotalPages(result.totalPages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedTypes]);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  const sortedPokemon = useMemo(() => sortPokemon(pokemon, sortBy), [pokemon, sortBy]);

  return {
    pokemon: sortedPokemon,
    loading,
    error,
    page,
    totalPages,
    setPage,
    searchQuery,
    setSearchQuery,
    selectedTypes,
    setSelectedTypes,
    sortBy,
    setSortBy,
  };
}