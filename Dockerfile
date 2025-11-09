FROM node:18FROM node:18



ENV NODE_ENV=production

ENV PORT=3000

ENV NODE_ENV=production

# Copiamos só manifests primeiro para cache eficiente

WORKDIR /app/backendENV PORT=3000

COPY backend/package*.json ./

RUN npm ci --only=production || npm install --only=production



# Python para scripts de ML# Diretório de trabalho dentro do container

RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*WORKDIR /app



# Copia requisitos Python e instalaRUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./

RUN pip3 install --no-cache-dir -r requirements.txt# Copia todo o backend primeiro

COPY backend/ ./backend/

# Copia o restante do código

COPY backend/ ./# Muda para o diretório backend e instala dependências

WORKDIR /app/backend

EXPOSE 3000

CMD ["node", "server.js"]# Dependências Node

RUN npm ci --only=production || npm install --only=production

# Dependências Python
RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 3000

CMD ["node", "server.js"]
