-- Script SQL à exécuter sur Render PostgreSQL Dashboard
-- Pour nettoyer les vidéos en double et corriger les caractères spéciaux

BEGIN;

-- Étape 1: Supprimer les doublons (IDs 51-100)
DELETE FROM multimedia WHERE id >= 51 AND id <= 100;

-- Étape 2: Corriger les caractères spéciaux dans les titres
UPDATE multimedia
SET titre = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    titre,
    '&#39;', ''''
), '&#x27;', ''''
), '&apos;', ''''
), ''', ''''
), ''', ''''
), ''', '''');

-- Étape 3: Corriger les caractères spéciaux dans les descriptions  
UPDATE multimedia
SET description = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    description,
    '&#39;', ''''
), '&#x27;', ''''
), '&apos;', ''''
), ''', ''''
), ''', ''''
), ''', '''')
WHERE description IS NOT NULL;

-- Vérification
SELECT 'Total vidéos:' as info, COUNT(*) as valeur FROM multimedia
UNION ALL
SELECT 'Vidéos avec &#:', COUNT(*) FROM multimedia WHERE titre LIKE '%&#%';

-- Afficher les 10 premières vidéos pour vérification
SELECT id, LEFT(titre, 60) as titre FROM multimedia ORDER BY id LIMIT 10;

COMMIT;

-- Si tout est OK, le COMMIT s'exécutera
-- Sinon, faire ROLLBACK; pour annuler
