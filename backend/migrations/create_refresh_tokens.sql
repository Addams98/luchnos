-- 🔒 Migration : Table pour les refresh tokens JWT
-- Permet la rotation des tokens et la révocation lors de la déconnexion

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_refresh_token UNIQUE (user_id)
);

-- Index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Fonction de nettoyage automatique des tokens expirés
CREATE OR REPLACE FUNCTION clean_expired_refresh_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM refresh_tokens WHERE expires_at < NOW() OR revoked = true;
END;
$$ LANGUAGE plpgsql;

-- Commentaires pour documentation
COMMENT ON TABLE refresh_tokens IS 'Stocke les refresh tokens JWT pour l''authentification sécurisée';
COMMENT ON COLUMN refresh_tokens.token IS 'Token de rafraîchissement cryptographiquement sécurisé (64 bytes hex)';
COMMENT ON COLUMN refresh_tokens.expires_at IS 'Date d''expiration du token (7 jours par défaut)';
COMMENT ON COLUMN refresh_tokens.revoked IS 'true si le token a été révoqué (déconnexion manuelle)';
