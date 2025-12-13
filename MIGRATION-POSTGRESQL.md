# Migration vers PostgreSQL - Guide Complet

## 📋 Prérequis

### 1. Installer PostgreSQL

**Option 1: Téléchargement direct**
- Téléchargez depuis: https://www.postgresql.org/download/windows/
- Version recommandée: PostgreSQL 15 ou 16
- Lors de l'installation, définissez le mot de passe: `WILFRIED98`

**Option 2: Avec winget (Windows)**
```powershell
winget install PostgreSQL.PostgreSQL
```

### 2. Vérifier l'installation
```powershell
psql --version
```

## 🚀 Étapes de Migration

### Étape 1: Configuration automatique

Exécutez le script de configuration :
```powershell
cd c:\Luchnos\backend\config
.\setup-postgresql.bat
```

Ce script va :
- ✅ Créer la base de données `luchnos_db`
- ✅ Créer toutes les tables
- ✅ Copier le fichier `.env` avec les bonnes configurations
- ✅ Installer le package `pg` (PostgreSQL client)

### Étape 2: Migrer les données existantes (Optionnel)

Si vous avez des données dans MySQL que vous voulez conserver :

```powershell
cd c:\Luchnos\backend
node scripts/migrate-mysql-to-postgresql.js
```

### Étape 3: Créer un utilisateur admin

```powershell
cd c:\Luchnos\backend
node scripts/create-admin.js
```

**Identifiants par défaut:**
- Email: `admin@luchnos.com`
- Password: `admin123`

⚠️ **Changez ce mot de passe après la première connexion!**

### Étape 4: Démarrer l'application

```powershell
cd c:\Luchnos
.\START.bat
```

Ou démarrer séparément :
```powershell
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run dev
```

## 🔧 Configuration Manuelle (si nécessaire)

### Créer la base de données manuellement

```sql
-- Se connecter à PostgreSQL
psql -U postgres

-- Créer la base de données
CREATE DATABASE luchnos_db WITH ENCODING 'UTF8';

-- Se connecter à la base
\c luchnos_db

-- Exécuter le schéma
\i 'C:/Luchnos/backend/config/postgresql-schema.sql'
```

### Fichier .env

Assurez-vous que `backend/.env` contient :

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=WILFRIED98
DB_NAME=luchnos_db
DB_PORT=5432
```

## 🐘 Commandes PostgreSQL Utiles

### Se connecter à la base
```powershell
psql -U postgres -d luchnos_db
```

### Lister les tables
```sql
\dt
```

### Voir la structure d'une table
```sql
\d nom_table
```

### Compter les enregistrements
```sql
SELECT COUNT(*) FROM livres;
SELECT COUNT(*) FROM evenements;
SELECT COUNT(*) FROM utilisateurs;
```

### Voir tous les utilisateurs
```sql
SELECT id, nom, email, role FROM utilisateurs;
```

### Réinitialiser la base (ATTENTION: supprime toutes les données)
```sql
DROP DATABASE luchnos_db;
CREATE DATABASE luchnos_db WITH ENCODING 'UTF8';
\c luchnos_db
\i 'C:/Luchnos/backend/config/postgresql-schema.sql'
```

## 🔍 Dépannage

### Erreur: "password authentication failed"
- Vérifiez le mot de passe dans `.env`
- Vérifiez que PostgreSQL accepte les connexions locales
- Fichier de configuration: `C:\Program Files\PostgreSQL\15\data\pg_hba.conf`

### Erreur: "database does not exist"
```sql
CREATE DATABASE luchnos_db;
```

### Erreur: "role does not exist"
```sql
CREATE ROLE postgres WITH LOGIN PASSWORD 'WILFRIED98';
```

### Port déjà utilisé
Vérifier quel processus utilise le port 5432 :
```powershell
netstat -ano | findstr :5432
```

## 📊 Différences MySQL vs PostgreSQL

| Aspect | MySQL | PostgreSQL |
|--------|-------|------------|
| Port par défaut | 3306 | 5432 |
| Auto-increment | AUTO_INCREMENT | SERIAL |
| Boolean | TINYINT(1) | BOOLEAN |
| String | VARCHAR | VARCHAR/TEXT |
| Timestamp | TIMESTAMP | TIMESTAMP |

## 🌐 Pour le Déploiement (Render, Railway, etc.)

Les variables d'environnement seront fournies automatiquement par l'hébergeur.

Exemple pour Render :
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

Le fichier `database.js` détectera automatiquement `DATABASE_URL`.

## ✅ Vérification Finale

Testez l'API :
```powershell
# Backend doit être démarré
curl http://localhost:5000/api/livres
curl http://localhost:5000/api/evenements
```

Si tout fonctionne, vous devriez voir les données en JSON ! 🎉

## 📞 Support

En cas de problème :
1. Vérifiez les logs du serveur backend
2. Vérifiez la connexion PostgreSQL
3. Vérifiez le fichier `.env`
4. Consultez les logs PostgreSQL
