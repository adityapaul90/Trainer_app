@echo off
set "NODE22_HOME=C:\Users\Aditya Paul\AppData\Local\node22-portable\node-v22.13.1-win-x64"
set "PATH=%NODE22_HOME%;%PATH%"
cd /d "%~dp0"
echo Node version:
node -v
echo.
npx expo start --port 8081
