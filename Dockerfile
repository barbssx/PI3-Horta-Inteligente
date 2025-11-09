FROM node:18

ENV NODE_ENV=production
ENV PORT=3000

# Diretório de trabalho
WORKDIR /app

# Instala Python (scripts de ML)
RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copia todo o código (quando Root Directory=backend no Railway, o contexto JÁ É backend/)
COPY . ./

# Instala dependências Node e Python
RUN npm install --omit=dev
RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 3000

CMD ["node", "server.js"]
