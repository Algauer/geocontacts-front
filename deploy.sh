#!/bin/bash
set -e

echo "========================================="
echo "  Deploy GeoContacts Frontend - $(date)"
echo "========================================="

# 1. Rebuild do container
echo "[1/3] Rebuild do container Docker..."
docker compose -f docker-compose.prod.yml build --no-cache

# 2. Subir container
echo "[2/3] Subindo container..."
docker compose -f docker-compose.prod.yml up -d --force-recreate

# 3. Limpar imagens antigas
echo "[3/3] Limpando imagens não utilizadas..."
docker image prune -f

echo "========================================="
echo "  Deploy concluído com sucesso!"
echo "========================================="