/**
 * Champions Repository — camada de acesso a dados.
 *
 * Atualmente lê os dados de um arquivo JSON local.
 * Futuramente, este arquivo pode ser substituído por uma implementação
 * que consulta PostgreSQL, sem necessidade de alterar services ou controllers.
 *
 * Interface pública:
 *   findAll()
 *   findBySlug(slug)
 */

const path = require('path');
const { normalizeText } = require('../utils/normalizeText');

// Carrega os dados mockados uma única vez ao inicializar o módulo.
// Futuramente: substituir por conexão com banco de dados.
const DATA_PATH = path.join(__dirname, '../data/champions.json');
let championsData = [];

try {
  championsData = require(DATA_PATH);
} catch (err) {
  console.error('[Repository] Falha ao carregar champions.json:', err.message);
}

/**
 * Retorna todos os campeões.
 * Aceita filtros opcionais por rota e por nome.
 *
 * @param {object} filters
 * @param {string} [filters.role]   - Filtra por rota (ex: 'Mid')
 * @param {string} [filters.search] - Busca por nome (accent/case insensitive)
 * @returns {object[]}
 */
function findAll({ role, search } = {}) {
  let results = [...championsData];

  if (role) {
    const normalizedRole = normalizeText(role);
    results = results.filter((champion) =>
      champion.roles.some((r) => normalizeText(r) === normalizedRole)
    );
  }

  if (search) {
    const normalizedSearch = normalizeText(search);
    results = results.filter((champion) =>
      normalizeText(champion.name).includes(normalizedSearch)
    );
  }

  return results;
}

/**
 * Retorna um único campeão pelo slug.
 *
 * @param {string} slug - Ex: 'ahri', 'lee-sin'
 * @returns {object|null}
 */
function findBySlug(slug) {
  if (!slug) return null;
  const normalized = normalizeText(slug);
  return (
    championsData.find((champion) => normalizeText(champion.slug) === normalized) || null
  );
}

module.exports = {
  findAll,
  findBySlug,
};
