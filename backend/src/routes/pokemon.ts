import { Router } from 'express';
import { getPokemonList, getPokemonByNameOrId, getTypes, searchPokemon, getPokemonByType } from '../controllers/pokemonController';

const router = Router();

router.get('/pokemon', getPokemonList);
router.get('/pokemon/search', searchPokemon);
router.get('/pokemon/type/:type', getPokemonByType);
router.get('/pokemon/:nameOrId', getPokemonByNameOrId);
router.get('/types', getTypes);

export default router;