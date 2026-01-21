.PHONY: help onboard setup build-all deploy-all all clean

help:
	@echo "Available commands:"
	@echo ""
	@echo "  make onboard                  - Setup permissions (run once)"
	@echo "  make setup                    - Setup Minikube environment"
	@echo ""
	@echo "  make build-candles-service    - Build candles-service"
	@echo "  make build-auth-service       - Build auth-service"
	@echo "  make build-all                - Build all services"
	@echo ""
	@echo "  make deploy-candles-service   - Deploy candles-service"
	@echo "  make deploy-auth-service      - Deploy auth-service"
	@echo "  make deploy-all               - Deploy all services"
	@echo ""
	@echo "  make all                      - Setup + Build + Deploy all"
	@echo "  make clean                    - Clean all services"
	@echo ""

onboard:
	@echo "Setting execution permissions for all shell scripts..."
	@find . -name "*.sh" -type f -exec chmod +x {} \;
	@echo "Permissions set for all .sh files in the repository."

setup:
	@bash common/setup-minikube.sh

build-candles-service:
	@bash candles-service/deploy/scripts/build-and-push.sh

build-auth-service:
	@bash auth-service/deploy/scripts/build-and-push.sh

deploy-candles-service:
	@bash candles-service/deploy/scripts/deploy.sh

deploy-auth-service:
	@bash auth-service/deploy/scripts/deploy.sh

build-all: build-candles-service build-auth-service

deploy-all: deploy-candles-service deploy-auth-service

all: setup build-all deploy-all

clean:
	@cd candles-service/deploy/scripts && ./setup-minikube.sh remove
	@helm uninstall -n candles-service candles-service 2>/dev/null || true
	@helm uninstall -n auth-service auth-service 2>/dev/null || true