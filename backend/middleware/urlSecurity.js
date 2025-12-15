/**
 * 🔒 Middleware de Sécurité pour les URLs
 * Protection contre SSRF, Path Traversal, et URLs malveillantes
 */

const { URL } = require('url');

/**
 * Nettoyer et valider une URL avant utilisation
 * @param {string} urlString - URL à valider
 * @param {object} options - Options de validation
 * @returns {object} { valid: boolean, sanitized: string, error: string }
 */
function validateAndSanitizeUrl(urlString, options = {}) {
  const {
    allowHttp = false,        // Autoriser HTTP (non recommandé)
    allowLocalhost = false,   // Autoriser localhost (danger SSRF)
    allowPrivateIPs = false,  // Autoriser IPs privées (danger SSRF)
    allowedDomains = [],      // Whitelist de domaines (vide = tous autorisés)
    allowedProtocols = ['https:'], // Protocoles autorisés
    requireExtension = null   // Extension requise (ex: '.pdf', '.jpg')
  } = options;

  try {
    // Trim et vérifier non vide
    const trimmed = urlString.trim();
    if (!trimmed) {
      return { valid: false, error: 'URL vide' };
    }

    // Cas spécial : URLs relatives (uploads locaux)
    if (trimmed.startsWith('/uploads/')) {
      // Vérifier path traversal
      if (trimmed.includes('..') || trimmed.includes('//') || trimmed.includes('\\')) {
        return { 
          valid: false, 
          error: 'Tentative de path traversal détectée',
          attack: 'PATH_TRAVERSAL'
        };
      }

      // Vérifier extension si requise
      if (requireExtension && !trimmed.toLowerCase().endsWith(requireExtension)) {
        return { 
          valid: false, 
          error: `Extension ${requireExtension} requise` 
        };
      }

      // Normaliser les slashes
      const normalized = trimmed.replace(/\/{2,}/g, '/');
      return { valid: true, sanitized: normalized };
    }

    // Parser l'URL complète
    const parsed = new URL(trimmed);

    // 🔒 Vérifier le protocole
    if (!allowedProtocols.includes(parsed.protocol)) {
      return { 
        valid: false, 
        error: `Protocole non autorisé : ${parsed.protocol}. Autorisés : ${allowedProtocols.join(', ')}`,
        attack: 'INVALID_PROTOCOL'
      };
    }

    // 🔒 Vérifier HTTPS obligatoire (sauf si allowHttp)
    if (!allowHttp && parsed.protocol === 'http:') {
      return { 
        valid: false, 
        error: 'HTTPS requis pour les URLs externes',
        attack: 'INSECURE_PROTOCOL'
      };
    }

    // 🔒 Bloquer les protocoles dangereux
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'ftp:'];
    if (dangerousProtocols.some(proto => trimmed.toLowerCase().startsWith(proto))) {
      return { 
        valid: false, 
        error: 'Protocole dangereux détecté',
        attack: 'DANGEROUS_PROTOCOL'
      };
    }

    const hostname = parsed.hostname.toLowerCase();

    // 🔒 SSRF Protection : Bloquer localhost
    if (!allowLocalhost) {
      const localhostPatterns = [
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
        '::1',
        '[::1]'
      ];
      
      if (localhostPatterns.includes(hostname)) {
        return { 
          valid: false, 
          error: 'Accès à localhost interdit',
          attack: 'SSRF_LOCALHOST'
        };
      }
    }

    // 🔒 SSRF Protection : Bloquer IPs privées
    if (!allowPrivateIPs) {
      const privateIPPatterns = [
        /^10\./,                          // 10.0.0.0/8
        /^172\.(1[6-9]|2[0-9]|3[01])\./,  // 172.16.0.0/12
        /^192\.168\./,                     // 192.168.0.0/16
        /^169\.254\./,                     // Link-local
        /^fc00:/,                          // IPv6 private
        /^fe80:/                           // IPv6 link-local
      ];

      if (privateIPPatterns.some(pattern => pattern.test(hostname))) {
        return { 
          valid: false, 
          error: 'Accès aux IPs privées interdit',
          attack: 'SSRF_PRIVATE_IP'
        };
      }
    }

    // 🔒 Whitelist de domaines
    if (allowedDomains.length > 0) {
      const domainMatch = allowedDomains.some(domain => {
        return hostname === domain || hostname.endsWith(`.${domain}`);
      });

      if (!domainMatch) {
        return { 
          valid: false, 
          error: `Domaine non autorisé : ${hostname}. Autorisés : ${allowedDomains.join(', ')}`,
          attack: 'DOMAIN_NOT_WHITELISTED'
        };
      }
    }

    // 🔒 Vérifier les caractères suspects dans le path
    const suspiciousPatterns = [
      /<script>/i,
      /javascript:/i,
      /<iframe>/i,
      /<object>/i,
      /<embed>/i,
      /on\w+=/i  // onclick=, onerror=, etc.
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(trimmed))) {
      return { 
        valid: false, 
        error: 'Caractères suspects détectés dans l\'URL',
        attack: 'XSS_ATTEMPT'
      };
    }

    // 🔒 Vérifier l'extension si requise
    if (requireExtension) {
      const pathname = parsed.pathname.toLowerCase();
      if (!pathname.endsWith(requireExtension)) {
        return { 
          valid: false, 
          error: `Extension ${requireExtension} requise` 
        };
      }
    }

    // URL valide
    return { 
      valid: true, 
      sanitized: parsed.toString() 
    };

  } catch (error) {
    return { 
      valid: false, 
      error: `URL malformée : ${error.message}`,
      attack: 'MALFORMED_URL'
    };
  }
}

