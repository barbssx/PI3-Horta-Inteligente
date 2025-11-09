FROM node:18-slim

WORKDIR /app

RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

COPY . /app/

RUN npm install
RUN pip3 install -r requirements.txt

EXPOSE 3000

CMD ["node", "server.js"]
