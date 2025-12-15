# 🚀 Migration PostgreSQL sur Render

## ✅ Migration Locale Complétée

La table `refresh_tokens` a été créée avec succès sur votre base de données locale PostgreSQL.

---

## 🌐 Migration sur Render (Production)

### Option 1 : Via Dashboard Render (Recommandé)

1. **Ouvrez le Dashboard Render** : https://dashboard.render.com
2. Cliquez sur votre base de données **"luchnos_db"**
3. Onglet **"Connect"** 
4. Sous **"External Database URL"**, copiez l'URL (format: `postgres://...`)
5. Dans un terminal PowerShell, exécutez :

```powershell
# Remplacez <RENDER_DATABASE_URL> par l'URL copiée
$env:DATABASE_URL="<RENDER_DATABASE_URL>"
cd c:\Luchnos\backend
node scripts/migrate-refresh-tokens-render.js
```

### Option 2 : Via Console Web Render

1. Dashboard Render → Base de données **"luchnos_db"**
2. Onglet **"Connect"**
3. Cliquez sur **"PSQL Command"** (bouton en haut à droite)
4. Copiez la commande complète (commence par `PGPASSWORD=...`)
5. Ouvrez PowerShell et exécutez la commande
6. Une fois connecté, copiez-collez le SQL suivant :

```sql
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_refresh_token UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

CREATE OR REPLACE FUNCTION clean_expired_refresh_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM refresh_tokens WHERE expires_at < NOW() OR revoked = true;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE refresh_tokens IS 'Stocke les refresh tokens JWT pour l''authentification sécurisée';
COMMENT ON COLUMN refresh_tokens.token IS 'Token de rafraîchissement cryptographiquement sécurisé (64 bytes hex)';
COMMENT ON COLUMN refresh_tokens.expires_at IS 'Date d''expiration du token (7 jours par défaut)';
COMMENT ON COLUMN refresh_tokens.revoked IS 'true si le token a été révoqué (déconnexion manuelle)';

-- Vérification
SELECT table_name FROM information_schema.tables WHERE table_name = 'refresh_tokens';
```

7. Vérifiez que le résultat affiche : `refresh_tokens`

---

## 🔍 Vérification de la Migration

Après l'exécution, vérifiez que tout fonctionne :

```sql
-- Vérifier la table
SELECT * FROM refresh_tokens LIMIT 5;

-- Vérifier les colonnes
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'refresh_tokens' ORDER BY ordinal_position;

-- Vérifier les index
SELECT indexname FROM pg_indexes WHERE tablename = 'refresh_tokens';

-- Vérifier la fonction
SELECT proname FROM pg_proc WHERE proname = 'clean_expired_refresh_tokens';
```

Résultat attendu :
- ✅ Table vide (0 lignes)
- ✅ 6 colonnes (id, user_id, token, expires_at, revoked, created_at)
- ✅ 6 index créés
- ✅ 1 fonction créée

---

## 🚨 Important : JWT_SECRET

Après la migration, n'oubliez pas d'ajouter le **JWT_SECRET** dans les variables d'environnement Render :

1. Dashboard Render → Service **"luchnos"** (backend)
2. Onglet **"Environment"**
3. Ajoutez :
   - **Key**: `JWT_SECRET`
   - **Value**: Votre secret généré (voir ACTIONS-REQUISES.md)
4. **Save Changes**

Sans cette variable, le serveur ne démarrera pas en production ! ⚠️

---

## 📝 Notes

- Migration locale : ✅ Terminée
- Migration Render : ⏳ À faire maintenant
- JWT_SECRET : ⏳ À ajouter sur Render

Une fois ces 2 étapes complétées, votre application sera 100% fonctionnelle en production ! 🎉
