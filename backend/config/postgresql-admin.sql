-- Créer l'utilisateur admin avec mot de passe hashé (bcrypt)
-- Mot de passe: admin123

INSERT INTO utilisateurs (nom, email, password, role) 
VALUES (
    'Administrateur',
    'admin@luchnos.com',
    '$2a$10$YourHashedPasswordHere', -- À remplacer par le hash bcrypt
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Note: Le mot de passe doit être hashé avec bcrypt avant insertion
-- Vous pouvez utiliser le script create-admin.js pour créer un admin avec mot de passe hashé
