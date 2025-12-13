@echo off
title Luchnos Backend Server
echo ========================================
echo  Demarrage du serveur Backend Luchnos
echo ========================================
echo.

cd /d "%~dp0backend"

echo Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe!
    pause
    exit /b 1
)

echo Node.js trouve!
echo.
echo Demarrage du serveur sur http://localhost:5000
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo ========================================
echo.

npm run dev

pause
