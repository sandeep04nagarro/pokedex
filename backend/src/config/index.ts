export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  pokeApiBaseUrl: process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2',
  cache: {
    defaultTtl: parseInt(process.env.CACHE_TTL || '3600000', 10),
    maxEntries: parseInt(process.env.CACHE_MAX_ENTRIES || '1000', 10),
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
};