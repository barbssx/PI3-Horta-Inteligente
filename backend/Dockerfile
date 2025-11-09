# Usa Node.js como base
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do Node primeiro (para otimizar cache)
COPY package*.json ./

# Instala dependências do Node.js
RUN npm install

# Copia o restante do projeto
COPY . .

# Instala Python e dependências do script
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install -r python/requirements.txt

# Expõe a porta do servidor
EXPOSE 3000

# Comando padrão de inicialização
CMD ["node", "server.js"]
