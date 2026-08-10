@echo off
setlocal

cd /d "%~dp0"

if not exist package.json (
  echo package.json was not found.
  echo Make sure this file is inside the hioso-nms-olt project folder.
  pause
  exit /b 1
)

if not exist node_modules (
  echo node_modules was not found. Running npm install...
  call npm install
  if errorlevel 1 goto :error
)

echo Starting the React dev server...
start "Hioso NMS React" cmd /k "cd /d \"%~dp0\" && set BROWSER=none && npm start"

echo Waiting for http://localhost:3000...
call npx wait-on http://localhost:3000 --timeout 60000
if errorlevel 1 goto :error

echo Starting Electron...
set NODE_ENV=development
call npx electron .
if errorlevel 1 goto :error

exit /b 0

:error
echo Failed to start the project.
echo Check the "Hioso NMS React" window for React startup errors.
pause
exit /b 1
