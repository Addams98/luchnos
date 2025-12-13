const { Pool } = require('pg');
require('dotenv').config();

// Configuration pour Render ou local
const poolConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'WILFRIED98',
      database: process.env.DB_NAME || 'luchnos_db',
      port: parseInt(process.env.DB_PORT) || 5432,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000,
    };

// Créer le pool de connexions PostgreSQL
const pool = new Pool(poolConfig);

// Tester la connexion
pool.connect()
  .then(client => {
    console.log('✅ Connexion à PostgreSQL réussie!');
    client.release();
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à PostgreSQL:', err.message);
  });

// Export direct du pool PostgreSQL
const db = {
  query: async (text, params) => {
    return await pool.query(text, params);
  },
  pool: pool
};

module.exports = db;
