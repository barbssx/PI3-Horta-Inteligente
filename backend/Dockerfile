FROM node:18

ENV NODE_ENV=production
ENV PORT=3000


WORKDIR /app/backend

RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copia package.json e package-lock.json do backend (constrói a partir da raiz)
COPY backend/package*.json ./
RUN npm ci --only=production || npm install --only=production

# Copia requirements do backend e instala
COPY backend/requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copia todo o código do backend
COPY backend/ ./

EXPOSE 3000

CMD ["node", "server.js"]