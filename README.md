# Rüfət Babayev - Şəxsi Asistent WhatsApp Bot

Bu layihə **Rüfət Babayev**in şəxsi asistent botudur. İş saatları ərzində peşəkar, qalan vaxtlarda dostcasına ünsiyyət təmin edir.

## Şəxs Məlumatları
**Ad Soyad:** Rüfət Babayev  
**Mobil:** +994-77-363-20-66  
**Şəxsi Email:** babayev.rufat.official@gmail.com  
**İş Email:** rufat.babayev@sosial.gov.az  
**Şəhər:** Bakı, Azərbaycan  
**İş Saatları:** 09:00-18:00 (Bakı vaxtı)  

### Sosial Media Əlaqələri
- **Telegram:** https://t.me/Babayev_Rufat_Rasul (@Babayev_Rufat_Rasul)
- **Facebook:** https://www.facebook.com/Rufat.Babayev91
- **Instagram:** https://www.instagram.com/19rbr19
- **LinkedIn:** https://www.linkedin.com/in/rufat-babayev19/
- **GitHub:** https://github.com/Rufat19
- **İş Botu:** @Sosial_Zone_Robot (Telegram)  

## Bot Xüsusiyyətləri
- 🕘 **İş Saatları Təqvibi:** 9:00-18:00 arası peşəkar rejim
- 🌙 **24/7 Dostcasına Rejim:** İş saatları xaricində dostcasına ünsiyyət
- 📱 **Sosial İnteqrasiya:** Tam sosial media profil dəstəyi (LinkedIn, Instagram, GitHub və s.)
- 💬 **Şəxsi Mesajlar:** Yalnız DM-lərdə cavab verir, qrup chatlarında passivdir
- ⏰ **Vaxt Zonası:** Bakı/Azərbaycan vaxt zonası
- 🤖 **Ağıllı Cavablar:** Kontekstə uyğun mesaj cavabları

## Requirements

### System Requirements
- **Node.js**: v16.0.0+
- **NPM**: v8.0.0+
- **Chromium/Chrome**: For WhatsApp Web

### Dependencies
Bütün lazımi paketlər `package.json`-da göstərilib:
- Core: whatsapp-web.js, express, dotenv
- Utils: qrcode-terminal, winston, moment, moment-timezone
- Security: helmet, cors
- Development: nodemon, eslint, prettier

## Qurulum

1. **Node.js yoxla:**
```bash
node --version  # v16.0.0+
npm --version   # v8.0.0+
```

2. **Dependencies qur:**
```bash
npm install
# və ya
npm run install-deps
```

3. **Environment konfiqurasiya:**
```bash
# .env faylını yarat (nümunə aşağıda)
```

4. **Botu işə sal:**
```bash
npm start        # Production
npm run dev      # Development
```

### Environment Variables (.env)
```env
# Şəxsi Asistent Konfiqurasiyası
BOT_NAME=Rüfət Babayev - Asistent
OWNER_NAME=Rüfət Babayev
OWNER_PHONE=994773632066
PERSONAL_EMAIL=babayev.rufat.official@gmail.com
WORK_EMAIL=rufat.babayev@sosial.gov.az
CITY=Bakı, Azərbaycan

# İş Saatları (Bakı vaxtı)
WORK_START=09:00
WORK_END=18:00
TIMEZONE=Asia/Baku

# Sosial Media Profiles
TELEGRAM_PROFILE=https://t.me/Rufat19
FACEBOOK_PROFILE=https://www.facebook.com/Rufat.Babayev91
INSTAGRAM_PROFILE=https://www.instagram.com/19rbr19
LINKEDIN_PROFILE=https://www.linkedin.com/in/rufat-babayev19/
GITHUB_PROFILE=https://github.com/Rufat19

# Sosial Media İnteqrasiyası
TELEGRAM_BOT=@Sosial_Zone_Robot
INTERNAL_IP=4925
SOCIAL_LINKS=Instagram: @rufat_social, LinkedIn: rufat-babayev

# Texniki Konfiqurasiya
PORT=3000
DEBUG=true
ENABLE_LOGGING=true
ENABLE_AUTO_REPLY=true
ENABLE_COMMANDS=true
COMMAND_PREFIX=!
```

## Xüsusiyyətlər

- 🔐 QR kod ilə WhatsApp Web authentication
- 🤖 Ağıllı avtomatik mesaj cavabı sistemi
- ⚡ Əmr işləmə sistemi
- 🕘 İş saatları və vaxt zonası dəstəyi
- 📱 Multi-media fayl dəstəyi
- 🌐 Sosial media inteqrasiyası

## İş Rejimləri

### 🏢 İş Saatları (9:00-18:00 Bakı vaxtı)
- Peşəkar ünsiyyət tərzi
- İş məsələlərinə yönləndirmə
- Telegram bot və IP sistemi təklifi
- Sürətli cavab müddəti

### 🌙 İş Saatları Xarici (Axşam/Həftə sonu)
- Dostcasına ünsiyyət tərzi
- Şəxsi söhbətlər
- Rahat atmosfer
- Uzun söhbətlər
- 🎉 **Təbrik və Bayramlaşma** sistemi

## İstifadə

Bot işə düşdükdən sonra terminalda QR kod görünəcək. Bu kodu WhatsApp tətbiqində skan etdikdən sonra bot hazır olacaq.

## Bot Əmrləri

### 🔧 Əsas Əmrlər
- `!help` - Bütün əmrləri göstərir
- `!info` - Şəxsi məlumatlar
- `!status` - Hazırkı iş statusu
- `!time` / `!vaxt` - Bakı vaxtını göstərir

### 💼 İş Əmrləri  
- `!projects` / `!layihələr` - İş layihələri
- `!resume` / `!cv` - CV məlumatları
- `!randevu` / `!appointment` - Görüş təyin etmə
- `!contact` / `!elaqe` - Əlaqə məlumatları

### 🤖 Avtomatik Cavablar
Bot vaxt kontekstinə əsasən cavab verir:

**İş Saatlarında:**
- "salam", "hello" → Peşəkar salamlama + iş yönləndirməsi
- "iş", "work", "layihə" → Telegram bot və IP məlumatları
- "randevu", "meeting" → Görüş təyin etmə sistemi

**İş Saatları Xaricində:**
- "salam", "hello" → Dostcasına salamlama
- "necə", "nə var" → Şəxsi söhbət başlanğıcı
- "darıx", "görüş" → Dostcasına təklif və planlar

**🎉 Təbrik və Bayramlaşma Sistemi:**
- "doğum günü" / "doğum gününüz" → Doğum günü təbriki
- "ad günü" / "ad gününüz" → Ad günü təbriki
- "təbrik" / "təbrik edirəm" → Ümumi təbrik mesajı
- "bayram" / "bayramınız mübarək" → Bayram təbriki
- "ramazan" / "qurban bayramı" / "ramazan bayramı" → Dini bayram təbrikləri
- "yeni il" / "yeni iliniz" → Yeni il təbriki
- "evlilik" / "nişan" / "məzuniyyət" → Xüsusi hadisələr təbriki

## Texnologiyalar

- Node.js
- whatsapp-web.js
- Express.js
- QRCode Terminal