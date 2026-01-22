#!/bin/bash

set -e

hosts="candles.local auth.local client.local"

getMinikubeIP() {
  if ! minikube status &> /dev/null; then
    echo "ERROR: Minikube is not running. Start with: minikube start" >&2
    exit 1
  fi

  local ip=$(minikube ip)
  
  if [ -z "$ip" ]; then
    echo "ERROR: Could not get Minikube IP" >&2
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

  echo "Minikube IP: $minikube_ip"
  echo "Adding hosts to /etc/hosts..."

  sudo bash -c "cat >> /etc/hosts << EOF
# minikube-candles
EOF"

  for host in $hosts; do
    echo "${minikube_ip} ${host}" | sudo tee -a /etc/hosts > /dev/null
    echo "  Added: ${minikube_ip} ${host}"
  done

  sudo tee -a /etc/hosts > /dev/null
  
  echo ""
  echo "Hosts configured. You can access:"
  for host in $hosts; do
    echo "  http://${host}"
  done
}

removeHosts() {
  echo "Removing Minikube hosts from /etc/hosts..."
  sudo sed -i.bak "/# minikube-candles/,/# minikube-candles-end/d" /etc/hosts
  echo "Hosts removed"
}

updateHosts() {
  local minikube_ip=${1}
  local hosts=${2}

  echo "Updating Minikube hosts..."
  removeHosts
  addHosts "${minikube_ip}" "${hosts}"
}

setupMinikube() {
  echo "Minikube Setup for Candles Service"
  echo "=========================================="
  echo ""

  if ! command -v minikube &> /dev/null; then
    echo "ERROR: Minikube is not installed"
    echo "Install at: https://minikube.sigs.k8s.io/docs/start/"
    exit 1
  fi

  echo "Checking Minikube status..."
  if ! minikube status &> /dev/null; then
    echo "Starting Minikube..."
    minikube start --driver=docker
    echo "Minikube started"
  else
    echo "Minikube is already running"
  fi

  echo ""
  echo "Enabling Ingress Controller..."
  minikube addons enable ingress

  echo "Waiting for Ingress Controller to be ready..."
  kubectl wait --namespace ingress-nginx \
    --for=condition=ready pod \
    --selector=app.kubernetes.io/component=controller \
    --timeout=120s 2>/dev/null || echo "WARNING: Continuing..."

  echo "Ingress Controller enabled"

  echo ""
  echo "Configuring /etc/hosts..."
  echo "This operation requires 'sudo'. Enter your password if prompted."
  echo ""

  minikube_ip=$(getMinikubeIP)

  if [ "$(doHostsExist "${minikube_ip}" "${hosts}")" == "false" ]; then
    removeHosts
    addHosts "${minikube_ip}" "${hosts}"
  else
    echo "Hosts are already configured correctly"
    for host in $hosts; do
      echo "  ${minikube_ip} ${host}"
    done
  fi

  echo ""
  echo "=========================================="
  echo "Minikube setup complete"
  echo "=========================================="
  echo ""
  echo "Minikube IP: $minikube_ip"
  echo "Configured hosts:"
  for host in $hosts; do
    echo "  - http://${host}"
  done
  echo ""
  echo "Next steps:"
  echo "  1. ./build-and-push.sh"
  echo "  2. ./deploy.sh"
  echo ""
}

showHelp() {
  echo "Usage: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  setup   - Complete Minikube setup (default)"
  echo "  add     - Add hosts to /etc/hosts"
  echo "  remove  - Remove hosts from /etc/hosts"
  echo "  update  - Update hosts with current IP"
  echo "  check   - Check if hosts are configured"
  echo ""
  echo "Managed hosts:"
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
      echo "This operation requires 'sudo'. Enter your password if prompted."
      echo ""
      removeHosts
      addHosts "${minikube_ip}" "${hosts}"
    else
      echo "Hosts are already configured correctly"
      for host in $hosts; do
        echo "  ${minikube_ip} ${host}"
      done
    fi
    ;;
    
  remove)
    echo "This operation requires 'sudo'. Enter your password if prompted."
    echo ""
    removeHosts
    ;;
    
  update)
    minikube_ip=$(getMinikubeIP)
    echo "This operation requires 'sudo'. Enter your password if prompted."
    echo ""
    updateHosts "${minikube_ip}" "${hosts}"
    ;;
    
  check)
    minikube_ip=$(getMinikubeIP)
    
    if [ "$(doHostsExist "${minikube_ip}" "${hosts}")" == "true" ]; then
      echo "All hosts are configured correctly"
      echo ""
      for host in $hosts; do
        echo "  ${minikube_ip} ${host}"
      done
    else
      echo "ERROR: Hosts are NOT configured or have different IP"
      echo ""
      echo "Current Minikube IP: ${minikube_ip}"
      echo ""
      echo "Run '$0 add' or '$0 update' to configure"
    fi
    ;;
    
  *)
    showHelp
    exit 1
    ;;
esac
