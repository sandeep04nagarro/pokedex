import React from 'react';
import { Link } from 'react-router-dom';

interface RecentlyViewedProps {
  pokemon: Array<{ id: number; name: string; image: string }>;
}

export function RecentlyViewed({ pokemon }: RecentlyViewedProps) {
  if (pokemon.length === 0) return null;
  return (
    <section className="recently-viewed">
      <h2>Recently Viewed</h2>
      <div className="recently-viewed-list">
        {pokemon.map((p) => (
          <Link key={p.id} to={`/pokemon/${p.name}`} className="recently-viewed-item">
            <img src={p.image} alt={p.name} loading="lazy" />
            <span>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}