#!/bin/bash

set -e

hosts="candles.local"

getMinikubeIP() {
  if ! minikube status &> /dev/null; then
    echo "❌ Minikube não está rodando. Inicie com: minikube start" >&2
    exit 1
  fi

  local ip=$(minikube ip)
  
  if [ -z "$ip" ]; then
    echo "❌ Não foi possível obter o IP do Minikube" >&2
    exit 1
  fi

  echo "$ip"
}

doHostsExist() {
  local minikube_ip=${1}
  local hosts=${2}

  for host in $hosts; do
    set +e
    cat /etc/hosts | grep -q "${minikube_ip} ${host}"
    local exitCode=$?
    set -e

    if [ $exitCode -ne 0 ]; then
      echo "false"
      return
    fi
  done

  echo "true"
}

addHosts() {
  local minikube_ip=${1}
  local hosts=${2}

  echo "📍 IP do Minikube: $minikube_ip"
  echo "✏️  Adicionando hosts ao /etc/hosts..."

  sudo bash -c "cat >> /etc/hosts << EOF
# minikube-candles
EOF"

  for host in $hosts; do
    sudo echo "${minikube_ip} ${host}" >> /etc/hosts
    echo "  ✅ ${minikube_ip} ${host}"
  done

  sudo echo "# minikube-candles-end" >> /etc/hosts
  
  echo ""
  echo "🌐 Hosts configurados! Você pode acessar:"
  for host in $hosts; do
    echo "  http://${host}"
  done
}

removeHosts() {
  echo "🧹 Removendo hosts do Minikube do /etc/hosts..."
  sudo sed -i.bak "/# minikube-candles/,/# minikube-candles-end/d" /etc/hosts
  echo "✅ Hosts removidos!"
}

updateHosts() {
  local minikube_ip=${1}
  local hosts=${2}

  echo "🔄 Atualizando hosts do Minikube..."
  removeHosts
  addHosts "${minikube_ip}" "${hosts}"
}

setupMinikube() {
  echo "🚀 Setup do Minikube para Candles Service"
  echo "=========================================="
  echo ""

  # Verificar se Minikube está instalado
  if ! command -v minikube &> /dev/null; then
    echo "❌ Minikube não está instalado!"
    echo "💡 Instale em: https://minikube.sigs.k8s.io/docs/start/"
    exit 1
  fi

  # Iniciar Minikube se não estiver rodando
  echo "📦 1. Verificando status do Minikube..."
  if ! minikube status &> /dev/null; then
    echo "🔄 Iniciando Minikube..."
    minikube start --driver=docker
    echo "✅ Minikube iniciado"
  else
    echo "✅ Minikube já está rodando"
  fi

  # Habilitar Ingress
  echo ""
  echo "🌐 2. Habilitando Ingress Controller..."
  minikube addons enable ingress

  echo "⏳ Aguardando Ingress Controller ficar pronto..."
  kubectl wait --namespace ingress-nginx \
    --for=condition=ready pod \
    --selector=app.kubernetes.io/component=controller \
    --timeout=120s 2>/dev/null || echo "⚠️  Continuando..."

  echo "✅ Ingress Controller habilitado"

  # Configurar /etc/hosts
  echo ""
  echo "🔧 3. Configurando /etc/hosts..."
  echo "Esta operação requer 'sudo'. Digite sua senha se solicitado."
  echo ""

  minikube_ip=$(getMinikubeIP)

  if [ "$(doHostsExist "${minikube_ip}" "${hosts}")" == "false" ]; then
    removeHosts
    addHosts "${minikube_ip}" "${hosts}"
  else
    echo "✅ Hosts já estão configurados corretamente!"
    for host in $hosts; do
      echo "  ${minikube_ip} ${host}"
    done
  fi

  # Resumo
  echo ""
  echo "=========================================="
  echo "✅ Setup do Minikube concluído!"
  echo "=========================================="
  echo ""
  echo "📍 IP do Minikube: $minikube_ip"
  echo "🌐 Hosts configurados:"
  for host in $hosts; do
    echo "  - http://${host}"
  done
  echo ""
  echo "🔍 Próximos passos:"
  echo "  1. ./build-and-push.sh    # Buildar e enviar a imagem"
  echo "  2. ./deploy.sh            # Fazer deploy da aplicação"
  echo ""
}

showHelp() {
  echo "Uso: $0 [comando]"
  echo ""
  echo "Comandos:"
  echo "  setup   - Setup completo do Minikube (padrão)"
  echo "  add     - Adiciona os hosts ao /etc/hosts"
  echo "  remove  - Remove os hosts do /etc/hosts"
  echo "  update  - Atualiza os hosts com o IP atual"
  echo "  check   - Verifica se os hosts estão configurados"
  echo ""
  echo "Hosts gerenciados:"
  for host in $hosts; do
    echo "  - ${host}"
  done
}

command=${1:-setup}

case "$command" in
  setup)
    setupMinikube
    ;;
    
  add)
    minikube_ip=$(getMinikubeIP)
    
    if [ "$(doHostsExist "${minikube_ip}" "${hosts}")" == "false" ]; then
      echo "Esta operação requer 'sudo'. Digite sua senha se solicitado."
      echo ""
      removeHosts
      addHosts "${minikube_ip}" "${hosts}"
    else
      echo "✅ Os hosts já estão configurados corretamente!"
      for host in $hosts; do
        echo "  ${minikube_ip} ${host}"
      done
    fi
    ;;
    
  remove)
    echo "Esta operação requer 'sudo'. Digite sua senha se solicitado."
    echo ""
    removeHosts
    ;;
    
  update)
    minikube_ip=$(getMinikubeIP)
    echo "Esta operação requer 'sudo'. Digite sua senha se solicitado."
    echo ""
    updateHosts "${minikube_ip}" "${hosts}"
    ;;
    
  check)
    minikube_ip=$(getMinikubeIP)
    
    if [ "$(doHostsExist "${minikube_ip}" "${hosts}")" == "true" ]; then
      echo "✅ Todos os hosts estão configurados corretamente!"
      echo ""
      for host in $hosts; do
        echo "  ${minikube_ip} ${host}"
      done
    else
      echo "❌ Os hosts NÃO estão configurados ou estão com IP diferente."
      echo ""
      echo "IP atual do Minikube: ${minikube_ip}"
      echo ""
      echo "Execute '$0 add' ou '$0 update' para configurar."
    fi
    ;;
    
  *)
    showHelp
    exit 1
    ;;
esac