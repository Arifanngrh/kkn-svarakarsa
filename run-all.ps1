$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Start-Process powershell.exe -ArgumentList @(
  "-NoExit",
  "-ExecutionPolicy", "Bypass",
  "-File", "$root\run-backend.ps1"
)

Start-Process powershell.exe -ArgumentList @(
  "-NoExit",
  "-ExecutionPolicy", "Bypass",
  "-File", "$root\run-frontend.ps1"
)

Write-Host "Backend dan frontend sedang dibuka di dua jendela PowerShell." -ForegroundColor Green
Write-Host "Website: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Admin  : http://localhost:5173/admin" -ForegroundColor Cyan
