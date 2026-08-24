/**
 * Champions Routes
 *
 * GET /api/champions          → lista todos os campeões (com filtros opcionais)
 * GET /api/champions/:slug    → retorna um campeão pelo slug
 */

const { Router } = require('express');
const championsController = require('../controllers/champions.controller');

const router = Router();

router.get('/', championsController.listChampions);
router.get('/:slug', championsController.getChampion);

module.exports = router;
