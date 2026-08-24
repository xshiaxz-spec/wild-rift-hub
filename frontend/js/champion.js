/**
 * champion.js — Lógica da página individual do campeão.
 *
 * Responsabilidades:
 *  - ler o slug da query string (?champion=ahri)
 *  - buscar os dados do campeão via API
 *  - renderizar todas as seções da página
 *  - exibir estados de loading e erro
 *  - inicializar navbar hamburguer
 */

/* ─── Inicialização ─────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();

  const slug = getSlugFromURL();
  if (!slug) {
    showPageError('Campeão não especificado.', 'Volte para a lista e selecione um campeão.');
    return;
  }

  loadChampion(slug);
});

/* ─── Navbar hamburguer ─────────────────────────────────────── */

function initNavbar() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ─── Carregar campeão ──────────────────────────────────────── */

async function loadChampion(slug) {
  showLoading();

  try {
    const champion = await getChampion(slug);
    renderChampionPage(champion);
  } catch (err) {
    if (err.statusCode === 404) {
      showPageError('Campeão não encontrado.', 'Verifique o nome e tente novamente.');
    } else {
      showPageError(
        'Não foi possível carregar o campeão.',
        'Verifique se o servidor está funcionando.'
      );
    }
  }
}

/* ─── Renderização principal ────────────────────────────────── */

/**
 * Recebe o objeto campeão e monta toda a página.
 * @param {object} champion
 */
function renderChampionPage(champion) {
  // Atualiza o título da aba do navegador
  document.title = `${champion.name} — Wild Rift Guide`;

  const container = document.getElementById('champion-container');
  if (!container) return;

  container.innerHTML = `
    ${renderHeader(champion)}
    <div class="champion-body container">
      ${renderStats(champion.stats)}
      ${renderBuild(champion.build)}
      ${renderSkillOrder(champion.skillOrder)}
      ${renderCounters(champion.counters, champion.strongAgainst)}
      ${renderSynergies(champion.synergies)}
      ${renderSources(champion.sources, champion.patch)}
    </div>
  `;

  // Animação de entrada
  container.classList.add('fade-in');
}

/* ─── Seção: Header ─────────────────────────────────────────── */

function renderHeader(champion) {
  const imageHtml = champion.image
    ? `<img
        class="champion-header__avatar"
        src="${escapeHtml(champion.image)}"
        alt="${escapeHtml(champion.name)}"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      />
      <div class="champion-header__avatar-placeholder" style="display:none;" aria-hidden="true">
        ${getInitials(champion.name)}
      </div>`
    : `<div class="champion-header__avatar-placeholder" aria-hidden="true">
        ${getInitials(champion.name)}
      </div>`;

  const rolesHtml = champion.roles
    .map((r) => `<span class="role-badge">${escapeHtml(r)}</span>`)
    .join('');

  const tierHtml = buildTierBadge(champion.tier);

  const patchHtml = champion.patch
    ? `<span class="patch-badge">Patch ${escapeHtml(champion.patch)}</span>`
    : '';

  return `
    <header class="champion-header">
      <div class="champion-header__inner container">
        <div class="champion-header__avatar-wrapper">
          ${imageHtml}
        </div>
        <div class="champion-header__info">
          <a href="/" class="champion-header__back" aria-label="Voltar para a lista de campeões">
            <span class="champion-header__back-arrow" aria-hidden="true">←</span>
            Todos os campeões
          </a>
          <h1 class="champion-header__name">${escapeHtml(champion.name)}</h1>
          <p class="champion-header__title-text">${escapeHtml(champion.title)}</p>
          <div class="champion-header__badges">
            ${rolesHtml}
            ${tierHtml}
            ${patchHtml}
          </div>
        </div>
      </div>
      <div class="container">
        <div class="champion-header__divider"></div>
      </div>
    </header>
  `;
}

/* ─── Seção: Estatísticas ───────────────────────────────────── */

