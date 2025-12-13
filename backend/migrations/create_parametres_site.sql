-- Migration: Création de la table parametres_site
-- Date: 2025-12-12

-- Table parametres_site
CREATE TABLE IF NOT EXISTS parametres_site (
    id SERIAL PRIMARY KEY,
    cle VARCHAR(100) UNIQUE NOT NULL,
    valeur TEXT,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger pour updated_at
CREATE TRIGGER update_parametres_site_updated_at 
    BEFORE UPDATE ON parametres_site 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insérer les paramètres par défaut (liens sociaux)
INSERT INTO parametres_site (cle, valeur, description) VALUES
    ('facebook_url', '', 'Lien vers la page Facebook'),
    ('youtube_url', '', 'Lien vers la chaîne YouTube'),
    ('instagram_url', '', 'Lien vers le compte Instagram'),
    ('twitter_url', '', 'Lien vers le compte Twitter'),
    ('whatsapp_url', '', 'Lien ou numéro WhatsApp'),
    ('email_contact', '', 'Email de contact principal')
ON CONFLICT (cle) DO NOTHING;

-- Index
CREATE INDEX IF NOT EXISTS idx_parametres_cle ON parametres_site(cle);

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Table parametres_site créée avec succès!';
END $$;
