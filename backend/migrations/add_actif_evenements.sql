-- Ajout de la colonne actif dans la table evenements
ALTER TABLE evenements 
ADD COLUMN actif TINYINT(1) DEFAULT 1 AFTER statut;
