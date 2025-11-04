const express = require('express');
const WhatsAppBot = require('./WhatsAppBot');
const config = require('../config/config');

// Express app yaradır
const app = express();
app.use(express.json());

// Bot instance yaradır
const bot = new WhatsAppBot();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        botReady: bot.isReady,
        timestamp: new Date().toISOString()
    });
});

// Bot status endpoint
app.get('/status', (req, res) => {
    res.json({
        botName: config.botName,
        isReady: bot.isReady,
        features: {
            commands: config.enableCommands,
            autoReply: config.enableAutoReply,
            logging: config.enableLogging
        },
        timestamp: new Date().toISOString()
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\\n🛑 Shutdown signal alındı...');
    
    try {
        await bot.stop();
        process.exit(0);
    } catch (error) {
        console.error('❌ Shutdown xətası:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    console.log('\\n🛑 SIGTERM signal alındı...');
    
    try {
        await bot.stop();
        process.exit(0);
    } catch (error) {
        console.error('❌ Shutdown xətası:', error);
        process.exit(1);
    }
});

// Error handling
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server and bot
async function startApplication() {
    try {
        // Express server başlat
        app.listen(config.port, () => {
            console.log(`🌐 HTTP Server işləyir: http://localhost:${config.port}`);
            console.log(`📊 Status: http://localhost:${config.port}/status`);
            console.log(`💚 Health: http://localhost:${config.port}/health`);
        });
        
        // Bot başlat
        await bot.start();
        
    } catch (error) {
        console.error('❌ Tətbiq başlatma xətası:', error);
        process.exit(1);
    }
}

// Tətbiqi başlat
startApplication();