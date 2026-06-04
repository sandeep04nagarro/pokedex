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

export const getEvolutionChain = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nameOrId } = req.params;
    if (!nameOrId) {
      res.status(400).json({ success: false, error: 'Pokemon name or ID is required' });
      return;
    }
    const result = await pokemonService.getEvolutionChain(nameOrId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getPokemonByIds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idsParam = req.query.ids as string;
    if (!idsParam) {
      res.status(400).json({ success: false, error: 'ids query parameter is required' });
      return;
    }
    const ids = idsParam.split(',').map(Number).filter((n) => !isNaN(n) && n > 0);
    if (ids.length === 0) {
      res.status(400).json({ success: false, error: 'At least one valid Pokemon ID is required' });
      return;
    }
    if (ids.length > 10) {
      res.status(400).json({ success: false, error: 'Maximum 10 Pokemon can be compared at once' });
      return;
    }
    const result = await pokemonService.getPokemonDetailsByIds(ids);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};