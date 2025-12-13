-- Ajouter la colonne image_url aux tables versets_hero et pensees
-- pour permettre des images de fond personnalisées

-- Ajout pour versets_hero
ALTER TABLE versets_hero 
ADD COLUMN image_url VARCHAR(500) AFTER reference;

-- Ajout pour pensees
ALTER TABLE pensees 
ADD COLUMN image_url VARCHAR(500) AFTER contenu;
