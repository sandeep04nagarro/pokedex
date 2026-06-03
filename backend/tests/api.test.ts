import request from 'supertest';
import { app } from '../src/index';

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
    });
  });

  describe('GET /api/pokemon', () => {
    it('should return paginated pokemon list', async () => {
      const res = await request(app).get('/api/pokemon?page=1&pageSize=5');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('total');
    }, 30000);
  });

  describe('GET /api/pokemon/:nameOrId', () => {
    it('should return pokemon details', async () => {
      const res = await request(app).get('/api/pokemon/pikachu');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('name', 'pikachu');
    }, 30000);
  });

  describe('GET /api/types', () => {
    it('should return types list', async () => {
      const res = await request(app).get('/api/types');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    }, 30000);
  });

  describe('GET /api/pokemon/search', () => {
    it('should search pokemon', async () => {
      const res = await request(app).get('/api/pokemon/search?q=char');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }, 30000);

    it('should require query parameter', async () => {
      const res = await request(app).get('/api/pokemon/search');
      expect(res.status).toBe(400);
    });
  });

  describe('Favorites API', () => {
    it('should add and get favorites', async () => {
      const addRes = await request(app)
        .post('/api/favorites')
        .send({ pokemonId: 25, name: 'pikachu', image: 'img' });
      expect(addRes.status).toBe(201);
      expect(addRes.body.success).toBe(true);

      const getRes = await request(app).get('/api/favorites');
      expect(getRes.status).toBe(200);
      expect(getRes.body.data.length).toBeGreaterThan(0);
    });

    it('should remove a favorite', async () => {
      await request(app)
        .post('/api/favorites')
        .send({ pokemonId: 999, name: 'testmon', image: 'img' });
      const res = await request(app).delete('/api/favorites/999');
      expect(res.status).toBe(200);
    });
  });
});