import { Request, Response, NextFunction } from 'express';
import { favoriteService } from '../services/favoriteService';

export const getFavorites = (_req: Request, res: Response) => {
  const favorites = favoriteService.getAll();
  res.json({ success: true, data: favorites });
};

export const addFavorite = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pokemonId, name, image } = req.body;
    if (!pokemonId || !name) {
      res.status(400).json({ success: false, error: 'pokemonId and name are required' });
      return;
    }
    const favorite = favoriteService.add(pokemonId, name, image || '');
    res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid favorite ID' });
      return;
    }
    favoriteService.remove(id);
    res.json({ success: true, message: 'Favorite removed' });
  } catch (error) {
    next(error);
  }
};