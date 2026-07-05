@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found in PATH.
  echo Install Node.js, then run this launcher again.
  echo.
  pause
  exit /b 1
)

echo Starting Space Model Lab v3...
echo Browser URL: http://127.0.0.1:4173/
echo Keep this window open while using the app.
echo.

node tools\serve-local.js --open

echo.
echo Server stopped.
pause
