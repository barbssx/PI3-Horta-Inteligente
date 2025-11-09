# 1. Usa imagem base do Node
FROM node:18

# 2. Define o diretório de trabalho
WORKDIR /app

# 3. Instala as dependências do sistema (Python) de uma vez
RUN apt-get update && apt-get install -y python3 python3-pip

# 4. Copia os arquivos de dependências do BACKEND
# (Este é o passo crucial: 'backend/...')
COPY backend/package*.json ./
COPY backend/requirements.txt ./

# 5. Instala as dependências do BACKEND
RUN npm install

# 6. Instala as dependências do Python
RUN pip3 install -r requirements.txt

# 7. Copia todo o restante do código do BACKEND
COPY backend/ .

# 8. Expõe a porta padrão
EXPOSE 3000

# 9. Comando para iniciar o servidor
CMD ["node", "server.js"]