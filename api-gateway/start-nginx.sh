#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Use JWT_SECRET as AUTH_TOKEN for Nginx
export AUTH_TOKEN=$JWT_SECRET

# Ensure envsubst is installed
if ! command -v envsubst &> /dev/null
then
    echo "Error: envsubst not found. Install with 'brew install gettext' and 'brew link --force gettext'"
    exit 1
fi

# Replace placeholders in nginx.conf.template and generate nginx.conf
envsubst '$AUTH_TOKEN' < nginx.conf.template > nginx.conf

# Start Nginx with the updated configuration
nginx -c $(pwd)/nginx.conf