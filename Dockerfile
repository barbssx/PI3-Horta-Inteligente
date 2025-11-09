FROM node:18-bullseye

RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

COPY backend/requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
