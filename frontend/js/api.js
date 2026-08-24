/**
 * api.js — Camada centralizada de chamadas ao backend.
 *
 * Detecta automaticamente se está rodando via:
 * - npm run dev (porta 3000) → usa /api (relativo)
 * - Live Server VS Code (porta 5500+) → usa http://localhost:3000/api (absoluto)
 */

// URL da API — detecta automaticamente a porta
const API_BASE_URL = window.location.port === '3000' 
  ? '/api' 
  : 'http://localhost:3000/api';

console.log('[API] Conectando a:', API_BASE_URL, '(porta:', window.location.port + ')');

/**
 * Wrapper interno de fetch com tratamento de erros padronizado.
 * Lança um Error com a mensagem da API ou um texto genérico.
 *
 * @param {string} endpoint - Caminho relativo à API (ex: '/champions')
 * @returns {Promise<any>} - JSON da resposta
 */
async function apiFetch(endpoint) {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url);

  // Tenta parsear o corpo mesmo em caso de erro para pegar a mensagem da API
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Resposta inválida do servidor (${response.status})`);
  }

  if (!response.ok) {
    const message = data?.error || `Erro ${response.status}`;
    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }

  return data;
}

/**
 * Verifica se a API está no ar.
 * @returns {Promise<{ status: string, timestamp: string }>}
 */
async function checkHealth() {
  return apiFetch('/health');
}

/**
 * Retorna todos os campeões.
 * Aceita filtros opcionais por rota e por nome.
 *
 * @param {object} [filters]
 * @param {string} [filters.role]   - Ex: 'Mid', 'Jungle'
 * @param {string} [filters.search] - Texto livre para busca por nome
 * @returns {Promise<object[]>}
 */
async function getChampions({ role = null, search = null } = {}) {
  const params = new URLSearchParams();
  if (role && role !== 'all') params.set('role', role);
  if (search && search.trim()) params.set('search', search.trim());

  const query = params.toString();
  const data = await apiFetch(`/champions${query ? `?${query}` : ''}`);
  
  // A API pode retornar um array diretamente ou um objeto com array
  return Array.isArray(data) ? data : data;
}

/**
 * Retorna os dados de um único campeão pelo slug.
 *
 * @param {string} slug - Ex: 'ahri', 'lee-sin'
 * @returns {Promise<object>}
 * @throws {Error} com statusCode 404 se não encontrado
 */
async function getChampion(slug) {
  if (!slug) throw new Error('Slug do campeão não informado.');
  return apiFetch(`/champions/${encodeURIComponent(slug)}`);
}
