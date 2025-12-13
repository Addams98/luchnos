# Script PowerShell pour configurer la base de données Luchnos
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Configuration Base de Données Luchnos" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Chemin vers MySQL de XAMPP
$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"
$sqlFile = Join-Path $PSScriptRoot "backend\config\database.sql"

# Vérifier que MySQL existe
if (-not (Test-Path $mysqlPath)) {
    Write-Host "ERREUR: MySQL introuvable!" -ForegroundColor Red
    Write-Host "Chemin attendu: $mysqlPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Vérifiez que XAMPP est installé correctement." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "MySQL trouvé!" -ForegroundColor Green
Write-Host ""

# Vérifier que le fichier SQL existe
if (-not (Test-Path $sqlFile)) {
    Write-Host "ERREUR: Fichier SQL introuvable!" -ForegroundColor Red
    Write-Host "Chemin attendu: $sqlFile" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Importation de la base de données 'luchnos'..." -ForegroundColor Yellow
Write-Host ""

# Importer la base de données
try {
    $result = & $mysqlPath -u root -e "source $sqlFile" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host " Base de données créée avec succès!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "La base de données 'luchnos' a été créée avec:" -ForegroundColor White
        Write-Host "- Tables: evenements, livres, multimedia, temoignages, newsletter, contacts" -ForegroundColor White
        Write-Host "- Données de test incluses" -ForegroundColor White
        Write-Host ""
        Write-Host "Vous pouvez maintenant démarrer le serveur backend." -ForegroundColor Cyan
        Write-Host ""
    } else {
        throw "Erreur lors de l'importation"
    }
} catch {
    Write-Host ""
    Write-Host "ERREUR lors de l'importation!" -ForegroundColor Red
    Write-Host "Vérifiez que:" -ForegroundColor Yellow
    Write-Host "1. XAMPP MySQL est démarré" -ForegroundColor Yellow
    Write-Host "2. Vous avez les droits nécessaires" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Détails de l'erreur:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
