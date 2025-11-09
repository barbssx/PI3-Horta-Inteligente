# Usa imagem base Node.js
FROM node:18

# Define diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos essenciais do Node
COPY package*.json ./

# Instala dependências do Node
RUN npm install

# Copia o restante do backend
COPY . .

# Instala Python e dependências
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install -r python/requirements.txt

# Expõe a porta usada pelo Node
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "server.js"]
