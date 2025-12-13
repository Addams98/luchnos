-- Ajout de la table utilisateurs pour l'administration
CREATE TABLE IF NOT EXISTS utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL,
  role ENUM('admin', 'redacteur') DEFAULT 'redacteur',
  actif BOOLEAN DEFAULT TRUE,
  derniere_connexion TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertion d'un utilisateur administrateur par défaut
-- Mot de passe: Admin@123 (À CHANGER IMMÉDIATEMENT EN PRODUCTION!)
INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES
('Administrateur', 'admin@luchnos.com', '$2a$10$xQZ7vKx3m5L8nH9YpTGc7.eR5tQJYvF.F3nZ8QWLYx9KpNmC4D7gq', 'admin');

-- Ajout de champs pour améliorer les tables existantes

-- Table livres: Ajouter langue, thème, ISBN
ALTER TABLE livres 
ADD COLUMN langue VARCHAR(50) DEFAULT 'français',
ADD COLUMN theme VARCHAR(100),
ADD COLUMN isbn VARCHAR(20),
ADD COLUMN epub_url VARCHAR(500),
ADD COLUMN disponible_lecture BOOLEAN DEFAULT TRUE,
ADD COLUMN disponible_telechargement BOOLEAN DEFAULT TRUE;

-- Table multimedia: Ajouter auteur, année, source YouTube
ALTER TABLE multimedia 
ADD COLUMN auteur VARCHAR(255),
ADD COLUMN annee_publication YEAR,
ADD COLUMN youtube_id VARCHAR(50),
ADD COLUMN source VARCHAR(100) DEFAULT 'youtube';

-- Table événements: Ajouter galerie
ALTER TABLE evenements 
ADD COLUMN galerie_images TEXT COMMENT 'JSON array of image URLs',
ADD COLUMN nombre_participants INT DEFAULT 0,
ADD COLUMN organisateur VARCHAR(255);

-- Table pour les paramètres du site
CREATE TABLE IF NOT EXISTS parametres_site (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cle VARCHAR(100) NOT NULL UNIQUE,
  valeur TEXT,
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertion des paramètres par défaut
INSERT INTO parametres_site (cle, valeur, description) VALUES
('site_nom', 'Lampe Allumée (Luchnos)', 'Nom du site'),
('site_description', 'Présenter Yéhoshoua car IL revient', 'Description du site'),
('youtube_channel_id', '', 'ID de la chaîne YouTube pour l''import automatique'),
('facebook_url', 'https://facebook.com/luchnos', 'Lien Facebook'),
('youtube_url', 'https://youtube.com/@luchnos', 'Lien YouTube'),
('instagram_url', 'https://instagram.com/luchnos', 'Lien Instagram'),
('twitter_url', 'https://twitter.com/luchnos', 'Lien Twitter'),
('email_contact', 'contact@luchnos.com', 'Email de contact'),
('telephone_contact', '+33 1 23 45 67 89', 'Téléphone de contact'),
('adresse_postale', 'Adresse du ministère', 'Adresse postale');
