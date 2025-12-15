import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // 🔒 Vérifier les nouveaux tokens (avec fallback pour migration)
  const accessToken = localStorage.getItem('luchnos_access_token');
  const oldToken = localStorage.getItem('luchnos_token'); // Pour compatibilité
  
  if (!accessToken && !oldToken) {
    return <Navigate to="/admin/login" replace />;
  }

  // Migration automatique : si ancien token présent mais pas le nouveau
  if (oldToken && !accessToken) {
    console.warn('⚠️ Ancien format de token détecté. Reconnectez-vous pour la sécurité renforcée.');
  }

  return children;
};

export default ProtectedRoute;
