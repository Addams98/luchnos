-- Script de migration PostgreSQL pour Luchnos
-- Database: luchnos_db

-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS newsletter CASCADE;
DROP TABLE IF EXISTS temoignages CASCADE;
DROP TABLE IF EXISTS multimedia CASCADE;
DROP TABLE IF EXISTS evenements CASCADE;
DROP TABLE IF EXISTS livres CASCADE;
DROP TABLE IF EXISTS versets_hero CASCADE;
DROP TABLE IF EXISTS pensees CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;

-- Table utilisateurs
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'editor')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table versets_hero
CREATE TABLE versets_hero (
    id SERIAL PRIMARY KEY,
    texte TEXT NOT NULL,
    reference VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    actif BOOLEAN DEFAULT TRUE,
    ordre INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pensees
CREATE TABLE pensees (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255),
    contenu TEXT NOT NULL,
    image_url VARCHAR(500),
    type_periode VARCHAR(20) DEFAULT 'semaine' CHECK (type_periode IN ('semaine', 'mois')),
    date_debut DATE,
    date_fin DATE,
    actif BOOLEAN DEFAULT TRUE,
    ordre INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table evenements
CREATE TABLE evenements (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    date_evenement DATE NOT NULL,
    heure_evenement VARCHAR(10),
    lieu VARCHAR(255),
    image_url VARCHAR(500),
    type_evenement VARCHAR(50) DEFAULT 'conference' CHECK (type_evenement IN ('conference', 'seminaire', 'culte', 'reunion', 'autre')),
    statut VARCHAR(20) DEFAULT 'a_venir' CHECK (statut IN ('a_venir', 'en_cours', 'termine')),
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table livres
CREATE TABLE livres (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    description TEXT,
    image_couverture VARCHAR(500),
    pdf_url VARCHAR(500),
    nombre_pages INTEGER,
    categorie VARCHAR(100),
    langue VARCHAR(50) DEFAULT 'Français',
    theme VARCHAR(100),
    isbn VARCHAR(20),
    epub_url VARCHAR(500),
    prix DECIMAL(10,2) DEFAULT 0.00,
    gratuit BOOLEAN DEFAULT TRUE,
    afficher_carousel BOOLEAN DEFAULT TRUE,
    disponible_lecture BOOLEAN DEFAULT TRUE,
    disponible_telechargement BOOLEAN DEFAULT TRUE,
    date_publication DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table multimedia
CREATE TABLE multimedia (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    type_media VARCHAR(50) DEFAULT 'video' CHECK (type_media IN ('video', 'audio', 'podcast')),
    duree VARCHAR(20),
    youtube_id VARCHAR(100),
    vues INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table temoignages
CREATE TABLE temoignages (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    temoignage TEXT NOT NULL,
    approuve BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table newsletter
CREATE TABLE newsletter (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table contacts
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    sujet VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer les index
CREATE INDEX idx_evenements_date ON evenements(date_evenement);
CREATE INDEX idx_evenements_statut ON evenements(statut);
CREATE INDEX idx_livres_auteur ON livres(auteur);
CREATE INDEX idx_livres_categorie ON livres(categorie);
CREATE INDEX idx_contacts_lu ON contacts(lu);
CREATE INDEX idx_newsletter_actif ON newsletter(actif);
CREATE INDEX idx_utilisateurs_email ON utilisateurs(email);
CREATE INDEX idx_versets_actif ON versets_hero(actif);
CREATE INDEX idx_pensees_actif ON pensees(actif);

-- Fonction pour mise à jour automatique du updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_utilisateurs_updated_at BEFORE UPDATE ON utilisateurs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_versets_updated_at BEFORE UPDATE ON versets_hero FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pensees_updated_at BEFORE UPDATE ON pensees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_evenements_updated_at BEFORE UPDATE ON evenements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_livres_updated_at BEFORE UPDATE ON livres FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_multimedia_updated_at BEFORE UPDATE ON multimedia FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_temoignages_updated_at BEFORE UPDATE ON temoignages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Base de données luchnos_db créée avec succès!';
END $$;
