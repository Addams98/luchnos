-- Table pour les pensées de l'administrateur
CREATE TABLE IF NOT EXISTS pensees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titre VARCHAR(255),
  contenu TEXT NOT NULL,
  image_url VARCHAR(500),
  type_periode ENUM('semaine', 'mois') DEFAULT 'semaine',
  date_debut DATE,
  date_fin DATE,
  actif BOOLEAN DEFAULT TRUE,
  ordre INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_actif (actif),
  INDEX idx_periode (date_debut, date_fin),
  INDEX idx_ordre (ordre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer une pensée exemple
INSERT INTO pensees (titre, contenu, type_periode, date_debut, date_fin, actif, ordre) VALUES
('Pensée de la Semaine', 'Cherchez premièrement le royaume et la justice de Dieu, et toutes ces choses vous seront données par-dessus.', 'semaine', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), TRUE, 1);
