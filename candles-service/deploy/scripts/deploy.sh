#!/bin/bash

set -e

# =========================
# Diretórios base
# =========================

# Diretório do script (deploy/scripts)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Diretório deploy
DEPLOY_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

PROJECT_ROOT="$(realpath "$SCRIPT_DIR/../../..")"
# Diretório do Helm Chart
CHART_DIR="$DEPLOY_DIR/chart"

NAMESPACE="candles-service"

CHART_NAME="candles-release"
IMAGE_NAME="candles-service"
IMAGE_TAG="latest"

HOST="candles.local"

echo "Deploy do Candles Service"
echo "============================"
echo ""

if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
    echo "📂 Criando namespace $NAMESPACE..."
    kubectl create namespace "$NAMESPACE"
else
    echo "📂 Namespace $NAMESPACE já existe"
fi

# =========================
# 0. Carregar Env
# =========================
if [ -f "$PROJECT_ROOT/.env" ]; then
  export $(grep -v '^#' "$DEPLOY_DIR/.env" | xargs)
  echo "✅ Variáveis de ambiente carregadas do .env"
else
  echo "⚠️  .env não encontrado, usando valores padrão"
fi

# =========================
# 1. Verificar Minikube
# =========================
echo "📦 1. Verificando Minikube..."
if ! minikube status &> /dev/null; then
    echo "❌ Minikube não está rodando!"
    echo "💡 Execute: ./setup-minikube.sh"
    exit 1
fi
echo "✅ Minikube rodando"

# =========================
# 1.5. Criar Secret
# =========================
echo ""
echo "🔒 1.5 Criando Secret (MongoDB) se não existir..."
if ! kubectl get secret candles-mongo-secret &> /dev/null; then
    kubectl create secret generic candles-mongo-secret \
    --from-literal=CANDLES_MONGO_URI="$MONGO_URI" \
    --from-literal=DB_NAME="$DB_NAME" \
    --from-literal=CANDLES_PORT="$CANDLES_PORT" \
    --namespace "$NAMESPACE" \
    --dry-run=client -o yaml | kubectl apply -f -
    echo "✅ Secret criado"
else
    echo "✅ Secret já existe"
fi

# =========================
# 2. Verificar imagem Docker
# =========================
echo ""
echo "🐳 2. Verificando imagem Docker..."
eval "$(minikube docker-env)"

if ! docker images | grep -q "${IMAGE_NAME}.*${IMAGE_TAG}"; then
    echo "❌ Imagem ${IMAGE_NAME}:${IMAGE_TAG} não encontrada!"
    echo "💡 Execute: ./build-and-push.sh"
    exit 1
fi
echo "✅ Imagem ${IMAGE_NAME}:${IMAGE_TAG} encontrada"

# =========================
# 3. Verificar Helm Chart
# =========================
echo ""
echo "📋 3. Verificando Helm Chart..."
if [ ! -f "$CHART_DIR/Chart.yaml" ]; then
    echo "❌ Chart não encontrado em $CHART_DIR/Chart.yaml"
    exit 1
fi
echo "✅ Chart encontrado: $CHART_DIR"

# =========================
# 4. Deploy / Update
# =========================
echo ""
echo "📦 4. Fazendo deploy..."

if helm list | grep -q "$CHART_NAME"; then
    echo "🔄 Release existente encontrado. Atualizando..."
    helm upgrade "$CHART_NAME" "$CHART_DIR" \
        --set image.repository="$IMAGE_NAME" \
        --set image.tag="$IMAGE_TAG" \
        --namespace "$NAMESPACE"
    echo "✅ Release atualizado"
else
    echo "📦 Instalando novo release..."
    helm install "$CHART_NAME" "$CHART_DIR" \
        --set image.repository="$IMAGE_NAME" \
        --set image.tag="$IMAGE_TAG" \
        --namespace "$NAMESPACE"
    echo "✅ Release instalado"
fi

# =========================
# 5. Aguardar pods prontos
# =========================
echo ""
echo "⏳ 5. Aguardando pods ficarem prontos..."
echo "Isso pode levar alguns minutos..."

kubectl wait --for=condition=ready pod \
  -l app.kubernetes.io/name=candles-chart \
  --timeout=180s 2>/dev/null || {
    echo "⚠️  Timeout aguardando pods. Verificando status..."
}

# =========================
# 6. Status do deployment
# =========================
echo ""
echo "🔍 6. Status do deployment:"
echo ""

echo "Pods:"
kubectl get pods -l app.kubernetes.io/name=candles-chart
echo ""

echo "Services:"
kubectl get svc -l app.kubernetes.io/name=candles-chart
echo ""

echo "Ingress:"
kubectl get ingress
echo ""

# =========================
# 7. Testar conectividade
# =========================
echo "🧪 7. Testando aplicação..."
sleep 5

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://$HOST" 2>/dev/null || echo "000")

if [[ "$HTTP_CODE" =~ ^[23] ]]; then
    echo "✅ Aplicação respondendo! (HTTP $HTTP_CODE)"
else
    echo "⚠️  Aplicação ainda não está respondendo (HTTP $HTTP_CODE)"
    echo "💡 Aguarde alguns segundos e tente acessar manualmente"
fi

# =========================
# Resumo final
# =========================
echo ""
echo "============================"
echo "✅ Deploy concluído!"
echo "============================"
echo ""
echo "🌐 Acesse: http://$HOST"
echo ""
echo "🔍 Comandos úteis:"
echo "  kubectl get pods"
echo "  kubectl logs -l app.kubernetes.io/name=candles-chart"
echo "  kubectl describe pod <pod-name>"
echo "  kubectl get ingress"
echo "  minikube dashboard"
echo ""
echo "🔄 Para atualizar após mudanças:"
echo "  ./build-and-push.sh && ./deploy.sh"
echo ""
echo "🗑️  Para remover:"
echo "  helm uninstall $CHART_NAME"
echo ""
