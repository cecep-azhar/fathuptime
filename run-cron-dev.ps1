# Script untuk menjalankan cron job setiap menit di development
Write-Host "=== FathUptime Development Cron Runner ===" -ForegroundColor Cyan
Write-Host "Menjalankan monitor checks setiap 60 detik..." -ForegroundColor Green
Write-Host "Tekan Ctrl+C untuk berhenti`n" -ForegroundColor Yellow

$cronUrl = "http://localhost:3000/api/cron/check"
$cronSecret = "dev-cron-secret-12345"

while ($true) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] Menjalankan monitor check..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri $cronUrl `
            -Method GET `
            -Headers @{
                "Authorization" = "Bearer $cronSecret"
            } `
            -UseBasicParsing
        
        $result = $response.Content | ConvertFrom-Json
        Write-Host "[$timestamp] Sukses - Checked: $($result.checked) / Total: $($result.total)" -ForegroundColor Green
    }
    catch {
        Write-Host "[$timestamp] Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "Menunggu 60 detik...`n" -ForegroundColor Gray
    Start-Sleep -Seconds 60
}
