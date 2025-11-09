#!/bin/bash

# Garante que estamos no diretório correto
cd "$(dirname "$0")"

# Nome da imagem e tag
IMAGE_NAME="horta-inteligente-backend"
IMAGE_TAG="latest"

# Constrói a imagem
echo "Construindo imagem Docker para o backend..."
docker build -t "$IMAGE_NAME:$IMAGE_TAG" .

# Verifica se o build foi bem sucedido
if [ $? -eq 0 ]; then
    echo "Build concluído com sucesso!"
    echo "Para executar o container, use:"
    echo "docker run -p 3000:3000 $IMAGE_NAME:$IMAGE_TAG"
else
    echo "Erro durante o build da imagem"
    exit 1
fi