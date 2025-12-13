-- Création de la base de données
CREATE DATABASE IF NOT EXISTS luchnos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE luchnos;

-- Table des événements
CREATE TABLE IF NOT EXISTS evenements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  date_evenement DATE NOT NULL,
  heure_evenement TIME,
  lieu VARCHAR(255),
  image_url VARCHAR(500),
  type_evenement ENUM('conference', 'seminaire', 'culte', 'autre') DEFAULT 'autre',
  statut ENUM('a_venir', 'en_cours', 'termine') DEFAULT 'a_venir',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des livres (Édition Plumage)
CREATE TABLE IF NOT EXISTS livres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  auteur VARCHAR(255) NOT NULL,
  description TEXT,
  image_couverture VARCHAR(500),
  pdf_url VARCHAR(500),
  nombre_pages INT,
  categorie VARCHAR(100),
  prix DECIMAL(10,2) DEFAULT 0.00,
  gratuit BOOLEAN DEFAULT TRUE,
  date_publication DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des vidéos/multimédia
CREATE TABLE IF NOT EXISTS multimedia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  video_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  type_media ENUM('video', 'audio', 'podcast') DEFAULT 'video',
  duree VARCHAR(20),
  categorie VARCHAR(100),
  vues INT DEFAULT 0,
  date_publication DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des témoignages
CREATE TABLE IF NOT EXISTS temoignages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  temoignage TEXT NOT NULL,
  photo_url VARCHAR(500),
  approuve BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table newsletter
CREATE TABLE IF NOT EXISTS newsletter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  nom VARCHAR(255),
  actif BOOLEAN DEFAULT TRUE,
  date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table contacts
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  sujet VARCHAR(255),
  message TEXT NOT NULL,
  telephone VARCHAR(50),
  lu BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de données exemple
INSERT INTO evenements (titre, description, date_evenement, heure_evenement, lieu, image_url, type_evenement) VALUES
('Conférence Prophétique 2024', 'Une soirée de révélation et d''enseignement sur les temps de la fin', '2024-12-15', '19:00:00', 'Salle de conférence', '/assets/event-community.jpg', 'conference'),
('Séminaire de Formation', 'Formation intensive sur l''évangélisation moderne', '2024-12-22', '10:00:00', 'Centre de formation', '/assets/hero-banner-lamp.jpg', 'seminaire');

INSERT INTO livres (titre, auteur, description, image_couverture, nombre_pages, categorie, gratuit) VALUES
('Les Mystères du Royaume', 'Pasteur Jean-Marie', 'Découvrez les secrets cachés de la Parole', '/assets/book-cover-3d.jpg', 250, 'Théologie', TRUE);

INSERT INTO temoignages (nom, temoignage, approuve) VALUES
('Marie Dubois', 'Les enseignements de Luchnos ont transformé ma compréhension de la Parole de Dieu.', TRUE),
('Pierre Martin', 'Une source d''inspiration constante pour ma marche avec le Seigneur.', TRUE),
('Sarah Lefèvre', 'Les livres gratuits sont une bénédiction pour notre communauté.', TRUE);
