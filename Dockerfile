FROM node:18

ENV NODE_ENV=production
ENV PORT=3000

# Trabalhar dentro de /app/backend (onde está o server.js)
WORKDIR /app/backend

# Sistema: Python para o script de ML
RUN apt-get update \
  && apt-get install -y python3 python3-pip \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Node deps do backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Python deps do backend
COPY backend/requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Código do backend
COPY backend/ ./

EXPOSE 3000

CMD ["npm", "start"]