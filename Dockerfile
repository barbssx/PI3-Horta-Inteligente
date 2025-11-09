FROM node:18

ENV NODE_ENV=production
ENV PORT=3000

# Define diretório de trabalho dentro do container
WORKDIR /app/backend

# Copia manifestos do backend para instalar dependências Node usando cache corretamente
COPY backend/package*.json ./
RUN npm ci --only=production || npm install --only=production

# Instala Python (necessário para scripts de ML)
RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copia requirements e instala dependências Python
COPY backend/requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copia restante do código backend
COPY backend/ ./

EXPOSE 3000

# Inicia aplicação
CMD ["node", "server.js"]
