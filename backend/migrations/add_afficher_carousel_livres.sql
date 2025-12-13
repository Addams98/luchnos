-- Ajouter la colonne afficher_carousel à la table livres
ALTER TABLE livres 
ADD COLUMN afficher_carousel BOOLEAN DEFAULT TRUE AFTER gratuit;
