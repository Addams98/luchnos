/**
 * @fileoverview Hook React pour la déconnexion automatique après inactivité
 * Surveille l'activité utilisateur et déconnecte après un délai d'inactivité
 * @module hooks/useAutoLogout
 */

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook personnalisé pour déconnecter automatiquement l'utilisateur après inactivité
 * 
 * Fonctionnalités:
 * - Démarre un timer au chargement de la page
 * - Reset le timer à chaque activité utilisateur (souris, clavier, scroll, touch)
 * - Déconnecte et redirige vers /admin/login après le délai d'inactivité
 * - Vérifie au chargement si la session a expiré pendant l'absence
 * - Sauvegarde le timestamp de dernière activité lors de la fermeture de page
 * 
 * @param {number} timeout - Délai d'inactivité en millisecondes (défaut: 15 minutes = 900000ms)
 * @returns {{ logout: Function }} - Objet contenant la fonction de déconnexion manuelle
 * 
 * @example
 * // Dans un composant admin
 * const AdminLayout = () => {
 *   useAutoLogout(15 * 60 * 1000); // 15 minutes
 *   return <div>...</div>;
 * };
 */
const useAutoLogout = (timeout = 15 * 60 * 1000) => {
  const navigate = useNavigate();
  
  /**
   * Référence mutable pour stocker l'ID du timer
   * Permet de clearTimeout sans re-render
   * @type {React.MutableRefObject<NodeJS.Timeout|null>}
   */
  const timeoutId = useRef(null);

  /**
   * Déconnecte l'utilisateur et nettoie toutes les données de session
   * 
   * Actions effectuées:
   * - Supprime tous les tokens du localStorage
   * - Supprime les données utilisateur
   * - Redirige vers /admin/login avec replace (pas d'historique)
   * - Log un message dans la console pour debug
   * 
   * @returns {void}
   */
  const logout = () => {
    // Nettoyer le localStorage
    localStorage.removeItem('luchnos_access_token');
    localStorage.removeItem('luchnos_refresh_token');
    localStorage.removeItem('luchnos_user');
    localStorage.removeItem('luchnos_token'); // Ancien token (migration)
    
    // Rediriger vers login (replace pour éviter retour arrière)
    navigate('/admin/login', { replace: true });
    
    // Log pour debugging
    console.log('🔒 Session expirée - Déconnexion automatique');
  };

  /**
   * Réinitialise le timer d'inactivité
   * 
   * Appelé à chaque activité utilisateur pour prolonger la session
   * Efface l'ancien timer et en crée un nouveau
   * 
   * @returns {void}
   */
  const resetTimer = () => {
    // Effacer le timer existant si présent
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    
    // Créer un nouveau timer qui déconnecte après le délai d'inactivité
    timeoutId.current = setTimeout(() => {
      logout();
    }, timeout);
  };

  useEffect(() => {
    // Événements qui indiquent une activité utilisateur
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Réinitialiser le timer à chaque activité
    const handleActivity = () => {
      resetTimer();
    };

    // Ajouter les écouteurs d'événements
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Vérifier au chargement si la session est expirée (avant de démarrer le timer)
    const lastActivity = localStorage.getItem('luchnos_last_activity');
    const hasToken = localStorage.getItem('luchnos_access_token') || localStorage.getItem('luchnos_token');
    
    // Vérifier l'expiration UNIQUEMENT si:
    // 1. Il y a un token (utilisateur connecté)
    // 2. Il y a une dernière activité enregistrée
    // 3. Le temps écoulé dépasse le timeout
    if (hasToken && lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
      if (timeSinceLastActivity > timeout) {
        // Session expirée pendant l'absence
        console.log('🔒 Session expirée (inactivité depuis', Math.round(timeSinceLastActivity / 60000), 'minutes)');
        logout();
        return; // Ne pas continuer si on déconnecte
      }
    }

    // Démarrer le timer initial (seulement si pas déconnecté)
    resetTimer();

    // Sauvegarder le timestamp de dernière activité lors de la fermeture
    const handleBeforeUnload = () => {
      // Sauvegarder le moment de fermeture pour vérifier au prochain chargement
      localStorage.setItem('luchnos_last_activity', Date.now().toString());
    };

    // Écouter la fermeture de page
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Nettoyer lors du démontage
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [timeout]);

  return { logout };
};

export default useAutoLogout;
