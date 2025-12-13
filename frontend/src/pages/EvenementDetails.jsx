import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowLeft, FaUser } from 'react-icons/fa';
import { evenementsAPI, BASE_URL } from '../services/api';

const EvenementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evenement, setEvenement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvenement();
  }, [id]);

  const loadEvenement = async () => {
    try {
      const response = await evenementsAPI.getById(id);
      setEvenement(response.data.data || response.data);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'événement:', error);
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

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!evenement) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-slate-600 mb-6">Événement non trouvé</p>
          <button
            onClick={() => navigate('/evenements')}
            className="btn-primary"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-slate-light">
      {/* Bouton retour */}
      <div className="bg-white shadow-sm py-4">
        <div className="container-custom">
          <button
            onClick={() => navigate('/evenements')}
            className="flex items-center gap-2 text-primary hover:text-gold transition-colors font-semibold"
          >
            <FaArrowLeft />
            Retour aux événements
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Image principale */}
          {evenement.image_url && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={`${BASE_URL}${evenement.image_url}`}
                alt={evenement.titre}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className={`${getStatutBadge(evenement.statut).color} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
                  {getStatutBadge(evenement.statut).text}
                </span>
                <span className={`${getTypeBadge(evenement.type_evenement).color} px-4 py-2 rounded-full text-sm font-bold shadow-lg bg-white`}>
                  {getTypeBadge(evenement.type_evenement).text}
                </span>
              </div>

              {/* Titre sur l'image */}
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  {evenement.titre}
                </h1>
              </div>
            </div>
          )}

          {/* Sans image */}
          {!evenement.image_url && (
            <div className="bg-gradient-primary p-12">
              <div className="flex items-center gap-4 mb-4">
                <span className={`${getStatutBadge(evenement.statut).color} text-white px-4 py-2 rounded-full text-sm font-bold`}>
                  {getStatutBadge(evenement.statut).text}
                </span>
                <span className={`${getTypeBadge(evenement.type_evenement).color} px-4 py-2 rounded-full text-sm font-bold bg-white`}>
                  {getTypeBadge(evenement.type_evenement).text}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {evenement.titre}
              </h1>
            </div>
          )}

          {/* Informations détaillées */}
          <div className="p-8 md:p-12">
            {/* Carte d'informations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-slate-50 p-6 rounded-xl">
                <div className="flex items-center text-gold font-semibold mb-3">
                  <FaCalendarAlt className="mr-2 text-xl" />
                  Date
                </div>
                <p className="text-slate-700 font-medium">
                  {new Date(evenement.date_evenement).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {evenement.heure_evenement && (
                <div className="bg-slate-50 p-6 rounded-xl">
                  <div className="flex items-center text-gold font-semibold mb-3">
                    <FaClock className="mr-2 text-xl" />
                    Heure
                  </div>
                  <p className="text-slate-700 font-medium">{evenement.heure_evenement}</p>
                </div>
              )}

              {evenement.lieu && (
                <div className="bg-slate-50 p-6 rounded-xl">
                  <div className="flex items-center text-gold font-semibold mb-3">
                    <FaMapMarkerAlt className="mr-2 text-xl" />
                    Lieu
                  </div>
                  <p className="text-slate-700 font-medium">{evenement.lieu}</p>
                </div>
              )}

              {evenement.organisateur && (
                <div className="bg-slate-50 p-6 rounded-xl">
                  <div className="flex items-center text-gold font-semibold mb-3">
                    <FaUser className="mr-2 text-xl" />
                    Organisateur
                  </div>
                  <p className="text-slate-700 font-medium">{evenement.organisateur}</p>
                </div>
              )}
            </div>

            {/* Description complète */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-primary mb-6">À propos de cet événement</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-line">
                  {evenement.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EvenementDetails;
