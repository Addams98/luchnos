import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaUser, FaPhone, FaPaperPlane, FaMapMarkerAlt, FaClock, FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa';
import { contactAPI } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await contactAPI.send(formData);
      setMessage({ text: response.data.message, type: 'success' });
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
      });
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Une erreur est survenue',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-primary flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Contactez-Nous
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto px-4">
            Nous serions ravis d'avoir de vos nouvelles
          </p>
        </motion.div>
      </section>

      {/* Section Contact */}
      <section className="py-20 bg-slate-light">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulaire */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card p-8"
            >
              <h2 className="text-3xl font-bold text-primary mb-6">
                Envoyez-nous un message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nom complet *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Téléphone (optionnel)
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                {/* Sujet */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
                    placeholder="Objet de votre message"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="Écrivez votre message ici..."
                  />
                </div>

                {/* Bouton Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                  <FaPaperPlane />
                </button>

                {/* Message de réponse */}
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${
                      message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}
                  >
                    {message.text}
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Informations de contact */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Coordonnées */}
              <div className="card p-8">
                <h3 className="text-2xl font-bold text-primary mb-6">
                  Nos Coordonnées
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <FaEnvelope className="text-white text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Email</h4>
                      <a href="mailto:contact@luchnos.org" className="text-slate-600 hover:text-gold transition-colors">
                        Luchnos2020@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <FaPhone className="text-white text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Telephone</h4>
                      <p className="text-slate-600">
                        ‎+241 62562910<br />
                       
                      </p>
                    </div>
                  </div>

                 
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="card p-8">
                <h3 className="text-2xl font-bold text-primary mb-6">
                  Suivez-Nous
                </h3>
                <p className="text-slate-600 mb-6">
                  Rejoignez notre communauté sur les réseaux sociaux
                </p>
                <div className="flex space-x-4">
                  <a
                    href="https://www.facebook.com/profile.php?id=100071922544535&mibextid=ZbWKwL"
                    className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-gold transition-colors"
                  >
                    <FaFacebook className="text-xl" />
                  </a>
                  <a
                    href="https://youtube.com/@luchnoslampeallumee?si=P7dIHkQ-0sQNR-lx"
                    className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-gold transition-colors"
                  >
                    <FaYoutube className="text-xl" />
                  </a>
                  <a
                    href="https://instagram.com/filles2saray_nouvelle_identite?igshid=NTc4MTIwNjQ2YQ=="
                    className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-gold transition-colors"
                  >
                    <FaInstagram className="text-xl" />
                  </a>
                </div>
              </div>

              
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
