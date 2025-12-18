import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook personnalisé pour déconnecter automatiquement l'utilisateur après inactivité
 * @param {number} timeout - Délai d'inactivité en millisecondes (défaut: 15 minutes)
 */
const useAutoLogout = (timeout = 15 * 60 * 1000) => {
  const navigate = useNavigate();
  const timeoutId = useRef(null);

  const logout = () => {
    // Nettoyer le localStorage
    localStorage.removeItem('luchnos_access_token');
    localStorage.removeItem('luchnos_refresh_token');
    localStorage.removeItem('luchnos_user');
    localStorage.removeItem('luchnos_token'); // Ancien token
    
    // Rediriger vers login
    navigate('/admin/login', { replace: true });
    
    // Afficher un message optionnel
    console.log('🔒 Session expirée - Déconnexion automatique');
  };

  const resetTimer = () => {
    // Effacer le timer existant
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    
    // Créer un nouveau timer
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
