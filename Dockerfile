FROM node:18

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./
COPY backend/requirements.txt ./

RUN npm install --omit=dev
RUN pip3 install --no-cache-dir -r requirements.txt

COPY backend/ ./

EXPOSE 3000

CMD ["node", "server.js"]
