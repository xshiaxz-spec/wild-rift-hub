/**
 * Champions Controller — camada de interface HTTP.
 *
 * Responsável por:
 *   - receber requisições HTTP
 *   - extrair e validar parâmetros
 *   - chamar o service adequado
 *   - devolver a resposta com o status HTTP correto
 *
 * Não contém lógica de negócio — isso é responsabilidade do service.
 */

const championsService = require('../services/champions.service');

// Caracteres permitidos em slugs: letras, números e hífens
const SLUG_PATTERN = /^[a-z0-9-]+$/i;

/**
 * GET /api/champions
 * Aceita query params: ?role=Mid&search=ah
 */
function listChampions(req, res) {
  try {
    const { role, search } = req.query;

    const champions = championsService.getAllChampions({ role, search });

    return res.status(200).json(champions);
  } catch (err) {
    console.error('[Controller] listChampions:', err.message);
    return res.status(500).json({ error: 'Erro interno ao buscar campeões.' });
  }
}

/**
 * GET /api/champions/:slug
 */
function getChampion(req, res) {
  try {
    const { slug } = req.params;

    // Validação básica do slug para evitar entradas maliciosas
    if (!slug || !SLUG_PATTERN.test(slug)) {
      return res.status(400).json({ error: 'Slug inválido.' });
    }

    const champion = championsService.getChampionBySlug(slug);

    return res.status(200).json(champion);
  } catch (err) {
    const status = err.statusCode || 500;
    const message =
      status === 404 ? err.message : 'Erro interno ao buscar campeão.';

    if (status === 500) {
      console.error('[Controller] getChampion:', err.message);
    }

    return res.status(status).json({ error: message });
  }
}

module.exports = {
  listChampions,
  getChampion,
};
