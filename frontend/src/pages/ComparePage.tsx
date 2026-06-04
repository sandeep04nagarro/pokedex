import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as api from '../services/api';
import { PokemonWithStats, Pokemon } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

const STAT_NAMES: Record<string, string> = { hp: 'HP', attack: 'Attack', defense: 'Defense', 'special-attack': 'Sp. Atk', 'special-defense': 'Sp. Def', speed: 'Speed' };
const ALL_STATS = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
};

export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pokemonA, setPokemonA] = useState<PokemonWithStats | null>(null);
  const [pokemonB, setPokemonB] = useState<PokemonWithStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchA, setSearchA] = useState(searchParams.get('a') || '');
  const [searchB, setSearchB] = useState(searchParams.get('b') || '');
  const [suggestionsA, setSuggestionsA] = useState<Pokemon[]>([]);
  const [suggestionsB, setSuggestionsB] = useState<Pokemon[]>([]);

  const fetchPokemon = useCallback(async (ids: number[]) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPokemonByIds(ids);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const a = searchParams.get('a');
    const b = searchParams.get('b');
    if (a && b) {
      Promise.all([api.getPokemonByNameOrId(a), api.getPokemonByNameOrId(b)]).then(([dataA, dataB]) => {
        fetchPokemon([dataA.id, dataB.id]).then((results) => {
          if (results.length === 2) {
            setPokemonA(results[0]);
            setPokemonB(results[1]);
          }
        });
      }).catch(() => {});
    }
  }, [searchParams, fetchPokemon]);

  const searchSuggestions = useCallback(async (query: string, setSuggestions: (s: Pokemon[]) => void) => {
    if (!query || query.length < 1) { setSuggestions([]); return; }
    try {
      const result = await api.searchPokemon(query, 1, 5);
      setSuggestions(result.data);
    } catch {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchSuggestions(searchA, setSuggestionsA), 300);
    return () => clearTimeout(timer);
  }, [searchA, searchSuggestions]);

  useEffect(() => {
    const timer = setTimeout(() => searchSuggestions(searchB, setSuggestionsB), 300);
    return () => clearTimeout(timer);
  }, [searchB, searchSuggestions]);

  const selectPokemon = async (name: string, side: 'a' | 'b') => {
    if (side === 'a') { setSearchA(name); setSuggestionsA([]); }
    else { setSearchB(name); setSuggestionsB([]); }
  };

  const handleCompare = async () => {
    if (!searchA || !searchB) return;
    setSearchParams({ a: searchA, b: searchB });
    setLoading(true);
    setError(null);
    try {
      const [dataA, dataB] = await Promise.all([
        api.getPokemonByNameOrId(searchA),
        api.getPokemonByNameOrId(searchB),
      ]);
      const results = await fetchPokemon([dataA.id, dataB.id]);
      if (results.length === 2) {
        setPokemonA(results[0]);
        setPokemonB(results[1]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon');
    } finally {
      setLoading(false);
    }
  };

  const getStatValue = (pokemon: PokemonWithStats, statName: string): number => {
    return pokemon.stats.find((s) => s.stat.name === statName)?.base_stat || 0;
  };

  const totalStats = (pokemon: PokemonWithStats): number => {
    return pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
  };

  return (
    <div className="compare-page">
      <h1>Compare Pokemon</h1>
      <div className="compare-controls">
        <div className="compare-search">
          <label htmlFor="search-a">Pokemon 1</label>
          <input id="search-a" type="text" value={searchA} onChange={(e) => setSearchA(e.target.value)} placeholder="e.g. pikachu" />
          {suggestionsA.length > 0 && (
            <ul className="compare-suggestions">
              {suggestionsA.map((p) => (
                <li key={p.id} onClick={() => selectPokemon(p.name, 'a')}>
                  <img src={p.image} alt={p.name} width="30" height="30" />
                  <span>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="compare-button" onClick={handleCompare} disabled={!searchA || !searchB || loading}>
          Compare
        </button>
        <div className="compare-search">
          <label htmlFor="search-b">Pokemon 2</label>
          <input id="search-b" type="text" value={searchB} onChange={(e) => setSearchB(e.target.value)} placeholder="e.g. charizard" />
          {suggestionsB.length > 0 && (
            <ul className="compare-suggestions">
              {suggestionsB.map((p) => (
                <li key={p.id} onClick={() => selectPokemon(p.name, 'b')}>
                  <img src={p.image} alt={p.name} width="30" height="30" />
                  <span>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {pokemonA && pokemonB && !loading && (
        <div className="compare-result">
          <div className="compare-cards">
            <CompareCard pokemon={pokemonA} />
            <CompareCard pokemon={pokemonB} />
          </div>
          <div className="compare-stats">
            <h2>Stats Comparison</h2>
            {ALL_STATS.map((statName) => {
              const valA = getStatValue(pokemonA, statName);
              const valB = getStatValue(pokemonB, statName);
              const maxVal = Math.max(valA, valB, 1);
              return (
                <div key={statName} className="compare-stat-row">
                  <span className="compare-stat-value">{valA}</span>
                  <div className="compare-stat-bars">
                    <div className="compare-bar-left">
                      <div className="compare-bar" style={{ width: `${(valA / maxVal) * 100}%`, backgroundColor: valA >= valB ? '#4CAF50' : '#ccc' }} />
                    </div>
                    <span className="compare-stat-label">{STAT_NAMES[statName] || statName}</span>
                    <div className="compare-bar-right">
                      <div className="compare-bar" style={{ width: `${(valB / maxVal) * 100}%`, backgroundColor: valB >= valA ? '#4CAF50' : '#ccc' }} />
                    </div>
                  </div>
                  <span className="compare-stat-value">{valB}</span>
                </div>
              );
            })}
            <div className="compare-stat-row compare-total">
              <span className="compare-stat-value">{totalStats(pokemonA)}</span>
              <div className="compare-stat-bars">
                <div className="compare-bar-left" />
                <span className="compare-stat-label">Total</span>
                <div className="compare-bar-right" />
              </div>
              <span className="compare-stat-value">{totalStats(pokemonB)}</span>
            </div>
          </div>
        </div>
      )}

      {!pokemonA && !pokemonB && !loading && (
        <div className="empty-state">
          <p>Search for two Pokemon to compare their stats side by side.</p>
        </div>
      )}
    </div>
  );
}

function CompareCard({ pokemon }: { pokemon: PokemonWithStats }) {
  const primaryType = pokemon.types[0] || 'normal';
  const bgColor = TYPE_COLORS[primaryType] || '#A8A878';
  return (
    <div className="compare-card" style={{ borderColor: bgColor }}>
      <img src={pokemon.image} alt={pokemon.name} className="compare-card-image" />
      <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
      <span className="compare-card-id">#{String(pokemon.id).padStart(3, '0')}</span>
      <div className="compare-card-types">
        {pokemon.types.map((type) => (
          <span key={type} className="type-badge" style={{ backgroundColor: TYPE_COLORS[type] || '#A8A878' }}>{type}</span>
        ))}
      </div>
    </div>
  );
}
