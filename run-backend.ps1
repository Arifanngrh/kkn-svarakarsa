Set-Location "$PSScriptRoot\backend"
if (!(Test-Path ".venv\Scripts\Activate.ps1")) {
  python -m venv .venv
}
.\.venv\Scripts\Activate.ps1
if (!(Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Created backend\.env. Update DATABASE_URL and secrets first." -ForegroundColor Yellow
}
pip install -r requirements.txt
uvicorn app.main:app --reload
