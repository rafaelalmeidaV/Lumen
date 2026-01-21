#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CHART_DIR="$DEPLOY_DIR/chart"

APP_NAME="auth-service"
NAMESPACE="$APP_NAME"
CHART_NAME="$APP_NAME"
IMAGE_NAME="$APP_NAME"
IMAGE_TAG="latest"
HOST="auth.local"

createNamespaceIfNotExists() {
    if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
        echo "Creating namespace $NAMESPACE..."
        kubectl create namespace "$NAMESPACE"
    else
        echo "Namespace $NAMESPACE already exists"
    fi
}

checkMinikube() {
    echo "Checking Minikube..."
    if ! minikube status &> /dev/null; then
        echo "ERROR: Minikube is not running"
        echo "Run: make setup"
        exit 1
    fi
    echo "Minikube is running"
}

checkDockerImage() {
    echo ""
    echo "Checking Docker image..."
    eval "$(minikube docker-env)"

    if ! docker images | grep -q "${IMAGE_NAME}.*${IMAGE_TAG}"; then
        echo "ERROR: Image ${IMAGE_NAME}:${IMAGE_TAG} not found"
        echo "Run: make build-auth-service"
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
        kubectl rollout restart deployment ${CHART_NAME}-auth-chart -n "$NAMESPACE"
        
        echo "Waiting for rollout to complete..."
        kubectl rollout status deployment ${CHART_NAME}-auth-chart -n "$NAMESPACE" --timeout=180s
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
    kubectl get pods -n "$NAMESPACE" -l app.kubernetes.io/name=auth-chart
    echo ""

    echo "Services:"
    kubectl get svc -n "$NAMESPACE" -l app.kubernetes.io/name=auth-chart
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
    echo "Admin Console: http://$HOST/admin"
    echo ""
    echo "Credentials:"
    echo "  Username: admin"
    echo "  Password: admin"
    echo ""
    echo "Useful commands:"
    echo "  kubectl get pods -n $NAMESPACE"
    echo "  kubectl logs -n $NAMESPACE -l app.kubernetes.io/name=auth-chart"
    echo "  kubectl describe pod <pod-name> -n $NAMESPACE"
    echo ""
    echo "To update after changes:"
    echo "  make build-auth-service && make deploy-auth-service"
    echo ""
    echo "To remove:"
    echo "  helm uninstall -n $NAMESPACE $CHART_NAME"
    echo ""
}

main() {
    echo "Deploy Auth Service"
    echo "============================"
    echo ""

    createNamespaceIfNotExists
    checkMinikube
    checkDockerImage
    checkHelmChart
    deployOrUpgrade
    showDeploymentStatus
    testApplication
    showSummary
}

main