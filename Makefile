.PHONY: onboard setup build-all deploy-all all

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

build-client:
	@bash client/deploy/scripts/build-and-push.sh

deploy-candles-service:
	@bash candles-service/deploy/scripts/deploy.sh

deploy-auth-service:
	@bash auth-service/deploy/scripts/deploy.sh

deploy-client:
	@bash client/deploy/scripts/deploy.sh

build-all: build-candles-service build-auth-service build-client

deploy-all: deploy-candles-service deploy-auth-service deploy-client

all: setup build-all deploy-all