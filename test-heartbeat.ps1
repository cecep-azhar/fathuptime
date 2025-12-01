# PowerShell script untuk testing heartbeat
# Windows version of test-heartbeat.sh

$TOKEN = "your-heartbeat-token-here"
$API_URL = "http://localhost:3000"

Write-Host "🧪 Testing FathUptime Heartbeat Endpoint" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Send UP status
Write-Host "📤 Test 1: Sending UP status..." -ForegroundColor Yellow
$response1 = Invoke-WebRequest -Uri "$API_URL/api/push/$TOKEN?status=up&msg=All%20systems%20operational&ping=50" -Method Get
Write-Host "✅ UP status sent - Response: $($response1.StatusCode)" -ForegroundColor Green
Write-Host ""

Start-Sleep -Seconds 2

# Test 2: Send DOWN status
Write-Host "📤 Test 2: Sending DOWN status..." -ForegroundColor Yellow
$response2 = Invoke-WebRequest -Uri "$API_URL/api/push/$TOKEN?status=down&msg=Service%20unavailable&ping=0" -Method Get
Write-Host "❌ DOWN status sent - Response: $($response2.StatusCode)" -ForegroundColor Red
Write-Host ""

Start-Sleep -Seconds 2

# Test 3: Send UP status with custom message
Write-Host "📤 Test 3: Sending UP status with custom ping..." -ForegroundColor Yellow
$response3 = Invoke-WebRequest -Uri "$API_URL/api/push/$TOKEN?status=up&msg=Backup%20completed&ping=123" -Method Get
Write-Host "✅ UP status with 123ms ping sent - Response: $($response3.StatusCode)" -ForegroundColor Green
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✨ All tests completed!" -ForegroundColor Green
Write-Host "Check your dashboard at $API_URL/dashboard" -ForegroundColor Cyan
