import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaVideo,
  FaSearch,
  FaTimes,
  FaYoutube,
  FaPlay,
  FaSync
} from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { multimediaAPI, youtubeAPI, adminAPI } from '../../services/api';

const Multimedia = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    video_url: '',
    youtube_id: '',
    type_media: 'video',
    duree: '',
    categorie: '',
    auteur: '',
    annee_publication: new Date().getFullYear()
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await multimediaAPI.getAll();
      if (response.data.success) {
        setVideos(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement vidéos:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractYoutubeId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
      /youtube\.com\/embed\/([^&\s]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return '';
  };

  const handleYoutubeSync = async () => {
    try {
      setSyncing(true);
      setSyncMessage('');

      // Récupérer le Channel ID depuis les paramètres
      const paramsResponse = await adminAPI.getParametres();
      const params = paramsResponse.data.data || [];
      const channelIdParam = params.find(p => p.cle === 'youtube_channel_id');
      
      if (!channelIdParam || !channelIdParam.valeur) {
        setSyncMessage('❌ Veuillez configurer le YouTube Channel ID dans les Paramètres');
        return;
      }

      const channelId = channelIdParam.valeur;
      
      // Lancer la synchronisation
      const response = await youtubeAPI.syncVideos(channelId);
      
      if (response.data.success) {
        setSyncMessage(`✅ ${response.data.message}`);
        // Recharger la liste des vidéos
        loadVideos();
      } else {
        setSyncMessage(`❌ ${response.data.message}`);
      }
    } catch (error) {
      console.error('Erreur sync YouTube:', error);
      setSyncMessage(`❌ ${error.response?.data?.message || 'Erreur lors de la synchronisation'}`);
    } finally {
      setSyncing(false);
      // Effacer le message après 5 secondes
      setTimeout(() => setSyncMessage(''), 5000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        youtube_id: formData.video_url ? extractYoutubeId(formData.video_url) : formData.youtube_id
      };
      
      if (editingVideo) {
        await multimediaAPI.update(editingVideo.id, dataToSend);
      } else {
        await multimediaAPI.create(dataToSend);
      }
      loadVideos();
      closeModal();
    } catch (error) {
      console.error('Erreur sauvegarde vidéo:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      try {
        await multimediaAPI.delete(id);
        loadVideos();
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const openModal = (video = null) => {
    if (video) {
      setEditingVideo(video);
      setFormData({
        titre: video.titre,
        description: video.description || '',
        video_url: video.video_url || '',
        youtube_id: video.youtube_id || '',
        type_media: video.type_media || 'video',
        duree: video.duree || '',
        categorie: video.categorie || '',
        auteur: video.auteur || '',
        annee_publication: video.annee_publication || new Date().getFullYear()
      });
    } else {
      setEditingVideo(null);
      setFormData({
        titre: '',
        description: '',
        video_url: '',
        youtube_id: '',
        type_media: 'video',
        duree: '',
        categorie: '',
        auteur: '',
        annee_publication: new Date().getFullYear()
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVideo(null);
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.titre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || video.type_media === filterType;
    return matchesSearch && matchesType;
  });

  const getThumbnail = (youtubeId) => {
    return youtubeId ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : null;
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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Gestion Multimédia
            </h1>
            <p className="text-slate">
              {filteredVideos.length} vidéo(s) trouvée(s)
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleYoutubeSync}
              disabled={syncing}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaYoutube className="text-xl" />
              <FaSync className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Synchronisation...' : 'Sync YouTube'}
            </button>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-gradient-gold text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <FaPlus />
              Nouvelle Vidéo
            </button>
          </div>
        </div>
      </div>

      {/* Message de synchronisation */}
      {syncMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`mb-6 p-4 rounded-lg ${
            syncMessage.includes('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <p className="font-medium">{syncMessage}</p>
        </motion.div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une vidéo..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
          >
            <option value="all">Tous les types</option>
            <option value="video">Vidéo</option>
            <option value="audio">Audio</option>
            <option value="podcast">Podcast</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="relative h-48 bg-gray-900">
              {video.youtube_id ? (
                <img
                  src={getThumbnail(video.youtube_id)}
                  alt={video.titre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaVideo className="text-white text-6xl opacity-30" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <FaPlay className="text-white text-4xl" />
              </div>
              {video.youtube_id && (
                <FaYoutube className="absolute top-2 right-2 text-red-600 text-3xl" />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-primary mb-2">{video.titre}</h3>
              <p className="text-sm text-slate mb-3 line-clamp-2">{video.description}</p>
              <div className="flex items-center gap-3 text-xs text-slate mb-4">
                {video.duree && <span>⏱️ {video.duree}</span>}
                {video.auteur && <span>👤 {video.auteur}</span>}
                {video.annee_publication && <span>📅 {video.annee_publication}</span>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(video)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  <FaEdit />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <FaVideo className="text-6xl mx-auto mb-4 text-slate opacity-20" />
          <p className="text-slate">Aucune vidéo trouvée</p>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-primary text-white p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingVideo ? 'Modifier la vidéo' : 'Nouvelle vidéo'}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Titre *</label>
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">URL YouTube</label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                  />
                  <p className="text-xs text-slate mt-1">L'ID YouTube sera extrait automatiquement</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Type</label>
                    <select
                      value={formData.type_media}
                      onChange={(e) => setFormData({ ...formData, type_media: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                    >
                      <option value="video">Vidéo</option>
                      <option value="audio">Audio</option>
                      <option value="podcast">Podcast</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Durée</label>
                    <input
                      type="text"
                      value={formData.duree}
                      onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                      placeholder="Ex: 1h 30min"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Auteur</label>
                    <input
                      type="text"
                      value={formData.auteur}
                      onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Année</label>
                    <input
                      type="number"
                      value={formData.annee_publication}
                      onChange={(e) => setFormData({ ...formData, annee_publication: parseInt(e.target.value) })}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Catégorie</label>
                  <input
                    type="text"
                    value={formData.categorie}
                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    placeholder="Enseignement, Prophétie, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-gold text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    {editingVideo ? 'Mettre à jour' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default Multimedia;
