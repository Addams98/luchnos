/**
 * 🔒 Utilitaires de Sécurité Frontend
 * Protection contre XSS, injection, et données malveillantes
 */

/**
 * Nettoyer une chaîne de caractères pour éviter XSS
 * @param {string} str - Chaîne à nettoyer
 * @returns {string} Chaîne nettoyée
 */
export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  
  // Trim les espaces
  let clean = str.trim();
  
  // Remplacer les caractères HTML dangereux
  const htmlEntities = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  clean = clean.replace(/[<>"'`=\/]/g, (char) => htmlEntities[char]);
  
  return clean;
};

/**
 * Valider un email (frontend)
 * @param {string} email - Email à valider
 * @returns {boolean} true si valide
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valider un numéro de téléphone
 * @param {string} phone - Téléphone à valider
 * @returns {boolean} true si valide
 */
export const isValidPhone = (phone) => {
  // Format international ou local
  const phoneRegex = /^[\d\s+()-]{8,20}$/;
  return phoneRegex.test(phone);
};

/**
 * Valider la longueur d'un champ
 * @param {string} value - Valeur à valider
 * @param {number} min - Longueur minimale
 * @param {number} max - Longueur maximale
 * @returns {object} { valid: boolean, error: string }
 */
export const validateLength = (value, min, max) => {
  const length = value.trim().length;
  
  if (length < min) {
    return { 
      valid: false, 
      error: `Minimum ${min} caractères requis` 
    };
  }
  
  if (length > max) {
    return { 
      valid: false, 
      error: `Maximum ${max} caractères autorisés` 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Valider un formulaire de contact
 * @param {object} formData - Données du formulaire
 * @returns {object} { valid: boolean, errors: object }
 */
export const validateContactForm = (formData) => {
  const errors = {};
  
  // Nom
  if (!formData.nom || formData.nom.trim() === '') {
    errors.nom = 'Le nom est requis';
  } else {
    const lengthCheck = validateLength(formData.nom, 2, 100);
    if (!lengthCheck.valid) {
      errors.nom = lengthCheck.error;
    }
  }
  
  // Email
  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'L\'email est requis';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Email invalide';
  }
  
  // Téléphone (optionnel mais validé si présent)
  if (formData.telephone && formData.telephone.trim() !== '') {
    if (!isValidPhone(formData.telephone)) {
      errors.telephone = 'Numéro de téléphone invalide';
    }
  }
  
  // Message
  if (!formData.message || formData.message.trim() === '') {
    errors.message = 'Le message est requis';
  } else {
    const lengthCheck = validateLength(formData.message, 10, 5000);
    if (!lengthCheck.valid) {
      errors.message = lengthCheck.error;
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valider un formulaire de témoignage
 * @param {object} formData - Données du formulaire
 * @returns {object} { valid: boolean, errors: object }
 */
export const validateTestimonialForm = (formData) => {
  const errors = {};
  
  // Nom
  if (!formData.nom || formData.nom.trim() === '') {
    errors.nom = 'Le nom est requis';
  } else {
    const lengthCheck = validateLength(formData.nom, 2, 100);
    if (!lengthCheck.valid) {
      errors.nom = lengthCheck.error;
    }
  }
  
  // Email (optionnel mais validé si présent)
  if (formData.email && formData.email.trim() !== '') {
    if (!isValidEmail(formData.email)) {
      errors.email = 'Email invalide';
    }
  }
  
  // Contenu du témoignage
  if (!formData.contenu || formData.contenu.trim() === '') {
    errors.contenu = 'Le témoignage est requis';
  } else {
    const lengthCheck = validateLength(formData.contenu, 20, 5000);
    if (!lengthCheck.valid) {
      errors.contenu = lengthCheck.error;
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valider un formulaire de login
 * @param {object} formData - Données du formulaire
 * @returns {object} { valid: boolean, errors: object }
 */
export const validateLoginForm = (formData) => {
  const errors = {};
  
  // Email
  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'L\'email est requis';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Email invalide';
  }
  
  // Password
  if (!formData.password || formData.password.trim() === '') {
    errors.password = 'Le mot de passe est requis';
  } else if (formData.password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Détecter des patterns suspects (potentielle injection)
 * @param {string} value - Valeur à vérifier
 * @returns {boolean} true si suspect
 */
export const detectSuspiciousPatterns = (value) => {
  if (typeof value !== 'string') return false;
  
  const suspiciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,  // Script tags
    /javascript:/gi,                  // JavaScript protocol
    /on\w+\s*=/gi,                    // Event handlers (onclick, onerror, etc.)
    /<iframe/gi,                      // IFrames
    /<object/gi,                      // Object embeds
    /<embed/gi,                       // Embed tags
    /eval\(/gi,                       // eval function
    /expression\(/gi,                 // CSS expression
    /vbscript:/gi,                    // VBScript protocol
    /data:text\/html/gi               // Data URI HTML
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(value));
};

/**
 * Nettoyer un objet de formulaire entier
 * @param {object} formData - Données du formulaire
 * @returns {object} Données nettoyées
 */
export const sanitizeFormData = (formData) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      // Vérifier les patterns suspects
      if (detectSuspiciousPatterns(value)) {
        console.warn(`🚨 Pattern suspect détecté dans le champ: ${key}`);
        sanitized[key] = sanitizeInput(value);
      } else {
        sanitized[key] = value.trim();
      }
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Hook React pour la validation de formulaire
 * @param {function} validationFunction - Fonction de validation
 * @returns {object} { validate, errors, setErrors }
 */
export const useFormValidation = (validationFunction) => {
  const [errors, setErrors] = React.useState({});
  
  const validate = (formData) => {
    const result = validationFunction(formData);
    setErrors(result.errors);
    return result.valid;
  };
  
  const clearError = (field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };
  
  return { validate, errors, setErrors, clearError };
};

/**
 * Encoder les caractères HTML pour affichage sûr
 * @param {string} text - Texte à encoder
 * @returns {string} Texte encodé
 */
export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

/**
 * Limiter le taux de soumission (rate limiting côté client)
 * @param {function} callback - Fonction à exécuter
 * @param {number} delay - Délai en ms (défaut: 1000ms)
 * @returns {function} Fonction throttled
 */
export const throttleSubmit = (callback, delay = 1000) => {
  let lastCall = 0;
  
  return (...args) => {
    const now = Date.now();
    
    if (now - lastCall < delay) {
      console.warn('⚠️ Soumission trop rapide. Veuillez patienter.');
      return Promise.reject(new Error('Veuillez patienter avant de soumettre à nouveau'));
    }
    
    lastCall = now;
    return callback(...args);
  };
};

/**
 * Vérifier la force du mot de passe
 * @param {string} password - Mot de passe à vérifier
 * @returns {object} { score: number, feedback: string[] }
 */
export const checkPasswordStrength = (password) => {
  let score = 0;
  const feedback = [];
  
  // Longueur
  if (password.length >= 8) score++;
  else feedback.push('Au moins 8 caractères');
  
  if (password.length >= 12) score++;
  
  // Majuscules
  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Au moins une majuscule');
  
  // Minuscules
  if (/[a-z]/.test(password)) score++;
  else feedback.push('Au moins une minuscule');
  
  // Chiffres
  if (/\d/.test(password)) score++;
  else feedback.push('Au moins un chiffre');
  
  // Caractères spéciaux
  if (/[@$!%*?&]/.test(password)) score++;
  else feedback.push('Au moins un caractère spécial (@$!%*?&)');
  
  return {
    score, // 0-6
    strength: score <= 2 ? 'Faible' : score <= 4 ? 'Moyen' : 'Fort',
    feedback
  };
};

export default {
  sanitizeInput,
  isValidEmail,
  isValidPhone,
  validateLength,
  validateContactForm,
  validateTestimonialForm,
  validateLoginForm,
  detectSuspiciousPatterns,
  sanitizeFormData,
  escapeHtml,
  throttleSubmit,
  checkPasswordStrength
};
