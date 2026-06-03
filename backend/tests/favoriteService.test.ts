import { favoriteService } from '../src/services/favoriteService';

describe('FavoriteService', () => {
  beforeEach(() => {
    // Reset by removing all favorites
    const favs = favoriteService.getAll();
    favs.forEach(f => {
      try { favoriteService.remove(f.id); } catch {}
    });
  });

  it('should add a favorite', () => {
    const fav = favoriteService.add(25, 'pikachu', 'https://example.com/pikachu.png');
    expect(fav).toHaveProperty('id', 25);
    expect(fav).toHaveProperty('name', 'pikachu');
  });

  it('should get all favorites', () => {
    favoriteService.add(25, 'pikachu', 'img1');
    favoriteService.add(1, 'bulbasaur', 'img2');
    const all = favoriteService.getAll();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  it('should remove a favorite', () => {
    favoriteService.add(999, 'testmon', 'img');
    favoriteService.remove(999);
    expect(favoriteService.isFavorite(999)).toBe(false);
  });

  it('should not add duplicate favorites', () => {
    favoriteService.add(25, 'pikachu', 'img1');
    favoriteService.add(25, 'pikachu', 'img2');
    const all = favoriteService.getAll();
    const pikachus = all.filter(f => f.id === 25);
    expect(pikachus.length).toBe(1);
  });

  it('should check if favorite exists', () => {
    favoriteService.add(25, 'pikachu', 'img');
    expect(favoriteService.isFavorite(25)).toBe(true);
    expect(favoriteService.isFavorite(999)).toBe(false);
  });
});