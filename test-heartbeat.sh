#!/bin/bash

# FathUptime - Quick Test Script
# Untuk testing heartbeat endpoint

TOKEN="your-heartbeat-token-here"
API_URL="http://localhost:3000"

echo "🧪 Testing FathUptime Heartbeat Endpoint"
echo "=========================================="
echo ""

# Test 1: Send UP status
echo "📤 Test 1: Sending UP status..."
curl -s "${API_URL}/api/push/${TOKEN}?status=up&msg=All%20systems%20operational&ping=50"
echo ""
echo "✅ UP status sent"
echo ""

sleep 2

# Test 2: Send DOWN status
echo "📤 Test 2: Sending DOWN status..."
curl -s "${API_URL}/api/push/${TOKEN}?status=down&msg=Service%20unavailable&ping=0"
echo ""
echo "❌ DOWN status sent"
echo ""

sleep 2

# Test 3: Send UP status with custom message
echo "📤 Test 3: Sending UP status with custom ping..."
curl -s "${API_URL}/api/push/${TOKEN}?status=up&msg=Backup%20completed&ping=123"
echo ""
echo "✅ UP status with 123ms ping sent"
echo ""

echo "=========================================="
echo "✨ All tests completed!"
echo "Check your dashboard at ${API_URL}/dashboard"
