@echo off
REM Script de configuration PostgreSQL pour Luchnos
REM Base de données: luchnos_db

echo.
echo ============================================================
echo    CONFIGURATION POSTGRESQL POUR LUCHNOS
echo ============================================================
echo.

REM Vérifier si PostgreSQL est installé
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] PostgreSQL n'est pas installe ou pas dans le PATH
    echo.
    echo Telechargez PostgreSQL depuis: https://www.postgresql.org/download/windows/
    echo Ou installez avec: winget install PostgreSQL.PostgreSQL
    echo.
    pause
    exit /b 1
)

echo [OK] PostgreSQL detecte
echo.

REM Définir les variables
set PGPASSWORD=WILFRIED98
set DB_NAME=luchnos_db
set DB_USER=postgres

echo [1/4] Creation de la base de donnees...
psql -U %DB_USER% -h localhost -c "DROP DATABASE IF EXISTS %DB_NAME%;"
psql -U %DB_USER% -h localhost -c "CREATE DATABASE %DB_NAME% WITH ENCODING 'UTF8';"

if %errorlevel% neq 0 (
    echo [ERREUR] Echec de la creation de la base de donnees
    pause
    exit /b 1
)
echo [OK] Base de donnees creee
echo.

echo [2/4] Creation des tables...
psql -U %DB_USER% -h localhost -d %DB_NAME% -f "%~dp0postgresql-schema.sql"

if %errorlevel% neq 0 (
    echo [ERREUR] Echec de la creation des tables
    pause
    exit /b 1
)
echo [OK] Tables creees
echo.

echo [3/4] Copie du fichier .env...
copy /Y "%~dp0.env.postgresql" "%~dp0..\.env"
echo [OK] Fichier .env configure
echo.

echo [4/4] Installation des dependances Node.js...
cd "%~dp0.."
call npm install pg

if %errorlevel% neq 0 (
    echo [ERREUR] Echec de l'installation de pg
    pause
    exit /b 1
)
echo [OK] Dependances installees
echo.

echo ============================================================
echo    CONFIGURATION TERMINEE !
echo ============================================================
echo.
echo Base de donnees : %DB_NAME%
echo Utilisateur     : %DB_USER%
echo Port            : 5432
echo.
echo Prochaines etapes:
echo 1. Verifiez le fichier backend/.env
echo 2. Lancez le serveur avec: npm start
echo 3. Creez un admin avec: node scripts/create-admin.js
echo.
pause
