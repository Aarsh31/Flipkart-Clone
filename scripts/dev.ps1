$root = Split-Path -Parent $PSScriptRoot
$serverPath = Join-Path $root "server"
$clientPath = Join-Path $root "client"

$job = Start-Job -ScriptBlock {
  param($path)
  Set-Location $path
  node src\server.js
} -ArgumentList $serverPath

try {
  Start-Sleep -Seconds 3
  Set-Location $clientPath
  npm run dev
}
finally {
  Stop-Job $job -ErrorAction SilentlyContinue | Out-Null
  Remove-Job $job -ErrorAction SilentlyContinue | Out-Null
}
