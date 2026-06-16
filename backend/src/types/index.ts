export interface PokemonListItem {
  id: number;
  name: string;
  url: string;
  image: string;
  types: string[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
}

export interface TypeListItem {
  name: string;
  url: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Favorite {
  id: number;
  name: string;
  image: string;
  addedAt: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface EvolutionDetail {
  name: string;
  id: number;
  image: string;
}

export interface EvolutionChain {
  id: number;
  pokemon: EvolutionDetail[];
}

export interface PokemonWithStats {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: Array<{ base_stat: number; stat: { name: string } }>;
}

export interface AbilityDetail {
  id: number;
  name: string;
  generation: { name: string; url: string };
  names: Array<{ language: { name: string }; name: string }>;
  effect_entries: Array<{
    effect: string;
    short_effect: string;
    language: { name: string };
  }>;
  effect_changes: Array<{
    version: { name: string; url: string };
    effect_entries: Array<{
      effect: string;
      short_effect: string;
      language: { name: string };
    }>;
  }>;
  pokemon: Array<{
    pokemon: { name: string; url: string };
    is_hidden: boolean;
    slot: number;
  }>;
}