-- Script de nettoyage des vidéos
-- À exécuter sur la console Render PostgreSQL

BEGIN;

-- Étape 1 : Supprimer les doublons (IDs 51-100)
DELETE FROM multimedia WHERE id BETWEEN 51 AND 100;

-- Étape 2 : Corriger les caractères spéciaux dans les titres et descriptions
UPDATE multimedia
SET 
  titre = REPLACE(REPLACE(REPLACE(titre, '&#39;', ''''), ''', ''''), ''', ''''),
  description = CASE 
    WHEN description IS NOT NULL 
    THEN REPLACE(REPLACE(REPLACE(description, '&#39;', ''''), ''', ''''), ''', '''')
    ELSE description
  END;

-- Vérification
SELECT COUNT(*) as total_videos FROM multimedia;
SELECT id, titre FROM multimedia ORDER BY id LIMIT 10;

COMMIT;
