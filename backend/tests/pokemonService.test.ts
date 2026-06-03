import { PokemonService } from '../src/services/pokemonService';
import { cache } from '../src/utils/cache';

describe('PokemonService', () => {
  let service: PokemonService;

  beforeEach(() => {
    cache.clear();
    service = new PokemonService();
  });

  describe('getPokemonList', () => {
    it('should return paginated pokemon list', async () => {
      const result = await service.getPokemonList(1, 5);
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page', 1);
      expect(result).toHaveProperty('pageSize', 5);
      expect(result.data.length).toBeLessThanOrEqual(5);
      if (result.data.length > 0) {
        expect(result.data[0]).toHaveProperty('id');
        expect(result.data[0]).toHaveProperty('name');
        expect(result.data[0]).toHaveProperty('image');
        expect(result.data[0]).toHaveProperty('types');
      }
    }, 30000);

    it('should cache results', async () => {
      const result1 = await service.getPokemonList(1, 5);
      const result2 = await service.getPokemonList(1, 5);
      expect(result1).toEqual(result2);
    }, 30000);
  });

  describe('getPokemonByNameOrId', () => {
    it('should return pokemon details by name', async () => {
      const result = await service.getPokemonByNameOrId('pikachu');
      expect(result).toHaveProperty('id', 25);
      expect(result).toHaveProperty('name', 'pikachu');
      expect(result).toHaveProperty('height');
      expect(result).toHaveProperty('weight');
      expect(result).toHaveProperty('types');
      expect(result).toHaveProperty('stats');
      expect(result).toHaveProperty('abilities');
    }, 30000);

    it('should return pokemon details by id', async () => {
      const result = await service.getPokemonByNameOrId('25');
      expect(result).toHaveProperty('name', 'pikachu');
    }, 30000);
  });

  describe('getTypes', () => {
    it('should return list of types', async () => {
      const result = await service.getTypes();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('url');
    }, 30000);
  });
});