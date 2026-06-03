import fetch from 'node-fetch';
import { config } from '../config';
import { cache } from '../utils/cache';
import { PokemonDetail, PokemonListItem, TypeListItem, PaginatedResponse } from '../types';

class ExternalApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExternalApiError';
  }
}

export class PokemonService {
  private baseUrl = config.pokeApiBaseUrl;

  async getPokemonList(page: number = 1, pageSize: number = config.pagination.defaultPageSize): Promise<PaginatedResponse<PokemonListItem>> {
    const cacheKey = `pokemon-list-${page}-${pageSize}`;
    const cached = cache.get<PaginatedResponse<PokemonListItem>>(cacheKey);
    if (cached) return cached;

    const offset = (page - 1) * pageSize;
    const listUrl = `${this.baseUrl}/pokemon?offset=${offset}&limit=${pageSize}`;

    let listResponse;
    try {
      listResponse = await fetch(listUrl);
    } catch {
      throw new ExternalApiError('Failed to fetch Pokemon list from PokeAPI');
    }
    if (!listResponse.ok) {
      throw new ExternalApiError(`PokeAPI returned ${listResponse.status}`);
    }

    const listData = await listResponse.json() as { count: number; results: Array<{ name: string; url: string }> };

    const pokemonDetails = await Promise.all(
      listData.results.map(async (item) => {
        const detailCacheKey = `pokemon-${item.name}`;
        const cachedDetail = cache.get<PokemonDetail>(detailCacheKey);
        if (cachedDetail) {
          return this.formatListItem(cachedDetail);
        }
        try {
          const detailResponse = await fetch(`${this.baseUrl}/pokemon/${item.name}`);
          if (!detailResponse.ok) return null;
          const detail = await detailResponse.json() as PokemonDetail;
          cache.set(detailCacheKey, detail);
          return this.formatListItem(detail);
        } catch {
          return null;
        }
      })
    );

    const result: PaginatedResponse<PokemonListItem> = {
      data: pokemonDetails.filter((p): p is PokemonListItem => p !== null),
      total: listData.count,
      page,
      pageSize,
      totalPages: Math.ceil(listData.count / pageSize),
    };

    cache.set(cacheKey, result);
    return result;
  }

  async getPokemonByNameOrId(nameOrId: string): Promise<PokemonDetail> {
    const cacheKey = `pokemon-${nameOrId.toLowerCase()}`;
    const cached = cache.get<PokemonDetail>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.baseUrl}/pokemon/${nameOrId.toLowerCase()}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new ExternalApiError(`Pokemon '${nameOrId}' not found`);
        }
        throw new ExternalApiError(`PokeAPI returned ${response.status}`);
      }
      const data = await response.json() as PokemonDetail;
      cache.set(cacheKey, data);
      return data;
    } catch (error) {
      if (error instanceof ExternalApiError) throw error;
      throw new ExternalApiError('Failed to fetch Pokemon details from PokeAPI');
    }
  }

  async getTypes(): Promise<TypeListItem[]> {
    const cacheKey = 'types';
    const cached = cache.get<TypeListItem[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.baseUrl}/type`);
      if (!response.ok) throw new ExternalApiError(`PokeAPI returned ${response.status}`);
      const data = await response.json() as { results: TypeListItem[] };
      cache.set(cacheKey, data.results);
      return data.results;
    } catch (error) {
      if (error instanceof ExternalApiError) throw error;
      throw new ExternalApiError('Failed to fetch types from PokeAPI');
    }
  }

  async searchPokemon(query: string, page: number = 1, pageSize: number = config.pagination.defaultPageSize): Promise<PaginatedResponse<PokemonListItem>> {
    const cacheKey = `search-${query.toLowerCase()}-${page}-${pageSize}`;
    const cached = cache.get<PaginatedResponse<PokemonListItem>>(cacheKey);
    if (cached) return cached;

    const allPokemonCacheKey = 'all-pokemon-names';
    let allNames = cache.get<Array<{ name: string; url: string }>>(allPokemonCacheKey);

    if (!allNames) {
      try {
        const response = await fetch(`${this.baseUrl}/pokemon?limit=1025`);
        if (!response.ok) throw new ExternalApiError('Failed to fetch Pokemon names');
        const data = await response.json() as { results: Array<{ name: string; url: string }> };
        allNames = data.results;
        cache.set(allPokemonCacheKey, allNames);
      } catch (error) {
        if (error instanceof ExternalApiError) throw error;
        throw new ExternalApiError('Failed to search Pokemon');
      }
    }

    const filtered = allNames.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    const pokemonDetails = await Promise.all(
      paginated.map(async (item) => {
        const detailCacheKey = `pokemon-${item.name}`;
        const cachedDetail = cache.get<PokemonDetail>(detailCacheKey);
        if (cachedDetail) return this.formatListItem(cachedDetail);
        try {
          const detailResponse = await fetch(`${this.baseUrl}/pokemon/${item.name}`);
          if (!detailResponse.ok) return null;
          const detail = await detailResponse.json() as PokemonDetail;
          cache.set(detailCacheKey, detail);
          return this.formatListItem(detail);
        } catch {
          return null;
        }
      })
    );

    const result: PaginatedResponse<PokemonListItem> = {
      data: pokemonDetails.filter((p): p is PokemonListItem => p !== null),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    cache.set(cacheKey, result);
    return result;
  }

  async getPokemonByType(type: string, page: number = 1, pageSize: number = config.pagination.defaultPageSize): Promise<PaginatedResponse<PokemonListItem>> {
    const cacheKey = `pokemon-type-${type.toLowerCase()}-${page}-${pageSize}`;
    const cached = cache.get<PaginatedResponse<PokemonListItem>>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.baseUrl}/type/${type.toLowerCase()}`);
      if (!response.ok) {
        throw new ExternalApiError(`Type '${type}' not found`);
      }
      const data = await response.json() as { pokemon: Array<{ pokemon: { name: string; url: string } }> };
      const allPokemon = data.pokemon.map((p) => p.pokemon);
      const total = allPokemon.length;
      const start = (page - 1) * pageSize;
      const paginated = allPokemon.slice(start, start + pageSize);

      const pokemonDetails = await Promise.all(
        paginated.map(async (item) => {
          const detailCacheKey = `pokemon-${item.name}`;
          const cachedDetail = cache.get<PokemonDetail>(detailCacheKey);
          if (cachedDetail) return this.formatListItem(cachedDetail);
          try {
            const detailResponse = await fetch(`${this.baseUrl}/pokemon/${item.name}`);
            if (!detailResponse.ok) return null;
            const detail = await detailResponse.json() as PokemonDetail;
            cache.set(detailCacheKey, detail);
            return this.formatListItem(detail);
          } catch {
            return null;
          }
        })
      );

      const result: PaginatedResponse<PokemonListItem> = {
        data: pokemonDetails.filter((p): p is PokemonListItem => p !== null),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };

      cache.set(cacheKey, result);
      return result;
    } catch (error) {
      if (error instanceof ExternalApiError) throw error;
      throw new ExternalApiError('Failed to fetch Pokemon by type from PokeAPI');
    }
  }

  private formatListItem(detail: PokemonDetail): PokemonListItem {
    const imageUrl = detail.sprites.other['official-artwork'].front_default || detail.sprites.front_default;
    return {
      id: detail.id,
      name: detail.name,
      url: `${this.baseUrl}/pokemon/${detail.id}`,
      image: imageUrl || '',
      types: detail.types.map((t) => t.type.name),
    };
  }
}

export const pokemonService = new PokemonService();