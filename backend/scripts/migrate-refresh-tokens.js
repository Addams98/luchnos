// 🔒 Script de migration : Création de la table refresh_tokens
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'luchnos_db',
    port: process.env.DB_PORT || 5432
});

async function runMigration() {
    const client = await pool.connect();
    
    try {
        console.log('🔄 Connexion à PostgreSQL...');
        console.log(`📍 Base de données: ${process.env.DB_NAME}`);
        console.log(`📍 Host: ${process.env.DB_HOST}`);
        
        // Lire le fichier SQL
        const sqlPath = path.join(__dirname, '../migrations/create_refresh_tokens.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('\n🚀 Exécution de la migration...\n');
        
        // Exécuter la migration
        await client.query(sql);
        
        console.log('✅ Migration réussie !');
        console.log('\n📊 Vérification de la table créée...\n');
        
        // Vérifier que la table existe
        const checkTable = await client.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'refresh_tokens'
            ORDER BY ordinal_position;
        `);
        
        if (checkTable.rows.length > 0) {
            console.log('✅ Table "refresh_tokens" créée avec succès !');
            console.log('\nColonnes:');
            checkTable.rows.forEach(row => {
                console.log(`  - ${row.column_name}: ${row.data_type}`);
            });
        } else {
            console.log('❌ Erreur: La table n\'a pas été créée');
        }
        
        // Vérifier les index
        const checkIndexes = await client.query(`
            SELECT indexname 
            FROM pg_indexes 
            WHERE tablename = 'refresh_tokens';
        `);
        
        console.log('\n📑 Index créés:');
        checkIndexes.rows.forEach(row => {
            console.log(`  - ${row.indexname}`);
        });
        
        // Vérifier la fonction
        const checkFunction = await client.query(`
            SELECT proname 
            FROM pg_proc 
            WHERE proname = 'clean_expired_refresh_tokens';
        `);
        
        if (checkFunction.rows.length > 0) {
            console.log('\n✅ Fonction "clean_expired_refresh_tokens" créée avec succès !');
        }
        
        console.log('\n🎉 Migration terminée avec succès !\n');
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error.message);
        console.error('\nDétails:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

// Exécuter la migration
runMigration();
