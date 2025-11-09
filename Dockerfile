FROM node:18FROM node:18



ENV NODE_ENV=productionENV NODE_ENV=production

ENV PORT=3000ENV PORT=3000



WORKDIR /app# Diretório de trabalho

WORKDIR /app

# Instala Python para ML

RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*# Instala Python (scripts de ML)

RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copia TUDO do backend para /app

COPY backend/package*.json ./# Copia todo o código (quando Root Directory=backend no Railway, o contexto JÁ É backend/)

COPY backend/requirements.txt ./COPY . ./



# Instala dependências primeiro (cache Docker)# Instala dependências Node e Python

RUN npm install --omit=devRUN npm install --omit=dev

RUN pip3 install --no-cache-dir -r requirements.txtRUN pip3 install --no-cache-dir -r requirements.txt



# Copia resto do códigoEXPOSE 3000

COPY backend/ ./

CMD ["node", "server.js"]

EXPOSE 3000

CMD ["node", "server.js"]
