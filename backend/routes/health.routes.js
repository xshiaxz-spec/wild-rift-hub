/**
 * Health Routes
 *
 * GET /api/health  → verifica se o servidor está no ar
 */

const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
