/**
 * home.js — Lógica da página inicial.
 *
 * Responsabilidades:
 *  - inicializar a navbar (hamburguer)
 *  - carregar campeões da API
 *  - renderizar cards no grid
 *  - filtrar por rota (botões)
 *  - pesquisar por nome (input)
 *  - exibir estados de loading, erro e resultado vazio
 */

/* ─── Estado da aplicação ───────────────────────────────────── */

const state = {
  allChampions: [],   // lista completa carregada da API
  activeRole: 'all',  // filtro de rota ativo
  searchQuery: '',    // texto da busca atual
};

/* ─── Seletores de DOM ──────────────────────────────────────── */

const elements = {
  grid: document.getElementById('champions-grid'),
  searchInput: document.getElementById('search-input'),
  filterButtons: document.querySelectorAll('.role-filter-btn'),
  championsCount: document.getElementById('champions-count'),
  navToggle: document.getElementById('nav-toggle'),
  navMenu: document.getElementById('nav-menu'),
};

/* ─── Inicialização ─────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Home] DOMContentLoaded dispara');
  initNavbar();
  initSearch();
  initFilters();
  loadChampions();
});

/* ─── Navbar hamburguer ─────────────────────────────────────── */

function initNavbar() {
  const { navToggle, navMenu } = elements;
  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Fecha o menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ─── Pesquisa ──────────────────────────────────────────────── */

function initSearch() {
  const { searchInput } = elements;
  if (!searchInput) return;

  // Debounce: aguarda 250ms após o usuário parar de digitar
  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.searchQuery = searchInput.value;
      renderFilteredChampions();
    }, 250);
  });
}

/* ─── Filtros de Rota ───────────────────────────────────────── */

function initFilters() {
  elements.filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role;
      if (role === state.activeRole) return;

      // Atualiza estado visual dos botões
      elements.filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      state.activeRole = role;
      renderFilteredChampions();
    });
  });
}

/* ─── Carregar Campeões ─────────────────────────────────────── */

async function loadChampions() {
  console.log('[Home] Iniciando loadChampions');
  showLoading();

  try {
    console.log('[Home] Chamando getChampions...');
    const champions = await getChampions({});
    console.log('[Home] Recebido:', champions.length, 'campeões');
    state.allChampions = champions;
    renderFilteredChampions();
  } catch (err) {
    console.error('[Home] Erro ao carregar campeões:', err);
    showError(err.message);
  }
}

/* ─── Filtrar e Renderizar ──────────────────────────────────── */

/**
 * Aplica os filtros de rota e de pesquisa sobre state.allChampions
 * e renderiza o resultado no grid.
 */
function renderFilteredChampions() {
  const { allChampions, activeRole, searchQuery } = state;

  let filtered = allChampions;

  // Filtro por rota
  if (activeRole && activeRole !== 'all') {
    filtered = filtered.filter((champion) =>
      champion.roles.some(
        (r) => normalizeText(r) === normalizeText(activeRole)
      )
    );
  }

  // Filtro por pesquisa (nome)
  if (searchQuery.trim()) {
    const query = normalizeText(searchQuery.trim());
    filtered = filtered.filter((champion) =>
      normalizeText(champion.name).includes(query)
    );
  }

  renderChampions(filtered);
}

/* ─── Renderização do Grid ──────────────────────────────────── */

/**
 * Renderiza a lista de campeões no grid.
 * Substitui o conteúdo atual completamente.
 *
 * @param {object[]} champions
 */
function renderChampions(champions) {
  const { grid, championsCount } = elements;
  if (!grid) return;

  // Atualiza o contador
  if (championsCount) {
    championsCount.innerHTML = `<span>${champions.length}</span> campeão${champions.length !== 1 ? 'ões' : ''} encontrado${champions.length !== 1 ? 's' : ''}`;
  }

  if (champions.length === 0) {
    showEmpty();
    return;
  }

  grid.innerHTML = champions.map(createChampionCard).join('');
}

