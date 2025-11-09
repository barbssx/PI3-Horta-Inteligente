# Usa a imagem base do Node.js
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do Node.js
COPY package*.json ./

# Instala dependências do Node.js
RUN npm install

# Copia todo o restante do código para o container
COPY . .

# Instala Python e as dependências
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install -r python/requirements.txt

# Expõe a porta padrão do backend
EXPOSE 3000

# Comando de inicialização
CMD ["node", "server.js"]
