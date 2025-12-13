const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'luchnos_db',
  user: 'postgres',
  password: 'WILFRIED98'
});

async function checkTables() {
  try {
    console.log('\n🔍 Vérification des tables parametres_site et liens_sociaux...\n');
    
    // Vérifier si les tables existent
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('parametres_site', 'liens_sociaux')
    `);
    
    console.log('Tables trouvées:', tablesCheck.rows.map(r => r.table_name));
    
    if (tablesCheck.rows.length === 0) {
      console.log('\n❌ Les tables n\'existent pas localement!');
      console.log('\n📋 Tables existantes dans luchnos_db:');
      
      const allTables = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      allTables.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    } else {
      // Vérifier le contenu
      if (tablesCheck.rows.some(r => r.table_name === 'parametres_site')) {
        const siteData = await pool.query('SELECT * FROM parametres_site');
        console.log(`\n✅ parametres_site: ${siteData.rows.length} lignes`);
        if (siteData.rows.length > 0) {
          console.log(siteData.rows[0]);
        }
      }
      
      if (tablesCheck.rows.some(r => r.table_name === 'liens_sociaux')) {
        const socialData = await pool.query('SELECT * FROM liens_sociaux');
        console.log(`\n✅ liens_sociaux: ${socialData.rows.length} lignes`);
        if (socialData.rows.length > 0) {
          console.log(socialData.rows);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

checkTables();
