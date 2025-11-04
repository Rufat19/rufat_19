const express = require('express');
const WhatsAppBot = require('./WhatsAppBot');
const config = require('../config/config');

// Express app yaradır
const app = express();
app.use(express.json());

// Bot instance yaradır
const bot = new WhatsAppBot();

// QR Code storage
let currentQRCode = null;
let qrCodeTimestamp = null;

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

// QR Code web səhifəsi
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>🤖 Rüfət Babayev - Şəxsi Asistent</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #f0f0f0; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .qr-code { margin: 20px 0; }
            .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
            .ready { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
            .waiting { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
            .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
            button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
            button:hover { background: #0056b3; }
        </style>
        <script>
            function refreshQR() {
                location.reload();
            }
            
            function checkStatus() {
                fetch('/status')
                    .then(response => response.json())
                    .then(data => {
                        const statusDiv = document.getElementById('bot-status');
                        if (data.isReady) {
                            statusDiv.innerHTML = '✅ Bot hazırdır və WhatsApp-a qoşulub!';
                            statusDiv.className = 'status ready';
                        } else {
                            statusDiv.innerHTML = '⏳ Bot WhatsApp qoşulmasını gözləyir...';
                            statusDiv.className = 'status waiting';
                        }
                    });
            }
            
            setInterval(checkStatus, 5000);
            setTimeout(checkStatus, 1000);
        </script>
    </head>
    <body>
        <div class="container">
            <h1>🤖 Rüfət Babayev - Şəxsi Asistent</h1>
            <div id="bot-status" class="status waiting">⏳ Status yoxlanılır...</div>
            
            ${currentQRCode ? `
                <div class="qr-code">
                    <h2>📱 WhatsApp QR Kodu</h2>
                    <p>WhatsApp tətbiqində "Bağlı Cihazlar" bölməsinə gedib bu QR kodu skan edin:</p>
                    <img src="data:image/png;base64,${currentQRCode}" alt="QR Code" style="max-width: 300px; border: 1px solid #ddd; padding: 10px; background: white;">
                    <p><small>QR kod yaradıldı: ${qrCodeTimestamp}</small></p>
                </div>
            ` : `
                <div class="qr-code">
                    <h2>⏳ QR Kod Gözləyir...</h2>
                    <p>Bot başlayır və QR kod yaradılır...</p>
                </div>
            `}
            
            <div style="margin: 20px 0;">
                <button onclick="refreshQR()">🔄 Yenilə</button>
                <button onclick="window.open('/status', '_blank')">📊 Status</button>
                <button onclick="window.open('/health', '_blank')">💚 Health</button>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                <h3>ℹ️ Məlumat</h3>
                <p><strong>Bot Xüsusiyyətləri:</strong></p>
                <ul style="text-align: left; display: inline-block;">
                    <li>📅 İş saatları: 9:00-18:00 (Bakı vaxtı)</li>
                    <li>💼 Peşəkar rejim (iş saatı) / Dostcasına rejim (qalan vaxt)</li>
                    <li>🎉 Təbrik və bayramlaşma sistemi</li>
                    <li>💬 Yalnız şəxsi mesajlarda aktiv (qrup chatda passiv)</li>
                    <li>🌐 Sosial media inteqrasiyası</li>
                </ul>
            </div>
        </div>
    </body>
    </html>`;
    
    res.send(html);
});

// QR Code API endpoint
app.get('/qr', (req, res) => {
    if (currentQRCode) {
        res.json({
            qr: currentQRCode,
            timestamp: qrCodeTimestamp,
            available: true
        });
    } else {
        res.json({
            qr: null,
            timestamp: null,
            available: false,
            message: 'QR kod hələ hazır deyil'
        });
    }
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

// QR kodu və bot event-ləri
bot.client.on('qr', (qr) => {
    // QR kodu base64 formatında yadda saxlayırıq
    const qrcode = require('qrcode');
    qrcode.toDataURL(qr, (err, url) => {
        if (!err) {
            // base64 prefix-i çıxarırıq
            currentQRCode = url.split(',')[1];
            qrCodeTimestamp = new Date().toLocaleString('az-AZ', {
                timeZone: 'Asia/Baku',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            console.log('📱 QR kod yaradıldı və web səhifədə görünür: http://localhost:3001');
        }
    });
});

bot.client.on('ready', () => {
    // Bot hazır olduqda QR kodu təmizlə
    currentQRCode = null;
    qrCodeTimestamp = null;
    console.log('✅ WhatsApp Bot hazırdır və qoşulub!');
});

bot.client.on('auth_failure', () => {
    console.log('❌ WhatsApp autentifikasiya uğursuz!');
    currentQRCode = null;
    qrCodeTimestamp = null;
});

bot.client.on('disconnected', (reason) => {
    console.log('⚠️ WhatsApp bağlantısı kəsildi:', reason);
    currentQRCode = null;
    qrCodeTimestamp = null;
});

// Tətbiqi başlatmaq
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