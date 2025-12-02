# FathUptime Development Guide

## 🚀 Quick Start

1. **Setup Database**
```bash
npm run db:push
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Run Cron Job (Required for monitoring)**

Buka terminal baru dan jalankan:
```bash
# Windows PowerShell
npm run cron:dev

# Linux/Mac
npm run cron:dev:bash
```

**PENTING:** Di development, cron job **TIDAK** berjalan otomatis. Anda harus menjalankan script di atas untuk monitoring bekerja.

4. **Access Application**
- Dashboard: http://localhost:3000/dashboard
- Login: http://localhost:3000/login
- Register: http://localhost:3000/register

## 📁 Project Structure

```
fathuptime/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── monitors/      # Monitor CRUD
│   │   ├── cron/check/    # Background checker
│   │   └── push/[token]/  # Heartbeat endpoint
│   ├── dashboard/         # Main dashboard
│   ├── monitors/[id]/     # Monitor detail page
│   └── status-page/[slug]/ # Public status page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── monitor-card.tsx
│   ├── status-badge.tsx
│   └── uptime-chart.tsx
├── lib/                  # Utilities
│   ├── db/              # Database
│   │   ├── schema.ts    # Drizzle schema
│   │   └── index.ts     # DB client
│   ├── auth.ts          # NextAuth config
│   ├── monitor-checker.ts # Monitor logic
│   └── utils.ts         # Helper functions
└── types/               # TypeScript types
```

## 🗄️ Database Schema

**Tables:**
- `users` - User accounts + 2FA
- `monitors` - Monitor configurations
- `monitor_logs` - Check history
- `status_pages` - Public status pages
- `incidents` - Incident tracking
- `notifications` - Notification logs
- `notification_channels` - Notification settings

## 🔧 Environment Variables

Required for production:
```env
DATABASE_URL="libsql://your-db.turso.io"
DATABASE_AUTH_TOKEN="your-token"
NEXTAUTH_SECRET="generate-with-openssl"
CRON_SECRET="random-secret-key"
```

Optional:
```env
GOOGLE_CLIENT_ID="google-oauth-id"
GOOGLE_CLIENT_SECRET="google-oauth-secret"
RESEND_API_KEY="re_your_key"
```

## 📊 Monitor Types

1. **HTTP/HTTPS** - Check website availability
2. **Keyword** - Check if keyword exists in response
3. **Ping** - ICMP ping check
4. **TCP** - Check if port is open
5. **Heartbeat** - Push-based monitoring

## 🔔 Notification Channels

1. **Email** - via Resend
2. **Telegram** - Bot API
3. **Discord** - Webhook
4. **ntfy.sh** - Push notifications

## 🚀 Deployment

### Vercel
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

Vercel Cron automatically runs `/api/cron/check` every minute.

### Database (Turso)
```bash
# Create database
turso db create fathuptime

# Get connection string
turso db show fathuptime
```

## 🧪 Testing Heartbeat

```bash
# Send heartbeat
curl "http://localhost:3000/api/push/YOUR_TOKEN?status=up&msg=OK&ping=123"
```

## 📝 Development Tips

1. **Hot Reload** - Turbopack enables fast refresh
2. **Database Studio** - `npm run db:studio` to view data
3. **Type Safety** - Full TypeScript support
4. **Dark Mode** - Built-in theme switcher

## 🐛 Troubleshooting

**Database connection error:**
- Check DATABASE_URL in .env.local
- Run `npm run db:push` to create tables

**Auth not working:**
- Generate NEXTAUTH_SECRET with `openssl rand -base64 32`
- Check NEXTAUTH_URL matches your domain

**Cron not triggering:**
- Locally: Call `/api/cron/check` manually
- Vercel: Check CRON_SECRET is set

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [NextAuth v5](https://authjs.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [Turso](https://turso.tech)
