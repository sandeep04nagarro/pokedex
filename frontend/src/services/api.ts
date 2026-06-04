import { PaginatedResponse, Pokemon, PokemonDetail, TypeOption, Favorite, EvolutionChain, PokemonWithStats } from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error || 'Unknown API error');
  }
  return json.data;
}

export async function getPokemonList(page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Pokemon>> {
  return fetchJson<PaginatedResponse<Pokemon>>(`${API_BASE}/pokemon?page=${page}&pageSize=${pageSize}`);
}

export async function getPokemonByNameOrId(nameOrId: string): Promise<PokemonDetail> {
  return fetchJson<PokemonDetail>(`${API_BASE}/pokemon/${nameOrId}`);
}

export async function getTypes(): Promise<TypeOption[]> {
  return fetchJson<TypeOption[]>(`${API_BASE}/types`);
}

export async function searchPokemon(query: string, page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Pokemon>> {
  return fetchJson<PaginatedResponse<Pokemon>>(`${API_BASE}/pokemon/search?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`);
}

export async function getPokemonByType(type: string, page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Pokemon>> {
  return fetchJson<PaginatedResponse<Pokemon>>(`${API_BASE}/pokemon/type/${encodeURIComponent(type)}?page=${page}&pageSize=${pageSize}`);
}

export async function getFavorites(): Promise<Favorite[]> {
  return fetchJson<Favorite[]>(`${API_BASE}/favorites`);
}

export async function addFavorite(pokemonId: number, name: string, image: string): Promise<Favorite> {
  const response = await fetch(`${API_BASE}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pokemonId, name, image }),
  });
  const json = await response.json();
  if (!json.success) throw new Error(json.error || 'Failed to add favorite');
  return json.data;
}

export async function removeFavorite(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/favorites/${id}`, {
    method: 'DELETE',
  });
  const json = await response.json();
  if (!json.success) throw new Error(json.error || 'Failed to remove favorite');
}

export async function getEvolutionChain(pokemonNameOrId: string): Promise<EvolutionChain> {
  return fetchJson<EvolutionChain>(`${API_BASE}/pokemon/${encodeURIComponent(pokemonNameOrId)}/evolution`);
}

export async function getPokemonByIds(ids: number[]): Promise<PokemonWithStats[]> {
  return fetchJson<PokemonWithStats[]>(`${API_BASE}/pokemon/compare?ids=${ids.join(',')}`);
}