import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Favorite } from '../types';
import * as api from '../services/api';

interface PokemonContextType {
  favorites: Favorite[];
  recentlyViewed: Array<{ id: number; name: string; image: string }>;
  loading: boolean;
  error: string | null;
  addFavorite: (pokemonId: number, name: string, image: string) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
  isFavorite: (id: number) => boolean;
  addToRecentlyViewed: (pokemon: { id: number; name: string; image: string }) => void;
  clearError: () => void;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

const RECENTLY_VIEWED_KEY = 'pokedex_recently_viewed';
const MAX_RECENTLY_VIEWED = 10;

export function PokemonProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Array<{ id: number; name: string; image: string }>>(() => {
    try {
      const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  useEffect(() => {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addFavoriteHandler = useCallback(async (pokemonId: number, name: string, image: string) => {
    try {
      const fav = await api.addFavorite(pokemonId, name, image);
      setFavorites((prev) => {
        if (prev.find((f) => f.id === pokemonId)) return prev;
        return [...prev, fav];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add favorite');
    }
  }, []);

  const removeFavoriteHandler = useCallback(async (id: number) => {
    try {
      await api.removeFavorite(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove favorite');
    }
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const addToRecentlyViewed = useCallback((pokemon: { id: number; name: string; image: string }) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== pokemon.id);
      return [pokemon, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <PokemonContext.Provider
      value={{
        favorites,
        recentlyViewed,
        loading,
        error,
        addFavorite: addFavoriteHandler,
        removeFavorite: removeFavoriteHandler,
        isFavorite,
        addToRecentlyViewed,
        clearError,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemon() {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }
  return context;
}