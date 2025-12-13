import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { newsletterAPI } from '../services/api';

const NewsletterSection = () => {
  const [formData, setFormData] = useState({
    email: '',
    nom: ''
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
      const response = await newsletterAPI.subscribe(formData);
      setMessage({ text: response.data.message, type: 'success' });
      setFormData({ email: '', nom: '' });
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
    <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-primary relative overflow-hidden">
      {/* Effets de lumière décoratifs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Rejoignez Notre Communauté
          </h2>
          <p className="text-xl text-slate-200 mb-10">
            Soyez les premiers informés de nos nouveaux contenus, événements et publications.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Votre nom (optionnel)"
                  className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-slate-300 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div className="flex-1 relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Votre email *"
                  className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-slate-300 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-12 py-4 bg-gradient-gold text-white font-bold rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Inscription...' : 'Nous Rejoindre'}
            </button>
          </form>

          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-500/20 border border-green-500 text-green-100'
                  : 'bg-red-500/20 border border-red-500 text-red-100'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <p className="text-slate-300 text-sm mt-6">
            Nous respectons votre vie privée. Vous pouvez vous désinscrire à tout moment.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
