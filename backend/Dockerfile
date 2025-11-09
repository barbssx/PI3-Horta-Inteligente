FROM node:18

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --only=production

COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]