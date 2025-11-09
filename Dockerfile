FROM node:18



ENV NODE_ENV=production

ENV PORT=3000



# Diretório de trabalho dentro do container
WORKDIR /app/backend

RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

# Dependências Node
COPY backend/package*.json ./
RUN npm ci --only=production || npm install --only=production

# Dependências Python
COPY backend/requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Código do backend
COPY backend/ ./

EXPOSE 3000

CMD ["node", "server.js"]
