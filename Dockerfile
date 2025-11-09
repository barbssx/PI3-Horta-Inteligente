FROM node:18

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app/backend

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE ${PORT}

USER node

CMD ["npm", "start"]