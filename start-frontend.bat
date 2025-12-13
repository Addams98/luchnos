@echo off
title Luchnos Frontend
echo ========================================
echo  Demarrage du site web Luchnos
echo ========================================
echo.

cd /d "%~dp0frontend"

echo Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe!
    pause
    exit /b 1
)

echo Node.js trouve!
echo.
echo Demarrage du site sur http://localhost:3000
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo ========================================
echo.

npm run dev

pause
