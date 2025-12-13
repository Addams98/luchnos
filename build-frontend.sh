#!/bin/bash
# Script de build pour Render
echo "📦 Building Luchnos Frontend..."

# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
echo "📥 Installing dependencies..."
npm install

# Build le projet
echo "🔨 Building..."
npm run build

# Copier le contenu de dist vers la racine pour Render
echo "📋 Copying build to publish directory..."
cd ..
mkdir -p publish
cp -r frontend/dist/* publish/

echo "✅ Build complete! Files in publish/"
ls -la publish/
