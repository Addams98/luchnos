import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaTrash, 
  FaUser,
  FaSearch,
  FaQuoteLeft
} from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { temoignagesAPI } from '../../services/api';

const Temoignages = () => {
  const [temoignages, setTemoignages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('all');

  useEffect(() => {
    loadTemoignages();
  }, []);

  const loadTemoignages = async () => {
    try {
      const response = await temoignagesAPI.getAll();
      if (response.data.success) {
        setTemoignages(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement témoignages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, currentStatus) => {
    try {
      await temoignagesAPI.update(id, { approuve: !currentStatus });
      loadTemoignages();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      try {
        await temoignagesAPI.delete(id);
        loadTemoignages();
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const filteredTemoignages = temoignages.filter(temoignage => {
    const matchesSearch = temoignage.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         temoignage.temoignage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = filterStatut === 'all' || 
                         (filterStatut === 'approuve' && temoignage.approuve) ||
                         (filterStatut === 'en_attente' && !temoignage.approuve);
    return matchesSearch && matchesStatut;
  });

  const stats = {
    total: temoignages.length,
    approuves: temoignages.filter(t => t.approuve).length,
    en_attente: temoignages.filter(t => !t.approuve).length
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
        <h1 className="text-3xl font-bold text-primary mb-6">
          Gestion des Témoignages
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate text-sm mb-1">Total</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
              </div>
              <FaUser className="text-4xl text-slate opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate text-sm mb-1">Approuvés</p>
                <p className="text-3xl font-bold text-green-600">{stats.approuves}</p>
              </div>
              <FaCheckCircle className="text-4xl text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate text-sm mb-1">En attente</p>
                <p className="text-3xl font-bold text-orange-600">{stats.en_attente}</p>
              </div>
              <FaTimesCircle className="text-4xl text-orange-600 opacity-20" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom ou contenu..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
            />
          </div>
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
          >
            <option value="all">Tous les statuts</option>
            <option value="approuve">Approuvés</option>
            <option value="en_attente">En attente</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTemoignages.map((temoignage) => (
          <motion.div
            key={temoignage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl shadow-lg p-6 ${
              !temoignage.approuve ? 'border-l-4 border-orange-500' : 'border-l-4 border-green-500'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-white font-bold text-xl">
                  {temoignage.nom.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">{temoignage.nom}</h3>
                  <p className="text-sm text-slate">
                    {new Date(temoignage.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {temoignage.approuve ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-2">
                    <FaCheckCircle />
                    Approuvé
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full flex items-center gap-2">
                    <FaTimesCircle />
                    En attente
                  </span>
                )}
              </div>
            </div>

            <div className="relative pl-8 mb-4">
              <FaQuoteLeft className="absolute left-0 top-0 text-gold text-2xl opacity-30" />
              <p className="text-slate italic">{temoignage.temoignage}</p>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => handleApprove(temoignage.id, temoignage.approuve)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  temoignage.approuve
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {temoignage.approuve ? (
                  <>
                    <FaTimesCircle />
                    Retirer l'approbation
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Approuver
                  </>
                )}
              </button>
              <button
                onClick={() => handleDelete(temoignage.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <FaTrash />
                Supprimer
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTemoignages.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <FaQuoteLeft className="text-6xl mx-auto mb-4 text-slate opacity-20" />
          <p className="text-slate">Aucun témoignage trouvé</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default Temoignages;
