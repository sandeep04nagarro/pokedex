import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EvolutionChain as EvolutionChainType } from '../types';
import { getEvolutionChain } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';

interface EvolutionChainProps {
  pokemonNameOrId: string;
}

export function EvolutionChain({ pokemonNameOrId }: EvolutionChainProps) {
  const [chain, setChain] = useState<EvolutionChainType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getEvolutionChain(pokemonNameOrId)
      .then((data) => { if (!cancelled) setChain(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [pokemonNameOrId]);

  if (loading) return <div className="evolution-loading"><LoadingSpinner /></div>;
  if (error) return null;
  if (!chain || chain.pokemon.length <= 1) return null;

  return (
    <div className="detail-section evolution-chain">
      <h2>Evolution Chain</h2>
      <div className="evolution-flow">
        {chain.pokemon.map((pokemon, index) => (
          <React.Fragment key={pokemon.id}>
            {index > 0 && <span className="evolution-arrow">→</span>}
            <Link to={`/pokemon/${pokemon.name}`} className="evolution-item">
              <img src={pokemon.image} alt={pokemon.name} loading="lazy" />
              <span className="evolution-name">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
              <span className="evolution-id">#{String(pokemon.id).padStart(3, '0')}</span>
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
