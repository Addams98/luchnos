import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // 🔒 Vérifier les nouveaux tokens (avec fallback pour migration)
  const accessToken = localStorage.getItem('luchnos_access_token');
  const oldToken = localStorage.getItem('luchnos_token'); // Pour compatibilité
  
  console.log('🛡️ [ProtectedRoute] Vérification:', {
    hasAccessToken: !!accessToken,
    hasOldToken: !!oldToken,
    accessTokenLength: accessToken?.length,
    willRedirect: !accessToken && !oldToken
  });
  
  if (!accessToken && !oldToken) {
    console.log('❌ [ProtectedRoute] Pas de token → Redirection vers login');
    return <Navigate to="/admin/login" replace />;
  }

  // Migration automatique : si ancien token présent mais pas le nouveau
  if (oldToken && !accessToken) {
    console.warn('⚠️ Ancien format de token détecté. Reconnectez-vous pour la sécurité renforcée.');
  }

  console.log('✅ [ProtectedRoute] Token valide → Accès autorisé');
  return children;
};

export default ProtectedRoute;
