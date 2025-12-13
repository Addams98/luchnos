#!/usr/bin/env bash
# Script de démarrage pour Render

echo "Installation des dépendances backend..."
cd backend
npm install --production

echo "Démarrage du serveur..."
npm start