function renderStats(stats) {
  const wr = formatStat(stats?.winRate, '%');
  const pr = formatStat(stats?.pickRate, '%');
  const br = formatStat(stats?.banRate, '%');

  return `
    <section class="section" aria-labelledby="stats-title">
      <div class="section__header">
        <h2 class="section__title" id="stats-title">Estatísticas</h2>
        <div class="section__line" aria-hidden="true"></div>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <p class="stat-card__label">Win Rate</p>
          <p class="stat-card__value ${!stats?.winRate ? 'stat-card__value--empty' : ''}">${wr}</p>
          <p class="stat-card__sub">Taxa de vitória</p>
        </div>
        <div class="stat-card">
          <p class="stat-card__label">Pick Rate</p>
          <p class="stat-card__value ${!stats?.pickRate ? 'stat-card__value--empty' : ''}">${pr}</p>
          <p class="stat-card__sub">Taxa de escolha</p>
        </div>
        <div class="stat-card">
          <p class="stat-card__label">Ban Rate</p>
          <p class="stat-card__value ${!stats?.banRate ? 'stat-card__value--empty' : ''}">${br}</p>
          <p class="stat-card__sub">Taxa de banimento</p>
        </div>
      </div>
    </section>
  `;
}

/* ─── Seção: Build ──────────────────────────────────────────── */

function renderBuild(build) {
  const hasData = build && (
    build.items?.length ||
    build.boots?.length ||
    build.runes?.length ||
    build.spells?.length
  );

  const content = hasData
    ? `<p style="color: var(--text-secondary); font-size: 0.875rem;">Dados disponíveis em breve.</p>`
    : `<div class="unavailable">
        <div class="unavailable__dot" aria-hidden="true"></div>
        <span>Dados ainda não disponíveis</span>
      </div>`;

  return `
    <section class="section" aria-labelledby="build-title">
      <div class="section__header">
        <h2 class="section__title" id="build-title">Build</h2>
        <div class="section__line" aria-hidden="true"></div>
      </div>
      <div class="info-section">
        <h3 class="info-section__title">
          <span class="info-section__icon" aria-hidden="true">⚔️</span>
          Itens, Runas e Feitiços
        </h3>
        ${content}
      </div>
    </section>
  `;
}

/* ─── Seção: Ordem de Habilidades ───────────────────────────── */

function renderSkillOrder(skillOrder) {
  const hasData = skillOrder && skillOrder.length > 0;

  const content = hasData
    ? `<p style="color: var(--text-secondary);">Dados disponíveis em breve.</p>`
    : `<div class="unavailable">
        <div class="unavailable__dot" aria-hidden="true"></div>
        <span>Dados ainda não disponíveis</span>
      </div>`;

  return `
    <section class="section" aria-labelledby="skills-title">
      <div class="section__header">
        <h2 class="section__title" id="skills-title">Ordem das Habilidades</h2>
        <div class="section__line" aria-hidden="true"></div>
      </div>
      <div class="info-section">
        <h3 class="info-section__title">
          <span class="info-section__icon" aria-hidden="true">✨</span>
          Prioridade de habilidades
        </h3>
        ${content}
      </div>
    </section>
  `;
}

/* ─── Seção: Counters ───────────────────────────────────────── */

function renderCounters(counters, strongAgainst) {
  const hasCounters = counters && counters.length > 0;
  const hasStrong = strongAgainst && strongAgainst.length > 0;

  const countersContent = hasCounters
    ? `<p style="color: var(--text-secondary);">Dados disponíveis em breve.</p>`
    : `<div class="unavailable">
        <div class="unavailable__dot" aria-hidden="true"></div>
        <span>Dados ainda não disponíveis</span>
      </div>`;

  const strongContent = hasStrong
    ? `<p style="color: var(--text-secondary);">Dados disponíveis em breve.</p>`
    : `<div class="unavailable">
        <div class="unavailable__dot" aria-hidden="true"></div>
        <span>Dados ainda não disponíveis</span>
      </div>`;

  return `
    <section class="section" aria-labelledby="counters-title">
      <div class="section__header">
        <h2 class="section__title" id="counters-title">Counters</h2>
        <div class="section__line" aria-hidden="true"></div>
      </div>
      <div class="info-section" style="margin-bottom: var(--space-sm);">
        <h3 class="info-section__title">
          <span class="info-section__icon" aria-hidden="true">🔴</span>
          Counters — Fraco contra
        </h3>
        ${countersContent}
      </div>
      <div class="info-section">
        <h3 class="info-section__title">
          <span class="info-section__icon" aria-hidden="true">🟢</span>
          Forte contra
        </h3>
        ${strongContent}
      </div>
    </section>
  `;
}

