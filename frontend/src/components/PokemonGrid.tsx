import React from 'react';
import { Pokemon } from '../types';
import { PokemonCard } from './PokemonCard';

interface PokemonGridProps {
  pokemon: Pokemon[];
}

export function PokemonGrid({ pokemon }: PokemonGridProps) {
  if (pokemon.length === 0) {
    return <div className="empty-state">No Pokemon found</div>;
  }
  return (
    <div className="pokemon-grid">
      {pokemon.map((p) => (
        <PokemonCard key={p.id} pokemon={p} />
      ))}
    </div>
  );
}