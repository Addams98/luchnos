-- Script d'importation pour la base de données Luchnos
-- Base de données déjà créée: luchnos

USE luchnos;

-- Suppression des tables si elles existent déjà
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS newsletter;
DROP TABLE IF EXISTS temoignages;
DROP TABLE IF EXISTS multimedia;
DROP TABLE IF EXISTS livres;
DROP TABLE IF EXISTS evenements;

-- Table des événements
CREATE TABLE evenements (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des livres (Édition Plumage)
CREATE TABLE livres (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des vidéos/multimédia
CREATE TABLE multimedia (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des témoignages
CREATE TABLE temoignages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  temoignage TEXT NOT NULL,
  photo_url VARCHAR(500),
  approuve BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table newsletter
CREATE TABLE newsletter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  nom VARCHAR(255),
  actif BOOLEAN DEFAULT TRUE,
  date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table contacts
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  sujet VARCHAR(255),
  message TEXT NOT NULL,
  telephone VARCHAR(50),
  lu BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion de données exemple
INSERT INTO evenements (titre, description, date_evenement, heure_evenement, lieu, image_url, type_evenement, statut) VALUES
('Conférence Prophétique 2024', 'Une soirée de révélation et d''enseignement sur les temps de la fin', '2024-12-15', '19:00:00', 'Salle de conférence', '/assets/event-community.jpg', 'conference', 'a_venir'),
('Séminaire de Formation', 'Formation intensive sur l''évangélisation moderne', '2024-12-22', '10:00:00', 'Centre de formation', '/assets/hero-banner-lamp.jpg', 'seminaire', 'a_venir'),
('Culte de Louange', 'Un moment de louange et d''adoration collective', '2024-12-08', '18:00:00', 'Église locale', '/assets/event-community.jpg', 'culte', 'a_venir');

INSERT INTO livres (titre, auteur, description, image_couverture, nombre_pages, categorie, gratuit, date_publication) VALUES
('Les Mystères du Royaume', 'Pasteur Jean-Marie', 'Découvrez les secrets cachés de la Parole de Dieu à travers une étude approfondie des paraboles et enseignements de Jésus.', '/assets/book-cover-3d.jpg', 250, 'Théologie', TRUE, '2024-01-15'),
('La Puissance de la Prière', 'Pasteur Jean-Marie', 'Un guide pratique pour développer une vie de prière efficace et transformer votre relation avec Dieu.', '/assets/book-cover-3d.jpg', 180, 'Spiritualité', TRUE, '2024-03-20');

INSERT INTO multimedia (titre, description, video_url, thumbnail_url, type_media, duree, categorie, date_publication) VALUES
('Les Temps de la Fin - Partie 1', 'Enseignement biblique sur les signes des temps de la fin et le retour de Jésus-Christ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '/assets/video-thumbnail-1.jpg', 'video', '45:30', 'Prophétie', '2024-11-01'),
('L''Évangélisation Moderne', 'Comment partager l''Évangile dans notre société contemporaine', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '/assets/video-thumbnail-2.jpg', 'video', '52:15', 'Évangélisation', '2024-10-15'),
('Le Saint-Esprit et Ses Dons', 'Comprendre l''œuvre du Saint-Esprit et les dons spirituels', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '/assets/video-thumbnail-3.jpg', 'video', '1:02:45', 'Enseignement', '2024-09-20');

INSERT INTO temoignages (nom, temoignage, approuve) VALUES
('Marie Dubois', 'Les enseignements de Luchnos ont transformé ma compréhension de la Parole de Dieu. Je suis maintenant plus proche du Seigneur que jamais.', TRUE),
('Pierre Martin', 'Une source d''inspiration constante pour ma marche avec le Seigneur. Les livres gratuits sont une véritable bénédiction.', TRUE),
('Sarah Lefèvre', 'Les livres gratuits sont une bénédiction pour notre communauté. J''ai pu approfondir ma foi grâce aux ressources disponibles.', TRUE),
('Jean Dupont', 'Les conférences m''ont aidé à comprendre les temps prophétiques dans lesquels nous vivons. Merci pour ce ministère!', TRUE);

-- Afficher le résultat
SELECT 'Base de données luchnos créée avec succès!' as Status;
SELECT COUNT(*) as 'Événements' FROM evenements;
SELECT COUNT(*) as 'Livres' FROM livres;
SELECT COUNT(*) as 'Vidéos' FROM multimedia;
SELECT COUNT(*) as 'Témoignages' FROM temoignages;
