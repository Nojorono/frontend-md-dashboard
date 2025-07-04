# Multi-stage build for production
FROM node:16-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps

# Install system dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies with frozen lockfile for reproducible builds
RUN yarn install --frozen-lockfile --production=false

# Build stage
FROM base AS builder

# Install system dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install all dependencies (including dev dependencies)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage with Node.js
FROM node:16-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S vuejs -u 1001

# Set working directory
WORKDIR /app

# Install system dependencies for runtime
RUN apk add --no-cache \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Install serve package globally for serving static files
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder --chown=vuejs:nodejs /app/dist ./dist

# Switch to non-root user
USER vuejs

# Expose port 9000
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:9000/ || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application using serve
CMD ["serve", "-s", "dist", "-l", "9000"] 