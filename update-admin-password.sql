-- Mise à jour du mot de passe admin
-- Mot de passe: Admin@123
UPDATE utilisateurs 
SET mot_de_passe = '$2b$10$fVKWziKg.0XbYpbPe1qpYeaFkznCEXDlgcyk4tiMoATRXTaewHhqO'
WHERE email = 'admin@luchnos.com';

-- Vérification
SELECT id, nom, email, role, LEFT(mot_de_passe, 30) as password_hash 
FROM utilisateurs 
WHERE email = 'admin@luchnos.com';
