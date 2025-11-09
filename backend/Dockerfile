# Usa imagem base do Node
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de dependências do Node
COPY package*.json ./

# Instala as dependências do Node.js
RUN npm install

# Copia todo o restante do código do backend
COPY . .

# Instala Python e dependências
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install -r python/requirements.txt || echo "Sem requirements.txt"

# Expõe a porta padrão
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "server.js"]
