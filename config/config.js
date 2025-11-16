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
    familyGroupId: process.env.FAMILY_GROUP_ID || '', // Ailə qrupunun ID-si (isteğe bağlı)
    familyGroupName: process.env.FAMILY_GROUP_NAME || 'Ailə Qrupu',
    timezone: process.env.TIMEZONE || 'Asia/Baku',
    workStart: process.env.WORK_START || '09:00',
    workEnd: process.env.WORK_END || '18:00',
    lunchStart: process.env.LUNCH_START || '13:00',
    lunchEnd: process.env.LUNCH_END || '14:00',
    weekendDays: (process.env.WEEKEND_DAYS || 'Saturday,Sunday').split(','),
    
    // Avtomatik Mesaj Konfiqurasiyası
    enableAutoMessages: process.env.ENABLE_AUTO_MESSAGES !== 'false',
    enableCheckIns: process.env.ENABLE_CHECKINS !== 'false',
    // Nahar xatırlatmaları hələlik deaktiv (env ilə ENABLE_LUNCH_REMINDER=true edərək aktivləşdirilə bilər)
    enableLunchReminder: process.env.ENABLE_LUNCH_REMINDER === 'true',
    // Dostlar qrupu üçün salamlama/hal-əhval check-inləri (default aktivdir)
    enableFriendsGroupCheckIns: process.env.ENABLE_FRIENDS_GROUP_CHECKINS !== 'false',
    enableFamilyGroupCheckIns: process.env.ENABLE_FAMILY_GROUP_CHECKINS !== 'false',
    // Hava proqnozu əsasında tövsiyələr
    enableWeatherTips: process.env.ENABLE_WEATHER_TIPS !== 'false',
    weather: {
        apiKey: process.env.WEATHER_API_KEY || '',
        // Bakı koordinatları
        lat: parseFloat(process.env.WEATHER_LAT || '40.4093'),
        lon: parseFloat(process.env.WEATHER_LON || '49.8671'),
        // Mesaj saatları (vergüllə ayrılmış)
        times: (process.env.WEATHER_TIP_TIMES || '08:10').split(',').map(s => s.trim()).filter(Boolean),
        // Hədəf: spouse | family | friends
        target: (process.env.WEATHER_TIP_TARGET || 'family').toLowerCase()
    },
    manualIgnoreWindowMinutes: parseInt(process.env.MANUAL_IGNORE_WINDOW_MINUTES || '180', 10),
    
    // Email Addresses
    personalEmail: process.env.PERSONAL_EMAIL || 'babayev.rufat.official@gmail.com',
    workEmail: process.env.WORK_EMAIL || 'rufat.babayev@sosial.gov.az',
    
    // Social Media Links
    telegramProfile: process.env.TELEGRAM_PROFILE || 'https://t.me/Babayev_Rufat_Rasul',
    facebookProfile: process.env.FACEBOOK_PROFILE || 'https://www.facebook.com/Rufat.Babayev91',
    instagramProfile: process.env.INSTAGRAM_PROFILE || 'https://www.instagram.com/19rbr19',
    linkedinProfile: process.env.LINKEDIN_PROFILE || 'https://www.linkedin.com/in/rufat-babayev19/',
    githubProfile: process.env.GITHUB_PROFILE || 'https://github.com/Rufat19',
    // Resume (CV) fayl yolu
    resumeFilePath: process.env.RESUME_FILE || 'assets/resume.pdf',
    
    // Business Info
    telegramBot: process.env.TELEGRAM_BOT || 'https://t.me/Sosial_Zone_Robot',
    telegramBotUsername: process.env.TELEGRAM_BOT_USERNAME || '@Rufat19',
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
        'project': ' Layihə haqqında məlumat üçün !projects yazın',
        'layihə': ' Layihələr haqqında !projects yazın',
        'menu': '📱 Əsas menyu üçün !menu yazın',
        'keyboard': '🎯 İnteraktiv menyu üçün !menu yazın',
        
        // Professional responses
        'necəsən': ' Şükür Allaha, yaxşıyam.Sən necəsən?',
        'nə var nə yox': ' Şükür, hər şey qaydasındadır. Səndə nə var, nə yox?.',
        'nəyniyirsən': '⌨️ Həmişəki işlər.',
        'sabahın xeyir': '🌅 Sabahınız xeyir olsun!',
        'axşamın xeyir': '🌆 Axşamınız xeyir olsun!',
        'gecən xeyrə': '🌙 Sizin də gecəniz xeyrə qalsın!',
        
        // Tech & Social Media
        'bot': 'Özünü inkişaf etdir: https://t.me/Sosial_Zone_Robot',
        'telegram': '📱 Telegram kanalım: https://t.me/Sosial_muhit',
        'whatsapp': '📲 WhatsApp bot development sahəsində çalışıram.',
        
        // Weekend & Off-hours responses  
        'həftə sonu': '📅 Həftə sonunda da layihələrlə məşğul oluram.',
        'boş vaxt': '💻 Adətən texniki layihələrlə məşğul oluram.',
        
        // Birthday & Name day responses (unified response)
    // Doğum günü və ad günü
    'doğum günün': '🎂 Təşəkkür edirəm. Diqqətinizə görə minnətdaram. 🎉',
    'ad günün': '🎂 Təşəkkür edirəm. Diqqətinizə görə minnətdaram. 🎁',
    'təbrik': '👏 Çox sağ olun! Var olun!',

    // Bayramlar və xüsusi günlər
    'ramazan bayramın': '🎉 Təşəkkür edirəm. Sizində Ramazan Bayramınız mübarək! Allah hər birinizə ruzi-bərəkət, ailənizə səadət və qəlbinizə rahatlıq bəxş etsin. Bayramınız xeyirli olsun! 🕌',
    'qurban bayramın': '🕋 Təşəkkür edirəm. Sizində Qurban Bayramınız mübarək! Allah kəsdiyiniz qurbanları, etdiyiniz duaları qəbul etsin. Hər zaman ruzi və bərəkət içində olun! 🤲',
    'novruz bayramın': '🌱 Təşəkkür edirəm. Sizində Novruz bayramınız mübarək! Baharın gəlişi həyatınıza yeni ümid, sevinc və uğur gətirsin. Süfrəniz bol, eviniz bərəkətli olsun! 🔥',
    'yeni ilin': '🎆 Yeni iliniz mübarək! 2026-cı ildə hər bir gününüz sevinc, uğur və sağlamlıqla dolu olsun. Arzularınız gerçək olsun! 🎊',
    'zəfər bayramı': '🏆 Zəfər Günü mübarək! Qəhrəmanlarımızın ruhu qarşısında baş əyir, xalqımıza daim sülh və rifah arzulayıram. 🇦🇿',
    'dirçəliş günü': '🌄 Dirçəliş Günü mübarək! Millətimizə birlik, güc və firavanlıq arzulayıram. Hər zaman yüksəlişdə olaq! 🇦🇿',
    'bayramın': '🎊 Diqqətinizə görə minnərdaram, Mən də sizin bayramınızı təbrik edirəm! Hər zaman sevinc, bərəkət və xoşbəxtlik sizinlə olsun!',
    // Digər xüsusi hallar
    'il dönümünüzü': 'Çox diqqətlisiniz, təşəkkür edirəm. 👩‍❤️‍👨',

    },
    
    // Personal Assistant Commands
    commands: {
        help: {
            description: 'Bütün əmrləri göstərir',
            usage: '!help'
        },
        info: {
            description: 'Sosial media hesablarım haqqında məlumat',
            usage: '!info'
        },
        status: {
            description: 'Hazırkı iş statusu',
            usage: '!status'
        },
        contact: {
            description: 'Əlaqə məlumatlarım',
            usage: '!contact'
        },
        projects: {
            description: 'İş layihələri və portfolio',
            usage: '!projects'
        },
        elaqe: {
            description: 'Əlaqə məlumatlarım',
            usage: '!elaqe'
        },
        appointment: {
            description: 'Görüş təyin etmə',
            usage: '!randevu'
        },
        hava: {
            description: 'Bakı üçün cari hava və tövsiyə',
            usage: '!hava'
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
                return `💼 Üzrlü sayın, işdəyəm (${now.format('HH:mm')})\n📋 Cavab gecikə bilər`;
            case 'lunch':
                return `🍽️ Üzrlü sayın, nahar fasiləsindəyəm (${this.lunchStart}-${this.lunchEnd})\n⏰ ${this.lunchEnd}-dən sonra cavablandıracam`;
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
        // İş günlərində nahar xatırlatma və follow-up
        lunchReminder: {
            time: process.env.LUNCH_REMINDER_TIME || '11:15',
            // Env format nümunələri:
            //  - 994508888757,994512330328
            //  - 994508888757:Rəna,994512330328:Aysel
            recipients: (process.env.LUNCH_REMINDER_RECIPIENTS || '994508888757:Rəna,994512330328')
                .split(',')
                .map(v => v.trim())
                .filter(Boolean)
                .map(token => {
                    const [phone, name] = token.split(':');
                    return { phone: phone?.trim(), name: name?.trim() || undefined };
                })
        },
        lunchFollowUp: {
            time: process.env.LUNCH_FOLLOWUP_TIME || '12:30',
            // Default olaraq yalnız ilk nömrəyə follow-up (Rəna)
            recipientIndex: parseInt(process.env.LUNCH_FOLLOWUP_RECIPIENT_INDEX || '0', 10)
        },
        // İşdən çıxarkən (18:00 civarı)
        eveningMessage: {
            time: '18:20', // İş bitkən 5 dəqiqə sonra
            message: 'Axşamın xeyir! İşdən çıxıram. Gələndə nəsə alım? 🛒'
        },
        
        // Cümə günü dostlarla görüş
        fridayMeeting: {
            time: '18:15',
            message: 'Axşamın xeyir! Bugün dostlarımla görüşəcəm. Vacibnəsə işin yoxdur? 👥'
        },
        
        // Günün müxtəlif vaxtlarında hal-əhval
        checkIns: [
            {
                time: '12:30',
                message: 'Bizdə nahar vaxtıdır, siz necəsiz, nə iş görürsüz, salamatçılıqdır? 🍽️'
            }
        ],
        
        // Hər Cümə günü dostlarla görüş planı
        friendsMeeting: {
            time: '12:30',
            day: 'Friday', // Hər Cümə günü
            message: 'Bugün görüşürük? 🤝'
        },
        // Dostlar qrupu üçün check-in vaxtları (gün ərzində qısa salam/hal-əhval)
        friendsGroupCheckIns: [
            { time: '10:30' },
            { time: '14:30' },
            { time: '21:00' }
        ],
        // Ailə qrupu üçün check-in saatları (sakit və hörmətli ton)
        familyGroupCheckIns: [
            { time: '10:00' },
            { time: '16:00' }
        ]
    },

    // Avtomatik mesaj funksiyaları
    getEveningMessage() {
        const messages = [
            `Salam ${this.spouseName}! İşdən çıxıram. Gəlirəm, nəsə almaq lazımdır? 🛒`,
            `${this.spouseName}, iş bitdi! yoldayam, nəsə almaq lazımdır? Yazın məlumat 📝`,
            `${this.spouseName}, evə gəlirəm, nəsə lazımdır? 🏠`
        ];
        const selectedMessage = messages[Math.floor(Math.random() * messages.length)];

        // Sabah iş günüdürsə əlavə qeydi eyni mesaja daxil et
        const now = this.getCurrentTime();
        const nextDay = now.clone().add(1, 'day');
        let appendNote = '';
        if (!this.weekendDays.includes(nextDay.format('dddd'))) {
            appendNote = `\n\n📌 Sabaha mənim üçün nahar fasiləsinə yemək qoymağı unutma.`;
        }

        return selectedMessage + appendNote + '\n\n☺️ _Bu mesaj bot tərəfindən göndərilib_';
    },

    getFridayMessage() {
        const messages = [
            `Salam ${this.spouseName}! Bugün dostlarımla görüşəcəm. Vacib mənimlə bağlı nəsə işin var? 👥`,
            `${this.spouseName}, bu gün dostlarla görüş günü! Mənə vacib deyəcəyin nəsə varmı? 🤝`,
            `${this.spouseName}, dostlarla çıxacam. Məndən xüsusi bir işin varmı? 👫`
        ];
        const selectedMessage = messages[Math.floor(Math.random() * messages.length)];
        return selectedMessage + '\n\n ☺️ _Bu mesaj bot tərəfindən göndərilib_';
    },

    getCheckInMessage(time) {
        // Yalnız nahar vaxtı mesajları
        const messages = [
            `Salam ${this.spouseName}! Necə keçir gün? Axşam yeməyə nə var?) 🍽️`,
            `${this.spouseName}, Evdə hər şey qaydasındadır? 🏠`,
            `${this.spouseName}, Necəsiniz? Uşaqlar yaxşıdır? ☺️`
        ];
        const selectedMessage = messages[Math.floor(Math.random() * messages.length)];
        return selectedMessage + '\n\n☺️ _Bu mesaj bot tərəfindən göndərilib_\n📱 _İş vaxtı zaman ayıra bilmirəm, tezliklə geri dönüş edəcəm_';
    },

    // Nahar sifarişi xatırlatma mesajı (Rəna üçün)
    getLunchOrderMessage(name) {
        const greeting = name ? `${name} salam,` : 'Salam,';
        const text =
            `${greeting} Necəsən? Mümkündürsə mənə bugün üçün nahar götürmək yadında olsun, ` +
            'əgər məndən məşğulluq səbəbi ilə növbəti öz yazdığım mesaj gəlməzsə bu lindkdən sifarişi edərsən zəhmət olmasa - ' +
            'https://wolt.com/az/aze/baku/restaurant/green-bite-khatai/itemid-fa78235e9785303d4c04dfaf ' +
            '- öncədən minnətdaram, alınmırsa problem deyil, özüm həll edəcəm, sənə isə nuş olsun';
        return text + '\n\n🤖 _Bu mesaj bot tərəfindən göndərilib_';
    },

    // Nahar xatırlatma follow-up (linki DM göndərmə xatırlatması)
    getLunchFollowUpMessage(name) {
        const prefix = name ? `${name}, ` : '';
        const text = `${prefix}Əgər sifariş verdinsə, zəhmət olmasa linki bura DM göndər 🙏`;
        return text + '\n\n🤖 _Bu mesaj bot tərəfindən göndərilib_';
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
    // Dostlar qrupu üçün qısa salam/hal-əhval  mesajları
    getFriendsGroupSmallTalk() {
        const options = [
            '👋 Salam dostlar, gününüz necə keçir?',
            '🙂 Necəsiniz? Yeni xəbər var?',
            '☕ Qısa fasilə verək? Kim nə edir?',
            '📅 Günün gedişi necədir, planlar nədir?',
            '💬 Hal-əhval: hər şey qaydasındadır?'
        ];
        return options[Math.floor(Math.random() * options.length)] + '\n\n🤖 _Bu mesaj avtomatik göndərilib_';
    },

    // Ailə qrupu üçün qısa salam/hal-əhval mesajları (daha neytral)
    getFamilyGroupSmallTalk() {
        const options = [
            '👋 Salam, necəsiniz?',
            '🙂 Gününüz xeyir, hər şey qaydasındadır?',
            '☕ Günorta hal-əhval: hər kəs yaxşıdır?',
            '📅 Gün necə keçir? Xoş xəbərlər var?',
            '💬 Hamıya salamlar, sağlığınız necədir?'
        ];
        return options[Math.floor(Math.random() * options.length)] + '\n\n🤖 _Bu mesaj avtomatik göndərilib_';
    },

    // Dostlar görüş mesajı (mövsümə həssas, zarafatla)
    getFriendsMeetingMessage() {
        // Mövsüm təyini
        const now = this.getCurrentTime();
        const month = now.month(); // 0=Yanvar ... 11=Dekabr
        const isWinter = [11, 0, 1].includes(month); // Dek, Yan, Fev
        const isSpringOrSummer = month >= 2 && month <= 7; // Mar..Avg

        const meetingsBase = [
            'Monopoliya oynayaq? 🎲',
            'Çayxanaya gedək dostlar? ☕',
            'Call of Duty oynayaq? 🎮',
            'Kart oynayaq? ♠️♥️',
            'Bilyarda kim var? ⚫⚪',
            'Bir nəfər də tapaq gedək Domino oynayaq? 🀫'
        ];

        // Pivə təklifi yalnız yaz‑yay aylarında olsun
        const meetings = [...meetingsBase];
        if (isSpringOrSummer) {
            meetings.push('Pivə içməyə? 🍺');
        }

        // Qış fəsli üçün Xəngəl və Hamam təklifləri əlavə et
        if (isWinter) {
            meetings.push('Xəngəl yeməyə gedək? 🥟');
            meetings.push('Hamama gedək? 🛁');
        }
        
        const jokes = [
            'Bəlkə bugün monopoliya oynayaq? 😄',
            'Əsl xəngəl havası var aa 😅',
            'Yenə PS gedirik? 🎮',
            'Bəlkə qutaba gedək dostlar? 🎉',
            'Bu aralar xərcimiz çoxdur, bəlkə çay içməyə gedək? 💸☕',
            '50 qəpikdə də oturmaq olar, tem bolee təzə kodu öyrənmişəm 😄'
        ];
        
        const selectedMeeting = meetings[Math.floor(Math.random() * meetings.length)];
        const selectedJoke = jokes[Math.floor(Math.random() * jokes.length)];

        return `${selectedMeeting}\n\n${selectedJoke}\n\n🤖 _Bu mesaj bot tərəfindən göndərilib_`;
    },

    // Hava tövsiyə mətni qurucu (OpenWeather `weather` endpoint nəticəsi üçün)
    buildWeatherTipMessage(current) {
        try {
            if (!current || !current.weather || !current.weather[0] || !current.main) {
                return '🌤️ Hava məlumatı hazırda əlçatan deyil.';
            }
            const desc = current.weather[0].description || '';
            const main = current.weather[0].main || '';
            const temp = Math.round(current.main.temp);
            const feels = Math.round(current.main.feels_like || temp);
            const wind = current.wind?.speed != null ? Math.round(current.wind.speed) : null; // m/s
            const rainMm = current.rain?.['1h'] || current.rain?.['3h'] || 0;
            const snowMm = current.snow?.['1h'] || current.snow?.['3h'] || 0;

            const tips = [];
            const lowered = (main + ' ' + desc).toLowerCase();
            if (rainMm > 0 || lowered.includes('rain') || lowered.includes('yağış')) {
                tips.push('çətir götürün ☔');
            }
            if (snowMm > 0 || lowered.includes('snow') || lowered.includes('qar')) {
                tips.push('yollar sürüşkən ola bilər ❄️');
            }
            if (feels <= 5) {
                tips.push('isti geyim məsləhətdir 🧥');
            }
            if (feels >= 30) {
                tips.push('su için, günəşdən qorunun ☀️🥤');
            }
            if (wind != null && wind >= 8) {
                tips.push('külək güclüdür, ehtiyatlı olun 🌬️');
            }

            const parts = [
                `Bakı: ${temp}°C (hiss olunan ${feels}°C)`,
                wind != null ? `külək ${wind} m/s` : null,
                desc ? `hava: ${desc}` : null
            ].filter(Boolean);

            const base = `🌤️ ${parts.join(', ')}`;
            const tipText = tips.length ? `Tövsiyə: ${tips.join(', ')}.` : 'Gün xoş keçsin!';
            return `${base}\n${tipText}` + '\n\n🤖 _Bu mesaj avtomatik göndərilib_';
        } catch {
            return '🌤️ Hava məlumatı hazırda əlçatan deyil.';
        }
    },

    // Qrup ID-si yoxla
    isFriendsGroup(chatId) {
        if (!this.friendsGroupId) return false;
        return chatId.includes(this.friendsGroupId);
    },
    isFamilyGroup(chatId) {
        if (!this.familyGroupId) return false;
        return chatId.includes(this.familyGroupId);
    }
};

module.exports = config;