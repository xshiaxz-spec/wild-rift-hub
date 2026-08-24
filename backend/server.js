/**
 * Wild Rift Guide — Server
 *
 * Ponto de entrada da aplicação.
 * Configura Express, middlewares, rotas da API e servimento do frontend estático.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const championsRoutes = require('./routes/champions.routes');
const healthRoutes = require('./routes/health.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares ──────────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());

// Log de requisições para debug
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Rotas da API ─────────────────────────────────────────────────────────────

app.use('/api/health', healthRoutes);
app.use('/api/champions', championsRoutes);

// ─── Frontend estático ────────────────────────────────────────────────────────
// O Express serve os arquivos da pasta frontend diretamente.
// Assim, http://localhost:3000 abre a home e a API continua em /api/*

const FRONTEND_PATH = path.join(__dirname, '../frontend');

app.use(express.static(FRONTEND_PATH));

// Rota raiz explícita — garante que / sirva o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

// Rota para páginas HTML avulsas (champion.html, etc.)
// Qualquer rota não reconhecida que não seja /api/* redireciona para o frontend
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

// ─── Tratamento de erros global ───────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('[Server] Erro não tratado:', err.message);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

// ─── Inicialização ────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  Wild Rift Guide`);
  console.log(`  ──────────────────────────────`);
  console.log(`  Servidor:  http://localhost:${PORT}`);
  console.log(`  API:       http://localhost:${PORT}/api/champions`);
  console.log(`  Health:    http://localhost:${PORT}/api/health`);
  console.log(`  ──────────────────────────────\n`);
});

module.exports = app;
