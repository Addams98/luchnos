@echo off
echo ========================================
echo  Configuration Base de Donnees Luchnos
echo ========================================
echo.

REM Chemin vers MySQL de XAMPP (ajustez si necessaire)
set MYSQL_PATH="C:\xampp\mysql\bin\mysql.exe"
set SQL_FILE="%~dp0backend\config\database.sql"

echo Verification de MySQL...
%MYSQL_PATH% --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: MySQL introuvable. Verifiez que XAMPP est installe.
    echo Chemin attendu: C:\xampp\mysql\bin\mysql.exe
    pause
    exit /b 1
)

echo MySQL trouve!
echo.
echo Importation de la base de donnees 'luchnos'...
echo.

REM Importer la base de donnees
%MYSQL_PATH% -u root < %SQL_FILE%

if errorlevel 1 (
    echo.
    echo ERREUR lors de l'importation!
    echo Verifiez que:
    echo 1. XAMPP MySQL est demarre
    echo 2. Le fichier database.sql existe
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Base de donnees creee avec succes!
echo ========================================
echo.
echo La base de donnees 'luchnos' a ete creee avec:
echo - Tables: evenements, livres, multimedia, temoignages, newsletter, contacts
echo - Donnees de test incluses
echo.
echo Vous pouvez maintenant demarrer le serveur backend.
echo.
pause
