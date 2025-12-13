# 🚀 Script de Préparation pour Render

Write-Host "`n=== PRÉPARATION DÉPLOIEMENT RENDER ===" -ForegroundColor Cyan

# Étape 1: Vérifier Git
Write-Host "`n1. Vérification Git..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "   ✓ Repository Git existant" -ForegroundColor Green
} else {
    Write-Host "   → Initialisation Git..." -ForegroundColor Yellow
    git init
    Write-Host "   ✓ Git initialisé" -ForegroundColor Green
}

# Étape 2: Vérifier les fichiers de configuration
Write-Host "`n2. Vérification des fichiers de configuration..." -ForegroundColor Yellow
$files = @(
    "render.yaml",
    "DEPLOIEMENT-RENDER.md",
    "init-render-db.sql",
    "backend\.env.example"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $file manquant!" -ForegroundColor Red
    }
}

# Étape 3: Vérifier les dépendances
Write-Host "`n3. Vérification des dépendances..." -ForegroundColor Yellow
if (Test-Path "backend\node_modules") {
    Write-Host "   ✓ Backend node_modules installés" -ForegroundColor Green
} else {
    Write-Host "   → Installation backend..." -ForegroundColor Yellow
    cd backend
    npm install
    cd ..
    Write-Host "   ✓ Backend prêt" -ForegroundColor Green
}

if (Test-Path "frontend\node_modules") {
    Write-Host "   ✓ Frontend node_modules installés" -ForegroundColor Green
} else {
    Write-Host "   → Installation frontend..." -ForegroundColor Yellow
    cd frontend
    npm install
    cd ..
    Write-Host "   ✓ Frontend prêt" -ForegroundColor Green
}

# Étape 4: Test de build frontend
Write-Host "`n4. Test de build frontend..." -ForegroundColor Yellow
cd frontend
$buildResult = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Build frontend réussi" -ForegroundColor Green
} else {
    Write-Host "   ✗ Erreur de build frontend" -ForegroundColor Red
    Write-Host $buildResult
}
cd ..

# Étape 5: Préparer Git
Write-Host "`n5. Préparation Git..." -ForegroundColor Yellow
Write-Host "   → Ajout des fichiers..." -ForegroundColor Yellow
git add .
git status

Write-Host "`n=== PROCHAINES ÉTAPES ===" -ForegroundColor Cyan
Write-Host "1. Créez un commit:" -ForegroundColor Yellow
Write-Host "   git commit -m 'Prêt pour déploiement Render'" -ForegroundColor White
Write-Host "`n2. Créez un repository GitHub:" -ForegroundColor Yellow
Write-Host "   https://github.com/new" -ForegroundColor White
Write-Host "`n3. Poussez le code:" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/VOTRE_USERNAME/luchnos.git" -ForegroundColor White
Write-Host "   git branch -M main" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host "`n4. Suivez le guide DEPLOIEMENT-RENDER.md" -ForegroundColor Yellow
Write-Host "`n==================================`n" -ForegroundColor Cyan
