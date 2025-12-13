-- Migration: Gestion dynamique du contenu de présentation
-- Date: 2025-11-29

-- Table pour le contenu de la page présentation
CREATE TABLE IF NOT EXISTS contenu_presentation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section VARCHAR(100) NOT NULL UNIQUE,
    titre VARCHAR(255),
    contenu TEXT,
    image_url VARCHAR(500),
    ordre INT DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer le contenu par défaut
INSERT INTO contenu_presentation (section, titre, contenu, ordre) VALUES
('hero', 'Notre Vision', 'Présenter Yéhoshoua car IL revient', 1),
('mission_titre', 'Notre Mission', NULL, 2),
('mission_p1', NULL, 'Lampe Allumée (Luchnos) est un ministère dédié à l\'évangélisation et à l\'édification du corps du Christ à travers la parole de Dieu. Notre nom, inspiré de la lampe qui éclaire dans l\'obscurité, symbolise notre mission d\'apporter la lumière du Christ dans un monde qui en a tant besoin.', 3),
('mission_p2', NULL, 'Nous croyons fermement que Yéhoshoua (Jésus-Christ) revient bientôt, et notre appel est de préparer les cœurs à Sa venue. À travers l\'enseignement biblique, la publication de livres chrétiens, et l\'organisation d\'événements spirituels, nous travaillons à équiper les saints pour l\'œuvre du ministère.', 4),
('mission_p3', NULL, 'Notre vision s\'étend au-delà des frontières, touchant les vies par le multimédia, l\'édition, et les rassemblements communautaires. Nous sommes passionnés par la vérité de l\'Évangile et déterminés à la partager avec amour et fidélité.', 5),
('vision', 'Vision pour l\'Avenir', 'Notre vision est de voir une génération transformée par la Parole de Dieu, marchant dans la sainteté et attendant avec espérance le retour glorieux de notre Seigneur Yéhoshoua. Nous aspirons à établir des centres de formation biblique, à multiplier les ressources spirituelles gratuites, et à toucher des millions d\'âmes à travers le monde.', 6);

-- Table pour les valeurs
CREATE TABLE IF NOT EXISTS valeurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    icone VARCHAR(50) DEFAULT 'FaBible',
    ordre INT DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer les valeurs par défaut
INSERT INTO valeurs (titre, description, icone, ordre) VALUES
('Parole de Dieu', 'Nous fondons notre enseignement sur la Parole inspirée de Dieu.', 'FaBible', 1),
('Évangélisation', 'Porter la bonne nouvelle aux quatre coins du monde.', 'FaGlobe', 2),
('Amour', 'L\'amour du Christ est au cœur de notre mission.', 'FaHeart', 3),
('Communauté', 'Édifier et fortifier le corps du Christ ensemble.', 'FaUsers', 4),
('Prière', 'La prière comme fondement de notre ministère.', 'FaPray', 5),
('Esprit Saint', 'Guidés par la puissance du Saint-Esprit.', 'FaFire', 6);
