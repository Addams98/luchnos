/**
 * @fileoverview Service API central avec Axios et gestion automatique des tokens JWT
 * Gère les requêtes HTTP, l'authentification, et le refresh automatique des tokens
 * @module services/api
 */

import axios from 'axios';

/**
 * Détection automatique de l'environnement (production vs développement)
 * Basé sur le hostname de l'URL actuelle
 * @type {boolean}
 */
const isProduction = window.location.hostname.includes('onrender.com');

/**
 * URL de base pour les assets statiques (images, PDFs)
 * Production: https://luchnos.onrender.com
 * Développement: http://localhost:5000
 * @type {string}
 */
export const BASE_URL = isProduction 
  ? 'https://luchnos.onrender.com'
  : (import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');

/**
 * URL de base pour les appels API
 * Toutes les routes sont préfixées par /api
 * @type {string}
 */
const API_URL = isProduction 
  ? 'https://luchnos.onrender.com/api'
  : (import.meta.env.VITE_API_URL || `${BASE_URL}/api`);

console.log('🔗 API URL:', API_URL);
console.log('📁 BASE URL:', BASE_URL);
console.log('🌍 Environment:', isProduction ? 'Production (Render)' : 'Development (Local)');

/**
 * Instance Axios configurée pour l'API
 * Headers par défaut: Content-Type application/json
 * Base URL déterminée par l'environnement
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Flag pour éviter les boucles infinies lors du refresh de token
 * Empêche plusieurs appels simultanés à /api/auth/refresh
 * @type {boolean}
 */
let isRefreshing = false;

/**
 * File d'attente des requêtes en attente du nouveau token
 * Stocke les callbacks à appeler après le refresh réussi
 * @type {Array<Function>}
 */
let refreshSubscribers = [];

/**
 * Notifie tous les appels en attente avec le nouveau token
 * Exécute tous les callbacks stockés et vide la file
 * @param {string} token - Le nouveau access token
 * @returns {void}
 */
function onRefreshed(token) {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

/**
 * Ajoute un callback à la file d'attente du refresh token
 * Le callback sera appelé une fois le nouveau token obtenu
 * @param {Function} callback - Fonction à appeler avec le nouveau token
 * @returns {void}
 */
function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('luchnos_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔒 Intercepteur amélioré pour gérer les refresh tokens automatiquement
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Détecter si le backend est complètement down (pas de réponse)
    if (!error.response) {
      console.error('❌ Backend inaccessible:', error.message);
      console.error('🔍 Vérifiez que le backend est démarré sur:', API_URL);
      // Ne pas bloquer les requêtes publiques, juste logger l'erreur
      return Promise.reject(error);
    }

    // Si erreur 401 et pas déjà retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorCode = error.response?.data?.code;

      // Si le token est expiré, tenter de le rafraîchir
      if (errorCode === 'TOKEN_EXPIRED') {
        if (isRefreshing) {
          // Si déjà en train de rafraîchir, attendre
          return new Promise((resolve) => {
            addRefreshSubscriber((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('luchnos_refresh_token');
          
          if (!refreshToken) {
            throw new Error('Pas de refresh token disponible');
          }

          // Appeler l'endpoint de refresh
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken
          });

          const { accessToken } = response.data.data;

          // Mettre à jour le token
          localStorage.setItem('luchnos_access_token', accessToken);
          
          // Notifier tous les appels en attente
          onRefreshed(accessToken);
          
          // Réessayer la requête originale
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          isRefreshing = false;
          
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh échoué, déconnecter l'utilisateur
          isRefreshing = false;
          localStorage.removeItem('luchnos_access_token');
          localStorage.removeItem('luchnos_refresh_token');
          localStorage.removeItem('luchnos_user');
          
          if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/admin/login')) {
            window.location.href = '/admin/login';
          }
          
          return Promise.reject(refreshError);
        }
      } else {
        // Autres erreurs 401 (token invalide, etc.) → déconnexion
        localStorage.removeItem('luchnos_access_token');
        localStorage.removeItem('luchnos_refresh_token');
        localStorage.removeItem('luchnos_user');
        
        if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
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
  // 🔒 Nouvelles routes pour refresh tokens
  refresh: (refreshToken) => axios.post(`${API_URL}/auth/refresh`, { refreshToken }),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
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
