import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaDownload, FaSearch, FaCheckCircle, FaFilter } from 'react-icons/fa';
import { livresAPI, BASE_URL } from '../services/api';

const Edition = () => {
  const [livres, setLivres] = useState([]);
  const [filteredLivres, setFilteredLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [filterTheme, setFilterTheme] = useState('');
  const [filterLangue, setFilterLangue] = useState('');
  const [filterAuteur, setFilterAuteur] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [themes, setThemes] = useState([]);
  const [langues, setLangues] = useState([]);

  useEffect(() => {
    loadLivres();
  }, []);

  useEffect(() => {
    let filtered = livres;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(livre =>
        livre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livre.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livre.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par thème
    if (filterTheme) {
      filtered = filtered.filter(livre => 
        livre.theme?.toLowerCase().includes(filterTheme.toLowerCase()) ||
        livre.categorie?.toLowerCase().includes(filterTheme.toLowerCase())
      );
    }

    // Filtre par langue
    if (filterLangue) {
      filtered = filtered.filter(livre => livre.langue?.toLowerCase() === filterLangue.toLowerCase());
    }

    // Filtre par auteur
    if (filterAuteur) {
      filtered = filtered.filter(livre => livre.auteur?.toLowerCase().includes(filterAuteur.toLowerCase()));
    }

    // Tri
    filtered = [...filtered].sort((a, b) => {
      switch(sortBy) {
        case 'recent':
          return new Date(b.created_at || b.date_publication) - new Date(a.created_at || a.date_publication);
        case 'ancien':
          return new Date(a.created_at || a.date_publication) - new Date(b.created_at || b.date_publication);
        case 'titre':
          return a.titre.localeCompare(b.titre);
        case 'auteur':
          return a.auteur.localeCompare(b.auteur);
        default:
          return 0;
      }
    });

    setFilteredLivres(filtered);
  }, [searchTerm, filterTheme, filterLangue, filterAuteur, sortBy, livres]);

  const loadLivres = async () => {
    try {
      const response = await livresAPI.getAll();
      const livresData = response.data.data || response.data || [];
      setLivres(livresData);
      setFilteredLivres(livresData);
      
      // Extraire les thèmes uniques (combine theme et categorie, normalise et déduplique)
      const themesSet = new Set();
      livresData.forEach(livre => {
        const themeValue = (livre.theme || livre.categorie || '').trim();
        if (themeValue) {
          // Normaliser: première lettre en majuscule, reste en minuscule
          const normalized = themeValue.charAt(0).toUpperCase() + themeValue.slice(1).toLowerCase();
          themesSet.add(normalized);
        }
      });
      setThemes([...themesSet].sort((a, b) => a.localeCompare(b, 'fr')));
      
      // Extraire les langues uniques (normalise et déduplique)
      const languesSet = new Set();
      livresData.forEach(livre => {
        const langueValue = (livre.langue || '').trim();
        if (langueValue) {
          // Normaliser: première lettre en majuscule, reste en minuscule
          const normalized = langueValue.charAt(0).toUpperCase() + langueValue.slice(1).toLowerCase();
          languesSet.add(normalized);
        }
      });
      setLangues([...languesSet].sort((a, b) => a.localeCompare(b, 'fr')));
    } catch (error) {
      console.error('Erreur lors du chargement des livres:', error);
      setLivres([]);
      setFilteredLivres([]);
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
          className="relative z-10 text-center px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gold/20 rounded-full mb-6"
          >
            <FaBook className="text-gold text-5xl animate-pulse" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Édition</span>{' '}
            <span className="text-gold">Plumage</span>
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Livres chrétiens gratuits à consulter en ligne ou à télécharger
          </p>
        </motion.div>
      </section>

      {/* Barre de recherche et filtres */}
      <section className="py-8 bg-white shadow-md">
        <div className="container-custom">
          <div className="space-y-4">
            {/* Recherche */}
            <div className="relative max-w-2xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un livre, auteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Filtres avancés */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filterTheme}
                onChange={(e) => setFilterTheme(e.target.value)}
                className="px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
              >
                <option value="">Tous les thèmes</option>
                {themes.map(theme => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>

              <select
                value={filterLangue}
                onChange={(e) => setFilterLangue(e.target.value)}
                className="px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
              >
                <option value="">Toutes les langues</option>
                {langues.map(langue => (
                  <option key={langue} value={langue}>{langue}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Auteur..."
                value={filterAuteur}
                onChange={(e) => setFilterAuteur(e.target.value)}
                className="px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-gold transition-colors"
              >
                <option value="recent">Plus récents</option>
                <option value="ancien">Plus anciens</option>
                <option value="titre">Titre (A-Z)</option>
                <option value="auteur">Auteur (A-Z)</option>
              </select>
            </div>

            {/* Compteur de résultats */}
            <div className="text-center text-slate-600">
              {filteredLivres.length} livre(s) trouvé(s)
            </div>
          </div>
        </div>
      </section>

      {/* Grille de livres */}
      <section className="py-20 bg-slate-light">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold mx-auto"></div>
              <p className="mt-4 text-slate-600">Chargement des livres...</p>
            </div>
          ) : filteredLivres.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-slate-600">
                {searchTerm ? 'Aucun livre trouvé' : 'Aucun livre disponible pour le moment'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredLivres.map((livre, index) => (
                <motion.div
                  key={livre.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card group cursor-pointer card-lift"
                  onClick={() => setSelectedBook(livre)}
                >
                  {/* Couverture avec effet 3D */}
                  <div className="relative overflow-hidden bg-gradient-primary p-4 book-cover-3d perspective-container">
                    {livre.image_couverture ? (
                      <img
                        src={`${BASE_URL}${livre.image_couverture}`}
                        alt={livre.titre}
                        className="w-full h-64 object-contain"
                      />
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center">
                        <FaBook className="text-gold text-6xl" />
                      </div>
                    )}
                    
                    {/* Badge Gratuit */}
                    {livre.gratuit && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                        <FaCheckCircle />
                        <span>GRATUIT</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-gold transition-colors line-clamp-2">
                      {livre.titre}
                    </h3>
                    <p className="text-sm text-slate-500 mb-3">
                      Par {livre.auteur}
                    </p>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                      {livre.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      {livre.nombre_pages && (
                        <span className="text-sm text-slate-500">
                          {livre.nombre_pages} pages
                        </span>
                      )}
                      {livre.gratuit ? (
                        <span className="text-green-600 font-bold text-sm">Gratuit</span>
                      ) : livre.prix ? (
                        <span className="text-gold font-bold">{livre.prix}€</span>
                      ) : null}
                    </div>

                    {/* Bouton de téléchargement pour livres gratuits */}
                    {livre.gratuit && livre.pdf_url && livre.disponible_telechargement && (
                      <a
                        href={`${BASE_URL}${livre.pdf_url}`}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-gold text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                      >
                        <FaDownload />
                        Télécharger
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal Livre */}
      {selectedBook && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedBook(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl overflow-hidden max-w-4xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Couverture */}
              <div className="bg-gradient-primary p-8 rounded-xl flex items-center justify-center book-cover-3d perspective-container">
                {selectedBook.image_couverture ? (
                  <img
                    src={`${BASE_URL}${selectedBook.image_couverture}`}
                    alt={selectedBook.titre}
                    className="max-h-96 object-contain"
                  />
                ) : (
                  <FaBook className="text-gold text-8xl" />
                )}
              </div>

              {/* Détails */}
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-4">
                    {selectedBook.titre}
                  </h2>
                  <p className="text-lg text-slate-600 mb-4">
                    Par <span className="font-semibold text-gold">{selectedBook.auteur}</span>
                  </p>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {selectedBook.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {selectedBook.nombre_pages && (
                      <p className="text-slate-600">
                        <span className="font-semibold">Pages:</span> {selectedBook.nombre_pages}
                      </p>
                    )}
                    {selectedBook.categorie && (
                      <p className="text-slate-600">
                        <span className="font-semibold">Catégorie:</span> {selectedBook.categorie}
                      </p>
                    )}
                    {selectedBook.date_publication && (
                      <p className="text-slate-600">
                        <span className="font-semibold">Date de publication:</span>{' '}
                        {new Date(selectedBook.date_publication).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>

                  {selectedBook.gratuit && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-green-700 font-semibold flex items-center">
                        <FaCheckCircle className="mr-2" />
                        Ce livre est disponible gratuitement
                      </p>
                    </div>
                  )}

                  {/* Bouton de téléchargement */}
                  {selectedBook.gratuit && selectedBook.pdf_url && selectedBook.disponible_telechargement && (
                    <a
                      href={`${BASE_URL}${selectedBook.pdf_url}`}
                      download
                      className="w-full flex items-center justify-center gap-2 bg-gradient-gold text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all mb-6"
                    >
                      <FaDownload />
                      Télécharger
                    </a>
                  )}
                </div>


              </div>
            </div>

            {/* Bouton fermer */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}

      {/* Styles pour effet 3D */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .book-cover-3d {
          transition: transform 0.6s ease-out;
          transform-style: preserve-3d;
        }
        
        .card:hover .book-cover-3d {
          transform: rotateY(10deg) rotateX(-5deg) translateZ(30px);
        }
        
        .card {
          transition: box-shadow 0.3s ease;
        }
        
        .card:hover {
          box-shadow: 0 20px 60px rgba(244, 196, 48, 0.3), 
                      0 10px 30px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Edition;
