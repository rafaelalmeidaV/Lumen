# Projeto Lumen

Este projeto consiste em um backend desenvolvido em Go, focado na criação de um sistema de velas virtuais e intenções. A aplicação permite que usuários escolham tipos de velas, definam tempos de duração e registrem suas justificativas ou intenções.

## Objetivos do Projeto

* **Seleção de Velas**: Interface para escolha de diferentes tipos de velas simbólicas.
* **Gestão de Intenções**: Registro de mensagens, orações ou justificativas associadas a cada vela.
* **Temporização**: Controle do período em que cada vela permanece ativa no sistema.
* **Arquitetura Modular**: Organização do código por domínios, garantindo escalabilidade e facilidade de manutenção.

## Tecnologias Utilizadas

* **Linguagem**: Go (Golang)
* **Framework**: Gin Gonic
* **Banco de Dados**: MongoDB
* **Orquestração**: Kubernetes (Minikube)
* **Gerenciamento de Pacotes**: Helm

## Pré-requisitos

* [Docker](https://docs.docker.com/get-docker/)
* [Minikube](https://minikube.sigs.k8s.io/docs/start/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/)
* [Helm](https://helm.sh/docs/intro/install/)

## Configuração

Crie um arquivo `.env` no diretório `deploy/`:

```bash
MONGO_URI=mongodb://usuario:senha@mongo-service:27017/candles_db?authSource=admin
DB_NAME=candles_db
CANDLES_PORT=8080
```

## Como Rodar

### 1. Setup do Minikube

```bash
cd deploy/scripts
chmod +x setup-minikube.sh
./setup-minikube.sh
```

### 2. Build da Imagem

```bash
chmod +x build-and-push.sh
./build-and-push.sh
```

### 3. Deploy da Aplicação

```bash
chmod +x deploy.sh
./deploy.sh
```

## Acessar

```
http://candles.local
```

## Atualizar

```bash
./build-and-push.sh && ./deploy.sh
```

## Remover

```bash
helm uninstall candles-release
./setup-minikube.sh remove
```