/* ─── Seção: Sinergias ──────────────────────────────────────── */

function renderSynergies(synergies) {
  const hasData = synergies && synergies.length > 0;

  const content = hasData
    ? `<p style="color: var(--text-secondary);">Dados disponíveis em breve.</p>`
    : `<div class="unavailable">
        <div class="unavailable__dot" aria-hidden="true"></div>
        <span>Dados ainda não disponíveis</span>
      </div>`;

  return `
    <section class="section" aria-labelledby="synergies-title">
      <div class="section__header">
        <h2 class="section__title" id="synergies-title">Sinergias</h2>
        <div class="section__line" aria-hidden="true"></div>
      </div>
      <div class="info-section">
        <h3 class="info-section__title">
          <span class="info-section__icon" aria-hidden="true">🤝</span>
          Bons aliados
        </h3>
        ${content}
      </div>
    </section>
  `;
}

/* ─── Seção: Fontes ─────────────────────────────────────────── */

function renderSources(sources, patch) {
  const hasSources = sources && sources.length > 0;

  const patchHtml = patch
    ? `<p style="margin-bottom: var(--space-md); font-size: 0.8rem; color: var(--text-muted);">
        Patch de referência: <strong style="color: var(--text-secondary);">${escapeHtml(patch)}</strong>
      </p>`
    : '';

  const content = hasSources
    ? `<div class="sources-list">
        ${sources.map((s) => `
          <div class="source-item">
            <span class="source-item__name">${escapeHtml(s.name || s)}</span>
            ${s.url ? `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" style="color: var(--blue); font-size: 0.8rem;">↗ Ver fonte</a>` : ''}
          </div>
        `).join('')}
      </div>`
    : `<div class="unavailable">
        <div class="unavailable__dot" aria-hidden="true"></div>
        <span>Dados ainda não disponíveis</span>
      </div>`;

  return `
    <section class="section" aria-labelledby="sources-title">
      <div class="section__header">
        <h2 class="section__title" id="sources-title">Fontes</h2>
        <div class="section__line" aria-hidden="true"></div>
      </div>
      <div class="info-section">
        <h3 class="info-section__title">
          <span class="info-section__icon" aria-hidden="true">📊</span>
          Origens dos dados
        </h3>
        ${patchHtml}
        ${content}
      </div>
    </section>
  `;
}

/* ─── Estados de UI ─────────────────────────────────────────── */

function showLoading() {
  const container = document.getElementById('champion-container');
  if (!container) return;
  container.innerHTML = `
    <div class="loading-state" role="status" aria-live="polite" style="padding: 6rem 1rem;">
      <div class="loading-spinner" aria-hidden="true"></div>
      <p>Carregando dados do campeão...</p>
    </div>
  `;
}

function showPageError(title, message) {
  document.title = 'Erro — Wild Rift Guide';
  const container = document.getElementById('champion-container');
  if (!container) return;
  container.innerHTML = `
    <div class="error-state" role="alert" style="padding: 6rem 1rem;">
      <div class="error-state__icon" aria-hidden="true">⚠️</div>
      <p class="error-state__title">${escapeHtml(title)}</p>
      <p class="error-state__message">${escapeHtml(message)}</p>
      <a href="/" class="btn btn--primary" style="margin-top: 1.5rem;">← Voltar para início</a>
    </div>
  `;
}

/* ─── Helpers ───────────────────────────────────────────────── */

/**
 * Lê o slug da query string da URL.
 * Ex: champion.html?champion=ahri → 'ahri'
 *
 * @returns {string|null}
 */
function getSlugFromURL() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('champion');
  if (!slug || !slug.trim()) return null;
  // Validação básica: apenas letras, números e hífens
  if (!/^[a-z0-9'-]+$/i.test(slug.trim())) return null;
  return slug.trim().toLowerCase();
}

/**
 * Formata uma estatística numérica ou exibe '--' se nula.
 *
 * @param {number|null} value
 * @param {string} [suffix] - Ex: '%'
 * @returns {string}
 */
function formatStat(value, suffix = '') {
  if (value === null || value === undefined) return '--';
  return `${value}${suffix}`;
}

/**
 * Retorna as iniciais do nome para o placeholder do avatar.
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
 * Gera o HTML do tier badge.
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
