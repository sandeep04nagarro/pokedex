# PokéAPI Integration Documentation

A comprehensive guide to the usage of [PokéAPI](https://pokeapi.co/) in the Pokedex application.

---

## Table of Contents

- [Overview](#overview)
- [Base URL & Configuration](#base-url--configuration)
- [API Endpoints Used](#api-endpoints-used)
  - [List All Pokémon](#list-all-pokémon)
  - [Get Pokémon by Name or ID](#get-pokémon-by-name-or-id)
  - [Get All Types](#get-all-types)
  - [Get Pokémon by Type](#get-pokémon-by-type)
  - [Get Species Details](#get-species-details)
  - [Get Evolution Chain](#get-evolution-chain)
- [Response Data Models](#response-data-models)
  - [Pokémon Detail](#pokémon-detail)
  - [Pokémon List Item](#pokémon-list-item)
  - [Type List Item](#type-list-item)
  - [Evolution Chain](#evolution-chain)
  - [Paginated Response](#paginated-response)
- [Caching Strategy](#caching-strategy)
- [Error Handling](#error-handling)
- [Architecture & Data Flow](#architecture--data-flow)
- [Rate Limiting & Best Practices](#rate-limiting--best-practices)
- [Configuration Reference](#configuration-reference)

---

## Overview

The Pokedex application consumes the public **PokéAPI v2** RESTful service to retrieve Pokémon data. PokéAPI provides a comprehensive, free, and open RESTful API for all Pokémon game data, including species, types, abilities, stats, sprites, and evolution chains.

The application follows a **backend-as-gateway** pattern where the frontend React SPA never calls PokéAPI directly. All external API calls are made by the Express backend, which handles caching, error normalization, and data transformation.

**Key facts about PokéAPI:**
- **Base URL:** `https://pokeapi.co/api/v2`
- **Protocol:** HTTPS REST
- **Authentication:** None required (public API)
- **Rate Limit:** No strict limit, but courteous usage is recommended
- **Data scope:** 1025+ Pokémon, 20+ types, evolution chains, abilities, and more

---

## Base URL & Configuration

The PokéAPI base URL is configured centrally in `backend/src/config/index.ts`:

```typescript
export const config = {
  pokeApiBaseUrl: process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2',
  cache: {
    defaultTtl: parseInt(process.env.CACHE_TTL || '3600000', 10), // 1 hour
    maxEntries: parseInt(process.env.CACHE_MAX_ENTRIES || '1000', 10),
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
};
```

The base URL can be overridden via the `POKEAPI_BASE_URL` environment variable, which is useful for testing or proxying.

---

## API Endpoints Used

### List All Pokémon

**PokéAPI Endpoint:**
```
GET https://pokeapi.co/api/v2/pokemon?offset={offset}&limit={limit}
```

**Purpose:** Fetches a paginated list of Pokémon names and URLs.

**Parameters:**

| Parameter | Type  | Description |
|-----------|-------|-------------|
| `offset`  | int   | Number of results to skip (calculated as `(page - 1) * pageSize`) |
| `limit`   | int   | Number of results per page (default: 20, max: 100) |

**Example Request:**
```bash
curl "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20"
```

**Example Response:**
```json
{
  "count": 1025,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
  "previous": null,
  "results": [
    { "name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/" },
    { "name": "ivysaur", "url": "https://pokeapi.co/api/v2/pokemon/2/" },
    { "name": "venusaur", "url": "https://pokeapi.co/api/v2/pokemon/3/" }
  ]
}
```

**In our codebase:** This endpoint is called in `PokemonService.getPokemonList()`. The response `results` array is iterated, and each Pokémon's individual detail endpoint is fetched to build a rich list item with image, types, and ID.

---

### Get Pokémon by Name or ID

**PokéAPI Endpoint:**
```
GET https://pokeapi.co/api/v2/pokemon/{name_or_id}
```

**Purpose:** Fetches complete details for a single Pokémon, including stats, abilities, types, and sprites.

**Parameters:**

| Parameter    | Type   | Description |
|--------------|--------|-------------|
| `name_or_id` | string | Pokémon name (case-insensitive) or numeric ID |

**Example Request:**
```bash
curl "https://pokeapi.co/api/v2/pokemon/pikachu"
curl "https://pokeapi.co/api/v2/pokemon/25"
```

**Example Response (abbreviated):**
```json
{
  "id": 25,
  "name": "pikachu",
  "height": 4,
  "weight": 60,
  "base_experience": 112,
  "sprites": {
    "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    "other": {
      "official-artwork": {
        "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
      }
    }
  },
  "types": [
    { "slot": 1, "type": { "name": "electric", "url": "https://pokeapi.co/api/v2/type/13/" } }
  ],
  "abilities": [
    { "ability": { "name": "static", "url": "..." }, "is_hidden": false, "slot": 1 },
    { "ability": { "name": "lightning-rod", "url": "..." }, "is_hidden": true, "slot": 3 }
  ],
  "stats": [
    { "base_stat": 35, "effort": 0, "stat": { "name": "hp", "url": "..." } },
    { "base_stat": 55, "effort": 0, "stat": { "name": "attack", "url": "..." } },
    { "base_stat": 40, "effort": 0, "stat": { "name": "defense", "url": "..." } },
    { "base_stat": 50, "effort": 0, "stat": { "name": "special-attack", "url": "..." } },
    { "base_stat": 50, "effort": 0, "stat": { "name": "special-defense", "url": "..." } },
    { "base_stat": 90, "effort": 2, "stat": { "name": "speed", "url": "..." } }
  ]
}
```

**In our codebase:** Used in `PokemonService.getPokemonByNameOrId()` for the detail view and comparison features. The response is cached by key `pokemon-{name_or_id}`.

---

### Get All Types

**PokéAPI Endpoint:**
```
GET https://pokeapi.co/api/v2/type
```

**Purpose:** Retrieves the complete list of Pokémon types (e.g., fire, water, grass).

**Example Response:**
```json
{
  "count": 21,
  "next": null,
  "previous": null,
  "results": [
    { "name": "normal", "url": "https://pokeapi.co/api/v2/type/1/" },
    { "name": "fire", "url": "https://pokeapi.co/api/v2/type/10/" },
    { "name": "water", "url": "https://pokeapi.co/api/v2/type/11/" },
    { "name": "electric", "url": "https://pokeapi.co/api/v2/type/13/" },
    { "name": "grass", "url": "https://pokeapi.co/api/v2/type/12/" }
  ]
}
```

**In our codebase:** Called in `PokemonService.getTypes()` and used to populate the type filter dropdown on the frontend.

---

### Get Pokémon by Type

**PokéAPI Endpoint:**
```
GET https://pokeapi.co/api/v2/type/{type_name}
```

**Purpose:** Fetches all Pokémon that belong to a specific type.

**Parameters:**

| Parameter   | Type   | Description |
|-------------|--------|-------------|
| `type_name` | string | Type name (e.g., `fire`, `water`, `grass`) |

**Example Request:**
```bash
curl "https://pokeapi.co/api/v2/type/fire"
```

**Example Response (abbreviated):**
```json
{
  "id": 10,
  "name": "fire",
  "pokemon": [
    { "pokemon": { "name": "charmander", "url": "https://pokeapi.co/api/v2/pokemon/4/" }, "slot": 1 },
    { "pokemon": { "name": "charmeleon", "url": "https://pokeapi.co/api/v2/pokemon/5/" }, "slot": 1 },
    { "pokemon": { "name": "charizard", "url": "https://pokeapi.co/api/v2/pokemon/6/" }, "slot": 1 }
  ]
}
```

**In our codebase:** Used in `PokemonService.getPokemonByType()`. The `pokemon` array is paginated server-side, and each entry is resolved to its full detail via the individual Pokémon endpoint.

---

### Get Species Details

**PokéAPI Endpoint:**
```
GET https://pokeapi.co/api/v2/pokemon-species/{id_or_name}
```

**Purpose:** Fetches species-level information including evolution chain references.

**In our codebase:** Accessed indirectly via the `species.url` field from a Pokémon detail response. This is a critical step in the evolution chain resolution — it provides the link to the evolution chain endpoint.

---

### Get Evolution Chain

**PokéAPI Endpoint:**
```
GET https://pokeapi.co/api/v2/evolution-chain/{id}
```

**Purpose:** Retrieves the full evolution chain for a Pokémon lineage.

**Example Response (abbreviated for Bulbasaur line):**
```json
{
  "id": 1,
  "chain": {
    "species": { "name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon-species/1/" },
    "evolves_to": [
      {
        "species": { "name": "ivysaur", "url": "https://pokeapi.co/api/v2/pokemon-species/2/" },
        "evolves_to": [
          {
            "species": { "name": "venusaur", "url": "https://pokeapi.co/api/v2/pokemon-species/3/" },
            "evolves_to": []
          }
        ]
      }
    ]
  }
}
```

**In our codebase:** The `getEvolutionChain()` method performs a three-step resolution:

1. **Pokémon → Species:** Fetch the Pokémon detail to get `species.url`
2. **Species → Evolution Chain:** Fetch species details to get `evolution_chain.url`
3. **Evolution Chain → Pokémon Details:** Traverse the chain tree, fetch each Pokémon's detail for images and IDs

```
/pokemon/{name}
    → species.url
        → /pokemon-species/{id}
            → evolution_chain.url
                → /evolution-chain/{id}
                    → traverse chain, fetch /pokemon/{name} for each node
```

---

## Response Data Models

### Pokémon Detail

The raw PokéAPI response is mapped to the `PokemonDetail` TypeScript interface:

```typescript
export interface PokemonDetail {
  id: number;
  name: string;
  height: number;          // Decimetres (e.g., 4 = 0.4m)
  weight: number;          // Hectograms (e.g., 60 = 6.0kg)
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
    type: { name: string; url: string };
  }>;
  abilities: Array<{
    ability: { name: string; url: string };
    is_hidden: boolean;
    slot: number;
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: { name: string; url: string };
  }>;
}
```

### Pokémon List Item

A simplified item returned by the paginated list endpoint after transformation:

```typescript
export interface PokemonListItem {
  id: number;
  name: string;
  url: string;
  image: string;       // Official artwork URL
  types: string[];     // Array of type names
}
```

### Type List Item

```typescript
export interface TypeListItem {
  name: string;
  url: string;
}
```

### Evolution Chain

```typescript
export interface EvolutionDetail {
  name: string;
  id: number;
  image: string;
}

export interface EvolutionChain {
  id: number;
  pokemon: EvolutionDetail[];  // Ordered from base to final evolution
}
```

### Paginated Response

```typescript
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

---

## Caching Strategy

All PokéAPI responses are cached in-memory via the `InMemoryCache` class to minimize redundant external API calls.

| Cache Key Pattern | TTL | Description |
|-------------------|-----|-------------|
| `pokemon-list-{page}-{pageSize}` | 1 hour | Paginated Pokémon list |
| `pokemon-{name_or_id}` | 1 hour | Individual Pokémon detail |
| `types` | 1 hour | All Pokémon types |
| `pokemon-type-{type}-{page}-{pageSize}` | 1 hour | Pokémon filtered by type |
| `search-{query}-{page}-{pageSize}` | 1 hour | Search results |
| `all-pokemon-names` | 1 hour | Full name list (1025 entries) for search |
| `evolution-{name_or_id}` | 1 hour | Resolved evolution chain |

**Cache configuration:**

| Setting | Default | Environment Variable |
|---------|---------|---------------------|
| TTL | 3,600,000 ms (1 hour) | `CACHE_TTL` |
| Max Entries | 1,000 | `CACHE_MAX_ENTRIES` |
| Eviction | FIFO (oldest entry removed when full) | — |

**Cache behavior:**
- **On hit:** Returns cached data immediately, skipping the external API call
- **On miss:** Fetches from PokéAPI, stores in cache, returns data
- **On expiry:** Entry is deleted and treated as a miss on next access
- **On overflow:** The oldest entry is evicted (FIFO) when `maxEntries` is reached

---

## Error Handling

The application wraps all PokéAPI errors in a structured `ExternalApiError` class and normalizes them through a global Express error handler.

### Error Classes

| Class | HTTP Status | When Thrown |
|-------|-------------|-------------|
| `ExternalApiError` | 502 | PokéAPI is unreachable or returns an unexpected status |
| `NotFoundError` | 404 | Pokémon or type not found |
| `ValidationError` | 400 | Invalid request parameters |
| `RateLimitError` | 429 | Rate limit exceeded |

### Error Response Format

All errors are returned to the frontend in a standardized envelope:

```json
{
  "success": false,
  "error": "Pokemon 'xyz' not found"
}
```

### PokéAPI-Specific Error Handling

- **404 from PokéAPI:** Maps to `ExternalApiError` with a user-friendly message (e.g., `Pokemon 'xyz' not found`)
- **Network failures:** Caught and re-thrown as `ExternalApiError` with message `Failed to fetch ... from PokeAPI`
- **Partial failures in bulk operations:** Individual failures are silently skipped (returns `null`) rather than failing the entire batch

---

## Architecture & Data Flow

```
+------------------+     +--------------------+     +------------------+
|    React SPA     |---->|   Express Backend   |---->|    PokéAPI v2    |
|   (port 3000)    |<----|    (port 3001)      |<----|   (pokeapi.co)   |
+------------------+     +--------------------+     +------------------+
                                |
                          +-----+------+
                          |   Cache    |
                          |  (memory)  |
                          +------------+
```

### Frontend to Backend API Endpoints

| Frontend Function | Backend Endpoint | PokéAPI Endpoint(s) |
|-------------------|------------------|---------------------|
| `getPokemonList()` | `GET /api/pokemon` | `/pokemon?offset=&limit=` + `/pokemon/{name}` (per item) |
| `getPokemonByNameOrId()` | `GET /api/pokemon/:nameOrId` | `/pokemon/{name_or_id}` |
| `getTypes()` | `GET /api/types` | `/type` |
| `getPokemonByType()` | `GET /api/pokemon/type/:type` | `/type/{name}` + `/pokemon/{name}` (per item) |
| `searchPokemon()` | `GET /api/pokemon/search?q=` | `/pokemon?limit=1025` (names only, cached) |
| `getEvolutionChain()` | `GET /api/pokemon/:name/evolution` | `/pokemon/{name}` -> `/pokemon-species/{id}` -> `/evolution-chain/{id}` |
| `getPokemonByIds()` | `GET /api/pokemon/compare?ids=` | `/pokemon/{id}` (per ID) |

### Backend Internal Flow

```
Request -> Route -> Controller -> Service -> Cache check -> (if miss) -> PokeAPI -> Cache store -> Response
```

---

## Rate Limiting & Best Practices

### Current Approach

The application relies on caching as its primary rate-limiting mechanism. By caching responses for 1 hour, the number of outbound PokéAPI calls is significantly reduced.

### PokéAPI Guidelines

- PokéAPI does not enforce strict rate limits but recommends reasonable usage
- Avoid rapid sequential requests — use caching and batching where possible
- The API is free and community-supported; be respectful of resources

### Application-Level Protections

1. **In-memory cache** with 1-hour TTL eliminates redundant calls
2. **Batch fetching** via `Promise.all` for list operations (e.g., fetching 20 Pokémon details in parallel)
3. **Graceful degradation** — individual failures in bulk operations don't break the entire response
4. **Backend proxy** — the frontend never calls PokéAPI directly, giving the backend full control over request frequency

---

## Configuration Reference

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `PORT` | `3001` | Express server port |
| `POKEAPI_BASE_URL` | `https://pokeapi.co/api/v2` | PokéAPI base URL |
| `CACHE_TTL` | `3600000` | Cache TTL in milliseconds (1 hour) |
| `CACHE_MAX_ENTRIES` | `1000` | Maximum cache entries |

---

## Quick Reference: PokéAPI v2 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/pokemon` | GET | List Pokémon (paginated) |
| `/pokemon/{id_or_name}` | GET | Single Pokémon details |
| `/pokemon-species/{id_or_name}` | GET | Species info and evolution references |
| `/type` | GET | List all types |
| `/type/{id_or_name}` | GET | Pokémon filtered by type |
| `/evolution-chain/{id}` | GET | Full evolution chain |
| `/ability/{id_or_name}` | GET | Ability details |
| `/move/{id_or_name}` | GET | Move details |
| `/generation/{id_or_name}` | GET | Generation info |
| `/nature/{id_or_name}` | GET | Nature details |

For the full PokéAPI reference, visit [https://pokeapi.co/docs/v2](https://pokeapi.co/docs/v2).
