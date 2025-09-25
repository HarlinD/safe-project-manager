# backend/Dockerfile
FROM node:20.18.1-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3016

# Start the application
CMD ["npm", "start"]
