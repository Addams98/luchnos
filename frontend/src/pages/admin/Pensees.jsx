import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaLightbulb, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheckCircle, 
  FaTimesCircle,
  FaSave,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaClock
} from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI, penseesAPI } from '../../services/api';

const Pensees = () => {
  const [pensees, setPensees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPensee, setEditingPensee] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    image_url: '',
    type_periode: 'semaine',
    date_debut: '',
    date_fin: '',
    actif: true,
    ordre: 0
  });
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadPensees();
  }, []);

  const loadPensees = async () => {
    try {
      const response = await adminAPI.getPensees();
      if (response.data.success) {
        setPensees(response.data.data || []);
      }
    } catch (error) {
      console.error('Erreur chargement pensées:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingPensee) {
        await adminAPI.updatePensee(editingPensee.id, formData);
      } else {
        await adminAPI.createPensee(formData);
      }
      
      await loadPensees();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erreur sauvegarde pensée:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (pensee) => {
    setEditingPensee(pensee);
    setFormData({
      titre: pensee.titre || '',
      contenu: pensee.contenu,
      image_url: pensee.image_url || '',
      type_periode: pensee.type_periode,
      date_debut: pensee.date_debut ? new Date(pensee.date_debut).toISOString().split('T')[0] : '',
      date_fin: pensee.date_fin ? new Date(pensee.date_fin).toISOString().split('T')[0] : '',
      actif: pensee.actif,
      ordre: pensee.ordre
    });
    setImagePreview(pensee.image_url ? `http://localhost:5000${pensee.image_url}` : '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette pensée ?')) return;
    
    try {
      await adminAPI.deletePensee(id);
      await loadPensees();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleActif = async (id) => {
    try {
      await adminAPI.togglePenseeActif(id);
      await loadPensees();
    } catch (error) {
      console.error('Erreur toggle actif:', error);
    }
  };

  const handleMoveUp = async (pensee, index) => {
    if (index === 0) return;
    const prevPensee = pensees[index - 1];
    
    try {
      await adminAPI.updatePensee(pensee.id, { ...pensee, ordre: prevPensee.ordre });
      await adminAPI.updatePensee(prevPensee.id, { ...prevPensee, ordre: pensee.ordre });
      await loadPensees();
    } catch (error) {
      console.error('Erreur déplacement:', error);
    }
  };

  const handleMoveDown = async (pensee, index) => {
    if (index === pensees.length - 1) return;
    const nextPensee = pensees[index + 1];
    
    try {
      await adminAPI.updatePensee(pensee.id, { ...pensee, ordre: nextPensee.ordre });
      await adminAPI.updatePensee(nextPensee.id, { ...nextPensee, ordre: pensee.ordre });
      await loadPensees();
    } catch (error) {
      console.error('Erreur déplacement:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const response = await penseesAPI.uploadImage(formDataUpload);
      if (response.data.success) {
        setFormData({ ...formData, image_url: response.data.imageUrl });
        setImagePreview(`http://localhost:5000${response.data.imageUrl}`);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      contenu: '',
      image_url: '',
      type_periode: 'semaine',
      date_debut: '',
      date_fin: '',
      actif: true,
      ordre: 0
    });
    setImagePreview('');
    setEditingPensee(null);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Pensées & Méditations
            </h1>
            <p className="text-slate-600">
              Partagez vos pensées hebdomadaires ou mensuelles sur la page d'accueil
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-gold text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <FaPlus />
            Nouvelle Pensée
          </button>
        </div>
      </div>

      {/* Liste des pensées */}
      <div className="grid gap-4">
        {pensees.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <FaLightbulb className="text-6xl text-slate-300 mx-auto mb-4" />
            <p className="text-xl text-slate-600">Aucune pensée enregistrée</p>
          </div>
        ) : (
          pensees.map((pensee, index) => (
            <motion.div
              key={pensee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Ordre */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMoveUp(pensee, index)}
                    disabled={index === 0}
                    className="p-2 hover:bg-slate-100 rounded disabled:opacity-30"
                  >
                    <FaArrowUp className="text-slate-600" />
                  </button>
                  <span className="text-sm font-bold text-slate-600 text-center">
                    {pensee.ordre}
                  </span>
                  <button
                    onClick={() => handleMoveDown(pensee, index)}
                    disabled={index === pensees.length - 1}
                    className="p-2 hover:bg-slate-100 rounded disabled:opacity-30"
                  >
                    <FaArrowDown className="text-slate-600" />
                  </button>
                </div>

                {/* Contenu */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {pensee.titre && (
                        <h3 className="text-xl font-bold text-primary mb-2">
                          {pensee.titre}
                        </h3>
                      )}
                      <p className="text-lg text-slate-700 mb-3 leading-relaxed">
                        {pensee.contenu}
                      </p>
                      
                      {/* Période */}
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold ${
                          pensee.type_periode === 'semaine' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          <FaClock />
                          {pensee.type_periode === 'semaine' ? 'Semaine' : 'Mois'}
                        </span>
                        
                        {pensee.date_debut && pensee.date_fin && (
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt />
                            {formatDate(pensee.date_debut)} → {formatDate(pensee.date_fin)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Badge statut */}
                    <div>
                      {pensee.actif ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          <FaCheckCircle />
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-semibold">
                          <FaTimesCircle />
                          Inactif
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActif(pensee.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        pensee.actif
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {pensee.actif ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => handleEdit(pensee)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-all"
                    >
                      <FaEdit className="inline mr-1" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(pensee.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-all"
                    >
                      <FaTrash className="inline mr-1" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Ajout/Modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                  <FaLightbulb />
                  {editingPensee ? 'Modifier la Pensée' : 'Nouvelle Pensée'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Titre (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                    placeholder="Pensée de la semaine"
                  />
                </div>

                {/* Contenu */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Contenu *
                  </label>
                  <textarea
                    value={formData.contenu}
                    onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                    placeholder="Votre pensée ou méditation..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Image de fond
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
                        <FaLightbulb className="text-4xl mx-auto mb-2 text-slate opacity-50" />
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
                  <p className="text-xs text-slate-500 mt-2">
                    L'image est requise pour l'affichage dans le carousel
                  </p>
                </div>

                {/* Ordre */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    value={formData.ordre}
                    onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                  />
                </div>

              </div>

              {/* Boutons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-gold text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <FaSave />
                  {editingPensee ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Pensees;
