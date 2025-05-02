FROM node:23-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the app source
COPY . .

# Expose internal port
EXPOSE 5004

# Start the app
CMD ["npm", "start"]