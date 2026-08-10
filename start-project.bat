@echo off
setlocal

cd /d "%~dp0"

if not exist package.json (
  echo package.json tidak ditemukan.
  echo Pastikan file ini berada di folder project hioso-nms-olt.
  pause
  exit /b 1
)

if not exist node_modules (
  echo node_modules belum ada. Menjalankan npm install...
  call npm install
  if errorlevel 1 goto :error
)

echo Menjalankan React dev server...
start "Hioso NMS React" cmd /k "cd /d \"%~dp0\" && set BROWSER=none && npm start"

echo Menunggu http://localhost:3000 siap...
call npx wait-on http://localhost:3000
if errorlevel 1 goto :error

echo Menjalankan Electron...
set NODE_ENV=development
call npx electron .
if errorlevel 1 goto :error

exit /b 0

:error
echo Gagal menjalankan project.
pause
exit /b 1