/**
 * Gera o HTML de um card de campeão.
 *
 * @param {object} champion
 * @returns {string} HTML do card
 */
function createChampionCard(champion) {
  const imageUrl = `/assets/images/champions/${champion.slug}.svg`;
  
  const tierHtml = buildTierBadge(champion.tier);
  const rolesHtml = champion.roles
    .map((role) => `<span class="role-badge">${escapeHtml(role)}</span>`)
    .join('');

  return `
    <a
      href="/champion.html?champion=${encodeURIComponent(champion.slug)}"
      class="champion-card fade-in"
      aria-label="Ver detalhes de ${escapeHtml(champion.name)}"
    >
      <div class="champion-card__image-wrapper">
        <img
          class="champion-card__image"
          src="${imageUrl}"
          alt="${escapeHtml(champion.name)}"
          loading="lazy"
        />
        <div class="champion-card__tier">${tierHtml}</div>
      </div>
      <div class="champion-card__body">
        <p class="champion-card__name">${escapeHtml(champion.name)}</p>
        <p class="champion-card__title">${escapeHtml(champion.title)}</p>
        <div class="champion-card__footer">
          <div class="champion-card__roles">${rolesHtml}</div>
        </div>
      </div>
    </a>
  `;
}

/* ─── Estados de UI ─────────────────────────────────────────── */

function showLoading() {
  const { grid, championsCount } = elements;
  if (!grid) return;
  if (championsCount) championsCount.innerHTML = '';
  grid.innerHTML = `
    <div class="loading-state" style="grid-column: 1 / -1;" role="status" aria-live="polite">
      <div class="loading-spinner" aria-hidden="true"></div>
      <p>Carregando campeões...</p>
    </div>
  `;
}

function showError(message = '') {
  const { grid, championsCount } = elements;
  if (!grid) return;
  if (championsCount) championsCount.innerHTML = '';
  grid.innerHTML = `
    <div class="error-state" style="grid-column: 1 / -1;" role="alert">
      <div class="error-state__icon" aria-hidden="true">⚠️</div>
      <p class="error-state__title">Não foi possível carregar os campeões.</p>
      <p class="error-state__message">
        Verifique se o servidor está funcionando.<br>
        ${message ? `<small style="opacity:0.6;">${escapeHtml(message)}</small>` : ''}
      </p>
    </div>
  `;
}

function showEmpty() {
  const { grid } = elements;
  if (!grid) return;
  grid.innerHTML = `
    <div class="empty-state" style="grid-column: 1 / -1;" role="status">
      <div class="empty-state__icon" aria-hidden="true">🔍</div>
      <p class="empty-state__title">Nenhum campeão encontrado.</p>
      <p class="empty-state__message">Tente outro nome ou remova os filtros.</p>
    </div>
  `;
}

/* ─── Helpers ───────────────────────────────────────────────── */

/**
 * Normaliza texto para comparação: minúsculas + sem acentos.
 * Espelha a mesma lógica do backend (normalizeText.js).
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

/**
 * Retorna as iniciais de um nome para o placeholder do card.
 * Ex: 'Lee Sin' → 'LS', 'Ahri' → 'AH'
 *
 * @param {string} name
 * @returns {string}
 */
function getInitials(name) {
  if (!name) return '?';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Escapa caracteres HTML especiais para prevenir XSS.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Gera o HTML do tier badge com a classe de cor correta.
 *
 * @param {string|null} tier
 * @returns {string}
 */
function buildTierBadge(tier) {
  if (!tier) {
    return `<span class="tier-badge tier-badge--none" aria-label="Tier não definido">--</span>`;
  }
  const t = tier.toLowerCase();
  return `<span class="tier-badge tier-badge--${t}" aria-label="Tier ${tier}">
    ${escapeHtml(tier.toUpperCase())}
  </span>`;
}
