FROM node:18

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

# Com Root Directory=backend, o contexto já está em /backend
# Então copiamos direto do contexto atual (.)
COPY package*.json ./
COPY requirements.txt ./

# DEBUG: Verificar o que foi copiado
RUN echo "===== CONTEÚDO DE /app APÓS COPY =====" && ls -lah /app/ && echo "===== FIM ====="

RUN npm install --omit=dev
RUN pip3 install --no-cache-dir -r requirements.txt

# Copia o resto do código
COPY . ./

EXPOSE 3000

CMD ["node", "server.js"]
