Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "                 SARKARAI OS SMART SYSTEM RUNNER                    " -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " Optimized for Lucknow Smart Governance Hackathon runs (Windows PowerShell) " -ForegroundColor Gray
Write-Host ""

# Set CWD to workspace path
$WorkspacePath = "d:\Hackathon\2026\APL\final"
Set-Location $WorkspacePath

# 1. Bootstrapping & Launching Python Backend on Port 8000
Write-Host "[1/3] Spawning Python FastAPI Backend Service..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$WorkspacePath\backend'; Write-Host 'Installing dependencies...' -ForegroundColor Cyan; pip install -r requirements.txt; Write-Host 'Booting Awadh Engine on http://localhost:8000...' -ForegroundColor Green; `$env:PYTHONPATH='.'; python app/main.py"

# 2. Bootstrapping & Launching Next.js Frontend on Port 3000
Write-Host "[2/3] Spawning Next.js Development Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$WorkspacePath'; Write-Host 'Installing frontend dependencies (with legacy-peer-deps)...' -ForegroundColor Cyan; npm install --legacy-peer-deps; Write-Host 'Starting Next.js dev server on http://localhost:3000...' -ForegroundColor Green; npm run dev"

# 3. Launching Browser to Smart City Portal
Write-Host "[3/3] Awaiting server boot..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

Write-Host "---------------------------------------------------------------------" -ForegroundColor Green
Write-Host " SARKARAI OS ONLINE: मुस्कुराइयौ भैया, आप लखनऊ में हैं! " -ForegroundColor Green
Write-Host " Opening http://localhost:3000 in your browser..." -ForegroundColor Green
Write-Host "---------------------------------------------------------------------" -ForegroundColor Green

Start-Process "http://localhost:3000"
