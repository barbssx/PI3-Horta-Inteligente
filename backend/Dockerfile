FROM node:18FROM node:18



ENV NODE_ENV=productionENV NODE_ENV=production

ENV PORT=3000ENV PORT=3000



WORKDIR /appWORKDIR /app



# Instala Python para scripts de MLRUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Copia e instala dependências NodeRUN npm ci --only=production || npm install --only=production

COPY package*.json ./

RUN npm ci --only=production || npm install --only=productionCOPY requirements.txt ./

RUN pip3 install --no-cache-dir -r requirements.txt

# Copia e instala dependências Python

COPY requirements.txt ./COPY . .

RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 3000

# Copia todo o código

COPY . .CMD ["node", "server.js"]

EXPOSE 3000

CMD ["node", "server.js"]
