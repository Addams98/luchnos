import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSave, 
  FaGlobe,
  FaFacebook,
  FaYoutube,
  FaWhatsapp,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/api';

const Parametres = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    site_nom: 'Lampe Allumée (Luchnos)',
    site_description: 'Présenter Yéhoshoua car IL revient',
    contact_email: '',
    contact_telephone: '',
    contact_adresse: '',
    facebook_url: '',
    youtube_url: '',
    whatsapp_url: '',
    instagram_url: '',
    youtube_channel_id: ''
  });

  useEffect(() => {
    loadParametres();
  }, []);

  const loadParametres = async () => {
    try {
      const response = await adminAPI.getParametres();
      if (response.data.success) {
        const params = {};
        response.data.data.forEach(param => {
          params[param.cle] = param.valeur || '';
        });
        setFormData(prev => ({ ...prev, ...params }));
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des paramètres' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Préparer les paramètres pour la mise à jour en bloc
      const parametres = Object.entries(formData).map(([cle, valeur]) => ({
        cle,
        valeur: valeur || '',
        description: ''
      }));

      // Utiliser l'endpoint de mise à jour en bloc
      const response = await adminAPI.updateParametres(parametres);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Paramètres enregistrés avec succès !' });
        // Recharger les paramètres pour synchroniser
        await loadParametres();
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde des paramètres' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Paramètres du Site
        </h1>
        <p className="text-slate">
          Configurez les informations générales et les réseaux sociaux
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations Générales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <FaGlobe className="text-2xl text-primary" />
            <h2 className="text-2xl font-bold text-primary">Informations Générales</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Nom du site
              </label>
              <input
                type="text"
                value={formData.site_nom}
                onChange={(e) => setFormData({ ...formData, site_nom: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.site_description}
                onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
              />
            </div>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <FaEnvelope className="text-2xl text-primary" />
            <h2 className="text-2xl font-bold text-primary">Informations de Contact</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <FaEnvelope className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                placeholder="contact@luchnos.org"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <FaPhone className="inline mr-2" />
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.contact_telephone}
                onChange={(e) => setFormData({ ...formData, contact_telephone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                placeholder="+33 1 23 45 67 89"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-primary mb-2">
                <FaMapMarkerAlt className="inline mr-2" />
                Adresse
              </label>
              <input
                type="text"
                value={formData.contact_adresse}
                onChange={(e) => setFormData({ ...formData, contact_adresse: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                placeholder="123 Rue Exemple, Paris, France"
              />
            </div>
          </div>
        </motion.div>

        {/* Réseaux Sociaux */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <FaFacebook className="text-2xl text-blue-600" />
            <h2 className="text-2xl font-bold text-primary">Réseaux Sociaux</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <FaFacebook className="inline mr-2 text-blue-600" />
                Facebook
              </label>
              <input
                type="url"
                value={formData.facebook_url}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                placeholder="https://facebook.com/luchnos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <FaYoutube className="inline mr-2 text-red-600" />
                YouTube
              </label>
              <input
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                placeholder="https://youtube.com/@luchnos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <FaWhatsapp className="inline mr-2 text-green-500" />
                WhatsApp
              </label>
              <input
                type="url"
                value={formData.whatsapp_url}
                onChange={(e) => setFormData({ ...formData, whatsapp_url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                placeholder="https://wa.me/33123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <FaInstagram className="inline mr-2 text-pink-600" />
                Instagram
              </label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                placeholder="https://instagram.com/luchnos"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-primary mb-2">
                <FaYoutube className="inline mr-2 text-red-600" />
                YouTube Channel ID (pour import automatique)
              </label>
              <input
                type="text"
                value={formData.youtube_channel_id}
                onChange={(e) => setFormData({ ...formData, youtube_channel_id: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                placeholder="UCxxxxxxxxxxxxxxxxxxxxx"
              />
              <p className="text-xs text-slate mt-1">
                Trouvez l'ID de votre chaîne YouTube dans les paramètres avancés
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bouton Enregistrer */}
        <div className="flex flex-col gap-4">
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <FaCheckCircle className="text-xl" />
              ) : (
                <FaExclamationTriangle className="text-xl" />
              )}
              <span className="font-medium">{message.text}</span>
            </motion.div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-gold text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />
              {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default Parametres;
