import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaEye, FaClock, FaSearch, FaYoutube } from 'react-icons/fa';
import { multimediaAPI } from '../services/api';

const Multimedia = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [displayCount, setDisplayCount] = useState(6);
  
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  // Extraire les thèmes, auteurs et années uniques
  const themes = ['all', ...new Set(videos.map(v => v.categorie).filter(Boolean))];
  const authors = ['all', ...new Set(videos.map(v => v.auteur).filter(Boolean))];
  const years = ['all', ...new Set(videos.map(v => v.annee_publication).filter(Boolean))].sort((a, b) => {
    if (a === 'all') return -1;
    if (b === 'all') return 1;
    return b - a;
  });

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    let filtered = [...videos];

    // Filtre de recherche
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par thème
    if (selectedTheme !== 'all') {
      filtered = filtered.filter(video => video.categorie === selectedTheme);
    }

    // Filtre par auteur
    if (selectedAuthor !== 'all') {
      filtered = filtered.filter(video => video.auteur === selectedAuthor);
    }

    // Filtre par année
    if (selectedYear !== 'all') {
      filtered = filtered.filter(video => video.annee_publication === selectedYear);
    }

    // Tri
    filtered.sort((a, b) => {
      if (sortOrder === 'recent') {
        return new Date(b.date_publication || b.created_at) - new Date(a.date_publication || a.created_at);
      } else if (sortOrder === 'oldest') {
        return new Date(a.date_publication || a.created_at) - new Date(b.date_publication || b.created_at);
      } else if (sortOrder === 'views') {
        return (b.vues || 0) - (a.vues || 0);
      }
      return 0;
    });

    setFilteredVideos(filtered);
  }, [searchTerm, videos, selectedTheme, selectedAuthor, selectedYear, sortOrder]);

  const loadVideos = async () => {
    try {
      const response = await multimediaAPI.getAll();
      const videosData = response.data.data || response.data || [];
      setVideos(videosData);
      setFilteredVideos(videosData);
    } catch (error) {
      console.error('Erreur lors du chargement des vidéos:', error);
      setVideos([]);
      setFilteredVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const getVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
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
            Luchnos Multimédia
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto px-4">
            Enseignements et contenus spirituels enrichissants
          </p>
        </motion.div>
      </section>

      {/* Barre de recherche et filtres */}
      <section className="py-8 bg-white shadow-md sticky top-20 z-40">
        <div className="container-custom">
          {/* Barre de recherche */}
          <div className="relative max-w-4xl mx-auto mb-6">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Rechercher par titre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-gold transition-colors text-base"
            />
          </div>

          {/* Filtres */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-6xl mx-auto">
            {/* Filtre Thème */}
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors bg-white cursor-pointer text-sm font-medium text-slate-700 hover:border-slate-300"
            >
              <option value="all">Tous les thèmes</option>
              {themes.filter(t => t !== 'all').map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>

            {/* Filtre Auteur */}
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors bg-white cursor-pointer text-sm font-medium text-slate-700 hover:border-slate-300"
            >
              <option value="all">Tous les auteurs</option>
              {authors.filter(a => a !== 'all').map(author => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>

            {/* Filtre Année */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors bg-white cursor-pointer text-sm font-medium text-slate-700 hover:border-slate-300"
            >
              <option value="all">Toutes les années</option>
              {years.filter(y => y !== 'all').map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Tri */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors bg-white cursor-pointer text-sm font-medium text-slate-700 hover:border-slate-300"
            >
              <option value="recent">Plus récentes</option>
              <option value="oldest">Plus anciennes</option>
              <option value="views">Plus populaires</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grille de vidéos */}
      <section className="py-12 bg-slate-light">
        <div className="container-custom">
          {/* Titre avec nombre de résultats */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">
              Vidéos Récentes ({filteredVideos.length} résultat{filteredVideos.length > 1 ? 's' : ''})
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold mx-auto"></div>
              <p className="mt-4 text-slate-600">Chargement des vidéos...</p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-slate-600">
                {searchTerm || selectedTheme !== 'all' || selectedAuthor !== 'all' || selectedYear !== 'all' 
                  ? 'Aucune vidéo trouvée avec ces critères' 
                  : 'Aucune vidéo disponible pour le moment'}
              </p>
            </div>
          ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.slice(0, displayCount).map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card group cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden rounded-t-xl">
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.titre}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : getVideoId(video.video_url) ? (
                      <img
                        src={`https://img.youtube.com/vi/${getVideoId(video.video_url)}/maxresdefault.jpg`}
                        alt={video.titre}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-primary flex items-center justify-center">
                        <FaPlay className="text-gold text-5xl" />
                      </div>
                    )}
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaPlay className="text-gold text-5xl" />
                    </div>

                    {/* Durée */}
                    {video.duree && (
                      <div className="absolute bottom-3 right-3 bg-black/80 text-white px-3 py-1 rounded text-sm font-semibold">
                        {video.duree}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    {/* Date et Catégorie */}
                    <div className="flex items-center justify-between mb-3 text-sm">
                      <span className="flex items-center text-slate-500">
                        <FaClock className="mr-2" />
                        {new Date(video.date_publication || video.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      {video.categorie && (
                        <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-semibold">
                          {video.categorie}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-gold transition-colors line-clamp-2 min-h-[56px]">
                      {video.titre}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                      {video.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-slate-500 pt-3 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span>👤 {video.auteur || 'Évangéliste Paul Martin'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaEye />
                        <span>{video.vues || 0} vues</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Bouton Afficher davantage */}
            {filteredVideos.length > displayCount && (
              <div className="text-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 bg-gradient-gold text-white px-8 py-4 rounded-lg font-semibold shadow-glow hover:shadow-flame transition-all"
                >
                  Afficher davantage
                  <span className="text-sm">({filteredVideos.length - displayCount} vidéos restantes)</span>
                </motion.button>
              </div>
            )}
            </>
          )}
        </div>
      </section>

      {/* Section Abonnement YouTube */}
      <section className="py-16 bg-primary">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Abonnez-vous à Notre Chaîne
            </h2>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto mb-8">
              Ne manquez aucun de nos contenus. Abonnez-vous et activez la cloche de notification.<br />
              
            </p>
            <a
              href="https://youtube.com/@luchnoslampeallumee?si=P7dIHkQ-0sQNR-lx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:shadow-xl"
            >
              <FaYoutube className="text-2xl" />
              S'abonner sur YouTube
            </a>
          </motion.div>
        </div>
      </section>

      {/* Modal Vidéo */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl overflow-hidden max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative pt-[56.25%]">
              {getVideoId(selectedVideo.video_url) ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${getVideoId(selectedVideo.video_url)}?autoplay=1`}
                  title={selectedVideo.titre}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-white">
                  <p>Vidéo non disponible</p>
                </div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-primary mb-2">{selectedVideo.titre}</h2>
              <p className="text-slate-600">{selectedVideo.description}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Multimedia;
