#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"
CONTAINER_NAME="skillup-api-local"
IMAGE_NAME="skillup-api:latest"
PORT=8080

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env file not found at $ENV_FILE"
  exit 1
fi

export $(grep -v '^#' "$ENV_FILE" | grep -v '^$' | xargs)

docker stop "$CONTAINER_NAME" 2>/dev/null || true
docker rm "$CONTAINER_NAME" 2>/dev/null || true

if [ "${1}" == "--rebuild" ] || ! docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${IMAGE_NAME}$"; then
  echo "Building image..."
  cd "$ROOT_DIR"
  docker build -f packages/api/Dockerfile -t "$IMAGE_NAME" .
fi

echo ""
echo "Starting container..."
echo "Root Endpoint: http://localhost:$PORT"
echo "Health Check:  http://localhost:$PORT/health"
echo "API Docs:      http://localhost:$PORT/api-docs"
echo ""

docker run --rm --name "$CONTAINER_NAME" \
  -e DATABASE_URL="$DATABASE_URL" \
  -e DATABASE_DIRECT_URL="$DATABASE_DIRECT_URL" \
  -e NODE_ENV="${NODE_ENV:-development}" \
  -e PORT="$PORT" \
  -e SUPABASE_URL="$SUPABASE_URL" \
  -e SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
  -e SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
  -p "$PORT:$PORT" \
  "$IMAGE_NAME"
