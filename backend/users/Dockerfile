# Use official Node.js LTS image
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency files first for caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy rest of the code
COPY . .

# Expose the service port (adjust if different)
EXPOSE 3001

# Start the service
CMD ["node", "index.js"]