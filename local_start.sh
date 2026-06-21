#!/bin/bash

trap "kill 0" SIGINT

PID=$(lsof -ti :8081)
if [ -n "$PID" ]; then
  kill -9 $PID
fi

(
  cd ./candles-service/app || exit
  go run ./cmd/api/main.go
) &

(
  cd ./auth-service/app || exit
  npx http-server . --cors -p 8081
) &

(
  cd ./client/app || exit
  sudo npx vite --host
) &

(
  docker start keycloak 2>/dev/null || true
) &

wait