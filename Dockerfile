FROM node:18



ENV NODE_ENV=production

ENV PORT=3000



# Diretório de trabalho dentro do container
WORKDIR /app

RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copia todo o backend primeiro
COPY backend/ ./backend/

# Muda para o diretório backend e instala dependências
WORKDIR /app/backend

# Dependências Node
RUN npm ci --only=production || npm install --only=production

# Dependências Python
RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 3000

CMD ["node", "server.js"]
