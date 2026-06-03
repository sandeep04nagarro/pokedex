import React from 'react';
import { Link } from 'react-router-dom';
import { usePokemon } from '../context/PokemonContext';

export function FavoritesPage() {
  const { favorites, removeFavorite } = usePokemon();

  return (
    <div className="favorites-page">
      <Link to="/" className="back-link">Back to Pokedex</Link>
      <h1>My Favorite Pokemon</h1>
      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>No favorite Pokemon yet.</p>
          <Link to="/" className="browse-link">Browse Pokemon</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((fav) => (
            <div key={fav.id} className="favorite-card">
              <Link to={`/pokemon/${fav.name}`}>
                <img src={fav.image} alt={fav.name} loading="lazy" />
                <h3>{fav.name.charAt(0).toUpperCase() + fav.name.slice(1)}</h3>
                <span className="favorite-id">#{String(fav.id).padStart(3, '0')}</span>
              </Link>
              <button className="remove-favorite" onClick={() => removeFavorite(fav.id)} aria-label={`Remove ${fav.name} from favorites`}>X</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}