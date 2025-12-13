import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaCalendarAlt,
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { evenementsAPI, adminAPI } from '../../services/api';

const Evenements = () => {
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date_evenement: '',
    heure_evenement: '',
    lieu: '',
    type_evenement: 'conference',
    statut: 'a_venir',
    image_url: '',
    actif: true
  });

  useEffect(() => {
    loadEvenements();
  }, []);

  const loadEvenements = async () => {
    try {
      const response = await evenementsAPI.getAll();
      if (response.data.success) {
        setEvenements(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement événements:', error);
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
      
      const response = await fetch('http://localhost:5000/api/evenements/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, image_url: data.imageUrl }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await evenementsAPI.update(editingEvent.id, formData);
      } else {
        await evenementsAPI.create(formData);
      }
      loadEvenements();
      closeModal();
    } catch (error) {
      console.error('Erreur sauvegarde événement:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await evenementsAPI.delete(id);
        loadEvenements();
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const handleToggleActif = async (id) => {
    try {
      await adminAPI.toggleEvenementActif(id);
      await loadEvenements();
    } catch (error) {
      console.error('Erreur toggle actif:', error);
    }
  };

  const openModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        titre: event.titre,
        description: event.description || '',
        date_evenement: event.date_evenement?.split('T')[0] || '',
        heure_evenement: event.heure_evenement || '',
        lieu: event.lieu || '',
        type_evenement: event.type_evenement || 'conference',
        statut: event.statut || 'a_venir',
        image_url: event.image_url || '',
        actif: event.actif !== undefined ? event.actif : true
      });
      setImagePreview(event.image_url ? `http://localhost:5000${event.image_url}` : '');
    } else {
      setEditingEvent(null);
      setFormData({
        titre: '',
        description: '',
        date_evenement: '',
        heure_evenement: '',
        lieu: '',
        type_evenement: 'conference',
        statut: 'a_venir',
        image_url: '',
        actif: true
      });
      setImagePreview('');
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const filteredEvents = evenements.filter(event => {
    const matchesSearch = event.titre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = filterStatut === 'all' || event.statut === filterStatut;
    return matchesSearch && matchesStatut;
  });

  const getStatutBadge = (statut) => {
    const styles = {
      'a_venir': 'bg-primary/10 text-primary',
      'en_cours': 'bg-green-100 text-green-700',
      'termine': 'bg-gray-100 text-gray-700'
    };
    return styles[statut] || styles.a_venir;
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Gestion des Événements
            </h1>
            <p className="text-slate">
              {filteredEvents.length} événement(s) trouvé(s)
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-gradient-gold text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <FaPlus />
            Nouvel Événement
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un événement..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
          >
            <option value="all">Tous les statuts</option>
            <option value="a_venir">À venir</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-6 py-4 text-left">Titre</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Lieu</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Statut</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-primary">{event.titre}</div>
                    <div className="text-sm text-slate truncate max-w-xs">
                      {event.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gold" />
                      <span>
                        {new Date(event.date_evenement).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {event.heure_evenement && (
                      <div className="text-sm text-slate">{event.heure_evenement}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate">{event.lieu || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="capitalize">{event.type_evenement}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatutBadge(event.statut)}`}>
                      {event.statut.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                      {event.actif ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          <FaCheckCircle />
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                          <FaTimesCircle />
                          Inactif
                        </span>
                      )}
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleActif(event.id)}
                          className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                            event.actif
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {event.actif ? 'Désactiver' : 'Activer'}
                        </button>
                        <button
                          onClick={() => openModal(event)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12 text-slate">
              <FaCalendarAlt className="text-6xl mx-auto mb-4 opacity-20" />
              <p>Aucun événement trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
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
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-primary text-white p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Upload d'image */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Image de l'événement
                  </label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="w-40 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img 
                          src={imagePreview} 
                          alt="Prévisualisation" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gold transition-colors">
                        <FaCalendarAlt className="text-4xl mx-auto mb-2 text-slate opacity-50" />
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

                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                  />
                </div>

                {/* Date et Heure */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date_evenement}
                      onChange={(e) => setFormData({ ...formData, date_evenement: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Heure
                    </label>
                    <input
                      type="time"
                      value={formData.heure_evenement}
                      onChange={(e) => setFormData({ ...formData, heure_evenement: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                    />
                  </div>
                </div>

                {/* Lieu */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Lieu
                  </label>
                  <input
                    type="text"
                    value={formData.lieu}
                    onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                  />
                </div>

                {/* Type et Statut */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type_evenement}
                      onChange={(e) => setFormData({ ...formData, type_evenement: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                    >
                      <option value="conference">Conférence</option>
                      <option value="seminaire">Séminaire</option>
                      <option value="culte">Culte</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Statut
                    </label>
                    <select
                      value={formData.statut}
                      onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                    >
                      <option value="a_venir">À venir</option>
                      <option value="en_cours">En cours</option>
                      <option value="termine">Terminé</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-gold text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    {editingEvent ? 'Mettre à jour' : 'Créer'}
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

export default Evenements;
