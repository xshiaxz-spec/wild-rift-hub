/**
 * Champions Service — camada de regras de negócio.
 *
 * Responsável por orquestrar a lógica da aplicação.
 * Não sabe (nem deve saber) se os dados vêm de JSON, PostgreSQL ou outra fonte.
 * Toda comunicação com dados passa pelo repository.
 *
 * Futuramente, esta camada também pode:
 *   - agregar dados de múltiplos providers (WildLegends, WildRiftFire, Riot)
 *   - calcular médias de estatísticas entre fontes
 *   - aplicar lógica de cache
 *   - filtrar dados por patch
 */

const championsRepository = require('../repositories/champions.repository');

/**
 * Retorna a lista de campeões com filtros opcionais.
 *
 * @param {object} filters
 * @param {string} [filters.role]
 * @param {string} [filters.search]
 * @returns {object[]}
 */
function getAllChampions(filters = {}) {
  return championsRepository.findAll(filters);
}

/**
 * Retorna um campeão pelo slug.
 * Lança um erro se não encontrado (tratado no controller).
 *
 * @param {string} slug
 * @returns {object}
 * @throws {Error} se o campeão não existir
 */
function getChampionBySlug(slug) {
  const champion = championsRepository.findBySlug(slug);

  if (!champion) {
    const error = new Error('Campeão não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return champion;
}

module.exports = {
  getAllChampions,
  getChampionBySlug,
};
