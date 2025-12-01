# FathUptime 🇮🇩

**Monitoring Website & Server Berbahasa Indonesia**

FathUptime adalah aplikasi monitoring uptime yang powerful dan mudah digunakan, dibuat khusus untuk Indonesia. Terinspirasi dari Uptime Kuma, FathUptime hadir dengan interface modern dan fitur lengkap.

## ✨ Fitur Utama

- 🔐 **Authentication Lengkap**: Login dengan Google OAuth atau Credentials + 2FA TOTP
- 📊 **Multi-Type Monitoring**: HTTP(s), Keyword, Ping, TCP Port, dan Heartbeat
- 📈 **Real-time Dashboard**: Grid monitor dengan status live dan grafik response time
- 🌐 **Status Page Publik**: Bagikan status sistem dengan custom slug dan domain
- 🔔 **Notifikasi Multi-Channel**: Email (Resend), Telegram, Discord, dan ntfy.sh
- ⏱️ **Heartbeat Endpoint**: Push monitoring dengan `GET /api/push/[token]`
- 🤖 **Background Worker**: Vercel Cron Jobs check otomatis setiap menit
- 🌙 **Dark Mode**: Support tema gelap dan terang
- 🇮🇩 **Bahasa Indonesia**: Interface 100% bahasa Indonesia

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI + Lucide Icons
- **Charts**: Recharts
- **Database**: Turso (libSQL) + Drizzle ORM
- **Auth**: NextAuth v5 + Google OAuth + 2FA (otplib)
- **Email**: Resend
- **Deployment**: Vercel + Vercel Cron Jobs

## 📦 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/cecep-azhar/fathuptime.git
cd fathuptime
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database (Turso)

Buat database Turso:

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Buat database
turso db create fathuptime

# Ambil URL dan token
turso db show fathuptime
```

### 4. Environment Variables

Salin `.env.local.example` ke `.env.local` dan isi variabel:

```env
# Database (Turso)
DATABASE_URL="libsql://your-database.turso.io"
DATABASE_AUTH_TOKEN="your-auth-token"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-dengan-openssl-rand-base64-32"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Resend (Email)
RESEND_API_KEY="re_your_resend_api_key"
EMAIL_FROM="FathUptime <noreply@yourdomain.com>"

# Vercel Cron Secret
CRON_SECRET="generate-random-string"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Push Database Schema

```bash
npm run db:push
```

### 6. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🚀 Deploy ke Vercel

### 1. Push ke GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import ke Vercel

- Buka [vercel.com](https://vercel.com)
- Import repository dari GitHub
- Tambahkan environment variables
- Deploy!

### 3. Setup Cron Jobs

Vercel otomatis mendeteksi `vercel.json` dan setup cron jobs untuk `/api/cron/check` yang jalan setiap menit.

**Penting**: Set `CRON_SECRET` di environment variables Vercel untuk keamanan!

## 📱 Penggunaan

### Tambah Monitor

1. Login ke dashboard
2. Klik "Tambah Monitor"
3. Isi nama, pilih tipe (HTTP, Keyword, Ping, TCP, Heartbeat)
4. Set interval dan timeout
5. Save!

### Heartbeat Monitoring

Untuk monitoring aplikasi/script yang berjalan:

```bash
# Kirim heartbeat
curl "https://your-domain.com/api/push/TOKEN?status=up&msg=OK&ping=123"
```

### Status Page Publik

1. Buat status page di dashboard
2. Pilih monitors yang ingin ditampilkan
3. Set slug (misal: `status`)
4. Akses di: `https://your-domain.com/status-page/status`

### Notifikasi

Setup notifikasi di Settings:

- **Email**: Via Resend
- **Telegram**: Bot token + Chat ID
- **Discord**: Webhook URL
- **ntfy.sh**: Topic name

## 🛠️ Development

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Drizzle Studio (Database GUI)
npm run db:studio
```

## 📝 Database Schema

- **users**: User accounts + 2FA
- **monitors**: Monitor configurations
- **monitor_logs**: Check history
- **status_pages**: Public status pages
- **incidents**: Incident tracking
- **notifications**: Notification logs
- **notification_channels**: Notification settings

## 🤝 Contributing

Pull requests are welcome! Untuk perubahan besar, silakan buka issue terlebih dahulu.

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## ☕ Support

Suka dengan FathUptime? Dukung development dengan trakteer:

**[☕ Trakteer Cecep Azhar](https://trakteer.id/cecepazhar)**

## 📧 Contact

- **Author**: Cecep Azhar
- **Location**: Bandung, Indonesia 🇮🇩
- **GitHub**: [@cecep-azhar](https://github.com/cecep-azhar)

---

**Made with ❤️ in Bandung, Indonesia — Cecep Azhar © 2025**
