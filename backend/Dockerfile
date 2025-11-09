FROM node:18

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY . ./

# Debug: listar arquivos copiados
RUN ls -la /app/ && echo "===== Arquivos copiados =====" && find /app -type f | head -20

RUN npm install --omit=dev
RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 3000

CMD ["node", "server.js"]
