import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { PokemonDetailPage } from './pages/PokemonDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ComparePage } from './pages/ComparePage';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-logo"><h1>Pokedex</h1></Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/compare" className="nav-link">Compare</Link>
          <Link to="/favorites" className="nav-link">Favorites</Link>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pokemon/:nameOrId" element={<PokemonDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Routes>
      </main>
    </div>
  );
}