FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm ci && \
    npm ci --prefix backend && \
    npm ci --prefix frontend

# Copy source code
COPY backend ./backend
COPY frontend ./frontend

# Build backend and frontend
RUN npm run build --prefix backend && \
    npm run build --prefix frontend

# Expose ports
EXPOSE 5000 3000

# Set working directory to backend for start
WORKDIR /app/backend

# Start backend server
CMD ["npm", "start"]
