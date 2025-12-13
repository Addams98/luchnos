-- Migration: Ajouter tables manquantes pour paramètres et liens sociaux

-- Table parametres_site
CREATE TABLE IF NOT EXISTS parametres_site (
    id SERIAL PRIMARY KEY,
    nom_site VARCHAR(255) DEFAULT 'Luchnos - Lampe Allumée',
    description_site TEXT,
    email_contact VARCHAR(255),
    telephone_contact VARCHAR(50),
    adresse TEXT,
    logo_url VARCHAR(500),
    favicon_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table liens_sociaux
CREATE TABLE IF NOT EXISTS liens_sociaux (
    id SERIAL PRIMARY KEY,
    plateforme VARCHAR(50) NOT NULL,
    url VARCHAR(500) NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    ordre INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer des paramètres par défaut si la table est vide
INSERT INTO parametres_site (nom_site, description_site, email_contact, telephone_contact, adresse)
SELECT 
    'Luchnos - Lampe Allumée',
    'Présenter Yéhoshoua (Jésus) car il est le salut des humains et il revient',
    'contact@luchnos.com',
    '+33 1 23 45 67 89',
    'France'
WHERE NOT EXISTS (SELECT 1 FROM parametres_site);

-- Insérer des liens sociaux par défaut
INSERT INTO liens_sociaux (plateforme, url, actif, ordre)
SELECT 'Facebook', 'https://facebook.com/luchnos', true, 1
WHERE NOT EXISTS (SELECT 1 FROM liens_sociaux WHERE plateforme = 'Facebook')
UNION ALL
SELECT 'Twitter', 'https://twitter.com/luchnos', true, 2
WHERE NOT EXISTS (SELECT 1 FROM liens_sociaux WHERE plateforme = 'Twitter')
UNION ALL
SELECT 'YouTube', 'https://youtube.com/@luchnos', true, 3
WHERE NOT EXISTS (SELECT 1 FROM liens_sociaux WHERE plateforme = 'YouTube')
UNION ALL
SELECT 'Instagram', 'https://instagram.com/luchnos', true, 4
WHERE NOT EXISTS (SELECT 1 FROM liens_sociaux WHERE plateforme = 'Instagram');
