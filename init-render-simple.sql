-- ============================================
-- SCRIPT D'INITIALISATION POUR RENDER
-- À exécuter via Query ou PSQL Command
-- ============================================

-- 1. Créer l'utilisateur admin avec mot de passe hashé
INSERT INTO utilisateurs (nom, email, mot_de_passe, role, created_at) 
VALUES (
  'Admin',
  'admin@luchnos.com',
  '$2a$10$8K1p/a0dL2LzfHNE5nqByu94BLqmWQ9n8xF/l8dCPU4OAK0C/pXl2',
  'admin',
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- 2. Insérer les paramètres du site
INSERT INTO parametres_site (nom_site, description_site, email_contact, telephone_contact, adresse, created_at)
VALUES (
  'Luchnos - Lampe Allumée',
  'Présenter Yéhoshoua (Jésus) car il est le salut des humains et il revient',
  'contact@luchnos.com',
  '+33 1 23 45 67 89',
  'France',
  NOW()
) ON CONFLICT DO NOTHING;

-- 3. Vérifier l'admin créé
SELECT id, nom, email, role FROM utilisateurs WHERE role = 'admin';
