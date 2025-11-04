# Rüfət Babayev - Şəxsi Asistent WhatsApp Bot - Requirements

## System Requirements

### Node.js Environment
- **Node.js**: v16.0.0 or higher (18.x tövsiyə olunur)
- **NPM**: v8.0.0 or higher
- **Operating System**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **Memory**: Minimum 512MB RAM (1GB tövsiyə olunur)
- **Timezone Support**: Asia/Baku timezone konfiqurasiyası

### Dependencies

#### Core Dependencies (Şəxsi Asistent)
```json
{
  "whatsapp-web.js": "^1.23.0",    // WhatsApp Web API
  "qrcode-terminal": "^0.12.0",    // QR code display
  "express": "^4.18.2",            // HTTP server
  "dotenv": "^16.3.1",             // Environment variables
  "fs-extra": "^11.1.1",           // Enhanced file system
  "moment-timezone": "^0.5.43"     // Bakı timezone dəstəyi
}
```

#### Additional Dependencies (24/7 Bot)
```json
{
  "cors": "^2.8.5",                // Cross-Origin Resource Sharing
  "helmet": "^7.1.0",              // Security headers
  "winston": "^3.11.0",            // Logging və error tracking
  "moment": "^2.29.4",             // Date/time handling
  "multer": "^1.4.5"               // File upload handling
}
```

#### Development Dependencies
```json
{
  "nodemon": "^3.0.1",             // Development server
  "eslint": "^8.55.0",             // Code linting
  "prettier": "^3.1.0"             // Code formatting
}
```

## Browser Requirements
- **Chromium/Chrome**: Required for WhatsApp Web automation
- **Puppeteer**: Automatically installed with whatsapp-web.js

## Environment Variables
Required in `.env` file:
- BOT_NAME
- BUSINESS_NAME
- INSTAGRAM_PAGE
- ADMIN_PHONE
- ADMIN_NAME
- BUSINESS_OWNER
- WORKING_HOURS
- DELIVERY_INFO

## Installation Steps

1. **Install Node.js**
   ```bash
   # Download from https://nodejs.org/
   node --version  # Check installation
   ```

2. **Clone/Download Project**
   ```bash
   git clone [repository-url]
   cd whatsapp-bot
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Start Bot**
   ```bash
   npm start
   ```

## Optional Enhancements

### Database (Optional)
- **SQLite**: For order storage
- **MongoDB**: For advanced features
- **PostgreSQL**: For production

### Cloud Deployment
- **Heroku**: Easy deployment
- **AWS**: Scalable solution
- **DigitalOcean**: Cost-effective

### Monitoring
- **PM2**: Process management
- **Docker**: Containerization
- **Nginx**: Reverse proxy

## Troubleshooting

### Common Issues
1. **Port 3000 in use**: Change PORT in .env
2. **QR code not showing**: Check terminal size
3. **Bot disconnects**: Check WhatsApp Web limits
4. **Dependencies error**: Run `npm audit fix`

### Performance Optimization
- Use PM2 for production
- Enable Winston logging
- Set up proper error handling
- Monitor memory usage