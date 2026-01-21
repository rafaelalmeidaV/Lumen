#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(realpath "$SCRIPT_DIR/../../../")"
CHART_DIR="$DEPLOY_DIR/chart"

APP_NAME="candles-service"
NAMESPACE="$APP_NAME"
CHART_NAME="$APP_NAME"
IMAGE_NAME="$APP_NAME"
IMAGE_TAG="latest"
HOST="candles.local"

createNamespaceIfNotExists() {
    if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
        echo "Creating namespace $NAMESPACE..."
        kubectl create namespace "$NAMESPACE"
    else
        echo "Namespace $NAMESPACE already exists"
    fi
}

loadEnvironmentVariables() {
    if [ -f "$PROJECT_ROOT/.env" ]; then
        set -a
        source "$PROJECT_ROOT/.env"
        set +a
        echo "Environment variables loaded from .env"
        
        if [ -z "$CANDLES_MONGO_URI" ]; then
            echo "ERROR: CANDLES_MONGO_URI is empty after loading .env"
            echo ".env file: $PROJECT_ROOT/.env"
            exit 1
        fi
    else
        echo "WARNING: .env not found at $PROJECT_ROOT/.env"
        exit 1
    fi
}

checkMinikube() {
    echo "Checking Minikube..."
    if ! minikube status &> /dev/null; then
        echo "ERROR: Minikube is not running"
        echo "Run: ./setup-minikube.sh"
        exit 1
    fi
    echo "Minikube is running"
}

createSecret() {
    echo ""
    echo "Creating MongoDB secret if not exists..."
    if ! kubectl get secret candles-mongo-secret -n "$NAMESPACE" &> /dev/null; then
        kubectl create secret generic candles-mongo-secret \
            --from-literal=CANDLES_MONGO_URI="$CANDLES_MONGO_URI" \
            --from-literal=DB_NAME="$DB_NAME" \
            --from-literal=CANDLES_PORT="$CANDLES_PORT" \
            --namespace "$NAMESPACE" \
            --dry-run=client -o yaml | kubectl apply -f -
        echo "Secret created"
    else
        echo "Secret already exists"
    fi
}

checkDockerImage() {
    echo ""
    echo "Checking Docker image..."
    eval "$(minikube docker-env)"

    if ! docker images | grep -q "${IMAGE_NAME}.*${IMAGE_TAG}"; then
        echo "ERROR: Image ${IMAGE_NAME}:${IMAGE_TAG} not found"
        echo "Run: ./build-and-push.sh"
        exit 1
    fi
    echo "Image ${IMAGE_NAME}:${IMAGE_TAG} found"
}

checkHelmChart() {
    echo ""
    echo "Checking Helm chart..."
    if [ ! -f "$CHART_DIR/Chart.yaml" ]; then
        echo "ERROR: Chart not found at $CHART_DIR/Chart.yaml"
        exit 1
    fi
    echo "Chart found: $CHART_DIR"
}

deployOrUpgrade() {
    echo ""
    echo "Deploying..."

    if helm list -n "$NAMESPACE" | grep -q "$CHART_NAME"; then
        echo "Existing release found. Upgrading..."
        helm upgrade "$CHART_NAME" "$CHART_DIR" \
            --set image.repository="$IMAGE_NAME" \
            --set image.tag="$IMAGE_TAG" \
            --namespace "$NAMESPACE" \
            --wait \
            --timeout 5m
        echo "Release upgraded"
        
        echo ""
        echo "Restarting pods to apply changes..."
        kubectl rollout restart deployment ${CHART_NAME}-candles-chart -n "$NAMESPACE"
        
        echo "Waiting for rollout to complete..."
        kubectl rollout status deployment ${CHART_NAME}-candles-chart -n "$NAMESPACE" --timeout=180s
    else
        echo "Installing new release..."
        helm install "$CHART_NAME" "$CHART_DIR" \
            --set image.repository="$IMAGE_NAME" \
            --set image.tag="$IMAGE_TAG" \
            --namespace "$NAMESPACE" \
            --wait \
            --timeout 5m
        echo "Release installed"
    fi
}

showDeploymentStatus() {
    echo ""
    echo "Deployment status:"
    echo ""

    echo "Pods:"
    kubectl get pods -n "$NAMESPACE" -l app.kubernetes.io/name=candles-chart
    echo ""

    echo "Services:"
    kubectl get svc -n "$NAMESPACE" -l app.kubernetes.io/name=candles-chart
    echo ""

    echo "Ingress:"
    kubectl get ingress -n "$NAMESPACE"
    echo ""
}

testApplication() {
    echo "Testing application..."
    sleep 5

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://$HOST" 2>/dev/null || echo "000")

    if [[ "$HTTP_CODE" =~ ^[23] ]]; then
        echo "Application is responding (HTTP $HTTP_CODE)"
    else
        echo "WARNING: Application not responding yet (HTTP $HTTP_CODE)"
        echo "Wait a few seconds and try accessing manually"
    fi
}

showSummary() {
    echo ""
    echo "============================"
    echo "Deploy complete"
    echo "============================"
    echo ""
    echo "Access: http://$HOST"
    echo ""
    echo "Useful commands:"
    echo "  kubectl get pods -n $NAMESPACE"
    echo "  kubectl logs -n $NAMESPACE -l app.kubernetes.io/name=candles-chart"
    echo "  kubectl describe pod <pod-name> -n $NAMESPACE"
    echo "  kubectl get ingress -n $NAMESPACE"
    echo "  minikube dashboard"
    echo ""
    echo "To update after changes:"
    echo "  ./build-and-push.sh && ./deploy.sh"
    echo ""
    echo "To remove:"
    echo "  helm uninstall -n $NAMESPACE $CHART_NAME"
    echo ""
}

main() {
    echo "Deploy Candles Service"
    echo "============================"
    echo ""

    createNamespaceIfNotExists
    loadEnvironmentVariables
    checkMinikube
    createSecret
    checkDockerImage
    checkHelmChart
    deployOrUpgrade
    showDeploymentStatus
    testApplication
    showSummary
}

main
