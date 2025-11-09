FROM node:18-slimFROM node:18



WORKDIR /appENV NODE_ENV=production

ENV PORT=3000

# Instalar Python

RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*WORKDIR /app



# Copiar arquivos de dependênciasRUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

COPY requirements.txt ./# Com Root Directory=backend, o contexto já está em /backend

# Então copiamos direto do contexto atual (.)

# Instalar dependênciasCOPY package*.json ./

RUN npm installCOPY requirements.txt ./

RUN pip3 install -r requirements.txt

# DEBUG: Verificar o que foi copiado

# Copiar códigoRUN echo "===== CONTEÚDO DE /app APÓS COPY =====" && ls -lah /app/ && echo "===== FIM ====="

COPY . .

RUN npm install --omit=dev

EXPOSE 3000RUN pip3 install --no-cache-dir -r requirements.txt



CMD ["node", "server.js"]# Copia o resto do código

COPY . ./

EXPOSE 3000

CMD ["node", "server.js"]
