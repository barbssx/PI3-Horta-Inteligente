# 1. Usa imagem base do Node
FROM node:18

# 2. Define o diretório de trabalho
WORKDIR /app

# 3. Instala as dependências do sistema (Python) de uma vez
RUN apt-get update && apt-get install -y python3 python3-pip

# 4. Copia os arquivos de dependências (SEM o prefixo 'backend/')
COPY package*.json ./
COPY requirements.txt ./

# 5. Instala as dependências do Node.js
RUN npm install

# 6. Instala as dependências do Python
RUN pip3 install -r requirements.txt

# 7. Copia todo o restante do código (SEM o prefixo 'backend/')
COPY . .

# 8. Expõe a porta que o Railway espera
EXPOSE 8080

# 9. Comando para iniciar o servidor
# (O server.js precisa escutar na porta 8080)
CMD ["node", "server.js"]