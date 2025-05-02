# Use official Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Expose the port defined in the env (default 5001)
EXPOSE 5001

# Run the app
CMD ["node", "index.js"]