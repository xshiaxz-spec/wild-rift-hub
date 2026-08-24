/**
 * Script para gerar imagens SVG dos campeões
 * Execute com: node generate-champion-images.js
 */

const fs = require('fs');
const path = require('path');

const champions = [
  { name: 'Ahri', slug: 'ahri', color: '#FF6B9D', emoji: '🦊' },
  { name: 'Yasuo', slug: 'yasuo', color: '#B8D4E8', emoji: '🌪️' },
  { name: 'Jinx', slug: 'jinx', color: '#FF6B6B', emoji: '💣' },
  { name: 'Lee Sin', slug: 'lee-sin', color: '#FFB84D', emoji: '🥋' },
  { name: 'Lux', slug: 'lux', color: '#FFE66D', emoji: '✨' },
  { name: 'Garen', slug: 'garen', color: '#8B4513', emoji: '⚔️' },
  { name: 'Vi', slug: 'vi', color: '#FF8C42', emoji: '👊' },
  { name: 'Nautilus', slug: 'nautilus', color: '#4A90E2', emoji: '⚓' },
  { name: "Kai'Sa", slug: 'kaisa', color: '#9B59B6', emoji: '👽' },
  { name: 'Sett', slug: 'sett', color: '#E74C3C', emoji: '💪' },
  { name: 'Ezreal', slug: 'ezreal', color: '#3498DB', emoji: '🏹' },
  { name: 'Blitzcrank', slug: 'blitzcrank', color: '#7F8C8D', emoji: '🤖' },
];

const outputDir = path.join(__dirname, 'frontend', 'assets', 'images', 'champions');

// Cria a pasta se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✓ Pasta criada: ${outputDir}`);
}

function lightenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function generateSVG(champion) {
  const lightColor = lightenColor(champion.color, 20);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${champion.color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${lightColor};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
    </filter>
  </defs>
  
  <!-- Background com gradiente -->
  <rect width="160" height="160" fill="url(#grad)"/>
  
  <!-- Padrão hexagonal sutil -->
  <g opacity="0.08" stroke="white" stroke-width="0.5" fill="none">
    <polygon points="40,20 55,12 70,20 70,36 55,44 40,36"/>
    <polygon points="85,15 100,7 115,15 115,31 100,39 85,31"/>
    <polygon points="130,35 145,27 160,35 160,51 145,59 130,51" clip-path="url(#clip)"/>
    <polygon points="20,65 35,57 50,65 50,81 35,89 20,81"/>
    <polygon points="110,70 125,62 140,70 140,86 125,94 110,86"/>
    <polygon points="30,120 45,112 60,120 60,136 45,144 30,136"/>
    <polygon points="100,130 115,122 130,130 130,146 115,154 100,146"/>
  </g>
  
  <!-- Brilho degradado no topo -->
  <ellipse cx="80" cy="35" rx="55" ry="30" fill="white" opacity="0.15"/>
  
  <!-- Emoji/ícone central com sombra -->
  <text x="80" y="92" font-size="64" text-anchor="middle" dominant-baseline="middle" filter="url(#shadow)" opacity="0.2">
    ${champion.emoji}
  </text>
  
  <!-- Emoji/ícone central -->
  <text x="80" y="90" font-size="64" text-anchor="middle" dominant-baseline="middle">
    ${champion.emoji}
  </text>
  
  <!-- Borda decorativa -->
  <rect x="2" y="2" width="156" height="156" fill="none" stroke="white" stroke-width="1" opacity="0.2" rx="4"/>
</svg>`;
}

console.log('\n🎨 Gerando imagens dos campeões...\n');

champions.forEach((champion) => {
  const svg = generateSVG(champion);
  const filename = path.join(outputDir, `${champion.slug}.svg`);
  fs.writeFileSync(filename, svg, 'utf-8');
  console.log(`  ✓ ${champion.name.padEnd(15)} → ${champion.slug}.svg`);
});

console.log(`\n✅ ${champions.length} imagens geradas com sucesso!`);
console.log(`📁 Localização: ${outputDir}\n`);
