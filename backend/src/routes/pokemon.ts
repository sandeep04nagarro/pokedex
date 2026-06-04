import { Router } from 'express';
import { getPokemonList, getPokemonByNameOrId, getTypes, searchPokemon, getPokemonByType, getEvolutionChain, getPokemonByIds } from '../controllers/pokemonController';

const router = Router();

router.get('/pokemon', getPokemonList);
router.get('/pokemon/search', searchPokemon);
router.get('/pokemon/type/:type', getPokemonByType);
router.get('/pokemon/compare', getPokemonByIds);
router.get('/pokemon/:nameOrId', getPokemonByNameOrId);
router.get('/pokemon/:nameOrId/evolution', getEvolutionChain);
router.get('/types', getTypes);

export default router;