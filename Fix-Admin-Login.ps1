# Script PowerShell pour résoudre le problème de login admin
# Luchnos - Lampe Allumée

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SOLUTION AU PROBLEME DE LOGIN ADMIN  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Le problème a été identifié et résolu !" -ForegroundColor Green
Write-Host ""
Write-Host "CAUSE:" -ForegroundColor Yellow
Write-Host "  - Le mot de passe dans la base de données était incorrect" -ForegroundColor White
Write-Host ""
Write-Host "SOLUTION APPLIQUEE:" -ForegroundColor Yellow
Write-Host "  - Mot de passe réinitialisé avec succès" -ForegroundColor Green
Write-Host ""
Write-Host "NOUVELLES CREDENTIALS:" -ForegroundColor Yellow
Write-Host "  Email: admin@luchnos.com" -ForegroundColor White
Write-Host "  Mot de passe: Admin@123" -ForegroundColor White
Write-Host ""

# Vérifier si PostgreSQL est actif
Write-Host "Vérification de PostgreSQL..." -ForegroundColor Cyan
$pgRunning = Get-Process -Name "postgres" -ErrorAction SilentlyContinue
if ($pgRunning) {
    Write-Host "✅ PostgreSQL est actif" -ForegroundColor Green
} else {
    Write-Host "❌ PostgreSQL n'est pas démarré" -ForegroundColor Red
    Write-Host "Veuillez démarrer PostgreSQL avant de continuer." -ForegroundColor Yellow
    Read-Host "Appuyez sur Entrée pour quitter"
    exit
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DEMARRAGE DES SERVEURS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Démarrer le backend
Write-Host "[1/2] Démarrage du backend (port 5000)..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Luchnos' -ForegroundColor Green; node server.js"
Start-Sleep -Seconds 3

# Démarrer le frontend
Write-Host "[2/2] Démarrage du frontend (port 3000)..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend Luchnos' -ForegroundColor Green; npm run dev"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SERVEURS DEMARRES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Admin:    http://localhost:3000/admin/login" -ForegroundColor Green
Write-Host ""
Write-Host "Utilisez les credentials suivants:" -ForegroundColor Yellow
Write-Host "  Email: admin@luchnos.com" -ForegroundColor White
Write-Host "  Mot de passe: Admin@123" -ForegroundColor White
Write-Host ""

# Attendre quelques secondes pour que les serveurs démarrent
Write-Host "Attente du démarrage complet des serveurs..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Ouvrir le navigateur sur la page de login admin
Write-Host "Ouverture de la page de login admin..." -ForegroundColor Cyan
Start-Process "http://localhost:3000/admin/login"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Les serveurs sont en cours d'exécution" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Pour arrêter les serveurs:" -ForegroundColor Yellow
Write-Host "  - Fermez les fenêtres PowerShell du backend et frontend" -ForegroundColor White
Write-Host "  - Ou appuyez sur Ctrl+C dans chaque fenêtre" -ForegroundColor White
Write-Host ""
Write-Host "Documentation complète: SOLUTION-LOGIN-ADMIN.md" -ForegroundColor Cyan
Write-Host ""

Read-Host "Appuyez sur Entrée pour fermer cette fenêtre"