/**
 * Middleware Express pour valider les URLs d'images
 */
function validateImageUrl(req, res, next) {
  const imageUrl = req.body.image_url;

  if (!imageUrl || imageUrl === '') {
    // URL optionnelle
    return next();
  }

  const result = validateAndSanitizeUrl(imageUrl, {
    allowHttp: false,
    allowLocalhost: false,
    allowPrivateIPs: false,
    allowedProtocols: ['https:'],
    requireExtension: null // Pas de restriction d'extension
  });

  if (!result.valid) {
    console.warn('🚨 URL d\'image invalide:', {
      url: imageUrl,
      error: result.error,
      attack: result.attack,
      ip: req.ip,
      user: req.user?.email
    });

    return res.status(400).json({
      success: false,
      message: `URL d'image invalide : ${result.error}`,
      code: result.attack || 'INVALID_URL'
    });
  }

  // Remplacer par l'URL sanitizée
  req.body.image_url = result.sanitized;
  next();
}

/**
 * Middleware Express pour valider les URLs de PDF
 */
function validatePdfUrl(req, res, next) {
  const pdfUrl = req.body.pdf_url;

  if (!pdfUrl || pdfUrl === '') {
    return next();
  }

  const result = validateAndSanitizeUrl(pdfUrl, {
    allowHttp: false,
    allowLocalhost: false,
    allowPrivateIPs: false,
    allowedProtocols: ['https:'],
    requireExtension: '.pdf'
  });

  if (!result.valid) {
    console.warn('🚨 URL de PDF invalide:', {
      url: pdfUrl,
      error: result.error,
      attack: result.attack,
      ip: req.ip,
      user: req.user?.email
    });

    return res.status(400).json({
      success: false,
      message: `URL de PDF invalide : ${result.error}`,
      code: result.attack || 'INVALID_URL'
    });
  }

  req.body.pdf_url = result.sanitized;
  next();
}

/**
 * Middleware Express pour valider les URLs YouTube
 */
function validateYoutubeUrl(req, res, next) {
  const videoUrl = req.body.video_url;

  if (!videoUrl || videoUrl === '') {
    return next();
  }

  const result = validateAndSanitizeUrl(videoUrl, {
    allowHttp: false,
    allowLocalhost: false,
    allowPrivateIPs: false,
    allowedDomains: ['youtube.com', 'www.youtube.com', 'youtu.be'],
    allowedProtocols: ['https:']
  });

  if (!result.valid) {
    console.warn('🚨 URL YouTube invalide:', {
      url: videoUrl,
      error: result.error,
      attack: result.attack,
      ip: req.ip,
      user: req.user?.email
    });

    return res.status(400).json({
      success: false,
      message: `URL YouTube invalide : ${result.error}`,
      code: result.attack || 'INVALID_URL'
    });
  }

  req.body.video_url = result.sanitized;
  next();
}

module.exports = {
  validateAndSanitizeUrl,
  validateImageUrl,
  validatePdfUrl,
  validateYoutubeUrl
};
