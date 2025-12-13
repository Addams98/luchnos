-- Table pour les versets bibliques affichés sur le hero
CREATE TABLE IF NOT EXISTS versets_hero (
  id INT PRIMARY KEY AUTO_INCREMENT,
  texte TEXT NOT NULL,
  reference VARCHAR(100) NOT NULL,
  image_url VARCHAR(500),
  actif BOOLEAN DEFAULT TRUE,
  ordre INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_actif (actif),
  INDEX idx_ordre (ordre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer quelques versets par défaut
INSERT INTO versets_hero (texte, reference, actif, ordre) VALUES
('Car Dieu a tant aimé le monde qu''il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu''il ait la vie éternelle.', 'Jean 3:16', TRUE, 1),
('Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi.', 'Jean 14:6', TRUE, 2),
('Que votre cœur ne se trouble point. Croyez en Dieu, et croyez en moi.', 'Jean 14:1', TRUE, 3);
