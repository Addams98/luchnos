#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Building Luchnos Frontend...');

try {
  // Aller dans frontend
  process.chdir('frontend');
  
  // Installer
  console.log('📥 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build
  console.log('🔨 Building...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Copier vers publish
  console.log('📋 Copying build to publish directory...');
  process.chdir('..');
  
  const publishDir = path.join(__dirname, 'publish');
  const distDir = path.join(__dirname, 'frontend', 'dist');
  
  // Créer publish si n'existe pas
  if (!fs.existsSync(publishDir)) {
    fs.mkdirSync(publishDir, { recursive: true });
  }
  
  // Copier récursivement
  const copyRecursive = (src, dest) => {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(file => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };
  
  copyRecursive(distDir, publishDir);
  
  console.log('✅ Build complete!');
  console.log('Files in publish:', fs.readdirSync(publishDir));
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
