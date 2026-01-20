#!/bin/bash

set -e

# Configurações
IMAGE_NAME="candles-service"
IMAGE_TAG="latest"

echo "🏗️  Build and Push para Minikube"
echo "================================="
echo ""

# 1. Verificar se Minikube está rodando
echo "📦 1. Verificando Minikube..."
if ! minikube status &> /dev/null; then
    echo "❌ Minikube não está rodando!"
    echo "💡 Execute: ./setup-minikube.sh"
    exit 1
fi
echo "✅ Minikube rodando"

# 2. Verificar se Dockerfile existe
echo ""
echo "📄 2. Verificando Dockerfile..."
if [ ! -f "../../app/Dockerfile" ]; then
    echo "❌ Dockerfile não encontrado!"
    echo "💡 Certifique-se de estar no diretório correto"
    exit 1
fi
echo "✅ Dockerfile encontrado"

# 3. Configurar Docker para usar o Minikube
echo ""
echo "🐳 3. Configurando Docker para Minikube..."
eval $(minikube docker-env)
echo "✅ Docker configurado para usar o ambiente do Minikube"

# 4. Build da imagem
echo ""
echo "🔨 4. Building imagem Docker..."
echo "Imagem: ${IMAGE_NAME}:${IMAGE_TAG}"
echo ""

docker build \
  -t ${IMAGE_NAME}:${IMAGE_TAG} \
  -f ../../app/Dockerfile \
  ../../app

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build concluído com sucesso!"
else
    echo ""
    echo "❌ Erro no build da imagem"
    exit 1
fi

# 5. Verificar imagem
echo ""
echo "🔍 5. Verificando imagem..."
if docker images | grep -q "${IMAGE_NAME}.*${IMAGE_TAG}"; then
    echo "✅ Imagem disponível no Minikube:"
    docker images | grep ${IMAGE_NAME}
else
    echo "❌ Imagem não encontrada!"
    exit 1
fi

# Resumo
echo ""
echo "================================="
echo "✅ Build and Push concluído!"
echo "================================="
echo ""
echo "📦 Imagem: ${IMAGE_NAME}:${IMAGE_TAG}"
echo "🐳 Disponível no Docker do Minikube"
echo ""
echo "🔍 Próximo passo:"
echo "  ./deploy.sh    # Fazer deploy da aplicação"
echo ""