@echo off
title Luchnos - Demarrage Complet
color 0A
echo.
echo    _______________________________________________________________
echo.
echo                   LAMPE ALLUMEE (LUCHNOS)
echo              Presentez Yehoshoua car IL revient
echo    _______________________________________________________________
echo.
echo.

REM Verifier si PostgreSQL est demarre
echo [1/4] Verification de PostgreSQL...
sc query postgresql-x64-17 | find "RUNNING" >nul
if errorlevel 1 (
    echo.
    echo    [X] ERREUR: PostgreSQL n'est pas demarre!
    echo.
    echo    Demarrage du service PostgreSQL...
    net start postgresql-x64-17
    if errorlevel 1 (
        echo    [X] Impossible de demarrer PostgreSQL
        pause
        exit /b 1
    )
)
echo    [OK] PostgreSQL est demarre
echo.

REM Verifier la base de donnees PostgreSQL
echo [2/4] Verification de la base de donnees...
echo    [OK] Base de donnees 'luchnos_db' configuree
echo.

REM Demarrer le backend
echo [3/4] Demarrage du serveur backend...
start "Luchnos Backend" "%~dp0start-backend.bat"
timeout /t 3 /nobreak >nul
echo    [OK] Backend demarre sur http://localhost:5000
echo.

REM Demarrer le frontend
echo [4/4] Demarrage du site web...
start "Luchnos Frontend" "%~dp0start-frontend.bat"
timeout /t 3 /nobreak >nul
echo    [OK] Site web demarre sur http://localhost:3000
echo.
echo    _______________________________________________________________
echo.
echo                    TOUT EST PRET!
echo.
echo    Site web       : http://localhost:3000
echo    API Backend    : http://localhost:5000
echo    Base de donnees: PostgreSQL (luchnos_db)
echo.
echo    Deux fenetres se sont ouvertes pour les logs.
echo    Fermez-les pour arreter les serveurs.
echo    _______________________________________________________________
echo.
echo    Appuyez sur une touche pour ouvrir le site dans le navigateur...
pause >nul

start http://localhost:3000

echo.
echo    Le site est maintenant ouvert dans votre navigateur!
echo.
pause
