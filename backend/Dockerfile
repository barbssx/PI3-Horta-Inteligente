FROM node:18-slim

WORKDIR /app

RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./requirements.txt /app/requirements.txt

RUN npm install
RUN pip3 install -r requirements.txt

COPY . /app/

EXPOSE 3000

CMD ["node", "server.js"]
