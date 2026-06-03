import express from 'express';
import cors from 'cors';
import { config } from './config';
import pokemonRoutes from './routes/pokemon';
import favoriteRoutes from './routes/favorites';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', pokemonRoutes);
app.use('/api', favoriteRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`Pokedex backend running on port ${config.port}`);
  });
}

export { app };