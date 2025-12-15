// 🔒 Script de migration : Création de la table refresh_tokens sur RENDER
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Vérifier que DATABASE_URL est définie
if (!process.env.DATABASE_URL) {
    console.error('❌ ERREUR: Variable d\'environnement DATABASE_URL non définie !');
    console.error('\n📝 Usage:');
    console.error('   $env:DATABASE_URL="postgres://user:pass@host:5432/db"');
    console.error('   node scripts/migrate-refresh-tokens-render.js');
    console.error('\n📍 Trouvez l\'URL dans: Render Dashboard → luchnos_db → Connect → External Database URL\n');
    process.exit(1);
}

// Connexion à la base Render via DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Nécessaire pour Render
    }
});

async function runMigration() {
    const client = await pool.connect();
    
    try {
        console.log('🔄 Connexion à PostgreSQL (Render)...');
        console.log(`📍 URL: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`); // Masquer le mot de passe
        
        // Vérifier la connexion
        const versionCheck = await client.query('SELECT version();');
        console.log(`✅ Connecté: ${versionCheck.rows[0].version.split(' ')[0]} ${versionCheck.rows[0].version.split(' ')[1]}`);
        
        // Lire le fichier SQL
        const sqlPath = path.join(__dirname, '../migrations/create_refresh_tokens.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('\n🚀 Exécution de la migration sur RENDER...\n');
        
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
            console.log('✅ Table "refresh_tokens" créée avec succès sur RENDER !');
            console.log('\nColonnes:');
            checkTable.rows.forEach(row => {
                console.log(`  - ${row.column_name}: ${row.data_type}`);
            });
        } else {
            console.log('❌ Erreur: La table n\'a pas été créée');
            process.exit(1);
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
        
        console.log('\n🎉 Migration sur RENDER terminée avec succès !');
        console.log('\n⚠️  PROCHAINE ÉTAPE : Ajouter JWT_SECRET dans les variables d\'environnement Render');
        console.log('    Dashboard → Service "luchnos" → Environment → Add JWT_SECRET\n');
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error.message);
        
        if (error.code === 'ENOTFOUND') {
            console.error('\n💡 Vérifiez que l\'URL de connexion est correcte');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('\n💡 Impossible de se connecter à la base de données');
            console.error('   Vérifiez que vous êtes autorisé à accéder à la base depuis votre IP');
        } else if (error.message.includes('password authentication failed')) {
            console.error('\n💡 Mot de passe incorrect dans DATABASE_URL');
        }
        
        console.error('\nDétails complets:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

// Exécuter la migration
runMigration();
