import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaBook, 
  FaVideo, 
  FaComments, 
  FaEnvelope, 
  FaCog, 
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
  FaBible,
  FaLightbulb,
  FaBell
} from 'react-icons/fa';
import { adminAPI } from '../services/api';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('luchnos_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Charger le nombre de messages non lus
    loadUnreadMessages();
    
    // Actualiser toutes les 30 secondes
    const interval = setInterval(loadUnreadMessages, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadUnreadMessages = async () => {
    try {
      const response = await adminAPI.getStats();
      if (response.data.success) {
        setUnreadMessages(response.data.data.stats.messages_non_lus || 0);
      }
    } catch (error) {
      console.error('Erreur chargement messages non lus:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('luchnos_token');
    localStorage.removeItem('luchnos_user');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard', color: 'text-gold' },
    { path: '/admin/evenements', icon: FaCalendarAlt, label: 'Événements', color: 'text-blue-400' },
    { path: '/admin/livres', icon: FaBook, label: 'Livres', color: 'text-copper' },
    { path: '/admin/multimedia', icon: FaVideo, label: 'Multimédia', color: 'text-red-400' },
    { path: '/admin/versets', icon: FaBible, label: 'Versets Hero', color: 'text-yellow-400' },
    { path: '/admin/pensees', icon: FaLightbulb, label: 'Pensées', color: 'text-orange-400' },
    { path: '/admin/messages', icon: FaEnvelope, label: 'Messages', color: 'text-purple-400' },
    { path: '/admin/utilisateurs', icon: FaUsers, label: 'Utilisateurs', color: 'text-indigo-400', adminOnly: true },
    { path: '/admin/parametres', icon: FaCog, label: 'Paramètres', color: 'text-slate' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-primary via-primary-dark to-primary shadow-2xl z-50"
          >
            {/* Header */}
            <div className="p-6 border-b border-gold/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img src="/logo.png" alt="Luchnos Logo" className="h-12 w-12 object-contain" />
                </div>
                <div>
                  <h2 className="text-gold font-bold text-lg">Luchnos</h2>
                  <p className="text-xs text-slate-light">Administration</p>
                </div>
              </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-4 border-b border-gold/10">
                <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                  <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center">
                    <FaUser className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{user.nom}</p>
                    <p className="text-xs text-gold capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu */}
            <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              {menuItems.map((item) => {
                if (item.adminOnly && user?.role !== 'admin') return null;
                
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                const showBadge = item.path === '/admin/messages' && unreadMessages > 0;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                      isActive
                        ? 'bg-gold text-primary shadow-glow'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={isActive ? 'text-primary' : item.color} />
                    <span className="font-medium">{item.label}</span>
                    {showBadge && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 min-w-[24px] text-center animate-pulse">
                        {unreadMessages}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gold/20">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-red-500/20 rounded-lg transition-all"
              >
                <FaSignOutAlt className="text-red-400" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            <div className="flex items-center gap-4">
              {/* Notification Messages */}
              <Link
                to="/admin/messages"
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaBell size={20} className="text-slate" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {unreadMessages}
                  </span>
                )}
              </Link>

              <div className="text-right">
                <p className="text-sm text-slate">Bienvenue,</p>
                <p className="font-semibold text-primary">{user?.nom}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
