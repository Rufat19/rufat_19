const dotenv = require('dotenv');
const moment = require('moment-timezone');

// Load environment variables
dotenv.config();

const config = {
    // Personal Assistant Bot settings
    botName: process.env.BOT_NAME || 'Rüfət Babayev - Asistent',
    ownerName: process.env.OWNER_NAME || 'Rüfət Babayev',
    ownerPosition: process.env.OWNER_POSITION || 'Software Developer',
    companyName: process.env.COMPANY_NAME || 'Tech Solutions',
    port: process.env.PORT || 3000,
    debug: process.env.DEBUG === 'true',
    
    // WhatsApp settings
    sessionName: process.env.WHATSAPP_SESSION_NAME || 'personal-assistant-session',
    autoReply: process.env.AUTO_REPLY === 'true',
    
    // Features (Railway deployment üçün default true)
    enableCommands: process.env.ENABLE_COMMANDS !== 'false',
    enableAutoReply: process.env.ENABLE_AUTO_REPLY !== 'false',
    enableLogging: process.env.ENABLE_LOGGING !== 'false', 
    enableWorkHours: process.env.ENABLE_WORK_HOURS !== 'false',
    enableProfessionalMode: process.env.ENABLE_PROFESSIONAL_MODE !== 'false',
    enableGroupChat: process.env.ENABLE_GROUP_CHAT !== 'false', // Qruplarda komandaları aktivləşdir
    
    // Personal Settings
    ownerPhone: process.env.OWNER_PHONE || '994773632066',
    spousePhone: process.env.SPOUSE_PHONE || '994556919601', // Həyat yoldaşının nömrəsi
    spouseName: process.env.SPOUSE_NAME || 'Nərgiz', // Həyat yoldaşının adı
    friendsGroupId: process.env.FRIENDS_GROUP_ID || '994553632066-1565592256@g.us', // Dostlar qrupunun ID-si
    friendsGroupName: process.env.FRIENDS_GROUP_NAME || 'Dostlar Qrupu', // Qrup adı
    timezone: process.env.TIMEZONE || 'Asia/Baku',
    workStart: process.env.WORK_START || '09:00',
    workEnd: process.env.WORK_END || '18:00',
    lunchStart: process.env.LUNCH_START || '13:00',
    lunchEnd: process.env.LUNCH_END || '14:00',
    weekendDays: (process.env.WEEKEND_DAYS || 'Saturday,Sunday').split(','),
    
    // Avtomatik Mesaj Konfiqurasiyası
    enableAutoMessages: process.env.ENABLE_AUTO_MESSAGES !== 'false',
    enableCheckIns: process.env.ENABLE_CHECKINS !== 'false',
    
    // Email Addresses
    personalEmail: process.env.PERSONAL_EMAIL || 'babayev.rufat.official@gmail.com',
    workEmail: process.env.WORK_EMAIL || 'rufat.babayev@sosial.gov.az',
    
    // Social Media Links
    telegramProfile: process.env.TELEGRAM_PROFILE || 'https://t.me/Rufat19',
    facebookProfile: process.env.FACEBOOK_PROFILE || 'https://www.facebook.com/Rufat.Babayev91',
    instagramProfile: process.env.INSTAGRAM_PROFILE || 'https://www.instagram.com/19rbr19',
    linkedinProfile: process.env.LINKEDIN_PROFILE || 'https://www.linkedin.com/in/rufat-babayev19/',
    githubProfile: process.env.GITHUB_PROFILE || 'https://github.com/Rufat19',
    
    // Business Info
    telegramBot: process.env.TELEGRAM_BOT || 'https://t.me/Sosial_Zone_Robot',
    telegramBotUsername: process.env.TELEGRAM_BOT_USERNAME || '@Sosial_Zone_Robot',
    internalIP: process.env.INTERNAL_IP || '4925',
    personalBio: process.env.PERSONAL_BIO || 'Software Developer & Bot Creator',
    hobbies: process.env.HOBBIES || 'Coding, Tech, AI Development',
    city: process.env.CITY || 'Bakı, Azərbaycan',
    
    // Commands prefix
    commandPrefix: '!',
    
    // Auto replies for handmade bag business
    autoReplies: {
        'salam': 'Salam və xoş gəlmisiniz! 👋\n\n🤖 Rüfət Babayev-in şəxsi assistenti\n⏰ İş saatları: 09:00-18:00\n\n━━━ SÜRƏTLİ MENYu ━━━\n1️⃣ Şəxsi məlumatlar\n2️⃣ Əlaqə məlumatları \n3️⃣ İş layihələri\n4️⃣ CV və Portfolio\n5️⃣ İş statusu\n\n💡 Rəqəm yazın və ya !help əmri',
        'hello': 'Hello and welcome! 👋\n\n🤖 Rüfət Babayev\'s personal assistant\n⏰ Working hours: 09:00-18:00\n\n━━━ QUICK MENU ━━━\n1️⃣ Personal info\n2️⃣ Contact details\n3️⃣ Work projects\n4️⃣ CV & Portfolio\n5️⃣ Work status\n\n💡 Type a number or !help command',
        'işdə': '💼 Hal-hazırda işdəyəm. Cavab gecikə bilər.\n⏰ İş saatları: 09:00-18:00\n📞 Təcili hallarda zəng edin',
        'working': '💼 Currently at work. Response might be delayed.\n⏰ Working hours: 09:00-18:00\n� Call for urgent matters',
        'görüşmək': '🤝 Görüşmək üçün !randevu yazın\n📅 İş saatları: 09:00-18:00',
        'meeting': '🤝 Type !appointment to schedule a meeting\n📅 Working hours: 09:00-18:00',
        'project': '� Layihə haqqında məlumat üçün !projects yazın',
        'layihə': '� Layihələr haqqında !projects yazın',
        'cv': '� CV və portfolio üçün !resume yazın',
        'özgəçmiş': '� Özgəçmiş üçün !resume yazın',
        'menu': '📱 Əsas menyu üçün !menu yazın',
        'keyboard': '🎯 İnteraktiv menyu üçün !menu yazın',
        
        // Professional responses
        'necəsən': '� Yaxşıyam, təşəkkür edirəm. Layihələrlə məşğulam.',
        'nə var nə yox': '� Hər şey qaydasındadır. İş prosesi normal gedir.',
        'nə edirsən': '⌨️ Software development üzərində çalışıram.',
        'darıxmışam': '� Məlumat və ya kömək lazımdırsa, əlaqə saxlayın.',
        'sabahın xeyir': '🌅 Sabahınız xeyir olsun!',
        'axşamın xeyir': '🌆 Axşamınız xeyir olsun!',
        'gecən xeyir': '🌙 Gecəniz xeyir olsun!',
        
        // Tech & Social Media
        'bot': '🤖 Bot development ilə məşğulam. Telegram: https://t.me/Sosial_Zone_Robot',
        'telegram': '📱 Telegram kanalım: https://t.me/Sosial_Zone_Robot',
        'sosial': '🌐 Sosial media: https://t.me/Sosial_Zone_Robot',
        'whatsapp': '📲 WhatsApp bot development sahəsində çalışıram.',
        
        // Weekend & Off-hours responses  
        'həftə sonu': '📅 Həftə sonunda da layihələrlə məşğul oluram.',
        'boş vaxt': '💻 Adətən texniki layihələrlə məşğul oluram.',
        
        // Birthday & Name day responses (unified response)
        'doğum günü': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        'doğum gününüz': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        'ad günü': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        'ad gününüz': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        'təbrik': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        'təbrik edirəm': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        
        // Holiday responses (unified)
        'bayram': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        'bayramınız mübarək': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        'ramazan': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        'qurban bayramı': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        'ramazan bayramı': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        
        // New Year and special occasions (unified)
        'yeni il': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        'yeni iliniz': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        
        // Special occasions (unified)
        'evlilik': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        'nişan': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        'məzuniyyət': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲',
        'iş': 'Təşəkkür edirəm, Allah canınızı sağ eləsin 🤲'
    },
    
    // Personal Assistant Commands
    commands: {
        help: {
            description: 'Bütün əmrləri göstərir',
            usage: '!help'
        },
        info: {
            description: 'Şəxsi məlumatlar və sosial media',
            usage: '!info'
        },
        status: {
            description: 'Hazırkı iş statusu',
            usage: '!status'
        },
        contact: {
            description: 'Əlaqə məlumatları',
            usage: '!contact'
        },
        projects: {
            description: 'İş layihələri və portfolio',
            usage: '!projects'
        },
        resume: {
            description: 'CV və təcrübə məlumatları',
            usage: '!resume'
        },
        time: {
            description: 'Bakı vaxtı',
            usage: '!time'
        },
        delivery: {
            description: 'Delivery information',
            usage: '!delivery'
        },
        elaqe: {
            description: 'Əlaqə məlumatları',
            usage: '!elaqe'
        },
        contact: {
            description: 'Contact information',
            usage: '!contact'
        },
        appointment: {
            description: 'Görüş təyin etmə',
            usage: '!randevu'
        }
    },

    // Work Hours Functions
    getCurrentTime() {
        return moment().tz(this.timezone);
    },

    isWorkingHours() {
        const now = this.getCurrentTime();
        const dayOfWeek = now.format('dddd');
        
        // Check if weekend
        if (this.weekendDays.includes(dayOfWeek)) {
            return false;
        }

        const currentTime = now.format('HH:mm');
        const workStart = this.workStart;
        const workEnd = this.workEnd;

        return currentTime >= workStart && currentTime <= workEnd;
    },

    isLunchTime() {
        const now = this.getCurrentTime();
        const currentTime = now.format('HH:mm');
        
        return currentTime >= this.lunchStart && currentTime <= this.lunchEnd;
    },

    getWorkStatus() {
        if (!this.isWorkingHours()) {
            return 'offline';
        } else if (this.isLunchTime()) {
            return 'lunch';
        } else {
            return 'working';
        }
    },

    getStatusMessage() {
        const status = this.getWorkStatus();
        const now = this.getCurrentTime();
        
        switch (status) {
            case 'working':
                return `💼 Hal-hazırda işdəyəm (${now.format('HH:mm')})\n📋 Cavab gecikə bilər, amma tezliklə cavablanacaq`;
            case 'lunch':
                return `🍽️ Nahar fasiləsindəyəm (${this.lunchStart}-${this.lunchEnd})\n⏰ ${this.lunchEnd}-dən sonra cavablanacaq`;
            case 'offline':
                const nextWorkDay = now.clone().add(1, 'day');
                while (this.weekendDays.includes(nextWorkDay.format('dddd'))) {
                    nextWorkDay.add(1, 'day');
                }
                return `🌙 İş saatları bitib (${this.workStart}-${this.workEnd})\n📅 Növbəti iş günü: ${nextWorkDay.format('dddd')} ${this.workStart}`;
            default:
                return '📱 Status yoxlanılır...';
        }
    },

    // Avtomatik Mesajlar Konfiqurasiyası
    autoMessages: {
        // İşdən çıxarkən (18:00 civarı)
        eveningMessage: {
            time: '18:05', // İş bitkən 5 dəqiqə sonra
            message: 'Salam! İşdən çıxıram. Gəlirəm, nəsə almaq lazımdır? 🛒'
        },
        
        // Cümə günü dostlarla görüş
        fridayMeeting: {
            time: '18:15',
            message: 'Salam! Bugün dostlarımla görüşəcəm. Vacib mənimlə bağlı nəsə işin var? 👥'
        },
        
        // Günün müxtəlif vaxtlarında hal-əhval
        checkIns: [
            {
                time: '12:30',
                message: 'Nahar vaxtı! Necə keçir gün? 🍽️'
            }
        ],
        
        // Hər Cümə günü dostlarla görüş planı
        friendsMeeting: {
            time: '11:30',
            day: 'Friday', // Hər Cümə günü
            message: 'Bugün görüşürük? 🤝'
        }
    },

    // Avtomatik mesaj funksiyaları
    getEveningMessage() {
        const messages = [
            `Salam ${this.spouseName}! İşdən çıxıram. Gəlirəm, nəsə almaq lazımdır? 🛒`,
            `${this.spouseName}, iş bitdi! Yolda nəsə almaq lazımdır? Yazın məlumat 📝`,
            `${this.spouseName}, evə gəlirəm. Lazım olan şey varmı? 🏠`
        ];
        const selectedMessage = messages[Math.floor(Math.random() * messages.length)];
        return selectedMessage + '\n\n🤖 _Bu mesaj avtomatik göndərilib_';
    },

    getFridayMessage() {
        const messages = [
            `Salam ${this.spouseName}! Bugün dostlarımla görüşəcəm. Vacib mənimlə bağlı nəsə işin var? 👥`,
            `${this.spouseName}, bu gün dostlarla görüş günü! Mənə vacib deyəcəyin nəsə varmı? 🤝`,
            `${this.spouseName}, dostlarla çıxacam. Məndən xüsusi bir işin varmı? 👫`
        ];
        const selectedMessage = messages[Math.floor(Math.random() * messages.length)];
        return selectedMessage + '\n\n🤖 _Bu mesaj avtomatik göndərilib_';
    },

    getCheckInMessage(time) {
        // Yalnız nahar vaxtı mesajları
        const messages = [
            `Salam ${this.spouseName}! Nahar vaxtı! Necə keçir gün? Yemək yedinizmi? 🍽️`,
            `${this.spouseName}, günorta! Evdə hər şey qaydasındadır? 🏠`,
            `${this.spouseName}, nahar fasiləsi! Necəsiniz? Uşaqlar yaxşıdır? ☺️`
        ];
        const selectedMessage = messages[Math.floor(Math.random() * messages.length)];
        return selectedMessage + '\n\n🤖 _Bu mesaj avtomatik göndərilib_\n📱 _İş vaxtı zaman ayıra bilmirəm, tezliklə geri dönüş edəcəm_';
    },

    // Qrup mesaj funksiyaları
    getFriendsGroupMessage() {
        const messages = [
            '👋 Kim hardadı dostlar? Necəsiniz?',
            '😊 Kim hardı indi? İşlər necədir?',
            '🤝 Salam qrupdakılar! Kim hardadı?',
            '👥 Dostlar, kim hardı? İndi təzə işdən çıxdım',
            '📱 Kim hardadı? Hər şey yaxşıdır?'
        ];
        const selectedMessage = messages[Math.floor(Math.random() * messages.length)];
        return selectedMessage + '\n\n🤖 _Bu mesaj avtomatik göndərilib_';
    },

    // Dostlar görüş mesajı (zarafatla)
    getFriendsMeetingMessage() {
        const meetings = [
            'Monopoliya oynayaq? 🎲',
            'Çayxanaya gedək dostlar? ☕',
            'Pivə içməyə? 🍺',
            'Call of Duty oynayaq? 🎮',
            'Kart oynayaq? ♠️♥️',
            'FIFA atmağa? ⚽🎮',
            'Nərd atmağa kim var? ⚫⚪',
            'Domino oynayaq? 🀫'
        ];
        
        const jokes = [
            '!ÇAY50QƏPİK 😄',
            'Evdə çay içirik də ☕😅',
            'Mən çay verəcəm 🍵😂',
            'Pulsuz çay party! 🎉☕',
            'Çay bizim maliyyə! 💸☕',
            'Çayxana bizim sponsordur 😄🍵'
        ];
        
        const selectedMeeting = meetings[Math.floor(Math.random() * meetings.length)];
        const selectedJoke = jokes[Math.floor(Math.random() * jokes.length)];
        
        return `${selectedMeeting}\n\n${selectedJoke}\n\n🤖 _Bu mesaj avtomatik göndərilib_`;
    },

    // Qrup ID-si yoxla
    isFriendsGroup(chatId) {
        if (!this.friendsGroupId) return false;
        return chatId.includes(this.friendsGroupId);
    }
};

module.exports = config;