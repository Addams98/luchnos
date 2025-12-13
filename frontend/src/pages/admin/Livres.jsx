import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaBook,
  FaSearch,
  FaTimes,
  FaDownload,
  FaEye,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { livresAPI, adminAPI } from '../../services/api';

const Livres = () => {
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLivre, setEditingLivre] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('');
  const [formData, setFormData] = useState({
    titre: '',
    auteur: '',
    description: '',
    categorie: '',
    langue: 'Français',
    theme: '',
    gratuit: true,
    afficher_carousel: true,
    disponible_lecture: true,
    disponible_telechargement: true,
    image_couverture: '',
    pdf_url: ''
  });

  useEffect(() => {
    loadLivres();
  }, []);

  const loadLivres = async () => {
    try {
      const response = await livresAPI.getAll();
      if (response.data.success) {
        setLivres(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement livres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Prévisualisation
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('http://localhost:5000/api/livres/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, image_couverture: data.imageUrl }));
      } else {
        alert('Erreur lors de l\'upload de l\'image');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPdfFileName(file.name);

    // Upload
    setUploadingPDF(true);
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      
      const response = await fetch('http://localhost:5000/api/livres/upload-pdf', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, pdf_url: data.pdfUrl }));
      } else {
        alert('Erreur lors de l\'upload du PDF');
      }
    } catch (error) {
      console.error('Erreur upload PDF:', error);
      alert('Erreur lors de l\'upload du PDF');
    } finally {
      setUploadingPDF(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLivre) {
        await livresAPI.update(editingLivre.id, formData);
      } else {
        await livresAPI.create(formData);
      }
      loadLivres();
      closeModal();
    } catch (error) {
      console.error('Erreur sauvegarde livre:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      try {
        await livresAPI.delete(id);
        loadLivres();
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const handleToggleCarousel = async (id) => {
    try {
      await adminAPI.toggleLivreCarousel(id);
      await loadLivres();
    } catch (error) {
      console.error('Erreur toggle carousel:', error);
    }
  };

  const openModal = (livre = null) => {
    if (livre) {
      setEditingLivre(livre);
      setFormData({
        titre: livre.titre,
        auteur: livre.auteur,
        description: livre.description || '',
        categorie: livre.categorie || '',
        langue: livre.langue || 'Français',
        theme: livre.theme || '',
        gratuit: livre.gratuit,
        afficher_carousel: livre.afficher_carousel !== false,
        disponible_lecture: livre.disponible_lecture !== false,
        disponible_telechargement: livre.disponible_telechargement !== false,
        image_couverture: livre.image_couverture || '',
        pdf_url: livre.pdf_url || ''
      });
      setImagePreview(livre.image_couverture ? `http://localhost:5000${livre.image_couverture}` : '');
      setPdfFileName(livre.pdf_url ? livre.pdf_url.split('/').pop() : '');
    } else {
      setEditingLivre(null);
      setFormData({
        titre: '',
        auteur: '',
        description: '',
        categorie: '',
        langue: 'Français',
        theme: '',
        gratuit: true,
        afficher_carousel: true,
        disponible_lecture: true,
        disponible_telechargement: true,
        image_couverture: '',
        pdf_url: ''
      });
      setImagePreview('');
      setPdfFileName('');
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLivre(null);
  };

  const filteredLivres = livres.filter(livre =>
    livre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    livre.auteur.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Gestion des Livres
            </h1>
            <p className="text-slate">
              {filteredLivres.length} livre(s) trouvé(s)
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-gradient-gold text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <FaPlus />
            Nouveau Livre
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par titre ou auteur..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLivres.map((livre) => (
          <motion.div
            key={livre.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="h-48 bg-gradient-to-br from-copper to-copper-light flex items-center justify-center">
              {livre.image_couverture ? (
                <img 
                  src={`http://localhost:5000${livre.image_couverture}`}
                  alt={livre.titre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaBook className="text-white text-6xl opacity-50" />
              )}
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-primary">{livre.titre}</h3>
                {livre.gratuit && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Gratuit
                  </span>
                )}
              </div>
              <p className="text-sm text-slate mb-2">Par {livre.auteur}</p>
              <p className="text-sm text-slate mb-4 line-clamp-2">{livre.description}</p>
              <div className="flex gap-2 text-xs text-slate mb-4">
                {livre.langue && <span>🌍 {livre.langue}</span>}
              </div>
              <div className="mb-3">
                {livre.afficher_carousel ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    <FaCheckCircle />
                    Carousel actif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                    <FaTimesCircle />
                    Carousel inactif
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleToggleCarousel(livre.id)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    livre.afficher_carousel
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {livre.afficher_carousel ? 'Désactiver carousel' : 'Activer carousel'}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(livre)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <FaEdit />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(livre.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredLivres.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <FaBook className="text-6xl mx-auto mb-4 text-slate opacity-20" />
          <p className="text-slate">Aucun livre trouvé</p>
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
                  {editingLivre ? 'Modifier le livre' : 'Nouveau livre'}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Upload d'image */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Image de couverture
                  </label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="w-32 h-40 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img 
                          src={imagePreview} 
                          alt="Prévisualisation" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gold transition-colors">
                        <FaBook className="text-4xl mx-auto mb-2 text-slate opacity-50" />
                        <p className="text-sm text-slate mb-1">
                          {uploadingImage ? 'Upload en cours...' : 'Cliquez pour choisir une image'}
                        </p>
                        <p className="text-xs text-slate">PNG, JPG, WEBP (max 5MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Upload de PDF */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Fichier PDF du livre
                  </label>
                  <div className="flex items-center gap-4">
                    {pdfFileName && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                        <FaDownload />
                        <span className="text-sm">{pdfFileName}</span>
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gold transition-colors">
                        <FaDownload className="text-4xl mx-auto mb-2 text-slate opacity-50" />
                        <p className="text-sm text-slate mb-1">
                          {uploadingPDF ? 'Upload en cours...' : 'Cliquez pour choisir un PDF'}
                        </p>
                        <p className="text-xs text-slate">PDF (max 50MB)</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePDFUpload}
                        disabled={uploadingPDF}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                    <label className="block text-sm font-medium text-primary mb-2">Auteur *</label>
                    <input
                      type="text"
                      value={formData.auteur}
                      onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Langue *</label>
                    <input
                      type="text"
                      value={formData.langue}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length === 0 || /^[A-Z]/.test(value)) {
                          setFormData({ ...formData, langue: value });
                        }
                      }}
                      placeholder="Français"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Catégorie</label>
                    <input
                      type="text"
                      value={formData.categorie}
                      onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                      placeholder="Théologie, etc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Thème</label>
                  <input
                    type="text"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.gratuit}
                      onChange={(e) => setFormData({ ...formData, gratuit: e.target.checked })}
                      className="w-4 h-4 text-gold focus:ring-gold rounded"
                    />
                    <span className="text-sm text-primary">Livre gratuit</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.disponible_lecture}
                      onChange={(e) => setFormData({ ...formData, disponible_lecture: e.target.checked })}
                      className="w-4 h-4 text-gold focus:ring-gold rounded"
                    />
                    <span className="text-sm text-primary">Lecture en ligne disponible</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.disponible_telechargement}
                      onChange={(e) => setFormData({ ...formData, disponible_telechargement: e.target.checked })}
                      className="w-4 h-4 text-gold focus:ring-gold rounded"
                    />
                    <span className="text-sm text-primary">Téléchargement disponible</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-gold text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    {editingLivre ? 'Mettre à jour' : 'Créer'}
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

export default Livres;
