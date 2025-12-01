# FathUptime API Documentation

## 🔐 Authentication

Sebagian besar endpoint memerlukan authentication. Gunakan session cookie dari NextAuth.

## 📡 Endpoints

### Monitors

#### GET /api/monitors
Ambil semua monitor milik user yang sedang login.

**Response:**
```json
[
  {
    "id": "abc123",
    "name": "Website Saya",
    "type": "http",
    "url": "https://example.com",
    "status": "up",
    "interval": 60,
    "lastCheck": "2025-12-01T10:00:00.000Z"
  }
]
```

#### POST /api/monitors
Buat monitor baru.

**Body:**
```json
{
  "name": "My Website",
  "type": "http",
  "url": "https://example.com",
  "interval": 60,
  "timeout": 30
}
```

**Monitor Types:**
- `http` - HTTP/HTTPS check
- `keyword` - Check jika keyword ada dalam response
- `ping` - ICMP ping check
- `tcp` - TCP port check
- `heartbeat` - Push-based monitoring

**Response:**
```json
{
  "id": "abc123",
  "name": "My Website",
  "type": "http",
  "url": "https://example.com",
  "status": "pending",
  "heartbeatToken": null
}
```

### Heartbeat Push

#### GET /api/push/[token]
Push heartbeat dari aplikasi eksternal.

**Query Parameters:**
- `status` - Status monitor: `up` atau `down`
- `msg` - Pesan/keterangan (optional)
- `ping` - Response time dalam ms (optional)

**Example:**
```bash
curl "https://yourdomain.com/api/push/abc123?status=up&msg=All%20good&ping=50"
```

**Response:**
```json
{
  "ok": true,
  "message": "Heartbeat received"
}
```

### Badge SVG

#### GET /api/badge/[monitorId]
Dapatkan badge SVG untuk monitor.

**Example:**
```markdown
![Status](https://yourdomain.com/api/badge/abc123)
```

**Response:** SVG image
- Green badge: Monitor UP
- Red badge: Monitor DOWN
- Yellow badge: Monitor PENDING
- Gray badge: Unknown

### Cron Checker

#### GET /api/cron/check
Background checker untuk semua monitor (dipanggil oleh Vercel Cron).

**Headers:**
```
Authorization: Bearer YOUR_CRON_SECRET
```

**Response:**
```json
{
  "success": true,
  "checked": 10,
  "total": 15
}
```

## 🔔 Webhook Integration

### Custom Webhook (Coming Soon)

FathUptime akan mendukung custom webhook untuk integrasi dengan sistem lain.

**Payload Example:**
```json
{
  "monitor": {
    "id": "abc123",
    "name": "My Website",
    "url": "https://example.com"
  },
  "event": "down",
  "timestamp": "2025-12-01T10:00:00.000Z",
  "message": "Connection timeout"
}
```

## 💡 Integration Examples

### Shell Script (Cron Job)

```bash
#!/bin/bash
# Send heartbeat setiap 5 menit

TOKEN="your-heartbeat-token"
API_URL="https://yourdomain.com"

# Check if service is running
if systemctl is-active --quiet myservice; then
    STATUS="up"
    MSG="Service running"
else
    STATUS="down"
    MSG="Service stopped"
fi

# Send heartbeat
curl -s "${API_URL}/api/push/${TOKEN}?status=${STATUS}&msg=${MSG}"
```

### Python Script

```python
import requests
import time

TOKEN = "your-heartbeat-token"
API_URL = "https://yourdomain.com"

def send_heartbeat(status="up", message="OK", ping=0):
    url = f"{API_URL}/api/push/{TOKEN}"
    params = {
        "status": status,
        "msg": message,
        "ping": ping
    }
    
    try:
        response = requests.get(url, params=params)
        return response.json()
    except Exception as e:
        print(f"Error: {e}")
        return None

# Send every 60 seconds
while True:
    result = send_heartbeat()
    print(f"Heartbeat sent: {result}")
    time.sleep(60)
```

### Node.js Script

```javascript
const axios = require('axios');

const TOKEN = 'your-heartbeat-token';
const API_URL = 'https://yourdomain.com';

async function sendHeartbeat(status = 'up', message = 'OK', ping = 0) {
  try {
    const response = await axios.get(
      `${API_URL}/api/push/${TOKEN}`,
      {
        params: { status, msg: message, ping }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// Send every 60 seconds
setInterval(async () => {
  const result = await sendHeartbeat();
  console.log('Heartbeat sent:', result);
}, 60000);
```

### Docker Container

```bash
# Add to your docker-compose.yml or run command
docker run -d --name heartbeat \
  --restart unless-stopped \
  alpine/curl:latest \
  sh -c "while true; do curl 'https://yourdomain.com/api/push/TOKEN?status=up'; sleep 60; done"
```

### GitHub Actions

```yaml
name: Heartbeat
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
  workflow_dispatch:

jobs:
  heartbeat:
    runs-on: ubuntu-latest
    steps:
      - name: Send Heartbeat
        run: |
          curl "https://yourdomain.com/api/push/${{ secrets.HEARTBEAT_TOKEN }}?status=up&msg=GitHub%20Actions"
```

### Systemd Service (Linux)

```ini
# /etc/systemd/system/fathuptime-heartbeat.service
[Unit]
Description=FathUptime Heartbeat
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/bash -c 'while true; do curl -s "https://yourdomain.com/api/push/TOKEN?status=up&msg=Server%20OK"; sleep 60; done'
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl enable fathuptime-heartbeat
sudo systemctl start fathuptime-heartbeat
```

## 📊 Rate Limits

- Heartbeat: Unlimited (tapi ikuti interval yang ditentukan)
- Monitor checks: Minimal 30 detik interval
- API calls: 100 requests/minute per user

## 🆘 Error Codes

- `401` - Unauthorized (perlu login)
- `404` - Resource not found
- `429` - Too many requests
- `500` - Internal server error

## 📝 Notes

- Semua timestamps dalam ISO 8601 format (UTC)
- Response time dalam milliseconds
- Status codes: `up`, `down`, `pending`

---

**Made with ❤️ in Bandung, Indonesia — Cecep Azhar © 2025**
