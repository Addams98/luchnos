import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaBook, 
  FaVideo, 
  FaEnvelope, 
  FaUsers,
  FaComments,
  FaChartLine,
  FaExclamationCircle
} from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate">Chargement...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Événements',
      value: stats?.stats?.total_evenements || 0,
      icon: FaCalendarAlt,
      color: 'bg-primary',
      subtext: `${stats?.stats?.evenements_a_venir || 0} à venir`
    },
    {
      title: 'Livres',
      value: stats?.stats?.total_livres || 0,
      icon: FaBook,
      color: 'bg-copper',
      subtext: 'Édition Plumage'
    },
    {
      title: 'Vidéos',
      value: stats?.stats?.total_videos || 0,
      icon: FaVideo,
      color: 'bg-copper-dark',
      subtext: 'Multimédia'
    },
    {
      title: 'Messages',
      value: stats?.stats?.total_messages || 0,
      icon: FaEnvelope,
      color: 'bg-primary-light',
      subtext: `${stats?.stats?.messages_non_lus || 0} non lus`,
      alert: stats?.stats?.messages_non_lus > 0
    },
    {
      title: 'Newsletter',
      value: stats?.stats?.total_newsletter || 0,
      icon: FaUsers,
      color: 'bg-green-500',
      subtext: 'Abonnés actifs'
    },
    {
      title: 'Témoignages',
      value: stats?.stats?.total_temoignages || 0,
      icon: FaComments,
      color: 'bg-gold',
      subtext: `${stats?.stats?.temoignages_en_attente || 0} en attente`,
      alert: stats?.stats?.temoignages_en_attente > 0
    },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Dashboard
        </h1>
        <p className="text-slate">
          Vue d'ensemble de votre administration
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow relative overflow-hidden"
          >
            {/* Background Icon */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${card.color} opacity-10 rounded-full flex items-center justify-center`}>
              <card.icon size={48} />
            </div>

            {/* Content */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center shadow-lg`}>
                  <card.icon className="text-white text-xl" />
                </div>
                {card.alert && (
                  <FaExclamationCircle className="text-red-500 animate-pulse" />
                )}
              </div>
              
              <h3 className="text-slate font-medium mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-primary mb-1">{card.value}</p>
              <p className="text-sm text-slate">{card.subtext}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <FaEnvelope className="text-purple-500" />
              Derniers Messages
            </h2>
          </div>

          <div className="space-y-3">
            {stats?.recent?.messages?.length > 0 ? (
              stats.recent.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg border ${
                    msg.lu ? 'bg-gray-50 border-gray-200' : 'bg-gold/5 border-gold/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm">{msg.nom}</p>
                    {!msg.lu && (
                      <span className="px-2 py-1 bg-gold text-xs text-white rounded-full">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate truncate">{msg.sujet}</p>
                  <p className="text-xs text-slate mt-1">
                    {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate text-center py-4">Aucun message récent</p>
            )}
          </div>
        </motion.div>

        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />
              Prochains Événements
            </h2>
          </div>

          <div className="space-y-3">
            {stats?.recent?.evenements?.length > 0 ? (
              stats.recent.evenements.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg border border-gray-200 hover:border-gold/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm">{event.titre}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.statut === 'a_venir' ? 'bg-blue-100 text-blue-700' :
                      event.statut === 'en_cours' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {event.statut.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate">
                    {new Date(event.date_evenement).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate text-center py-4">Aucun événement récent</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 bg-gradient-to-r from-primary to-primary-dark rounded-xl shadow-lg p-6 text-white"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaChartLine />
          Actions Rapides
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/admin/evenements')}
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
          >
            <FaCalendarAlt className="text-2xl mb-2 mx-auto" />
            <p className="text-sm">Nouvel Événement</p>
          </button>
          <button 
            onClick={() => navigate('/admin/livres')}
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
          >
            <FaBook className="text-2xl mb-2 mx-auto" />
            <p className="text-sm">Nouveau Livre</p>
          </button>
          <button 
            onClick={() => navigate('/admin/multimedia')}
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
          >
            <FaVideo className="text-2xl mb-2 mx-auto" />
            <p className="text-sm">Nouvelle Vidéo</p>
          </button>
          <button 
            onClick={() => navigate('/admin/messages')}
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
          >
            <FaEnvelope className="text-2xl mb-2 mx-auto" />
            <p className="text-sm">Voir Messages</p>
          </button>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default Dashboard;
