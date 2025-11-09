# 📦 Guia de Deploy - Horta Inteligente

## 🏗️ Arquitetura do Projeto

```
PI3-Horta-Inteligente/
├── backend/              # API Node.js + Express + Python ML
│   ├── server.js        # Servidor Express (porta 3000)
│   ├── package.json     # Dependências Node.js
│   ├── requirements.txt # Dependências Python
│   ├── controllers/     # Lógica de ML e upload
│   ├── models/          # Models Sequelize
│   └── routes/          # Rotas da API
├── src/                 # Frontend Vue.js
└── Dockerfile           # Build para Railway (backend)
```

---

## 🚀 Deploy do Backend (Railway)

### 1. **Configuração do Railway**

No painel do Railway, configurar:

- **Builder**: `Dockerfile`
- **Dockerfile Path**: `Dockerfile` (arquivo na raiz)
- **Root Directory**: `/` ou deixar vazio
- **Build Command**: deixar vazio (Dockerfile gerencia)

### 2. **Variáveis de Ambiente**

Configurar no Railway → Settings → Environment Variables:

```env
DATABASE_URL=postgres://user:password@host:port/database
NODE_ENV=production
PORT=3000
```

### 3. **Como Funciona o Build**

O `Dockerfile` na raiz do repositório:

1. **Base Image**: Node.js 18 + Python 3
2. **Working Directory**: `/app/backend`
3. **Instala dependências**:
   - Node: `npm ci --only=production`
   - Python: `pip3 install -r requirements.txt`
4. **Copia código** do diretório `backend/` para dentro do container
5. **Comando de start**: `node server.js`

**Importante**: O Railway usa o contexto da raiz do repositório, mas o Dockerfile copia especificamente do subdiretório `backend/`.

### 4. **Estrutura do Dockerfile**

```dockerfile
# Baseado em Node 18 Alpine
FROM node:18-alpine

# Instala Python e dependências do sistema
RUN apk add --no-cache python3 py3-pip build-base

# Define diretório de trabalho
WORKDIR /app/backend

# Copia e instala dependências Node
COPY backend/package*.json ./
RUN npm ci --only=production || npm install --only=production

# Copia e instala dependências Python
COPY backend/requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copia todo o código do backend
COPY backend/ ./

# Expõe porta 3000
EXPOSE 3000

# Inicia servidor
CMD ["node", "server.js"]
```

### 5. **Configuração railway.toml**

```toml
[build]
builder = "Dockerfile"
dockerfilePath = "Dockerfile"
watchPaths = ["backend/**"]

[deploy]
startCommand = "cd backend && node server.js"
```

- **watchPaths**: Railway redeployer quando arquivos em `backend/` mudarem
- **startCommand**: Garante execução no contexto correto

---

## 🌐 Deploy do Frontend (Vercel)

### 1. **Configuração Vercel**

- **Framework Preset**: Vue.js
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2. **Variáveis de Ambiente**

```env
VUE_APP_API_URL=https://seu-backend.railway.app
```

### 3. **Configuração vercel.json**

Verificar se existe na raiz:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🔐 CORS - Configuração Crítica

O backend (`backend/server.js`) está configurado para aceitar requisições de:

```javascript
const allowedOrigins = [
  "https://dashboard-eight-xi-35.vercel.app",
  "https://horta-inteligente-jxenulci8-barbaras-projects-04d294a6.vercel.app",
  "http://localhost:8080"
];
```

**⚠️ Sempre que deployar frontend em nova URL**:
1. Adicionar a URL em `allowedOrigins`
2. Commit e push
3. Railway irá redeployar automaticamente

---

## 🐛 Troubleshooting

### Erro: "node: command not found"

**Causa**: Railway tentando usar Nixpacks ao invés do Dockerfile

**Solução**:
1. Ir em Settings → Build → Builder
2. Selecionar `Dockerfile`
3. Clear Build Cache
4. Redeploy

### Erro: "/backend: not found" no build

**Causa**: Docker context não encontra diretório `backend/`

**Solução**:
1. Verificar se `watchPaths = ["backend/**"]` está no railway.toml
2. Confirmar que Dockerfile está na **raiz** do repositório
3. Clear Build Cache no Railway
4. Redeploy

### Erro 502 - Bad Gateway

**Possíveis causas**:
1. Servidor não iniciou (verificar logs do Railway)
2. Porta incorreta (deve ser 3000)
3. Banco de dados não conectado
4. Timeout na inicialização (>15s)

**Debug**:
```bash
# Verificar logs no Railway
railway logs

# Testar health endpoint
curl https://seu-backend.railway.app/health
```

### CORS Error no Frontend

**Sintoma**: `Access to XMLHttpRequest...has been blocked by CORS policy`

**Solução**:
1. Verificar URL do frontend em `allowedOrigins` (backend/server.js)
2. Verificar se backend está respondendo (testar `/health`)
3. Confirmar que preflight OPTIONS está retornando 200

---

## ✅ Checklist de Deploy

### Backend (Railway)

- [ ] Variáveis de ambiente configuradas (DATABASE_URL, PORT)
- [ ] Builder definido como "Dockerfile"
- [ ] Dockerfile na raiz do repositório
- [ ] railway.toml com watchPaths correto
- [ ] Build cache limpo antes do deploy
- [ ] Logs mostram "Servidor rodando na porta 3000"
- [ ] Endpoint `/health` retorna 200 OK
- [ ] Database conectado (logs mostram "Database connected")

### Frontend (Vercel)

- [ ] VUE_APP_API_URL aponta para Railway
- [ ] Build completa sem erros
- [ ] URL adicionada em allowedOrigins do backend
- [ ] CORS funcionando (sem erros no console)

### Integração

- [ ] Frontend consegue fazer GET/POST na API
- [ ] Upload de arquivos funciona
- [ ] Dashboard carrega dados do banco
- [ ] ML predictions funcionam

---

## 📝 Notas Importantes

1. **Python + Node.js**: O backend precisa de ambos os runtimes. Python é usado para scripts de ML (treinar_modelo.py).

2. **Database Retry**: O servidor tenta conectar 5 vezes com backoff exponencial. Logs mostrarão tentativas.

3. **Health Checks**: 
   - `GET /health` - Status básico do servidor
   - `GET /api` - Confirma API está respondendo

4. **Estrutura do Banco**:
   - Models: `Registro.js`, `Previsao.js`
   - Sequelize com suporte MySQL e PostgreSQL
   - Migrations automáticas na inicialização

5. **Watch Mode**: Railway redeployer automaticamente ao detectar mudanças em `backend/**` (definido em watchPaths).

---

## 🆘 Comandos Úteis

```bash
# Ver logs do Railway (localmente com CLI)
railway logs --follow

# Limpar cache do Railway (via painel ou CLI)
railway service cache clear

# Testar Dockerfile localmente
docker build -t horta-backend .
docker run -p 3000:3000 --env-file backend/.env horta-backend

# Verificar se backend está respondendo
curl https://seu-backend.railway.app/health

# Testar CORS preflight
curl -X OPTIONS https://seu-backend.railway.app/api/registros \
  -H "Origin: https://seu-frontend.vercel.app" \
  -H "Access-Control-Request-Method: GET"
```

---

**Última atualização**: Novembro 2024  
**Mantido por**: Equipe PI3 UNIVESP
