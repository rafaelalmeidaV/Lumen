#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(realpath "$SCRIPT_DIR/../../app")"

IMAGE_NAME="client-service"
IMAGE_TAG="latest"

echo "Build and Push to Minikube"
echo "================================="
echo ""

echo "Checking Minikube..."
if ! minikube status &> /dev/null; then
    echo "ERROR: Minikube is not running"
    echo "Run: make setup"
    exit 1
fi
echo "Minikube is running"

echo ""
echo "Checking Dockerfile..."
if [ ! -f "$APP_DIR/Dockerfile" ]; then
    echo "ERROR: Dockerfile not found at $APP_DIR/Dockerfile"
    exit 1
fi
echo "Dockerfile found"

echo ""
echo "Configuring Docker to use Minikube..."
eval $(minikube docker-env)
echo "Docker configured"

echo ""
echo "Building Docker image..."
echo "Image: ${IMAGE_NAME}:${IMAGE_TAG}"
echo ""

docker build \
  -t ${IMAGE_NAME}:${IMAGE_TAG} \
  -f "$APP_DIR/Dockerfile" \
  "$APP_DIR"

if [ $? -eq 0 ]; then
    echo ""
    echo "Build completed successfully"
else
    echo ""
    echo "ERROR: Build failed"
    exit 1
fi

echo ""
echo "Verifying image..."
if docker images | grep -q "${IMAGE_NAME}.*${IMAGE_TAG}"; then
    echo "Image available in Minikube:"
    docker images | grep ${IMAGE_NAME}
else
    echo "ERROR: Image not found"
    exit 1
fi

echo ""
echo "================================="
echo "Build and Push complete"
echo "================================="
echo ""
echo "Image: ${IMAGE_NAME}:${IMAGE_TAG}"
echo "Available in Minikube Docker"
echo ""
echo "Next step:"
echo "  make deploy-client-service"
echo ""