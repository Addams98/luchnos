@echo off
REM ============================================================
REM    INSTALLATION ET CONFIGURATION POSTGRESQL
REM ============================================================

echo.
echo ============================================================
echo    LUCHNOS - INSTALLATION POSTGRESQL
echo ============================================================
echo.

echo ETAPE 1: Installation de PostgreSQL
echo ────────────────────────────────────────────────────────────
echo.
echo Choisissez une methode d'installation:
echo.
echo [1] Installer avec winget (recommande)
echo [2] Telecharger manuellement
echo [3] J'ai deja PostgreSQL installe
echo.
set /p choice="Votre choix (1, 2 ou 3): "

if "%choice%"=="1" (
    echo.
    echo Installation de PostgreSQL avec winget...
    winget install PostgreSQL.PostgreSQL
    
    if %errorlevel% neq 0 (
        echo.
        echo [ERREUR] Installation echouee
        echo Essayez l'option 2 ou installez manuellement
        pause
        exit /b 1
    )
    
    echo.
    echo [OK] PostgreSQL installe !
    echo.
    echo IMPORTANT: Lors de l'installation, utilisez le mot de passe: WILFRIED98
    echo.
    pause
)

if "%choice%"=="2" (
    echo.
    echo Ouverture de la page de telechargement...
    start https://www.postgresql.org/download/windows/
    echo.
    echo 1. Telechargez PostgreSQL 15 ou 16
    echo 2. Installez avec le mot de passe: WILFRIED98
    echo 3. Revenez ici et appuyez sur une touche quand c'est fait
    echo.
    pause
)

if "%choice%"=="3" (
    echo.
    echo Verification de PostgreSQL...
    where psql >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERREUR] PostgreSQL non detecte dans le PATH
        echo Ajoutez PostgreSQL au PATH ou reinstallez
        pause
        exit /b 1
    )
    echo [OK] PostgreSQL detecte
)

echo.
echo ============================================================
echo ETAPE 2: Configuration de la base de donnees
echo ============================================================
echo.

REM Aller dans le dossier config
cd "%~dp0backend\config"

echo Lancement du script de configuration...
call setup-postgresql.bat

if %errorlevel% neq 0 (
    echo.
    echo [ERREUR] Configuration echouee
    pause
    exit /b 1
)

echo.
echo ============================================================
echo ETAPE 3: Creation de l'administrateur
echo ============================================================
echo.

cd "%~dp0backend"
node scripts\create-admin.js

echo.
echo ============================================================
echo    INSTALLATION TERMINEE !
echo ============================================================
echo.
echo Prochaines etapes:
echo.
echo 1. Lancez l'application avec: START.bat
echo 2. Connectez-vous avec:
echo    - Email: admin@luchnos.com
echo    - Password: admin123
echo.
echo 3. Changez le mot de passe admin immediatement !
echo.
echo Pour migrer vos anciennes donnees MySQL:
echo    node backend\scripts\migrate-mysql-to-postgresql.js
echo.
pause
