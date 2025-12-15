# 🔒 Script de Migration - Sécurité JWT avec Refresh Tokens
# À exécuter sur Render via le Dashboard PostgreSQL

## Instructions :
1. Connectez-vous à votre dashboard Render
2. Allez dans votre base de données PostgreSQL "luchnos_db"
3. Cliquez sur "Connect" → "External Connection" ou utilisez la console interne
4. Copiez-collez le contenu du fichier `create_refresh_tokens.sql` dans la console SQL

## Vérification après migration :
```sql
-- Vérifier que la table existe
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'refresh_tokens';

-- Vérifier les colonnes
\d refresh_tokens

-- Tester l'insertion (optionnel)
INSERT INTO refresh_tokens (user_id, token, expires_at) 
VALUES (1, 'test_token_123', NOW() + INTERVAL '7 days');

-- Nettoyer le test
DELETE FROM refresh_tokens WHERE token = 'test_token_123';
```

## Fichier à exécuter :
`backend/migrations/create_refresh_tokens.sql`

## Impact :
- Ajout de la table `refresh_tokens` pour stocker les tokens de rafraîchissement
- Permet la rotation automatique des access tokens (15 minutes de validité)
- Améliore la sécurité : les tokens volés expirent rapidement
- Permet la révocation lors de la déconnexion

## Après la migration :
1. Redéployer le backend sur Render (les nouvelles routes /refresh et /logout seront disponibles)
2. Mettre à jour le frontend pour gérer les refresh tokens
3. Les anciens tokens (24h) continueront de fonctionner pendant la transition
