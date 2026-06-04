import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { usePokemon } from '../context/PokemonContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EvolutionChain } from '../components/EvolutionChain';

const STAT_NAMES: Record<string, string> = { hp: 'HP', attack: 'Attack', defense: 'Defense', 'special-attack': 'Sp. Atk', 'special-defense': 'Sp. Def', speed: 'Speed' };

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
};

export function PokemonDetailPage() {
  const { nameOrId } = useParams<{ nameOrId: string }>();
  const { pokemon, loading, error } = usePokemonDetail(nameOrId || '');
  const { isFavorite, addFavorite, removeFavorite, addToRecentlyViewed } = usePokemon();

  useEffect(() => {
    if (pokemon) {
      const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
      addToRecentlyViewed({ id: pokemon.id, name: pokemon.name, image: imageUrl || '' });
    }
  }, [pokemon, addToRecentlyViewed]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!pokemon) return null;

  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const bgColor = TYPE_COLORS[primaryType] || '#A8A878';
  const fav = isFavorite(pokemon.id);

  return (
    <div className="pokemon-detail" style={{ '--accent': bgColor } as React.CSSProperties}>
      <Link to="/" className="back-link">Back to Pokedex</Link>
      <div className="detail-hero" style={{ backgroundColor: bgColor + '22' }}>
        <div className="detail-hero-content">
          <span className="detail-id">#{String(pokemon.id).padStart(3, '0')}</span>
          <h1 className="detail-name">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
          <div className="detail-types">
            {pokemon.types.map((t) => (
              <span key={t.type.name} className="type-badge large" style={{ backgroundColor: TYPE_COLORS[t.type.name] || '#A8A878' }}>{t.type.name}</span>
            ))}
          </div>
          <button className={`favorite-button ${fav ? 'favorited' : ''}`} onClick={() => fav ? removeFavorite(pokemon.id) : addFavorite(pokemon.id, pokemon.name, imageUrl || '')} aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}>
            {fav ? 'Favorited' : 'Add to Favorites'}
          </button>
        </div>
        <img src={imageUrl || ''} alt={pokemon.name} className="detail-image" />
      </div>
      <div className="detail-info">
        <div className="detail-section">
          <h2>Physical Info</h2>
          <div className="detail-stats-row">
            <div className="stat-box"><span className="stat-label">Height</span><span className="stat-value">{(pokemon.height / 10).toFixed(1)} m</span></div>
            <div className="stat-box"><span className="stat-label">Weight</span><span className="stat-value">{(pokemon.weight / 10).toFixed(1)} kg</span></div>
            <div className="stat-box"><span className="stat-label">Base Exp</span><span className="stat-value">{pokemon.base_experience || 'N/A'}</span></div>
          </div>
        </div>
        <div className="detail-section">
          <h2>Abilities</h2>
          <div className="abilities-list">
            {pokemon.abilities.map((a) => (
              <span key={a.ability.name} className={`ability-badge ${a.is_hidden ? 'hidden-ability' : ''}`}>
                {a.ability.name.replace('-', ' ')}{a.is_hidden && ' (Hidden)'}
              </span>
            ))}
          </div>
        </div>
        <div className="detail-section">
          <h2>Stats</h2>
          <div className="stats-list">
            {pokemon.stats.map((s) => (
              <div key={s.stat.name} className="stat-row">
                <span className="stat-name">{STAT_NAMES[s.stat.name] || s.stat.name}</span>
                <div className="stat-bar-container">
                  <div className="stat-bar" style={{ width: `${Math.min((s.base_stat / 255) * 100, 100)}%`, backgroundColor: bgColor }} />
                </div>
                <span className="stat-value">{s.base_stat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <EvolutionChain pokemonNameOrId={nameOrId || ''} />
    </div>
  );
}