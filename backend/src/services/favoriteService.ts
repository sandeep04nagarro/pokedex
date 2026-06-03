import { Favorite } from '../types';

class FavoriteNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FavoriteNotFoundError';
  }
}

class FavoriteService {
  private favorites: Map<number, Favorite> = new Map();

  getAll(): Favorite[] {
    return Array.from(this.favorites.values()).sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    );
  }

  add(pokemonId: number, name: string, image: string): Favorite {
    const existing = this.favorites.get(pokemonId);
    if (existing) return existing;

    const favorite: Favorite = {
      id: pokemonId,
      name,
      image,
      addedAt: new Date().toISOString(),
    };
    this.favorites.set(pokemonId, favorite);
    return favorite;
  }

  remove(pokemonId: number): void {
    if (!this.favorites.has(pokemonId)) {
      throw new FavoriteNotFoundError('Favorite not found');
    }
    this.favorites.delete(pokemonId);
  }

  isFavorite(pokemonId: number): boolean {
    return this.favorites.has(pokemonId);
  }
}

export const favoriteService = new FavoriteService();