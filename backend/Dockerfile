FROM node:18-slim

# Install Python 3
RUN apt-get update && \
    apt-get install -y python3 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (Railway sets PORT env var)
ENV PORT=3000
EXPOSE 3000

# Start application
CMD ["npm", "start"]
