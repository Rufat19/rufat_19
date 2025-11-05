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
    enableGroupChat: process.env.ENABLE_GROUP_CHAT === 'true',
    
    // Personal Settings
    ownerPhone: process.env.OWNER_PHONE || '994773632066',
    spousePhone: process.env.SPOUSE_PHONE || '994556919601', // Həyat yoldaşının nömrəsi
    spouseName: process.env.SPOUSE_NAME || 'Həyat yoldaşım', // Həyat yoldaşının adı
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
        'salam': 'Salam! Rüfət Babayev-in şəxsi assistenti.\nİş saatları: 09:00-18:00\nKömək: !help',
        'hello': 'Hello! Rüfət Babayev\'s personal assistant.\nWorking hours: 09:00-18:00\nHelp: !help',
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
        
        // Friendly responses (professional tone)
        'necəsən': 'Yaxşıyam, təşəkkür edirəm. Sizin işlər necədir?',
        'nə var nə yox': 'Hər şey qaydasındadır. Hal-hazırda layihələrlə məşğulam.',
        'nə edirsən': 'İş üzərində çalışıram.',
        'darıxmışam': 'Təşəkkür edirəm. Tezliklə əlaqə saxlayarıq.',
        'sabahın xeyir': 'Sabahınız xeyir olsun!',
        'axşamın xeyir': 'Axşamınız xeyir olsun!',
        'gecən xeyir': 'Gecəniz xeyir olsun!',
        
        // Tech & Social Media
        'bot': 'Bot development ilə məşğulam. Telegram botum: https://t.me/Sosial_Zone_Robot',
        'telegram': 'Telegram botum: https://t.me/Sosial_Zone_Robot',
        'sosial': 'Sosial kanal: https://t.me/Sosial_Zone_Robot',
        'whatsapp': 'WhatsApp bot development.',
        
        // Weekend & Off-hours responses
        'həftə sonu': 'Həftə sonunda da layihələrlə məşğulam.',
        'boş vaxt': 'Layihələrim üzərində işləyirəm.',
        
        // Birthday & Name day responses (thank you instead of congratulations)
        'doğum günü': 'Təşəkkür edirəm! Xoş sözləriniz üçün minnətdaram.',
        'doğum gününüz': 'Təşəkkür edirəm! Xoş sözləriniz üçün minnətdaram.',
        'ad günü': 'Təşəkkür edirəm! Diqqətiniz üçün minnətdaram.',
        'ad gününüz': 'Təşəkkür edirəm! Diqqətiniz üçün minnətdaram.',
        'təbrik': 'Təşəkkür edirəm! Dəstəyiniz üçün minnətdaram.',
        'təbrik edirəm': 'Təşəkkür edirəm! Xoş sözləriniz üçün minnətdaram.',
        
        // Holiday responses
        'bayram': 'Təşəkkür edirəm! Sizin də bayramınız mübarək olsun!',
        'bayramınız mübarək': 'Təşəkkür edirəm! Sizin də bayramınız mübarək olsun!',
        'ramazan': 'Təşəkkür edirəm! Sizin də Ramazan ayınız mübarək!',
        'qurban bayramı': 'Təşəkkür edirəm! Sizin də bayramınız mübarək olsun!',
        'ramazan bayramı': 'Təşəkkür edirəm! Sizin də bayramınız mübarək olsun!',
        
        // New Year and special occasions
        'yeni il': 'Təşəkkür edirəm! Sizin də yeni iliniz mübarək olsun!',
        'yeni iliniz': 'Təşəkkür edirəm! Sizin də yeni iliniz mübarək olsun!',
        
        // Special occasions - gratitude responses
        'evlilik': 'Təşəkkür edirəm! Xoş sözləriniz üçün minnətdaram.',
        'nişan': 'Təşəkkür edirəm! Diqqətiniz üçün minnətdaram.',
        'məzuniyyət': 'Təşəkkür edirəm! Dəstəyiniz üçün minnətdaram.',
        'iş': 'Təşəkkür edirəm! Xoş sözləriniz üçün minnətdaram.'
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
        ]
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
    }
};

module.exports = config;