# Deployment Checklist untuk FathUptime

## ✅ Pre-Deployment

### 1. Environment Variables
- [ ] `DATABASE_URL` - Turso database URL
- [ ] `DATABASE_AUTH_TOKEN` - Turso auth token
- [ ] `NEXTAUTH_URL` - Production URL (https://yourdomain.com)
- [ ] `NEXTAUTH_SECRET` - Generate: `openssl rand -base64 32`
- [ ] `CRON_SECRET` - Random secret key untuk cron endpoint
- [ ] `GOOGLE_CLIENT_ID` (optional) - Google OAuth
- [ ] `GOOGLE_CLIENT_SECRET` (optional) - Google OAuth
- [ ] `RESEND_API_KEY` (optional) - Email notifications
- [ ] `EMAIL_FROM` (optional) - Sender email address

### 2. Database Setup

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create production database
turso db create fathuptime-prod

# Get credentials
turso db show fathuptime-prod

# Copy URL and token to Vercel environment variables
```

### 3. Code Review
- [ ] Semua fitur tested
- [ ] No console.log di production code
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Mobile responsive checked

## 🚀 Vercel Deployment

### Step 1: Push to GitHub

```bash
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables

Add all variables from checklist above in Vercel dashboard.

### Step 4: Deploy

Click "Deploy" and wait for build to complete.

### Step 5: Verify Cron Jobs

Vercel automatically detects `vercel.json` and creates cron job for `/api/cron/check`.

Verify in: Dashboard → Settings → Crons

## ✅ Post-Deployment

### 1. Test Basic Functions
- [ ] Login/Register works
- [ ] Create monitor works
- [ ] Dashboard displays correctly
- [ ] Monitor detail page works
- [ ] Status page accessible

### 2. Test Monitoring
- [ ] Create HTTP monitor
- [ ] Wait 1 minute for cron to run
- [ ] Check if logs appear
- [ ] Verify status updates

### 3. Test Heartbeat
```bash
curl "https://yourdomain.com/api/push/TOKEN?status=up&msg=test&ping=50"
```

### 4. Test Notifications
- [ ] Setup notification channel
- [ ] Trigger alert (make monitor go down)
- [ ] Verify notification received

### 5. Test Status Page
- [ ] Create status page
- [ ] Access public URL
- [ ] Check if monitors display
- [ ] Verify badge SVG works

## 📊 Monitoring Production

### Check Logs
```bash
vercel logs
```

### Database Stats
```bash
turso db inspect fathuptime-prod
```

### Performance
- Check Vercel Analytics
- Monitor response times
- Check error rates

## 🔒 Security

- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] CRON_SECRET is set and secure
- [ ] Database credentials not exposed
- [ ] No sensitive data in client-side code
- [ ] CORS properly configured (if needed)

## 🎯 Optional Enhancements

### Custom Domain
1. Add domain in Vercel dashboard
2. Update DNS records
3. Update NEXTAUTH_URL to new domain

### Email Setup (Resend)
1. Get API key from [resend.com](https://resend.com)
2. Verify domain
3. Add to environment variables

### Google OAuth
1. Create project in Google Cloud Console
2. Setup OAuth consent screen
3. Create credentials (OAuth 2.0 Client ID)
4. Add authorized redirect URIs:
   - `https://yourdomain.com/api/auth/callback/google`

## 📝 Maintenance

### Regular Tasks
- [ ] Monitor database size
- [ ] Clean old logs (if needed)
- [ ] Check for dependencies updates
- [ ] Review error logs
- [ ] Backup database

### Updates
```bash
# Update dependencies
npm update

# Test locally
npm run dev

# Deploy
git push origin main
```

## 🆘 Troubleshooting

### Cron Not Running
- Check CRON_SECRET is set
- Verify vercel.json exists
- Check Vercel cron logs

### Database Errors
- Verify DATABASE_URL and TOKEN
- Check Turso dashboard for issues
- Review Vercel function logs

### Auth Issues
- Verify NEXTAUTH_URL matches domain
- Check NEXTAUTH_SECRET is set
- Review callback URLs for OAuth

---

**Made with ❤️ in Bandung, Indonesia — Cecep Azhar © 2025**
