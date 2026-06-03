import { useState, useEffect, useCallback } from 'react';
import { Pokemon } from '../types';
import * as api from '../services/api';

interface UsePokemonListResult {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
}

export function usePokemonList(): UsePokemonListResult {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

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
        if (selectedType) {
          filtered = filtered.filter((p) => p.types.includes(selectedType.toLowerCase()));
        }
        setPokemon(filtered);
        setTotalPages(result.totalPages);
      } else if (selectedType) {
        const result = await api.getPokemonByType(selectedType, page);
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
  }, [page, debouncedSearch, selectedType]);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  return {
    pokemon,
    loading,
    error,
    page,
    totalPages,
    setPage,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
  };
}