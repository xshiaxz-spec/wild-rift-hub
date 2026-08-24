/**
 * Normaliza uma string para comparação:
 * - converte para minúsculas
 * - remove acentos e caracteres diacríticos
 *
 * Útil para buscas case-insensitive e accent-insensitive.
 *
 * @param {string} text
 * @returns {string}
 */
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

module.exports = { normalizeText };
