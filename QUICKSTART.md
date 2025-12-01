# 🚀 Quick Start - FathUptime

Aplikasi monitoring Indonesia sudah siap! Ikuti langkah-langkah ini untuk mulai.

## ⚡ 3 Langkah Cepat

### 1️⃣ Install Dependencies (Sudah Selesai ✅)
```bash
npm install
```

### 2️⃣ Setup Database (Sudah Selesai ✅)
```bash
npm run db:push
```

### 3️⃣ Jalankan Development Server
```bash
npm run dev
```

Buka: **http://localhost:3000**

## 📱 Cara Menggunakan

### Langkah 1: Register Akun
1. Buka http://localhost:3000/register
2. Isi nama, email, password
3. Klik "Daftar"

### Langkah 2: Login
1. Masuk dengan akun yang baru dibuat
2. Atau gunakan Google OAuth (jika dikonfigurasi)

### Langkah 3: Tambah Monitor Pertama
1. Di dashboard, klik "Tambah Monitor"
2. Pilih tipe monitoring:
   - **HTTP** - Monitor website (https://example.com)
   - **Keyword** - Check apakah kata tertentu ada di website
   - **Ping** - Ping server atau IP address
   - **TCP** - Check apakah port terbuka
   - **Heartbeat** - Untuk aplikasi yang push status sendiri
3. Set interval check (minimal 30 detik)
4. Klik "Simpan"

### Langkah 4: Lihat Hasilnya
- Dashboard akan refresh otomatis
- Monitor akan mulai dicek setiap interval yang ditentukan
- Klik card monitor untuk lihat detail + chart

## 🎯 Testing Heartbeat

Jika buat monitor tipe **Heartbeat**, copy token dan test:

```bash
# Windows PowerShell
.\test-heartbeat.ps1

# Linux/Mac
chmod +x test-heartbeat.sh
./test-heartbeat.sh
```

Atau manual:
```bash
curl "http://localhost:3000/api/push/YOUR_TOKEN?status=up&msg=OK&ping=50"
```

## 🌐 Status Page Publik

### Buat Status Page:
1. (Coming soon - implementasi UI management)
2. Atau langsung insert ke database via Drizzle Studio

### Akses Status Page:
```
http://localhost:3000/status-page/[slug]
```

## 🔔 Setup Notifikasi

Edit di `app/settings/page.tsx` untuk manage notification channels:
- Email via Resend
- Telegram Bot
- Discord Webhook
- ntfy.sh

## 📊 Badge untuk README

Tambahkan badge status di README GitHub:

```markdown
![Status](http://localhost:3000/api/badge/MONITOR_ID)
```

## 🚀 Deploy ke Production

Lihat file **DEPLOYMENT.md** untuk panduan lengkap deploy ke Vercel + Turso.

Singkatnya:
1. Push ke GitHub
2. Import ke Vercel
3. Setup Turso database
4. Add environment variables
5. Deploy!

## 🛠️ Development

```bash
# Run dev server dengan Turbopack
npm run dev

# Build production
npm run build

# Database studio (GUI)
npm run db:studio

# Generate migration
npm run db:generate

# Push schema
npm run db:push
```

## 📝 File Penting

- **README.md** - Dokumentasi lengkap
- **API.md** - API documentation & integration examples
- **DEPLOYMENT.md** - Deployment checklist
- **CONTRIBUTING.md** - Cara berkontribusi
- **.env.local** - Environment variables (lokal)
- **vercel.json** - Cron job configuration

## ❓ Troubleshooting

### Monitor tidak ter-check otomatis?
- Cron jobs hanya jalan di production (Vercel)
- Untuk testing lokal, panggil manual:
  ```bash
  curl "http://localhost:3000/api/cron/check" -H "Authorization: Bearer dev-cron-secret-12345"
  ```

### Database error?
- Pastikan `npm run db:push` sudah dijalankan
- Check .env.local ada DATABASE_URL

### Auth tidak work?
- Generate NEXTAUTH_SECRET baru: `openssl rand -base64 32`
- Copy paste ke .env.local

## 🎉 Selesai!

Sekarang Anda punya aplikasi monitoring lengkap:
✅ Dashboard dengan real-time monitoring
✅ Multiple monitor types (HTTP, Ping, TCP, Heartbeat)
✅ Charts dan analytics
✅ Public status page
✅ Notification system
✅ Badge SVG
✅ 2FA support
✅ Dark mode

## 💡 Next Steps

1. Tambah monitor untuk website/server Anda
2. Setup notification channels
3. Buat status page publik
4. Deploy ke production
5. Share dengan tim!

## 📞 Butuh Bantuan?

- Read: **DEVELOPMENT.md** untuk detail teknis
- Read: **API.md** untuk integration
- Buka issue di GitHub
- Contact: Cecep Azhar

---

**Made with ❤️ in Bandung, Indonesia — Cecep Azhar © 2025**

☕ Support development: https://trakteer.id/cecepazhar
