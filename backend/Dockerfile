FROM node:18-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY . .

RUN npm install && \
    pip3 install --no-cache-dir --break-system-packages -r requirements.txt

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE ${PORT}

CMD ["node", "server.js"]
