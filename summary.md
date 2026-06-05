# Repository Summary — Pokedex

A full-stack Pokemon browsing application built with **React**, **Node.js/Express**, and **TypeScript**, powered by the public [PokeAPI](https://pokeapi.co/).

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend Runtime | Node.js | 18+ |
| Backend Framework | Express | 4.18.2 |
| Backend Language | TypeScript | 5.3.3 |
| Frontend Framework | React | 18.2.0 |
| Frontend Router | React Router DOM | 6.21.1 |
| Build Tool | Vite | 5.0.12 |
| Backend Testing | Jest + Supertest | 29.7.0 / 6.3.4 |
| Frontend Testing | Vitest + Testing Library | 1.2.2 |
| External API | PokeAPI | v2 |
| HTTP Client | node-fetch | 2.7.0 |

---

## Architecture

The application follows a layered architecture where the frontend communicates only with the backend Express server, which in turn proxies all requests to the external PokeAPI. This design centralizes caching, error normalization, and rate limiting in the backend.

**Data flow:** React SPA (Vite, port 3000) → Express API (port 3001) → PokeAPI (pokeapi.co)

---

## Project Structure

```
pokedex/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server entry point
│   │   ├── config/index.ts       # Centralized configuration
│   │   ├── types/index.ts        # TypeScript interfaces
│   │   ├── controllers/          # Request handlers
│   │   ├── services/             # Business logic and PokeAPI integration
│   │   ├── routes/               # API route definitions
│   │   ├── middleware/           # Error handling middleware
│   │   └── utils/               # Cache and error classes
│   └── tests/                   # Jest test suites
├── frontend/
│   └── src/
│       ├── App.tsx              # Root component with routing
│       ├── context/             # React Context (favorites, recently viewed)
│       ├── services/            # API client functions
│       ├── hooks/               # Custom React hooks
│       ├── pages/               # Route page components
│       ├── components/          # Reusable UI components
│       └── types/               # TypeScript interfaces
├── README.md
└── summary.md
```

---

## Backend

### API Endpoints

| Method | Endpoint | Description | Query / Body |
|--------|----------|-------------|-------------|
| `GET` | `/health` | Health check | — |
| `GET` | `/api/pokemon` | Paginated Pokemon list | `page`, `pageSize` |
| `GET` | `/api/pokemon/search` | Search by name | `q`, `page`, `pageSize` |
| `GET` | `/api/pokemon/type/:type` | Filter by type | `page`, `pageSize` |
| `GET` | `/api/pokemon/compare` | Bulk fetch for comparison | `ids` (comma-separated) |
| `GET` | `/api/pokemon/:nameOrId` | Single Pokemon details | — |
| `GET` | `/api/pokemon/:nameOrId/evolution` | Evolution chain | — |
| `GET` | `/api/types` | All Pokemon types | — |
| `GET` | `/api/favorites` | All favorites (newest first) | — |
| `POST` | `/api/favorites` | Add a favorite | `{ pokemonId, name, image }` |
| `DELETE` | `/api/favorites/:id` | Remove a favorite | — |

### Key Modules

- **pokemonService** — Core PokeAPI integration. Fetches, transforms, and caches Pokemon data. Supports paginated lists, search, type filtering, evolution chains, and bulk fetches for comparison.
- **favoriteService** — In-memory CRUD for user favorites using a Map. Designed to support future database migration.
- **InMemoryCache** — Generic TTL-based cache with configurable max entries (default 1000) and expiration (default 1 hour).
- **Error Classes** — AppError hierarchy: NotFoundError (404), ValidationError (400), RateLimitError (429), ExternalApiError (502).
- **errorHandler** — Global Express middleware that catches all errors and returns a standardized response.

### Configuration

All settings are centralized in `config/index.ts` with environment variable overrides:

| Setting | Default | Description |
|---------|---------|-------------|
| port | 3001 | Server port |
| pokeApiBaseUrl | https://pokeapi.co/api/v2 | PokeAPI base URL |
| cache.defaultTtl | 3600 | Cache entry TTL in seconds |
| cache.maxEntries | 1000 | Maximum cache entries |
| pagination.defaultPageSize | 20 | Default page size |
| pagination.maxPageSize | 100 | Maximum page size |

---

## Frontend

### Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Main Pokedex grid with search, filter, and sort |
| `/pokemon/:nameOrId` | PokemonDetailPage | Detailed Pokemon view with stats, abilities, and evolution |
| `/favorites` | FavoritesPage | User's favorited Pokemon |
| `/compare` | ComparePage | Side-by-side Pokemon comparison (URL-param shareable) |

### Key Modules

- **PokemonContext** — React Context provider managing global state: favorites (from API), recently viewed (localStorage, max 10), loading/error states.
- **usePokemonList** — Custom hook encapsulating list fetching, pagination, search with 300ms debounce, type filtering, and client-side sorting.
- **usePokemonDetail** — Custom hook for fetching a single Pokemon's details.
- **api.ts** — HTTP client layer wrapping all backend calls with standardized error handling.

### Components

| Component | Purpose |
|-----------|---------|
| PokemonCard | Card with lazy-loaded image, ID, name, and type badges |
| PokemonGrid | Responsive grid container for Pokemon cards |
| SearchBar | Debounced text input for Pokemon search |
| TypeFilter | Dropdown for filtering by Pokemon type |
| SortBar | Dropdown for sorting (ID/Name, ascending/descending) |
| Pagination | Page navigation with ellipsis for large ranges |
| EvolutionChain | Visual evolution chain with clickable stage links |
| RecentlyViewed | Horizontal strip of the last 10 viewed Pokemon |
| ErrorMessage | Error display with optional retry button |
| LoadingSpinner | CSS-animated loading indicator |

---

## Testing

### Backend (Jest + Supertest)

- **api.test.ts** — Integration tests for all API endpoints: health check, list, detail, types, search, and favorites CRUD.
- **favoriteService.test.ts** — Unit tests for add, get, remove, duplicate prevention, and existence check.
- **pokemonService.test.ts** — Integration tests with real PokeAPI calls for list, detail, types, and cache verification.

### Frontend (Vitest + Testing Library)

- Test setup configured in `frontend/src/test/setup.ts`.
- Vite test environment set to jsdom.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
npm run dev      # Starts on port 3001
npm test         # Run test suite
```

### Frontend

```bash
cd frontend
npm install
npm run dev      # Starts on port 3000, proxies /api to backend
npm test         # Run test suite
```

Start the backend first, then the frontend. The Vite dev server automatically proxies `/api` requests to `http://localhost:3001`.

---

## Key Design Decisions

1. **Backend as API Gateway** — The frontend never calls external APIs directly. All PokeAPI traffic is routed through the backend, enabling caching, error normalization, and the ability to swap data sources without frontend changes.
2. **In-Memory Cache** — Server-side caching with TTL reduces redundant API calls. The architecture supports future migration to a persistent data store.
3. **Standardized API Responses** — All endpoints return `{ success, data, error }` for consistent client-side handling.
4. **Full TypeScript Coverage** — Both frontend and backend use strict TypeScript with shared interface definitions.
5. **Custom Hooks Pattern** — Data fetching logic is encapsulated in custom React hooks (`usePokemonList`, `usePokemonDetail`), keeping components focused on rendering.
6. **Component Composition** — Small, single-responsibility components are composed into pages for maintainability and reusability.
