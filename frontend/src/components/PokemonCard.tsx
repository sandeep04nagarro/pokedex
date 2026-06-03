import React from 'react';
import { Link } from 'react-router-dom';
import { Pokemon } from '../types';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const primaryType = pokemon.types[0] || 'normal';
  const bgColor = TYPE_COLORS[primaryType] || '#A8A878';

  return (
    <Link to={`/pokemon/${pokemon.name}`} className="pokemon-card" style={{ borderColor: bgColor }}>
      <div className="pokemon-card-image" style={{ backgroundColor: bgColor + '33' }}>
        <img src={pokemon.image} alt={pokemon.name} loading="lazy" />
      </div>
      <div className="pokemon-card-info">
        <span className="pokemon-card-id">#{String(pokemon.id).padStart(3, '0')}</span>
        <h3 className="pokemon-card-name">
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </h3>
        <div className="pokemon-card-types">
          {pokemon.types.map((type) => (
            <span key={type} className="type-badge" style={{ backgroundColor: TYPE_COLORS[type] || '#A8A878' }}>
              {type}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}