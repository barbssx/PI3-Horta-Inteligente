# 1. Usa imagem base do Node
FROM node:18

# 2. Define o diretório de trabalho
WORKDIR /app

# 3. Instala as dependências do sistema (Python) de uma vez
RUN apt-get update && apt-get install -y python3 python3-pip

# 4. Copia os arquivos de dependências, especificando a pasta 'backend'
# O build começa na raiz, então ele precisa "entrar" na pasta backend/
COPY backend/package*.json ./
COPY backend/requirements.txt ./

# 5. Instala as dependências do Node.js
RUN npm install

# 6. Instala as dependências do Python
RUN pip3 install -r requirements.txt

# 7. Copia todo o restante do código da pasta 'backend' para o /app
COPY backend/ .

# 8. Expõe a porta padrão
EXPOSE 3000

# 9. Comando para iniciar o servidor
CMD ["node", "server.js"]