#!/bin/bash

# Script untuk menjalankan cron job setiap menit di development
echo "=== FathUptime Development Cron Runner ==="
echo "Menjalankan monitor checks setiap 60 detik..."
echo "Tekan Ctrl+C untuk berhenti"
echo ""

CRON_URL="http://localhost:3000/api/cron/check"
CRON_SECRET="dev-cron-secret-12345"

while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$TIMESTAMP] Menjalankan monitor check..."
    
    RESPONSE=$(curl -s -w "\n%{http_code}" \
        -H "Authorization: Bearer $CRON_SECRET" \
        "$CRON_URL")
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" -eq 200 ]; then
        CHECKED=$(echo "$BODY" | grep -o '"checked":[0-9]*' | grep -o '[0-9]*')
        TOTAL=$(echo "$BODY" | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
        echo "[$TIMESTAMP] ✓ Sukses - Checked: $CHECKED / Total: $TOTAL"
    else
        echo "[$TIMESTAMP] ✗ Error: HTTP $HTTP_CODE"
    fi
    
    echo "Menunggu 60 detik..."
    echo ""
    sleep 60
done
