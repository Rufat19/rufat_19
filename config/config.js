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
    
    // Features
    enableCommands: process.env.ENABLE_COMMANDS === 'true',
    enableAutoReply: process.env.ENABLE_AUTO_REPLY === 'true',
    enableLogging: process.env.ENABLE_LOGGING === 'true',
    enableWorkHours: process.env.ENABLE_WORK_HOURS === 'true',
    enableProfessionalMode: process.env.ENABLE_PROFESSIONAL_MODE === 'true',
    enableGroupChat: process.env.ENABLE_GROUP_CHAT === 'true',
    
    // Personal Info
    ownerPhone: process.env.OWNER_PHONE || '+994773632066',
    timezone: process.env.TIMEZONE || 'Asia/Baku',
    workStart: process.env.WORK_START || '09:00',
    workEnd: process.env.WORK_END || '18:00',
    lunchStart: process.env.LUNCH_START || '13:00',
    lunchEnd: process.env.LUNCH_END || '14:00',
    weekendDays: (process.env.WEEKEND_DAYS || 'Saturday,Sunday').split(','),
    
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
    telegramBot: process.env.TELEGRAM_BOT || '@Sosial_Zone_Robot',
    internalIP: process.env.INTERNAL_IP || '4925',
    personalBio: process.env.PERSONAL_BIO || 'Software Developer & Bot Creator',
    hobbies: process.env.HOBBIES || 'Coding, Tech, AI Development',
    city: process.env.CITY || 'Bakı, Azərbaycan',
    
    // Commands prefix
    commandPrefix: '!',
    
    // Auto replies for handmade bag business
    autoReplies: {
        'salam': '👋 Salam! Bu *Rüfət Babayev*in şəxsi assistentidir.\n💼 Hal-hazırda iş saatlarındayam (09:00-18:00)\n📱 Kömək üçün !help yazın',
        'hello': '👋 Hello! This is *Rüfət Babayev*\'s personal assistant.\n💼 Currently in working hours (09:00-18:00)\n� Type !help for assistance',
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
        
        // Friendly & Social (24/7)
        'necəsən': '😊 Yaxşıyam, sağ ol! Sən necəsən? İşlər necədir?',
        'nə var nə yox': '😄 Hər şey yaxşıdır! Kodla məşğulam, yeni botlar düzəldirəm',
        'nə edirsən': '💻 Kompüterdə oturub kod yazıram, həmişəki kimi! 😅',
        'darıxmışam': '🤗 Mən də səni darıxmışam! Görüşək tezliklə',
        'sabahın xeyir': '🌅 Sabahın xeyir! Gözəl bir gün olsun! ☀️',
        'axşamın xeyir': '🌆 Axşamın xeyir! Necə keçdi gün? 🌙',
        'gecən xeyir': '🌙 Gecən xeyir! Yatmağa vaxtıdır 😴',
        
        // Tech & Social Media
        'bot': '🤖 Bot dünyasından danışaq! @Sosial_Zone_Robot da düzəltmişəm',
        'telegram': '📱 Telegram botum: @Sosial_Zone_Robot - yoxla, bəyənəcəksən!',
        'sosial': '📢 Sosial kanalım: https://t.me/Sosial_Zone_Robot',
        'whatsapp': '💬 WhatsApp bot düzəldirəm, gördüyün kimi! 😄',
        
        // Weekend & Off-hours responses
        'həftə sonu': '🎮 Həftə sonunda rahatlıq, film, oyun... Sən nə edirsən?',
        'boş vaxt': '🎯 Boş vaxtımda yenə kod yazıram! 😅 Hobbim həm də işimdir',
        
        // Təbriklər və Bayramlaşmalar
        'doğum günü': '🎂🎉 Doğum günün mübarək! Səadətli, sağlam və uğurlu bir yaş keçir! 🥳✨\nAllah səni hər zaman qoruyub saxlasın! 🤲💝',
        'doğum gününüz': '🎂🎉 Doğum gününüz mübarək! Səadətli, sağlam və uğurlu bir yaş keçirsiniz! 🥳✨\nAllah sizi hər zaman qoruyub saxlasın! 🤲💝',
        'ad günü': '🎊 Ad günün mübarək olsun! 🌟 Bu gün sənin günündür! 🎈\nİstəklərin, arzularınla dolu bir gün keçir! 💫🎁',
        'ad gününüz': '🎊 Ad gününüz mübarək olsun! 🌟 Bu gün sizin gününüzdür! 🎈\nİstəkləriniz, arzularınızla dolu bir gün keçirin! 💫🎁',
        'təbrik': '🎉 Təbriklər! 👏 Bu uğur tamamilə sənin layiqindir! 🌟\nDaha çox uğurlara nail olmağın üçün! 🚀✨',
        'təbrik edirəm': '🎊 Çox təbriklər! 🎯 Bu nailiyyət çox gözəldir! 💪\nDaha böyük uğurların olsun! 🏆🌟',
        
        // Bayramlar
        'bayram': '🌙✨ Bayramınız mübarək olsun! 🎊\nAilələ, dostlarla gözəl vaxtlar keçirin! 💕🏡',
        'bayramınız mübarək': '🌙🎉 Bayramınız mübarək olsun! Səadətli, xoşbəxt günlər! ✨\nAllah bu günləri hər il nasib etsin! 🤲💫',
        'ramazan': '🌙 Ramazan ayınız mübarək! 🤲 Müqəddes bu ayda mənəvi təmizlik! ✨\nOrucunuz qəbul olsun! 🕌💝',
        'qurban bayramı': '🐑🌙 Qurban Bayramınız mübarək olsun! 🎊\nAllahın rəhməti və bərəkəti ailələrinizə! 🤲✨',
        'ramazan bayramı': '🌙🎉 Ramazan Bayramınız mübarək! Xoş günlər! ✨\nAilələrlə, yaxınlarınızla gözəl vaxtlar! 💕🏡',
        
        // Yeni il
        'yeni il': '🎊🥳 Yeni İliniz mübarək olsun! 2️⃣0️⃣2️⃣6️⃣ ✨\nSəadət, sağlamlıq və uğurlarla dolu bir il olsun! 🌟🎁',
        'yeni iliniz': '🎉🍾 Yeni İliniz mübarək! Arzularınız həqiqətləşsin! ✨\nBu il sizə xoşbəxtlik gətirsin! 🌈💫',
        
        // Xüsusi günlər
        'evlilik': '💍💒 Evliliyiniz mübarək olsun! 💕 Xoşbəxt bir həyat keçirin!\nBirlikdə bütün çətinlikləri aşın! 👰🤵✨',
        'nişan': '💍✨ Nişanınız mübarək! Xoşbəxt günlərin başlanğıcı! 💕\nGələcək üçün ən gözəl arzu və istəklər! 🌟💫',
        'məzuniyyət': '🎓🎉 Məzuniyyətin mübarək! Təhsilin başa çatdı! 📚✨\nİndi yeni sərgüzəştlər səni gözləyir! 🚀💪',
        'iş': '💼🎯 Yeni işin mübarək olsun! Uğurlu karyera! 🌟\nBu yeni başlanğıc səni böyük nailiyyətlərə aparacaq! 🚀💪'
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
    }
};

module.exports = config;