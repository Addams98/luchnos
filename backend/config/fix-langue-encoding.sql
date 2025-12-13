-- Correction des encodages de langues dans la table livres
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Corriger Français
UPDATE livres SET langue = 'Français' WHERE langue REGEXP 'fran|Fran';

-- Vérifier le résultat
SELECT DISTINCT langue FROM livres;
