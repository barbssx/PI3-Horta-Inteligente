FROM node:18-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY . .

RUN ls -la /app && \
    echo "==== Checking for package.json ====" && \
    if [ -f package.json ]; then \
        echo "package.json found, installing..."; \
        npm ci --production || npm install --production || npm install; \
    else \
        echo "ERROR: package.json not found!"; \
        exit 1; \
    fi && \
    pip3 install --no-cache-dir --break-system-packages -r requirements.txt

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE ${PORT}

CMD ["node", "server.js"]
