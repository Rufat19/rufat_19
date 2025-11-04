# Rüfət Babayev - Şəxsi Asistent WhatsApp Bot
FROM node:18-alpine

# Bot metadata
LABEL maintainer="Rüfət Babayev <rufatbabayev@example.com>"
LABEL description="24/7 Şəxsi Asistent WhatsApp Bot - İş saatları ərzində peşəkar, qalan vaxtlarda dostcasına"
LABEL version="2.0"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user first
RUN addgroup -g 1001 -S botuser && adduser -S botuser -u 1001 -G botuser

# Create necessary directories with correct permissions
RUN mkdir -p .wwebjs_auth .wwebjs_cache && \
    chown -R botuser:botuser .wwebjs_auth .wwebjs_cache && \
    chmod -R 755 .wwebjs_auth .wwebjs_cache

# Install Chromium for WhatsApp Web
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set Chromium path
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Bot environment variables
ENV TZ=Asia/Baku
ENV NODE_ENV=production
ENV BOT_NAME="Rüfət Babayev - Asistent"

# Expose port
EXPOSE 3001

# Health check - Şəxsi asistent botun sağlığını yoxla
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Switch to non-root user
USER botuser

# Start şəxsi asistent bot
CMD ["npm", "start"]