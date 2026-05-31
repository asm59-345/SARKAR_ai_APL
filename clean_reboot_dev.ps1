# SarkarAI OS: Clean Reboot Dev Server
# Run this script to clear webpack chunk mismatches and boot a fresh Next.js Dev Server.

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   SARKARAI OS: CLEAN REBOOT DEV RUN" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Terminate any running Next.js / Node.js dev server processes to release file locks
Write-Host "[1/3] Stopping background dev servers..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Where-Object { 
    $_.CommandLine -like "*next*" -or $_.CommandLine -like "*start-server.js*"
} | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. Securely remove the stale build cache
Write-Host "[2/3] Deleting stale .next cache directory..." -ForegroundColor Yellow
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
}

# 3. Clean boot dev server
Write-Host "[3/3] Booting fresh Next.js dev server..." -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
npm run dev
