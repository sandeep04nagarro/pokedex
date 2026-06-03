import { useState, useEffect } from 'react';
import { PokemonDetail } from '../types';
import * as api from '../services/api';

export function usePokemonDetail(nameOrId: string) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nameOrId) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getPokemonByNameOrId(nameOrId);
        setPokemon(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [nameOrId]);

  return { pokemon, loading, error };
}