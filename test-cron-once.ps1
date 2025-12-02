# Script untuk menjalankan cron check sekali saja (testing)
$cronUrl = "http://localhost:3000/api/cron/check"
$cronSecret = "dev-cron-secret-12345"

Write-Host "Menjalankan monitor check..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri $cronUrl `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer $cronSecret"
        } `
        -UseBasicParsing
    
    $result = $response.Content | ConvertFrom-Json
    Write-Host "Sukses!" -ForegroundColor Green
    Write-Host "Checked: $($result.checked)" -ForegroundColor Yellow
    Write-Host "Total: $($result.total)" -ForegroundColor Yellow
    Write-Host "`nResponse:" -ForegroundColor Gray
    $result | ConvertTo-Json
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
