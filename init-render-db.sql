-- Script d'initialisation pour déploiement Render
-- Exécutez ce script dans le shell PostgreSQL de Render après création de la base

\echo '=== Création des tables Luchnos ==='

-- Import du schéma complet
\i backend/config/postgresql-schema.sql

\echo '=== Création utilisateur admin ==='

-- Créer l'utilisateur admin par défaut
-- Mot de passe: Admin@123 (hash bcrypt)
INSERT INTO utilisateurs (nom, email, password, role) 
VALUES (
  'Administrateur Luchnos', 
  'admin@luchnos.com', 
  '$2b$10$CwTycUXWue0Thq9StjUM0uJ8qjhg8qWVJVPF.qJP8lhPBh2hXYJBe',
  'admin'
) ON CONFLICT (email) DO NOTHING;

\echo '=== Création paramètres par défaut ==='

-- Paramètres du site
INSERT INTO parametres (cle, valeur, description) VALUES
  ('site_nom', 'Lampe Allumée (Luchnos)', 'Nom du site'),
  ('site_slogan', 'Présenter Yéhoshoua car IL revient', 'Slogan principal'),
  ('contact_email', 'contact@luchnos.org', 'Email de contact'),
  ('contact_telephone', '+243 XXX XXX XXX', 'Téléphone de contact'),
  ('contact_adresse', 'Kinshasa, RDC', 'Adresse physique'),
  ('facebook_url', 'https://facebook.com/luchnos', 'Page Facebook'),
  ('youtube_url', 'https://youtube.com/@luchnos', 'Chaîne YouTube'),
  ('instagram_url', 'https://instagram.com/luchnos', 'Compte Instagram')
ON CONFLICT (cle) DO NOTHING;

\echo '=== Initialisation terminée! ==='
\echo 'Utilisateur admin créé: admin@luchnos.com / Admin@123'
\echo 'IMPORTANT: Changez le mot de passe après la première connexion!'
