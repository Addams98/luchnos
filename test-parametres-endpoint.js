const axios = require('axios');

async function testEndpoint() {
  try {
    console.log('\n🧪 Test endpoint /api/parametres/publics...\n');
    
    const response = await axios.get('http://127.0.0.1:5000/api/parametres/publics');
    
    console.log('✅ Réponse reçue:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testEndpoint();
