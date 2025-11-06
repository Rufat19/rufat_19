const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('../config/config');

class WhatsAppBot {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth({
                name: config.sessionName
            }),
            puppeteer: {
                headless: true,
                executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-extensions',
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-web-security',
                    '--no-first-run'
                ]
            }
        });
        
        this.isReady = false;
        this.autoMessageScheduler = null;
        this.setupEventListeners();
        this.setupAutoMessages();
    }
    
    setupEventListeners() {
        // QR kod generasiyası
        this.client.on('qr', (qr) => {
            console.log('� QR Kod event-i çağırıldı!');
            console.log('�🔍 QR Kodu skan edin:');
            qrcode.generate(qr, { small: true });
            console.log('\nWhatsApp tətbiqində QR kodu skan edin...');
            console.log(`🌐 QR kod uzunluğu: ${qr.length} karakter`);
        });
        
        // Bot hazır olduqda
        this.client.on('ready', () => {
            console.log('✅ WhatsApp Bot hazırdır!');
            console.log(`📱 Bot adı: ${config.botName}`);
            console.log(`🔧 Session: ${config.sessionName}`);
            this.isReady = true;
            
            // Avtomatik mesajları başlat
            if (config.enableAutoMessages) {
                this.startAutoMessages();
                console.log('🤖 Avtomatik mesaj sistemi aktivləşdi');
            }
        });
        
        // Mesaj alındıqda
        this.client.on('message', async (message) => {
            await this.handleMessage(message);
        });
        
        // Bağlantı kəsildiyi zaman
        this.client.on('disconnected', (reason) => {
            console.log('❌ Client disconnected:', reason);
            this.isReady = false;
        });
        
        // Xəta baş verdiyi zaman
        this.client.on('auth_failure', (message) => {
            console.error('❌ Authentication failed:', message);
        });

        // Loading state
        this.client.on('loading_screen', (percent, message) => {
            console.log(`⏳ Yüklənir: ${percent}% - ${message}`);
        });

        // Error handling
        this.client.on('change_state', state => {
            console.log('🔄 Client state dəyişdi:', state);
        });
    }
    
    async handleMessage(message) {
        try {
            // Botun öz mesajlarını ignore et
            if (message.fromMe) return;
            
            // Status mesajlarını ignore et (spam qarşısı)
            if (message.from.includes('status@broadcast')) return;
            
            // Boş mesajları ignore et
            if (!message.body || message.body.trim() === '') return;
            
            const chat = await message.getChat();
            const messageBody = message.body.toLowerCase().trim();
            const isCommand = messageBody.startsWith(config.commandPrefix);
            
            // DEBUG məlumatları (yalnız vacib mesajlar üçün)
            if (config.enableLogging || isCommand) {
                console.log('🔍 DEBUG: Mesaj alındı');
                console.log(`📨 Mesaj: "${message.body}"`);
                console.log(`👤 Göndərən: ${message.from}`);
                console.log(`💬 Chat növü: ${chat.isGroup ? 'Qrup' : 'Şəxsi'}`);
                if (isCommand) console.log(`🎯 Komanda aşkarlandı: ${messageBody}`);
            }
            
            // Komanda həmişə işlənir (qrupda və ya şəxsi söhbətdə)
            if (isCommand && config.enableCommands) {
                console.log('🎯 Komanda aşkarlandı, işlənir...');
                await this.handleCommand(message);
                return; // Komanda işləndikdən sonra auto reply-a ehtiyac yox
            }
            
            // Qrup mesajları - yalnız dostlar qrupu istisna, digərləri ignore
            if (chat.isGroup) {
                // Dostlar qrupu deyilsə, ignore et
                if (message.from !== config.friendsGroupId) {
                    if (config.enableLogging) {
                        console.log(`� Qrup mesajı ignore edildi: ${chat.name || 'Group Chat'} (ID: ${message.from})`);
                        console.log(`   Dostlar qrupu: ${config.friendsGroupId}`);
                        console.log(`   Bu qrup: ${message.from}`);
                    }
                    return;
                }
                // Dostlar qrupundaysa, yalnız komandaları qəbul et, auto reply yox
                else if (!isCommand) {
                    if (config.enableLogging) {
                        console.log(`📝 Dostlar qrupunda non-command mesaj ignore edildi`);
                    }
                    return;
                }
            }
            
            // İş statusunu yoxla
            const workStatus = config.getWorkStatus();
            
            if (config.enableLogging) {
                console.log(`📨 Mesaj alındı: "${message.body}" - ${message.from} (Status: ${workStatus})`);
            }
            
            // Auto reply (ağıllı sistem)
            if (config.enableAutoReply) {
                console.log('🤖 Auto reply işləyir...');
                await this.handleAutoReply(message);
                
                // Şəxsi mesajları xüsusi idarə et
                if (this.isPersonalMessage(messageBody) && workStatus === 'offline') {
                    console.log('💬 Şəxsi mesaj - dostcasına cavab hazırlanır...');
                    setTimeout(async () => {
                        await this.sendFriendlyResponse(message.from, messageBody);
                    }, 1000); // 1 saniyə gecikmə
                }
            } else {
                console.log('⚠️ Auto reply deaktivdir və ya şərt uyğun deyil');
                console.log(`- isCommand: ${isCommand}`);
                console.log(`- enableCommands: ${config.enableCommands}`);
                console.log(`- enableAutoReply: ${config.enableAutoReply}`);
            }
            
        } catch (error) {
            console.error('❌ Mesaj işləmədə xəta:', error);
        }
    }
    
    async handleCommand(message) {
        const commandText = message.body.toLowerCase().slice(config.commandPrefix.length).trim();
        const args = commandText.split(' ');
        const command = args[0];
        
        console.log(`🎯 DEBUG Command: "${command}" - Text: "${commandText}" - Full: "${message.body}"`);
        
        switch (command) {
            case 'help':
                await this.sendHelpMessage(message.from);
                break;
                
            case 'info':
                await this.sendPersonalInfoMessage(message.from);
                break;
                
            case 'status':
                await this.sendStatusMessage(message.from);
                break;
                
            case 'randevu':
            case 'appointment':
                await this.sendAppointmentMessage(message.from);
                break;
                
            case 'projects':
            case 'layihələr':
                await this.sendProjectsMessage(message.from);
                break;
                
            case 'resume':
            case 'cv':
                await this.sendResumeMessage(message.from);
                break;
                
            case 'elaqe':
            case 'contact':
                await this.sendContactMessage(message.from);
                break;
                
            case 'time':
            case 'vaxt':
                await this.sendTimeMessage(message.from);
                break;
                
            case 'menu':
            case 'keyboard':
                await this.sendMainMenuMessage(message.from);
                break;
                
            case 'setgroup':
                console.log('🎯 SetGroup komandası çağırıldı!');
                await this.handleSetGroup(message);
                break;
                
            case 'groupinfo':
                await this.handleGroupInfo(message);
                break;
                
            default:
                await this.sendMessage(message.from, `❓ Naməlum əmr: "${command}". Kömək üçün !help yazın.`);
        }
    }
    
    async handleAutoReply(message) {
        let messageBody = message.body.toLowerCase().trim();
        
        // Söz variantlarını normalizə et
        const originalMessage = messageBody;
        messageBody = this.normalizeMessage(messageBody);
        
        console.log(`🤖 AUTO REPLY DEBUG:`);
        console.log(`   Original: "${originalMessage}"`);
        console.log(`   Normalized: "${messageBody}"`);
        
        const workStatus = config.getWorkStatus();
        
        // Borc istəyənlər üçün avtomatik cavab
        if (this.isMoneyRequest(messageBody)) {
            console.log('💰 Borc istəyi aşkarlandı - polite decline cavabı göndərilir');
            const excuseReplies = [
                '😅 Üzr istəyirəm, hal-hazırda vəziyyətim çox çətindir.\n💼 Bu ay maddi durumum əlverişli deyil.',
                '🙏 Çox üzr istəyirəm, amma ayın axırına qədər çox sıxışmışam.\n💸 Gələn dəfə kömək etməyə çalışaram.',
                '😔 Təəssüf ki, hazırda imkanım yoxdur.\n📊 Mali vəziyyət çox gərgindir.',
                '🤝 Çox istərdim kömək edim, amma bu aralar çox çətinlik çəkirəm.\n💰 Bağışlayın.'
            ];
            const excuseReply = excuseReplies[Math.floor(Math.random() * excuseReplies.length)];
            await this.sendMessage(message.from, excuseReply);
            return;
        }
        
        // Təcili hallar üçün dərhal cavab (24/7)
        if (messageBody.includes('təcili') || messageBody.includes('urgent') || messageBody.includes('emergency')) {
            await this.sendMessage(message.from, '🚨 Təcili hal qeyd edildi!\n📞 Dərhal əlaqə saxlayacağam\n⚠️ Zəng gözləyin...');
            return;
        }
        
        // İş məsələləri iş saatlarında olduqda yönləndir
        if (workStatus === 'working' && (messageBody.includes('iş') || messageBody.includes('work') || messageBody.includes('layihə') || messageBody.includes('project'))) {
            const workReply = await this.getWorkRelatedReply(messageBody);
            await this.sendMessage(message.from, workReply);
            return;
        }
        
        // Nömrəli seçimləri yoxla (1-5 arası)
        if (/^[1-5]$/.test(messageBody)) {
            await this.handleNumberSelection(message.from, parseInt(messageBody));
            return;
        }
        
        // Auto replies konfiqurasiyasından yoxla
        console.log(`   Yoxlanılan triggers:`);
        for (const [trigger, reply] of Object.entries(config.autoReplies)) {
            const matches = messageBody.includes(trigger);
            console.log(`   - "${trigger}": ${matches ? '✅ MATCH' : '❌'}`);
            if (matches) {
                console.log(`   🎯 Trigger tapıldı: "${trigger}" -> Reply göndərilir`);
                let finalReply = await this.getContextualReply(trigger, reply, workStatus);
                await this.sendMessage(message.from, finalReply);
                
                // Salamlaşma triggerindən sonra help menyusunu da göndər
                if (trigger === 'salam' || trigger === 'hello') {
                    console.log(`   📚 Salamlaşmadan sonra kömək menyusu göndərilir...`);
                    setTimeout(async () => {
                        await this.sendHelpMessage(message.from);
                    }, 2000); // 2 saniyə gecikmə
                }
                return;
            }
        }
        console.log(`   ❌ Heç bir trigger tutmadı`);
        
        // Əgər heç bir trigger tutmasa, ümumi dostcasına cavab
        if (this.isPersonalMessage(messageBody)) {
            await this.sendFriendlyResponse(message.from, messageBody);
        }
    }
    
    async sendHelpMessage(chatId) {
        const workStatus = config.getWorkStatus();
        
        let helpText = `🤖 *${config.botName} - Kömək Menyusu*\n\n`;
        
        helpText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        helpText += `💼 *ƏSAS KOMANDALAR*\n`;
        helpText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        helpText += `• !info      - Şəxsi məlumatlar\n`;
        helpText += `• !contact   - Əlaqə məlumatları\n`;
        helpText += `• !projects  - İş layihələri\n`;
        helpText += `• !resume    - CV və Portfolio\n`;
        helpText += `• !status    - İş statusu\n`;
        helpText += `• !time      - Bakı vaxtı\n`;
        helpText += `• !help      - Bu menyu\n\n`;
        
        helpText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        helpText += `⚡ *SÜRƏTLİ SEÇİMLƏR*\n`;
        helpText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        helpText += `Sadəcə rəqəm yazın:\n`;
        helpText += `• 1 → Şəxsi məlumatlar\n`;
        helpText += `• 2 → Əlaqə məlumatları\n`;
        helpText += `• 3 → İş layihələri\n`;
        helpText += `• 4 → CV və Portfolio\n`;
        helpText += `• 5 → İş statusu\n\n`;
        
        helpText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        helpText += `💬 *AÇAR SÖZLƏR*\n`;
        helpText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        helpText += `Salamlaşma: salam, hello\n`;
        helpText += `Hal-əhval: necəsən, nə var\n`;
        helpText += `İş haqqında: işdə, layihə\n`;
        helpText += `Bot: bot, telegram\n\n`;
        
        if (workStatus === 'working') {
            helpText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            helpText += `💼 *HAL-HAZIRDA İŞ SAATINDAYıQ*\n`;
            helpText += `🤖 Peşəkar rejim aktiv\n`;
            helpText += `📞 Telegram: @Sosial_Zone_Robot\n`;
        } else {
            helpText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            helpText += `🌙 *İŞ SAATI BİTİB*\n`;
            helpText += `😊 Dostcasına söhbət edə bilərik!\n`;
        }
        helpText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        
        await this.sendMessage(chatId, helpText);
    }
    
    async sendPersonalInfoMessage(chatId) {
        const currentTime = config.getCurrentTime().format('DD.MM.YYYY HH:mm');
        const status = config.getWorkStatus();
        
        const info = `👨‍💻 *${config.ownerName}*\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `💼 *VƏZİFƏ:* ${config.ownerPosition}\n` +
                    `🏢 *ŞİRKƏT:* ${config.companyName}\n` +
                    `🏙️ *ŞƏHƏr:* ${config.city}\n` +
                    `⏰ *İNDİKİ VAXT:* ${currentTime}\n\n` +
                    `📊 *STATUS:* ${status === 'working' ? '💼 İşdə' : status === 'lunch' ? '🍽️ Nahar fasiləsi' : '🌙 İş saatı bitib'}\n` +
                    `🕐 *İş SAATLARI:* ${config.workStart}-${config.workEnd}\n` +
                    `📅 *İş GÜNLƏRİ:* Bazar ertəsi - Cümə\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `💻 *İXTİSASLAR*\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `• Software Development\n` +
                    `• WhatsApp Bot Development\n` +
                    `• Web Applications\n` +
                    `• Database Management\n\n` +
                    `💬 Ətraflı məlumat: 2 → Əlaqə`;
        
        await this.sendMessage(chatId, info);
    }

    async sendCatalogMessage(chatId) {
        let catalogText = `🎒 *${config.businessName} - Kataloq*\\n\\n`;
        
        config.products.bags.forEach((bag, index) => {
            catalogText += `${index + 1}️⃣ *${bag.name}*\\n`;
            catalogText += `💰 *Qiymət:* ${bag.price}\\n`;
            catalogText += `📝 *Təsvir:* ${bag.description}\\n\\n`;
        });
        
        catalogText += `═══════════════════════\\n`;
        catalogText += `📱 *Sürətli seçim:*\\n`;
        catalogText += `📝 Sifariş üçün: *3* yazın\\n`;
        catalogText += `💰 Qiymətlər üçün: *2* yazın\\n`;
        catalogText += `🏠 Əsas menyu: !menu\\n\\n`;
        catalogText += `Və ya istədiyiniz çanta nömrəsini seçin!`;
        
        await this.sendMessage(chatId, catalogText);
    }

    async sendPriceListMessage(chatId) {
        let priceText = `💰 *${config.businessName} - Qiymətlər*\\n\\n`;
        
        config.products.bags.forEach((bag, index) => {
            priceText += `${index + 1}️⃣ ${bag.name}: *${bag.price}*\\n`;
        });
        
        priceText += `\\n📋 *Qeydlər:*\\n`;
        priceText += `• Qiymətlər material və dizayna görə dəyişir\\n`;
        priceText += `• Fərdi sifarişlər üçün əlavə qiymət\\n`;
        priceText += `• Topdan alışda endirim var\\n\\n`;
        priceText += `📞 Dəqiq qiymət üçün: !sifaris`;
        
        await this.sendMessage(chatId, priceText);
    }

    async startOrderProcess(chatId) {
        const orderText = `📝 *Sifariş Formu*\\n\\n` +
                         `Sifariş vermək üçün aşağıdakı məlumatları göndərin:\\n\\n` +
                         `1️⃣ *Çanta növü* (katalogdan seçin)\\n` +
                         `2️⃣ *Rəng tercihi*\\n` +
                         `3️⃣ *Ölçü* (böyük/orta/kiçik)\\n` +
                         `4️⃣ *Adınız və soyadınız*\\n` +
                         `5️⃣ *Telefon nömrəniz*\\n` +
                         `6️⃣ *Ünvan* (çatdırılma üçün)\\n\\n` +
                         `� *Nümunə:*\\n` +
                         `"1. Klassik Əl Çantası\\n` +
                         `2. Qara rəng\\n` +
                         `3. Orta ölçü\\n` +
                         `4. Ayşe Məmmədova\\n` +
                         `5. 050-123-45-67\\n` +
                         `6. Yasamal rayonu"\\n\\n` +
                         `💬 Bu formatda yazıb göndərin!`;
        
        await this.sendMessage(chatId, orderText);
    }

    async sendDeliveryInfoMessage(chatId) {
        const deliveryText = `🚚 *Çatdırılma Məlumatları*\\n\\n` +
                            `📍 *Çatdırılma zonası:* ${config.deliveryInfo}\\n\\n` +
                            `💰 *Çatdırılma qiymətləri:*\\n` +
                            `• Bakı şəhəri daxili: 5 AZN\\n` +
                            `• Abşeron rayonu: 8 AZN\\n` +
                            `• Digər rayonlar: razılaşma ilə\\n\\n` +
                            `⏱️ *Çatdırılma müddəti:*\\n` +
                            `• Hazır məhsullar: 1-2 gün\\n` +
                            `• Sifarişli məhsullar: 3-7 gün\\n\\n` +
                            `📋 *Ödəniş:*\\n` +
                            `• Nağd (çatdırılma zamanı)\\n` +
                            `• Köçürmə (əvvəlcədən)\\n\\n` +
                            `📞 Ətraflı məlumat üçün: !elaqe`;
        
        await this.sendMessage(chatId, deliveryText);
    }

    async sendContactMessage(chatId) {
        const currentTime = config.getCurrentTime().format('HH:mm');
        const status = config.getWorkStatus();
        
        const contactText = `📞 *ƏLAQƏ MƏLUMAT LAri*\n\n` +
                           `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                           `👨‍💻 *${config.ownerName}*\n` +
                           `💼 *${config.ownerPosition}*\n` +
                           `⏰ *İndiki vaxt:* ${currentTime}\n` +
                           `� *Status:* ${status === 'working' ? '💼 İş saatı' : status === 'lunch' ? '🍽️ Nahar fasiləsi' : '🌙 İş saatı bitib'}\n\n` +
                           `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                           `� *ƏLAQƏ*\n` +
                           `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                           `📞 WhatsApp: ${config.ownerPhone}\n` +
                           `📧 Şəxsi: ${config.personalEmail}\n` +
                           `� İş: ${config.workEmail}\n` +
                           `🕐 İş saatları: ${config.workStart}-${config.workEnd}\n\n` +
                           `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                           `🌐 *SOSİAL MEDIA*\n` +
                           `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                           `� Telegram: ${config.telegramProfile}\n` +
                           `📸 Instagram: ${config.instagramProfile}\n` +
                           `💼 LinkedIn: ${config.linkedinProfile}\n` +
                           `💻 GitHub: ${config.githubProfile}\n\n` +
                           `🚨 *Təcili hal:* "təcili" yazın\n` +
                           `🤝 *Randevu:* !randevu yazın`;
        
        await this.sendMessage(chatId, contactText);
    }

    async sendMainMenuMessage(chatId) {
        const menuText = `🎒 *${config.businessName} - Əsas Menyu*\\n\\n` +
                        `Aşağıdakı seçimlərdən birini edin:\\n\\n` +
                        `🛒 *Kataloq* - Çanta kolleksiyamız\\n` +
                        `💰 *Qiymətlər* - Qiymət siyahısı\\n` +
                        `📝 *Sifariş* - Sifariş formu\\n` +
                        `🚚 *Çatdırılma* - Çatdırılma məlumatı\\n` +
                        `📞 *Əlaqə* - Əlaqə məlumatları\\n` +
                        `ℹ️ *Məlumat* - Biznes haqqında\\n\\n` +
                        `═══════════════════════\\n` +
                        `📱 *Sürətli seçim:*\\n` +
                        `1️⃣ Kataloq\\n` +
                        `2️⃣ Qiymətlər\\n` +
                        `3️⃣ Sifariş\\n` +
                        `4️⃣ Əlaqə\\n\\n` +
                        `Seçmək üçün nömrəsini və ya emoji-ni göndərin!`;
        
        await this.sendMessage(chatId, menuText);
    }

    async handleNumberSelection(chatId, number) {
        switch (number) {
            case 1:
                // Şəxsi məlumatlar
                await this.sendPersonalInfoMessage(chatId);
                break;
            case 2:
                // Əlaqə detalları
                await this.sendContactMessage(chatId);
                break;
            case 3:
                // İş layihələri
                await this.sendProjectsMessage(chatId);
                break;
            case 4:
                // CV məlumatları
                await this.sendResumeMessage(chatId);
                break;
            case 5:
                // İş statusu
                await this.sendStatusMessage(chatId);
                break;
            default:
                await this.sendMessage(chatId, "❓ Yalnız 1-5 arası nömrə seçin və ya !help yazın.");
        }
    }
    
    async sendStatusMessage(chatId) {
        const statusMessage = config.getStatusMessage();
        const currentTime = config.getCurrentTime().format('DD.MM.YYYY HH:mm');
        
        const statusText = `📊 *İŞ STATUSU*\n\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `⏰ *İndiki vaxt:* ${currentTime}\n` +
                          `📍 *Status:* ${statusMessage}\n\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `🕐 *İŞ SAATLARI*\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `⏰ İş saatı: ${config.workStart} - ${config.workEnd}\n` +
                          `🍽️ Nahar: ${config.lunchStart} - ${config.lunchEnd}\n` +
                          `📅 İş günləri: Bazar ertəsi - Cümə\n` +
                          `🏖️ Həftə sonu: ${config.weekendDays.join(', ')}\n\n` +
                          `🌍 *Vaxt zonası:* Bakı vaxtı (UTC+4)\n` +
                          `🚨 *Təcili hal:* "təcili" yazın`;
        
        await this.sendMessage(chatId, statusText);
    }

    async sendAppointmentMessage(chatId) {
        const nextWorkDay = config.getCurrentTime().clone().add(1, 'day');
        while (config.weekendDays.includes(nextWorkDay.format('dddd'))) {
            nextWorkDay.add(1, 'day');
        }
        
        const appointmentText = `🤝 *Görüşmək üçün*\\n\\n` +
                               `📅 *Mövcud vaxtlar:*\\n` +
                               `• ${config.workStart}-${config.lunchStart}\\n` +
                               `• ${config.lunchEnd}-${config.workEnd}\\n\\n` +
                               `📞 *Randevu üçün:*\\n` +
                               `1️⃣ Telefon: ${config.ownerPhone}\\n` +
                               `2️⃣ WhatsApp: Bu nömrə\\n` +
                               `3️⃣ Mesaj: Təklif edin\\n\\n` +
                               `⏰ *Növbəti iş günü:* ${nextWorkDay.format('DD.MM.YYYY')}\\n` +
                               `🕐 *Təklif olunan vaxt:* ${config.workStart}`;
        
        await this.sendMessage(chatId, appointmentText);
    }

    async sendProjectsMessage(chatId) {
        const projectsText = `💻 *LAYİHƏLƏRİM*\n\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                            `🤖 *WHATSAPP BOT DEVELOPMENT*\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                            `• Şəxsi Assistant Botları\n` +
                            `• Biznes Avtomatlaşdırma\n` +
                            `• Müştəri Xidməti Botları\n` +
                            `• E-ticarət Botları\n\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                            `🌐 *WEB APPLICATIONS*\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                            `• İdarəetmə Sistemləri\n` +
                            `• API Development\n` +
                            `• Database İdarəsi\n` +
                            `• Web Portalları\n\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                            `📊 *STATİSTİKA*\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                            `✅ 50+ uğurlu layihə\n` +
                            `🤖 20+ bot development\n` +
                            `� 100% müştəri məmnuniyyəti\n\n` +
                            `� Ətraflı: 2 → Əlaqə məlumatları`;
        
        await this.sendMessage(chatId, projectsText);
    }

    async sendResumeMessage(chatId) {
        const resumeText = `📄 *CV VƏ PORTFOLIO*\n\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `👨‍💻 *${config.ownerName}*\n` +
                          `💼 *${config.ownerPosition}*\n` +
                          `🏢 *${config.companyName}*\n\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `🎓 *TƏCRÜBƏ*\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `• Software Development (3+ il)\n` +
                          `• WhatsApp Bot Development\n` +
                          `• Database Management\n` +
                          `• Web Applications\n\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `💻 *TEXNOLOGİYALAR*\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `• JavaScript/Node.js\n` +
                          `• Python\n` +
                          `• WhatsApp API\n` +
                          `• SQL/NoSQL\n\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `🏆 *NAİLİYYƏTLƏR*\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `✅ 50+ tamamlanmış layihə\n` +
                          `🤖 20+ bot development\n` +
                          `⭐ 100% müştəri məmnuniyyəti\n\n` +
                          `📧 Portfolio sorğusu: 2 → Əlaqə`;
        
        await this.sendMessage(chatId, resumeText);
    }

    async sendTimeMessage(chatId) {
        const now = config.getCurrentTime();
        const timeText = `🕐 *Vaxt Məlumatları*\\n\\n` +
                        `⏰ *İndiki vaxt:* ${now.format('DD.MM.YYYY HH:mm:ss')}\\n` +
                        `🌍 *Vaxt zonası:* ${config.timezone}\\n` +
                        `📅 *Gün:* ${now.format('dddd')}\\n\\n` +
                        `💼 *İş saatları:* ${config.workStart}-${config.workEnd}\\n` +
                        `🥪 *Nahar:* ${config.lunchStart}-${config.lunchEnd}\\n\\n` +
                        `📊 *Status:* ${config.getStatusMessage()}`;
        
        await this.sendMessage(chatId, timeText);
    }

    async getWorkRelatedReply(messageBody) {
        const replies = [
            '💼 İş saatlarındayam! İş məsələləri üçün:\n📱 @Sosial_Zone_Robot botuma bax\n🔍 Daxili IP: 4925\n⏰ Daha ətraflı: !work',
            '💻 İş məsələsi üçün daha yaxşı olar:\n🤖 Telegram: @Sosial_Zone_Robot\n📞 IP 4925 ilə əlaqə\n💼 İş portfelim: !projects'
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }

    async getContextualReply(trigger, reply, workStatus) {
        // İş saatlarında salam daha rəsmi
        if (trigger === 'salam' && workStatus === 'working') {
            return '👋 Salam! İş saatlarındayam, amma sizə kömək edə bilərəm.\n💼 İş məsələsi üçün: @Sosial_Zone_Robot\n💬 Digər sorğular üçün burada yazın';
        }
        
        // İş saatları bitdikdə də professional
        if ((trigger === 'salam' || trigger === 'hello') && workStatus === 'offline') {
            const professionalGreetings = [
                '👋 Salam! İş saatları bitib, amma sizə yardım etməyə hazıram.\n💬 Hansı məlumat lazımdır?',
                '😊 Salamlar! Hal-hazırda müsaitəm.\n📞 Sizə necə kömək edə bilərəm?',
                '🌙 Salam! İşdən sonrakı vaxtımda da əlçatanəm.\n� Nəyə ehtiyacınız var?'
            ];
            return professionalGreetings[Math.floor(Math.random() * professionalGreetings.length)];
        }
        
        // Təbriklər üçün vahid cavab
        if (this.isCelebrationMessage(trigger)) {
            return 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲';
        }
        
        return reply;
    }

    isCelebrationMessage(trigger) {
        const celebrationKeywords = [
            'doğum günü', 'doğum gününüz', 'ad günü', 'ad gününüz', 
            'təbrik', 'təbrik edirəm', 'bayram', 'bayramınız mübarək',
            'ramazan', 'qurban bayramı', 'ramazan bayramı', 'yeni il', 'yeni iliniz',
            'evlilik', 'nişan', 'məzuniyyət', 'iş'
        ];
        return celebrationKeywords.includes(trigger);
    }

    isPersonalMessage(messageBody) {
        const personalKeywords = [
            'necə', 'nə var', 'darıx', 'görüş', 'dostum', 'həftə sonu', 'boş vaxt',
            // Təbrik və bayramlaşma sözləri
            'doğum', 'ad günü', 'təbrik', 'bayram', 'mübarək', 'ramazan', 'qurban',
            'yeni il', 'evlilik', 'nişan', 'məzuniyyət', 'uğur'
        ];
        return personalKeywords.some(keyword => messageBody.includes(keyword));
    }
    
    isMoneyRequest(messageBody) {
        const moneyKeywords = [
            'borc', 'borc ver', 'borcu var', 'pul', 'pul ver', 'pulu var', 
            'kömək et', 'yardım et', 'ayın axırı', 'ayın sonu', 'gələn ay', 
            'növbəti ay', 'manat', 'dollar', 'avro', 'kredit', 'ödəmə',
            'ödəyə bilmir', 'ödə', 'qaytararam', 'geri verərəm', 'borcu',
            'pulu yox', 'pulim yox', 'çətin durumda', 'maddi', 'malik çıx'
        ];
        return moneyKeywords.some(keyword => messageBody.includes(keyword));
    }

    async sendFriendlyResponse(chatId, messageBody) {
        const workStatus = config.getWorkStatus();
        
        let responses = [];
        
        if (workStatus === 'working') {
            responses = [
                '💼 İş saatlarındayam. Sizə necə kömək edə bilərəm?',
                '👨‍💻 Hal-hazırda layihələrlə məşğulam. Nə ilə əlaqədar yazırsınız?',
                '💻 İş prosesindəyəm. Sizin məsələnizi dinləməyə hazıram.'
            ];
        } else {
            responses = [
                '🌙 İş saatları bitib. Sizə necə kömək edə bilərəm?',
                '⏰ Hal-hazırda müsaitəm. Hansı məlumatlar lazımdır?',
                '📱 İşdən sonrakı vaxtımdayam. Sizin sorğunuz nədir?',
                '� Vaxt müsaitdir. Nə barədə danışmaq istəyirsiniz?'
            ];
        }
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        await this.sendMessage(chatId, randomResponse);
    }

    // Mesaj normalizasiyası - müxtəlif yazılış variantlarını eyniləşdir
    normalizeMessage(message) {
        let normalized = message;
        
        // Salam variantları 
        normalized = normalized.replace(/s[ae]l[ae]m/g, 'salam');
        normalized = normalized.replace(/selam/g, 'salam');
        normalized = normalized.replace(/selamlar/g, 'salam');
        normalized = normalized.replace(/salamlar/g, 'salam');
        
        // Necəsən variantları (bütün mümkün yazılışlar)
        normalized = normalized.replace(/ne[cs]e?s[ae]?n/g, 'necəsən');
        normalized = normalized.replace(/nec[ae]s[ae]n/g, 'necəsən');
        normalized = normalized.replace(/neces[ae]n/g, 'necəsən');
        normalized = normalized.replace(/nejesan/g, 'necəsən');
        
        // Nə var nə yox variantları
        normalized = normalized.replace(/ne\s?var\s?ne\s?yox/g, 'nə var nə yox');
        normalized = normalized.replace(/nevar\s?neyox/g, 'nə var nə yox');
        normalized = normalized.replace(/ne\s?var\s?neyox/g, 'nə var nə yox');
        normalized = normalized.replace(/nevar\s?ne\s?yox/g, 'nə var nə yox');
        
        // Nə edirsən variantları
        normalized = normalized.replace(/ne\s?edir?s[ae]n/g, 'nə edirsən');
        normalized = normalized.replace(/neyirs[ae]n/g, 'nə edirsən');
        normalized = normalized.replace(/ne\s?yiirsan/g, 'nə edirsən');
        normalized = normalized.replace(/ne\s?ediyrsen/g, 'nə edirsən');
        
        // İşdə variantları
        normalized = normalized.replace(/i[sz]de/g, 'işdə');
        normalized = normalized.replace(/i[sz]te/g, 'işdə');
        normalized = normalized.replace(/working/g, 'işdə');
        
        // Görüşmək variantları
        normalized = normalized.replace(/gor[uy][sz]mek/g, 'görüşmək');
        normalized = normalized.replace(/gorusmek/g, 'görüşmək');
        normalized = normalized.replace(/meeting/g, 'görüşmək');
        
        // Layihə/Project variantları
        normalized = normalized.replace(/layihe/g, 'layihə');
        normalized = normalized.replace(/project/g, 'layihə');
        normalized = normalized.replace(/projekti?/g, 'layihə');
        
        // CV variantları
        normalized = normalized.replace(/ozgecmi[sz]/g, 'cv');
        normalized = normalized.replace(/özgeçmi[sz]/g, 'cv');
        normalized = normalized.replace(/resume/g, 'cv');
        
        // Təşəkkür variantları
        normalized = normalized.replace(/te[sz]ekkur/g, 'təşəkkür');
        normalized = normalized.replace(/tesekur/g, 'təşəkkür');
        normalized = normalized.replace(/sagol/g, 'təşəkkür');
        normalized = normalized.replace(/sag\s?ol/g, 'təşəkkür');
        
        // Darıxmışam variantları
        normalized = normalized.replace(/dar[iy][xh]mi[sz]am/g, 'darıxmışam');
        normalized = normalized.replace(/dariqmi[sz]am/g, 'darıxmışam');
        
        // Vaxt salamları variantları
        normalized = normalized.replace(/sabah[iy]n\s?xeyir/g, 'sabahın xeyir');
        normalized = normalized.replace(/ax[sz]am[iy]n\s?xeyir/g, 'axşamın xeyir');
        normalized = normalized.replace(/gecen\s?xeyir/g, 'gecən xeyir');
        
        // Bot variantları
        normalized = normalized.replace(/bott?/g, 'bot');
        normalized = normalized.replace(/robot/g, 'bot');
        
        // Doğum günü variantları
        normalized = normalized.replace(/do[gq]um\s?g[uy]n[uy]/g, 'doğum günü');
        normalized = normalized.replace(/dogum\s?gunu/g, 'doğum günü');
        
        // Ad günü variantları
        normalized = normalized.replace(/ad\s?g[uy]n[uy]/g, 'ad günü');
        normalized = normalized.replace(/ad\s?gunu/g, 'ad günü');
        
        // Bayram variantları
        normalized = normalized.replace(/bayram[i]?n[i]?z?\s?mubar[ae]k/g, 'bayram');
        
        // Təbrik variantları
        normalized = normalized.replace(/tebrik/g, 'təbrik');
        
        // Gecə/axşam/sabah variantları
        normalized = normalized.replace(/gec[ae]n\s?xeyir/g, 'gecən xeyir');
        normalized = normalized.replace(/ax[sz]am[i]?n\s?xeyir/g, 'axşamın xeyir');
        normalized = normalized.replace(/sabah[i]?n\s?xeyir/g, 'sabahın xeyir');
        
        // Boşluqları təmizlə
        normalized = normalized.replace(/\s+/g, ' ').trim();
        
        return normalized;
    }

    async sendMessage(chatId, message) {
        try {
            console.log(`📤 Mesaj göndərilməyə çalışılır: "${message}" - ${chatId}`);
            await this.client.sendMessage(chatId, message);
            console.log(`✅ Mesaj uğurla göndərildi: "${message}" - ${chatId}`);
        } catch (error) {
            console.error('❌ Mesaj göndərmə xətası:', error);
        }
    }
    
    // Avtomatik mesaj sistemi
    setupAutoMessages() {
        // Hər dəqiqə yoxla
        setInterval(() => {
            if (this.isReady && config.enableAutoMessages) {
                this.checkAutoMessages();
            }
        }, 60000); // 1 dəqiqə
    }

    async checkAutoMessages() {
        const now = config.getCurrentTime();
        const currentTime = now.format('HH:mm');
        const spouseId = `${config.spousePhone}@c.us`;
        
        // Təhlükəsizlik yoxlaması - həyat yoldaşının nömrəsi doğrudur?
        if (!config.spousePhone || config.spousePhone === '994556919601') {
            console.log(`🔒 Avtomatik mesaj göndəriləcək nömrə: ${config.spousePhone} (${config.spouseName})`);
        }
        
        try {
            // Cümə günü dostlarla görüş mesajı (18:15)
            if (now.format('dddd') === 'Friday' && currentTime === config.autoMessages.fridayMeeting.time) {
                const message = config.getFridayMessage();
                await this.sendMessage(spouseId, message);
                console.log(`📤 Cümə görüş mesajı göndərildi: ${currentTime}`);
                return; // Cümə günü digər axşam mesajı göndərilməsin
            }
            
            // Adi axşam mesajı (işdən çıxarkən) - Cümə günü istisna
            if (now.format('dddd') !== 'Friday' && currentTime === config.autoMessages.eveningMessage.time) {
                const message = config.getEveningMessage();
                await this.sendMessage(spouseId, message);
                console.log(`📤 Axşam mesajı göndərildi: ${currentTime}`);
            }
            
            // Hal-əhval mesajları
            for (const checkIn of config.autoMessages.checkIns) {
                if (currentTime === checkIn.time) {
                    const message = config.getCheckInMessage(checkIn.time);
                    await this.sendMessage(spouseId, message);
                    console.log(`📤 Hal-əhval mesajı göndərildi: ${currentTime}`);
                }
            }

            // Dostlar qrupuna mesaj (cümə axşam 19:00)
            if (now.format('dddd') === 'Friday' && currentTime === '19:00' && config.friendsGroupId) {
                const groupMessage = config.getFriendsGroupMessage();
                await this.sendMessage(config.friendsGroupId, groupMessage);
                console.log(`📤 Dostlar qrupuna mesaj göndərildi: ${currentTime}`);
            }
            
            // Dostlar görüş mesajı (hər Cümə saat 11:30)
            if (now.format('dddd') === 'Friday' && currentTime === config.autoMessages.friendsMeeting.time && config.friendsGroupId) {
                const meetingMessage = config.getFriendsMeetingMessage();
                await this.sendMessage(config.friendsGroupId, meetingMessage);
                console.log(`📤 Dostlar görüş mesajı göndərildi: ${currentTime} (Cümə günü)`);
            }
            
        } catch (error) {
            console.error('❌ Avtomatik mesaj xətası:', error);
        }
    }

    async startAutoMessages() {
        console.log('🕐 Avtomatik mesaj vaxtları:');
        console.log(`   Axşam mesajı: ${config.autoMessages.eveningMessage.time} (B.e, Ç.a, Ç və Ş)`);
        console.log(`   Cümə görüş: ${config.autoMessages.fridayMeeting.time} (yalnız Cümə)`);
        console.log(`   Dostlar qrupu: 19:00 (yalnız Cümə) - ${config.friendsGroupName}`);
        console.log(`   Dostlar görüş: ${config.autoMessages.friendsMeeting.time} (hər Cümə)`);
        config.autoMessages.checkIns.forEach(checkIn => {
            console.log(`   Hal-əhval: ${checkIn.time}`);
        });
        
        if (!config.friendsGroupId) {
            console.log('⚠️  Dostlar qrupu ID təyin edilməyib. Qrup mesajları deaktivdir.');
            console.log('💡 Qrup ID təyin etmək üçün qrupa "!setgroup" yazın');
        }
    }

    // Qrup ID təyin etmə funksiyaları
    async handleSetGroup(message) {
        console.log('🔧 handleSetGroup funksiyası başladı');
        const chat = await message.getChat();
        console.log(`📱 Chat info: isGroup=${chat.isGroup}, name=${chat.name}, id=${chat.id._serialized}`);
        
        if (!chat.isGroup) {
            console.log('❌ Chat qrup deyil, xəta mesajı göndərilir');
            await this.sendMessage(message.from, '❌ Bu komanda yalnız qruplarda işləyir!');
            return;
        }
        
        // Qrup ID-sini config-ə təyin et (bu sadə nümunədir, real proyektdə database istifadə edin)
        config.friendsGroupId = chat.id._serialized;
        config.friendsGroupName = chat.name;
        
        await this.sendMessage(chat.id._serialized, 
            `✅ *Dostlar qrupu təyin edildi!*\n\n` +
            `📱 Qrup: ${chat.name}\n` +
            `🆔 ID: ${chat.id._serialized}\n\n` +
            `🕘 Cümə günləri saat 19:00-da avtomatik salamlaşma mesajı göndəriləcək.\n\n` +
            `🤖 _Bu qrup indi dostlar qrupu kimi tanınır_`
        );
        
        console.log(`✅ Dostlar qrupu təyin edildi: ${chat.name} (${chat.id._serialized})`);
    }



    async handleGroupInfo(message) {
        const chat = await message.getChat();
        
        if (!chat.isGroup) {
            await this.sendMessage(message.from, '❌ Bu komanda yalnız qruplarda işləyir!');
            return;
        }
        
        const isFriendsGroup = config.isFriendsGroup(chat.id._serialized);
        
        await this.sendMessage(chat.id._serialized,
            `📊 *Qrup məlumatları:*\n\n` +
            `📛 Ad: ${chat.name}\n` +
            `🆔 ID: ${chat.id._serialized}\n` +
            `👥 Üzv sayı: ${chat.participants.length}\n` +
            `🤖 Dostlar qrupu: ${isFriendsGroup ? '✅ Bəli' : '❌ Xeyr'}\n\n` +
            `${isFriendsGroup ? '🕘 Cümə 19:00-da avtomatik mesaj gələcək' : '💡 !setgroup ilə dostlar qrupu olaraq təyin edə bilərsiniz'}`
        );
    }

    async start() {
        try {
            console.log('🚀 WhatsApp Bot başladılır...');
            console.log(`⚙️  Konfiqurasiya: ${config.botName}`);
            
            console.log('🔧 WhatsApp Client initialize edilir...');
            await this.client.initialize();
            console.log('✅ WhatsApp Client başlatıldı!');
            
        } catch (error) {
            console.error('❌ Bot başlatma xətası:', error);
            throw error;
        }
    }
    
    async stop() {
        try {
            console.log('🛑 Bot dayanır...');
            await this.client.destroy();
            console.log('✅ Bot dayandırıldı.');
        } catch (error) {
            console.error('❌ Bot dayandırma xətası:', error);
        }
    }
}

module.exports = WhatsAppBot;