# 📦 Instruções para Fazer Commit no GitHub

O projeto Wild Rift Guide está pronto para ser enviado ao repositório. Escolha uma opção abaixo:

---

## ✅ Opção 1: Git Bash (Recomendado)

1. Abra **Git Bash** (procure na pasta de instalação do Git ou no menu Iniciar)
2. Navegue até a pasta do projeto:
   ```bash
   cd "/c/Users/Aluno/Downloads/site league of legends/wild-rift-guide"
   ```

3. Inicialize o repositório git:
   ```bash
   git init
   git add .
   git commit -m "feat: initialize Wild Rift Guide project with frontend and backend

- Set up Express backend with champion API
- Implement responsive frontend with HTML/CSS/JS
- Create 12 champion data with mockups
- Add champion cards with SVG placeholders
- Implement search, filters by role
- Create individual champion page
- Add layered architecture (routes → controllers → services → repositories)
- Prepare for PostgreSQL integration"
   ```

4. Adicione o repositório remoto:
   ```bash
   git remote add origin https://github.com/xshiaxz-spec/wild-rift-hub.git
   ```

5. Faça push para main:
   ```bash
   git branch -M main
   git push -u origin main
   ```

---

## ✅ Opção 2: GitHub Desktop

1. Abra **GitHub Desktop**
2. Clique em **File → Clone Repository**
3. Cole a URL: `https://github.com/xshiaxz-spec/wild-rift-hub.git`
4. Escolha a localização
5. Abra o repositório
6. Mude para o branch `main`
7. Arraste a pasta `wild-rift-guide` completa para o GitHub Desktop
8. Escreva a mensagem de commit:
   ```
   feat: initialize Wild Rift Guide project
   ```
9. Clique em **Commit to main**
10. Clique em **Push origin**

---

## ✅ Opção 3: VS Code Built-in Git

1. Abra a pasta `wild-rift-guide` no VS Code
2. Clique no ícone **Source Control** (Ctrl+Shift+G)
3. Clique em **Initialize Repository**
4. Stage all files (Ctrl+Shift+A)
5. Digite a mensagem de commit na caixa de texto
6. Pressione Ctrl+Enter ou clique o ícone de commit
7. Abra o Terminal integrado (Ctrl+`)
8. Execute:
   ```bash
   git remote add origin https://github.com/xshiaxz-spec/wild-rift-hub.git
   git branch -M main
   git push -u origin main
   ```

---

## 📝 Mensagem de Commit Sugerida

```
feat: initialize Wild Rift Guide project with full stack implementation

- Backend: Express.js API with champion routes and health check
- Frontend: Responsive HTML/CSS/JS with no dependencies
- Features: Search, filter by role, individual champion pages
- Architecture: Routes → Controllers → Services → Repositories (MVC-like)
- Data: 12 champions with SVG placeholders
- Design: Dark theme with cyan/gold colors, inspired by League of Legends UI
- Ready for PostgreSQL integration
- Nodemon for development, CORS enabled
```

---

## 🔧 Antes de Fazer Push

Verifique se:
- [ ] `node_modules/` não está sendo commitado (`.gitignore` está correto)
- [ ] `.env` não está sendo commitado
- [ ] Servidor está desligado (Ctrl+C no terminal do `npm run dev`)
- [ ] Não há erros de Git

---

## ✨ Estrutura do Projeto

```
wild-rift-guide/
├── frontend/          # UI em HTML/CSS/JS puro
├── backend/           # API Express
├── package.json       # Dependências
├── README.md          # Documentação
└── .gitignore         # Arquivos ignorados
```

---

**Pronto! Qualquer dúvida, é só chamar.** 🚀
