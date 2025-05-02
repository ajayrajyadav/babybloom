#!/bin/bash

# Detect environment mode
ENV_MODE="${1:-local}"

if [ "$ENV_MODE" == "docker" ]; then
  ENV_FILE=".env.docker"
else
  ENV_FILE=".env.local"
fi

# Absolute path resolution
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_PATH="$SCRIPT_DIR/$ENV_FILE"
NGINX_TEMPLATE="$SCRIPT_DIR/nginx.conf.template"
NGINX_OUTPUT="$SCRIPT_DIR/nginx.conf"

# Verify file exists
if [ ! -f "$ENV_PATH" ]; then
  echo "❌ Error: $ENV_PATH does not exist."
  exit 1
fi

echo "📦 Using environment file: $ENV_PATH"

# Load environment variables
export $(grep -v '^#' "$ENV_PATH" | xargs)

# Set AUTH_TOKEN for template
export AUTH_TOKEN=$JWT_SECRET

# Check for envsubst
if ! command -v envsubst &> /dev/null; then
  echo "❌ Error: envsubst not found. Run 'brew install gettext && brew link --force gettext'"
  exit 1
fi

# Render the template
envsubst '${USERS_HOST} ${USERS_PORT} ${BABIES_HOST} ${BABIES_PORT} ${ACTIVITY_LOGS_HOST} ${ACTIVITY_LOGS_PORT} ${FRONTEND_HOST} ${FRONTEND_PORT} ${AUTH_TOKEN}' < "$NGINX_TEMPLATE" > "$NGINX_OUTPUT"

echo "⚙️  Starting Nginx with $NGINX_OUTPUT"
nginx -c "$NGINX_OUTPUT"