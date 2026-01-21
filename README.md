# Lumen Project

The Lumen Project is a virtual candle and intention platform built with a modern microservices architecture. It allows users to register intentions, prayers, and messages through symbolic candles with controlled expiration times.

## System Architecture

The system is composed of independent services orchestrated via Kubernetes:

* **Candles Service**: A Go (Gin Gonic) backend responsible for business logic, candle management, and MongoDB persistence.
* **Auth Service**: Identity and Access Management (IAM) powered by **Keycloak**, implementing the **PKCE** flow for secure frontend authentication.
* **Database**: A MongoDB instance for storing intentions and candle states.

## Technologies

* **Languages**: Go (Golang)
* **Security**: Keycloak (OIDC/PKCE)
* **Database**: MongoDB
* **Infrastructure**: Docker, Kubernetes (Minikube), Helm
* **Automation**: GNU Make

## Prerequisites

Ensure you have the following installed:

* [Docker](https://docs.docker.com/get-docker/)
* [Minikube](https://minikube.sigs.k8s.io/docs/start/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/)
* [Helm](https://helm.sh/docs/intro/install/)

## Installation and Setup

This project uses a `Makefile` to centralize operations. Follow the order below for the initial setup:

### 1. Initial Permissions

Prepare the repository scripts by granting execution permissions:

```bash
make onboard

```

### 2. Environment Setup

Initialize Minikube, enable the Ingress Controller, and configure local domains in your `/etc/hosts`:

```bash
make setup

```

### 3. Build and Full Deployment

Compile Docker images within the Minikube environment and deploy via Helm Charts:

```bash
make all

```

## Accessing the Services

Once the deployment is complete, the services will be available at:

* **Main Application**: [http://candles.local](https://www.google.com/search?q=http://candles.local)
* **Identity Provider**: [http://auth.local](https://www.google.com/search?q=http://auth.local)

## Development Workflow

To update a specific service after code changes:

**Candles Service:**

```bash
make build-candles-service
make deploy-candles-service

```

**Auth Service:**

```bash
make build-auth-service
make deploy-auth-service

```

## Cleanup

To remove all deployments and clean local host entries:

```bash
make clean

```

---
