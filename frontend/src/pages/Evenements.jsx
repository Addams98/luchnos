import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaSearch, FaImages } from 'react-icons/fa';
import { evenementsAPI } from '../services/api';

const Evenements = () => {
  const navigate = useNavigate();
  const [evenements, setEvenements] = useState([]);
  const [filteredEvenements, setFilteredEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [activeTab, setActiveTab] = useState('a_venir'); // a_venir, en_cours, termine, tous

  useEffect(() => {
    loadEvenements();
  }, []);

  useEffect(() => {
    let filtered = evenements;

    // Filtre par statut (tab)
    if (activeTab !== 'tous') {
      filtered = filtered.filter(event => event.statut === activeTab);
    }

    // Filtre par type
    if (filterType !== 'tous') {
      filtered = filtered.filter(event => event.type_evenement === filterType);
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvenements(filtered);
  }, [searchTerm, filterType, activeTab, evenements]);

  const loadEvenements = async () => {
    try {
      const response = await evenementsAPI.getAll();
      const eventsData = response.data.data || response.data || [];
      setEvenements(eventsData);
      setFilteredEvenements(eventsData);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      setEvenements([]);
      setFilteredEvenements([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      a_venir: { text: 'À venir', color: 'bg-primary' },
      en_cours: { text: 'En cours', color: 'bg-green-500' },
      termine: { text: 'Terminé', color: 'bg-gray-500' }
    };
    return badges[statut] || badges.a_venir;
  };

  const getTypeBadge = (type) => {
    const badges = {
      conference: { text: 'Conférence', color: 'text-copper bg-copper/10' },
      seminaire: { text: 'Séminaire', color: 'text-primary bg-primary/10' },
      culte: { text: 'Culte', color: 'text-green-600 bg-green-50' },
      autre: { text: 'Autre', color: 'text-slate-600 bg-slate-50' }
    };
    return badges[type] || badges.autre;
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
            Nos Événements
          </h1>
          
        </motion.div>
      </section>

      {/* Tabs et Filtres */}
      <section className="py-8 bg-white shadow-md">
        <div className="container-custom">
          {/* Tabs pour statut */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('a_venir')}
              className={`px-6 py-3 font-semibold transition-all border-b-2 ${
                activeTab === 'a_venir'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-slate-600 hover:text-gold'
              }`}
            >
              À venir
            </button>
            <button
              onClick={() => setActiveTab('en_cours')}
              className={`px-6 py-3 font-semibold transition-all border-b-2 ${
                activeTab === 'en_cours'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-slate-600 hover:text-green-500'
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => setActiveTab('termine')}
              className={`px-6 py-3 font-semibold transition-all border-b-2 ${
                activeTab === 'termine'
                  ? 'border-slate-500 text-slate-600'
                  : 'border-transparent text-slate-600 hover:text-slate-500'
              }`}
            >
              Passés
            </button>
            <button
              onClick={() => setActiveTab('tous')}
              className={`px-6 py-3 font-semibold transition-all border-b-2 ${
                activeTab === 'tous'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-600 hover:text-primary'
              }`}
            >
              Tous
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Filtre par type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-6 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
            >
              <option value="tous">Tous les types</option>
              <option value="conference">Conférences</option>
              <option value="seminaire">Séminaires</option>
              <option value="culte">Cultes</option>
              <option value="autre">Autres</option>
            </select>
          </div>
        </div>
      </section>

      {/* Liste des événements */}
      <section className="py-20 bg-slate-light">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold mx-auto"></div>
              <p className="mt-4 text-slate-600">Chargement des événements...</p>
            </div>
          ) : filteredEvenements.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-slate-600">
                {searchTerm || filterType !== 'tous' 
                  ? 'Aucun événement trouvé' 
                  : 'Aucun événement disponible pour le moment'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvenements.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card group card-lift cursor-pointer"
                  onClick={() => navigate(`/evenements/${event.id}`)}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden h-48 event-image-3d ${event.statut === 'a_venir' ? 'upcoming' : ''}`}>
                    {event.image_url ? (
                      <img
                        src={`http://localhost:5000${event.image_url}`}
                        alt={event.titre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                        <FaCalendarAlt className="text-gold text-6xl" />
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className={`${getStatutBadge(event.statut).color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                        {getStatutBadge(event.statut).text}
                      </span>
                      <span className={`${getTypeBadge(event.type_evenement).color} px-3 py-1 rounded-full text-sm font-bold`}>
                        {getTypeBadge(event.type_evenement).text}
                      </span>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-gold transition-colors line-clamp-2">
                      {event.titre}
                    </h3>
                    
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    {/* Détails */}
                    <div className="space-y-2 border-t border-slate-200 pt-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <FaCalendarAlt className="text-gold mr-2" />
                        <span>
                          {new Date(event.date_evenement).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      {event.heure_evenement && (
                        <div className="flex items-center text-sm text-slate-600">
                          <FaClock className="text-gold mr-2" />
                          <span>{event.heure_evenement}</span>
                        </div>
                      )}

                      {event.lieu && (
                        <div className="flex items-center text-sm text-slate-600">
                          <FaMapMarkerAlt className="text-gold mr-2" />
                          <span className="line-clamp-1">{event.lieu}</span>
                        </div>
                      )}
                    </div>

                    {/* Bouton */}
                    {event.statut === 'a_venir' && (
                      <button className="mt-6 w-full btn-primary text-sm">
                        S'inscrire
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Evenements;
