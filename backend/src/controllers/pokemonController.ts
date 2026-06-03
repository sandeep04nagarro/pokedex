import { Request, Response, NextFunction } from 'express';
import { pokemonService } from '../services/pokemonService';

export const getPokemonList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const result = await pokemonService.getPokemonList(page, pageSize);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getPokemonByNameOrId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nameOrId } = req.params;
    if (!nameOrId) {
      res.status(400).json({ success: false, error: 'Pokemon name or ID is required' });
      return;
    }
    const result = await pokemonService.getPokemonByNameOrId(nameOrId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getTypes = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pokemonService.getTypes();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const searchPokemon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ success: false, error: 'Search query is required' });
      return;
    }
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const result = await pokemonService.searchPokemon(query, page, pageSize);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getPokemonByType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.params;
    if (!type) {
      res.status(400).json({ success: false, error: 'Type is required' });
      return;
    }
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const result = await pokemonService.getPokemonByType(type, page, pageSize);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};