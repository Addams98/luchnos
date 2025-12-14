import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, 
  FaEnvelopeOpen,
  FaTrash, 
  FaSearch,
  FaTimes,
  FaUser,
  FaPhone
} from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/api';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await adminAPI.getMessages();
      console.log('Messages response:', response.data);
      if (response.data.success) {
        const messagesData = response.data.data.messages || response.data.data;
        // S'assurer que c'est un tableau
        if (Array.isArray(messagesData)) {
          setMessages(messagesData);
        } else {
          console.warn('Messages data is not an array:', messagesData);
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id, currentStatus) => {
    try {
      await adminAPI.toggleReadMessage(id);
      await loadMessages();
      // Déclencher un événement pour mettre à jour les notifications
      window.dispatchEvent(new Event('messagesUpdated'));
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      try {
        await adminAPI.deleteMessage(id);
        await loadMessages();
        // Déclencher un événement pour mettre à jour les notifications
        window.dispatchEvent(new Event('messagesUpdated'));
        if (selectedMessage?.id === id) {
          setShowModal(false);
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const openMessageDetail = async (message) => {
    setSelectedMessage(message);
    setShowModal(true);
    
    // Marquer comme lu si non lu
    if (!message.lu) {
      await handleToggleRead(message.id, false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  const filteredMessages = (messages || []).filter(message => {
    const matchesSearch = 
      message.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatut = filterStatut === 'all' || 
                         (filterStatut === 'lu' && message.lu) ||
                         (filterStatut === 'non_lu' && !message.lu);
    
    return matchesSearch && matchesStatut;
  });

  const stats = {
    total: (messages || []).length,
    non_lus: (messages || []).filter(m => !m.lu).length,
    lus: (messages || []).filter(m => m.lu).length
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
          Messages Reçus
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate text-sm mb-1">Total</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
              </div>
              <FaEnvelope className="text-4xl text-slate opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate text-sm mb-1">Non lus</p>
                <p className="text-3xl font-bold text-orange-600">{stats.non_lus}</p>
              </div>
              <FaEnvelope className="text-4xl text-orange-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate text-sm mb-1">Lus</p>
                <p className="text-3xl font-bold text-green-600">{stats.lus}</p>
              </div>
              <FaEnvelopeOpen className="text-4xl text-green-600 opacity-20" />
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
              placeholder="Rechercher dans les messages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
            />
          </div>
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
          >
            <option value="all">Tous les messages</option>
            <option value="non_lu">Non lus</option>
            <option value="lu">Lus</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">De</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Sujet</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <motion.tr
                  key={message.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`hover:bg-gray-50 cursor-pointer ${!message.lu ? 'bg-blue-50' : ''}`}
                  onClick={() => openMessageDetail(message)}
                >
                  <td className="px-6 py-4">
                    {message.lu ? (
                      <FaEnvelopeOpen className="text-gray-400 text-xl" />
                    ) : (
                      <FaEnvelope className="text-orange-500 text-xl" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`font-medium ${!message.lu ? 'text-primary font-bold' : 'text-slate'}`}>
                        {message.nom}
                      </p>
                      <p className="text-sm text-slate">{message.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className={!message.lu ? 'font-bold text-primary' : 'text-slate'}>
                      {message.sujet}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-slate text-sm">
                    {new Date(message.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleRead(message.id, message.lu)}
                        className={`px-3 py-1 rounded text-sm ${
                          message.lu
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {message.lu ? 'Non lu' : 'Lu'}
                      </button>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <FaEnvelope className="text-6xl mx-auto mb-4 text-slate opacity-20" />
            <p className="text-slate">Aucun message trouvé</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && selectedMessage && (
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
                <h2 className="text-2xl font-bold">Détails du message</h2>
                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <FaUser className="text-gold text-xl" />
                      <div>
                        <p className="text-xs text-slate">Nom</p>
                        <p className="font-semibold text-primary">{selectedMessage.nom}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-gold text-xl" />
                      <div>
                        <p className="text-xs text-slate">Email</p>
                        <a 
                          href={`mailto:${selectedMessage.email}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                    </div>
                    {selectedMessage.telephone && (
                      <div className="flex items-center gap-3">
                        <FaPhone className="text-gold text-xl" />
                        <div>
                          <p className="text-xs text-slate">Téléphone</p>
                          <a 
                            href={`tel:${selectedMessage.telephone}`}
                            className="font-semibold text-blue-600 hover:underline"
                          >
                            {selectedMessage.telephone}
                          </a>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-gold text-xl" />
                      <div>
                        <p className="text-xs text-slate">Date</p>
                        <p className="font-semibold text-primary">
                          {new Date(selectedMessage.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Sujet</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-lg font-semibold text-primary">{selectedMessage.sujet}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Message</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-slate whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.lu)}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                      selectedMessage.lu
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    Marquer comme {selectedMessage.lu ? 'non lu' : 'lu'}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-semibold"
                  >
                    Supprimer
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

export default Messages;
