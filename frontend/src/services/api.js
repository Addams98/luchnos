import axios from 'axios';

// Détection automatique de l'environnement
const isProduction = window.location.hostname.includes('onrender.com');
const API_URL = isProduction 
  ? 'https://luchnos.onrender.com/api'
  : (import.meta.env.VITE_API_URL || '${BASE_URL}/api');

// URL de base pour les assets (images, PDFs)
export const BASE_URL = isProduction 
  ? 'https://luchnos.onrender.com'
  : '${BASE_URL}';

console.log('🔗 API URL:', API_URL);
console.log('📁 BASE URL:', BASE_URL);

// Instance Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('luchnos_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('luchnos_token');
      localStorage.removeItem('luchnos_user');
      // Ne rediriger que si on est déjà sur une page admin
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// =====================
// Auth API
// =====================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
  changePassword: (passwords) => api.put('/auth/password', passwords),
  getUsers: () => api.get('/auth/users'),
  updateUser: (id, userData) => api.put(`/auth/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
};

// =====================
// Admin API
// =====================
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  
  // Messages
  getMessages: (params) => api.get('/admin/messages', { params }),
  getMessage: (id) => api.get(`/admin/messages/${id}`),
  toggleReadMessage: (id) => api.put(`/admin/messages/${id}/toggle-read`),
  deleteMessage: (id) => api.delete(`/admin/messages/${id}`),
  
  // Paramètres
  getParametres: () => api.get('/admin/parametres'),
  updateParametre: (cle, valeur) => api.put(`/admin/parametres/${cle}`, { valeur }),
  updateParametres: (parametres) => api.put('/admin/parametres', { parametres }),
  
  // Versets Hero
  getVersets: () => api.get('/admin/versets'),
  createVerset: (data) => api.post('/admin/versets', data),
  updateVerset: (id, data) => api.put(`/admin/versets/${id}`, data),
  toggleVersetActif: (id) => api.put(`/admin/versets/${id}/toggle-actif`),
  deleteVerset: (id) => api.delete(`/admin/versets/${id}`),
  
  // Pensées
  getPensees: () => api.get('/admin/pensees'),
  createPensee: (data) => api.post('/admin/pensees', data),
  updatePensee: (id, data) => api.put(`/admin/pensees/${id}`, data),
  togglePenseeActif: (id) => api.put(`/admin/pensees/${id}/toggle-actif`),
  deletePensee: (id) => api.delete(`/admin/pensees/${id}`),
  
  // Livres
  toggleLivreCarousel: (id) => api.put(`/admin/livres/${id}/toggle-carousel`),
  
  // Événements
  toggleEvenementActif: (id) => api.put(`/admin/evenements/${id}/toggle-actif`),
};

// Événements
export const evenementsAPI = {
  getAll: () => api.get('/evenements'),
  getById: (id) => api.get(`/evenements/${id}`),
  getUpcoming: () => api.get('/evenements/statut/a-venir'),
  create: (data) => api.post('/evenements', data),
  update: (id, data) => api.put(`/evenements/${id}`, data),
  delete: (id) => api.delete(`/evenements/${id}`),
};

// Livres
export const livresAPI = {
  getAll: () => api.get('/livres'),
  getById: (id) => api.get(`/livres/${id}`),
  getFree: () => api.get('/livres/filter/gratuits'),
  create: (data) => api.post('/livres', data),
  update: (id, data) => api.put(`/livres/${id}`, data),
  delete: (id) => api.delete(`/livres/${id}`),
};

// Multimédia
export const multimediaAPI = {
  getAll: () => api.get('/multimedia'),
  getById: (id) => api.get(`/multimedia/${id}`),
  getByType: (type) => api.get(`/multimedia/type/${type}`),
  create: (data) => api.post('/multimedia', data),
  update: (id, data) => api.put(`/multimedia/${id}`, data),
  delete: (id) => api.delete(`/multimedia/${id}`),
};

// Témoignages
export const temoignagesAPI = {
  getAll: () => api.get('/temoignages'),
  getAllWithUnapproved: () => api.get('/temoignages/all'),
  create: (data) => api.post('/temoignages', data),
  approve: (id) => api.put(`/temoignages/${id}/approuver`),
  delete: (id) => api.delete(`/temoignages/${id}`),
};

// Newsletter
export const newsletterAPI = {
  subscribe: (data) => api.post('/newsletter/subscribe', data),
  unsubscribe: (email) => api.post('/newsletter/unsubscribe', { email }),
  getAll: () => api.get('/newsletter'),
};

// Contact
export const contactAPI = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  getUnread: () => api.get('/contact/non-lus'),
  markAsRead: (id) => api.put(`/contact/${id}/marquer-lu`),
  delete: (id) => api.delete(`/contact/${id}`),
};

// YouTube
export const youtubeAPI = {
  syncVideos: (channelId) => api.post('/youtube/sync', { channelId }),
  testConnection: () => api.get('/youtube/test'),
  getChannelInfo: (channelId) => api.get(`/youtube/channel/${channelId}`)
};

export const presentationAPI = {
  getContenu: () => api.get('/presentation/contenu'),
  getValeurs: () => api.get('/presentation/valeurs'),
  updateContenu: (id, data) => api.put(`/presentation/contenu/${id}`, data),
  createValeur: (data) => api.post('/presentation/valeurs', data),
  updateValeur: (id, data) => api.put(`/presentation/valeurs/${id}`, data),
  deleteValeur: (id) => api.delete(`/presentation/valeurs/${id}`)
};

// Versets Hero (public)
export const versetsAPI = {
  getActifs: () => api.get('/versets/actifs'),
  uploadImage: (formData) => api.post('/versets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Pensées (public)
export const penseesAPI = {
  getActifs: () => api.get('/pensees/actifs'),
  uploadImage: (formData) => api.post('/pensees/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Paramètres publics (liens sociaux, etc.)
export const parametresAPI = {
  getPublics: () => api.get('/parametres/publics'),
};

export default api;
