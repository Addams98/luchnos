import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const BackendStatus = () => {
  const [status, setStatus] = useState('checking'); // checking, online, offline, waking
  const [message, setMessage] = useState('Vérification du serveur...');

  useEffect(() => {
    checkBackendStatus();
    // Vérifier toutes les 10 secondes si offline
    const interval = setInterval(() => {
      if (status === 'offline' || status === 'waking') {
        checkBackendStatus();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [status]);

  const checkBackendStatus = async () => {
    try {
      const isProduction = window.location.hostname.includes('onrender.com');
      const backendURL = isProduction 
        ? 'https://luchnos.onrender.com/api/health'
        : 'http://localhost:5000/api/health';

      const response = await axios.get(backendURL, { timeout: 5000 });
      
      if (response.data.success) {
        setStatus('online');
        setMessage('Serveur en ligne');
      }
    } catch (error) {
      if (status === 'checking') {
        setStatus('waking');
        setMessage('Réveil du serveur en cours... (30-60 secondes)');
      } else if (status === 'waking') {
        // Continuer à attendre
        setMessage('Réveil du serveur en cours... Patientez encore quelques secondes');
      } else {
        setStatus('offline');
        setMessage('Serveur temporairement indisponible');
      }
    }
  };

  const handleWakeUp = () => {
    setStatus('waking');
    setMessage('Tentative de réveil du serveur...');
    checkBackendStatus();
  };

  // Ne rien afficher si tout est en ligne
  if (status === 'online') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className={`fixed top-20 left-0 right-0 z-40 mx-4 ${
          status === 'waking' ? 'bg-blue-500' :
          status === 'offline' ? 'bg-orange-500' :
          'bg-yellow-500'
        } text-white shadow-lg rounded-lg p-4`}
      >
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-3">
            {status === 'checking' && <FaSpinner className="animate-spin text-2xl" />}
            {status === 'waking' && <FaSpinner className="animate-spin text-2xl" />}
            {status === 'offline' && <FaExclamationTriangle className="text-2xl" />}
            
            <div>
              <p className="font-semibold">{message}</p>
              {(status === 'waking' || status === 'offline') && (
                <p className="text-sm opacity-90">
                  Le serveur gratuit Render se met en veille après inactivité. Il redémarre automatiquement à la première requête.
                </p>
              )}
            </div>
          </div>

          {status === 'offline' && (
            <button
              onClick={handleWakeUp}
              className="bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Réessayer
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BackendStatus;
