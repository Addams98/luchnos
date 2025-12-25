@echo off
echo ========================================
echo   SOLUTION AU PROBLEME DE LOGIN ADMIN
echo ========================================
echo.
echo Le probleme a ete identifie et resolu !
echo.
echo CAUSE:
echo   - Le mot de passe dans la base de donnees etait incorrect
echo.
echo SOLUTION APPLIQUEE:
echo   - Mot de passe reinitialise avec succes
echo.
echo NOUVELLES CREDENTIALS:
echo   Email: admin@luchnos.com
echo   Mot de passe: Admin@123
echo.
echo ========================================
echo   DEMARRAGE DES SERVEURS
echo ========================================
echo.

REM Demarrer le backend
echo [1/2] Demarrage du backend (port 5000)...
start "Backend Luchnos" cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 3 /nobreak >nul

REM Demarrer le frontend
echo [2/2] Demarrage du frontend (port 3000)...
start "Frontend Luchnos" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   SERVEURS DEMARRES
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo Admin:    http://localhost:3000/admin/login
echo.
echo Utilisez les credentials suivants:
echo   Email: admin@luchnos.com
echo   Mot de passe: Admin@123
echo.
echo Appuyez sur une touche pour ouvrir la page de login admin...
pause >nul

REM Ouvrir le navigateur sur la page de login admin
start http://localhost:3000/admin/login

echo.
echo Les serveurs sont en cours d'execution dans des fenetres separees.
echo Fermez ces fenetres pour arreter les serveurs.
echo.
pause
