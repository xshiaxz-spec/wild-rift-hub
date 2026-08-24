# Wild Rift Guide

> Guia completo de League of Legends: Wild Rift

## Descrição

Wild Rift Guide é uma aplicação web que reúne informações sobre os campeões de **League of Legends: Wild Rift**, incluindo builds, runas, counters, estatísticas, tier lists e muito mais.

O projeto está em desenvolvimento ativo. Esta versão representa a fundação da aplicação, com a estrutura preparada para crescer e integrar dados de múltiplas fontes como Riot Games, WildRiftFire e Wild Legends.

---

## Tecnologias

| Camada     | Tecnologia              |
|------------|-------------------------|
| Frontend   | HTML5, CSS3, JavaScript |
| Backend    | Node.js, Express        |
| Dados      | JSON (mock)             |
| Futuro BD  | PostgreSQL              |

---

## Como instalar

```bash
git clone https://github.com/seu-usuario/wild-rift-guide.git
cd wild-rift-guide
npm install
```

---

## Como executar

```bash
npm run dev
```

Acesse em:

```
http://localhost:3000
```

---

## Variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o `.env` conforme necessário. A porta padrão é `3000`.

---

## API

### Health Check

```
GET /api/health
```

**Resposta:**
```json
{ "status": "ok" }
```

---

### Listar campeões

```
GET /api/champions
```

**Parâmetros opcionais:**

| Parâmetro | Tipo   | Descrição                          |
|-----------|--------|-------------------------------------|
| `role`    | string | Filtra por rota (ex: `Mid`)         |
| `search`  | string | Busca por nome (ex: `ahri`)         |

**Exemplos:**
```
GET /api/champions
GET /api/champions?role=Mid
GET /api/champions?search=ah
GET /api/champions?role=Mid&search=ah
```

---

### Buscar campeão por slug

```
GET /api/champions/:slug
```

**Exemplo:**
```
GET /api/champions/ahri
```

**Resposta de sucesso:** dados do campeão

**Resposta de erro (404):**
```json
{ "error": "Campeão não encontrado." }
```

---

## Estrutura do projeto

```
wild-rift-guide/
│
├── frontend/                   # Interface do usuário
│   ├── index.html              # Home — listagem de campeões
│   ├── champion.html           # Página individual do campeão
│   ├── css/
│   │   ├── global.css          # Reset, variáveis e estilos globais
│   │   ├── home.css            # Estilos da home
│   │   └── champion.css        # Estilos da página do campeão
│   ├── js/
│   │   ├── api.js              # Camada centralizada de chamadas à API
│   │   ├── home.js             # Lógica da home (grid, filtros, busca)
│   │   └── champion.js         # Lógica da página individual
│   └── assets/
│       ├── images/
│       │   └── champions/      # Imagens dos campeões (ex: ahri.webp)
│       └── icons/
│
├── backend/
│   ├── server.js               # Ponto de entrada do servidor Express
│   ├── routes/
│   │   ├── champions.routes.js # Rotas /api/champions
│   │   └── health.routes.js    # Rota /api/health
│   ├── controllers/
│   │   └── champions.controller.js
│   ├── services/
│   │   └── champions.service.js
│   ├── repositories/
│   │   └── champions.repository.js  # Abstração de acesso a dados (JSON hoje, PostgreSQL futuramente)
│   ├── data/
│   │   └── champions.json      # Dados mockados
│   └── utils/
│       └── normalizeText.js    # Utilitário para normalização de strings
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Roadmap

```
[x] Estrutura inicial
[x] API básica
[x] Catálogo de campeões
[x] Pesquisa por nome
[x] Filtros por rota
[x] Página individual do campeão

[ ] Banco de dados PostgreSQL
[ ] Todos os campeões do Wild Rift
[ ] Builds completas (itens, runas, feitiços)
[ ] Ordem de habilidades
[ ] Counters e sinergias
[ ] Estatísticas reais (win rate, pick rate, ban rate)
[ ] Tier List
[ ] Dados por patch
[ ] Histórico de estatísticas
[ ] Integração com fontes (Wild Legends, WildRiftFire)
[ ] Comparador de campeões
[ ] Analisador de composições
[ ] Sistema de usuários e favoritos
```

---

## Fontes de dados (futuras)

- [Wild Legends](https://wildlegends.net/)
- [WildRiftFire](https://www.wildriftfire.com/)
- [Riot Games — Wild Rift](https://wildrift.leagueoflegends.com/pt-br/champions/)

> **Aviso:** Os dados desta versão são demonstrativos. Nenhuma estatística (win rate, pick rate, ban rate, tier) reflete dados reais do jogo.

---

## Licença

MIT
