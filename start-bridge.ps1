# Start GoldShield AI — Python MT5 Bridge
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  GOLDSHIELD AI — FASTAPI PYTHON MT5 BRIDGE (EA-NEVAN)" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

$pythonExe = "C:\Users\Nevan\AppData\Local\Programs\Python\Python311\python.exe"

if (!(Test-Path $pythonExe)) {
    $pythonExe = "python"
}

Write-Host "Starting Bridge on http://localhost:8000..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\backend"
& $pythonExe main.py

