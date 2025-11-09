FROM node:18

ENV NODE_ENV=production
ENV PORT=3000

# Diretório de trabalho
WORKDIR /app/backend

# Instala Python (scripts de ML)
RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copia todo o backend de uma vez para garantir que package.json esteja presente
COPY backend/ ./

# Instala dependências Node e Python
RUN npm ci --only=production || npm install --only=production
RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 3000

CMD ["node", "server.js"]
