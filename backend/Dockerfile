FROM node:18

WORKDIR /app

RUN apt-get update && apt-get install -y python3 python3-pip

COPY package*.json ./
COPY requirements.txt ./

RUN npm install
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]