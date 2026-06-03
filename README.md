# Pokedex - Full Stack Pokemon Application

A production-quality full-stack Pokedex application built with React, Node.js/Express, TypeScript, and the public PokeAPI.

## Architecture

```
pokedex/
├── backend/          # Node.js/Express API server
│   ├── src/
│   │   ├── config/       # App configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/    # Error handling
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic & PokeAPI integration
│   │   ├── types/        # TypeScript interfaces
│   │   └── utils/        # Cache & error classes
│   └── tests/            # Jest test suites
└── frontend/         # React SPA
    └── src/
        ├── components/   # Reusable UI components
        ├── pages/        # Route pages
        ├── hooks/        # Custom React hooks
        ├── services/     # API client functions
        ├── context/      # React context (favorites, recently viewed)
        └── types/        # TypeScript interfaces
```

## Features

- **Pokemon Listing** - Paginated grid with name, artwork, ID, and type badges
- **Pokemon Search** - Case-insensitive search with debounced input
- **Pokemon Details** - Full detail view with stats, abilities, and physical info
- **Type Filtering** - Filter by any Pokemon type (Fire, Water, Grass, etc.)
- **Favorites** - Add/remove favorites with persistent storage
- **Recently Viewed** - Last 10 viewed Pokemon stored in localStorage
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Loading & Error States** - Graceful handling of all states

## Tech Stack

**Backend:**
- Node.js + Express + TypeScript
- In-memory cache with configurable TTL
- Server-side PokAPI integration (frontend never calls external APIs directly)

**Frontend:**
- React 18 + TypeScript
- React Router v6
- Vite for development and bundling
- Vitest for testing

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Backend Setup
```bash
cd backend
npm install
npm run dev      # Starts on port 3001
npm test         # Run tests
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts on port 3000, proxies /api to backend
npm test         # Run tests
```

### Running Both
Start the backend first, then the frontend. The frontend proxies API requests to the backend automatically.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/pokemon?page=1&pageSize=20 | Paginated Pokemon list |
| GET | /api/pokemon/:nameOrId | Pokemon details by name or ID |
| GET | /api/pokemon/search?q=name | Search Pokemon by name |
| GET | /api/pokemon/type/:type | Pokemon filtered by type |
| GET | /api/types | List all Pokemon types |
| GET | /api/favorites | Get all favorites |
| POST | /api/favorites | Add a favorite |
| DELETE | /api/favorites/:id | Remove a favorite |
| GET | /health | Health check |

## Design Decisions

- **Backend as API Gateway**: The frontend never calls PokeAPI directly. All external API calls go through the backend, enabling caching, rate limiting, and error normalization.
- **In-Memory Cache**: Server-side caching with TTL reduces redundant API calls. Architecture supports future database migration.
- **Standardized Responses**: All API responses follow `{ success, data, error }` format.
- **Type Safety**: Full TypeScript coverage on both frontend and backend.
