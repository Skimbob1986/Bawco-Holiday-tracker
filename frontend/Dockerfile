FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy built frontend
COPY build ./build

# Install serve to run static frontend
RUN npm install -g serve

EXPOSE 3000

# Serve the frontend
CMD ["serve", "-s", "build", "-l", "3000"]
