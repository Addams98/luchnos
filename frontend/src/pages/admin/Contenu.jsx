import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { presentationAPI } from '../../services/api';

const Contenu = () => {
  const [contenu, setContenu] = useState([]);
  const [valeurs, setValeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showValeurModal, setShowValeurModal] = useState(false);
  const [editingValeur, setEditingValeur] = useState(null);
  const [valeurForm, setValeurForm] = useState({
    titre: '',
    description: '',
    icone: 'FaBible',
    ordre: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contenuRes, valeursRes] = await Promise.all([
        presentationAPI.getContenu(),
        presentationAPI.getValeurs()
      ]);
      setContenu(contenuRes.data.data || []);
      setValeurs(valeursRes.data.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditContenu = (item) => {
    setEditingId(item.id);
    setEditForm({
      titre: item.titre || '',
      contenu: item.contenu || '',
      image_url: item.image_url || ''
    });
  };

  const handleSaveContenu = async (id) => {
    try {
      await presentationAPI.updateContenu(id, editForm);
      await loadData();
      setEditingId(null);
      alert('Contenu mis à jour avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleEditValeur = (valeur) => {
    setEditingValeur(valeur);
    setValeurForm({
      titre: valeur.titre,
      description: valeur.description,
      icone: valeur.icone,
      ordre: valeur.ordre
    });
    setShowValeurModal(true);
  };

  const handleSaveValeur = async () => {
    try {
      if (editingValeur) {
        await presentationAPI.updateValeur(editingValeur.id, valeurForm);
      } else {
        await presentationAPI.createValeur(valeurForm);
      }
      await loadData();
      closeValeurModal();
      alert('Valeur sauvegardée avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDeleteValeur = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette valeur ?')) {
      try {
        await presentationAPI.deleteValeur(id);
        await loadData();
        alert('Valeur supprimée');
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const closeValeurModal = () => {
    setShowValeurModal(false);
    setEditingValeur(null);
    setValeurForm({ titre: '', description: '', icone: 'FaBible', ordre: 0 });
  };

  const icones = ['FaBible', 'FaGlobe', 'FaHeart', 'FaUsers', 'FaPray', 'FaFire', 'FaCross', 'FaBook', 'FaStar'];

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
        <h1 className="text-3xl font-bold text-primary mb-2">
          Gestion du Contenu - Page Présentation
        </h1>
        <p className="text-slate">
          Modifiez les textes et valeurs affichés sur la page Présentation
        </p>
      </div>

      {/* Sections de contenu */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-primary mb-6">Sections de Texte</h2>
        <div className="space-y-6">
          {contenu.map((item) => (
            <div key={item.id} className="border-b border-slate-200 pb-6 last:border-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-primary">
                  {item.section.replace(/_/g, ' ').toUpperCase()}
                </h3>
                {editingId === item.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveContenu(item.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <FaSave /> Enregistrer
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditContenu(item)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <FaEdit /> Modifier
                  </button>
                )}
              </div>

              {editingId === item.id ? (
                <div className="space-y-3">
                  {item.titre !== null && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Titre</label>
                      <input
                        type="text"
                        value={editForm.titre}
                        onChange={(e) => setEditForm({ ...editForm, titre: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Contenu</label>
                    <textarea
                      value={editForm.contenu}
                      onChange={(e) => setEditForm({ ...editForm, contenu: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-lg">
                  {item.titre && <p className="font-semibold mb-2">{item.titre}</p>}
                  <p className="text-slate-600">{item.contenu}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Valeurs */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Valeurs</h2>
          <button
            onClick={() => setShowValeurModal(true)}
            className="flex items-center gap-2 bg-gradient-gold text-white px-6 py-3 rounded-lg hover:shadow-lg"
          >
            <FaPlus /> Nouvelle Valeur
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valeurs.map((valeur) => (
            <div key={valeur.id} className="border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{valeur.icone}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditValeur(valeur)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteValeur(valeur.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">{valeur.titre}</h3>
              <p className="text-sm text-slate-600">{valeur.description}</p>
              <p className="text-xs text-slate-400 mt-2">Ordre: {valeur.ordre}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Valeur */}
      <AnimatePresence>
        {showValeurModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeValeurModal}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary">
                  {editingValeur ? 'Modifier la Valeur' : 'Nouvelle Valeur'}
                </h2>
                <button onClick={closeValeurModal} className="p-2 hover:bg-gray-100 rounded">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre *</label>
                  <input
                    type="text"
                    value={valeurForm.titre}
                    onChange={(e) => setValeurForm({ ...valeurForm, titre: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={valeurForm.description}
                    onChange={(e) => setValeurForm({ ...valeurForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Icône</label>
                    <select
                      value={valeurForm.icone}
                      onChange={(e) => setValeurForm({ ...valeurForm, icone: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      {icones.map(icone => (
                        <option key={icone} value={icone}>{icone}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Ordre</label>
                    <input
                      type="number"
                      value={valeurForm.ordre}
                      onChange={(e) => setValeurForm({ ...valeurForm, ordre: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSaveValeur}
                    className="flex-1 bg-gradient-gold text-white py-3 rounded-lg font-semibold hover:shadow-lg"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={closeValeurModal}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default Contenu;
