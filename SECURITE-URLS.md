# 🔒 Sécurité des URLs - Documentation

## Vue d'ensemble

Les URLs dans l'application Luchnos sont maintenant **entièrement sécurisées** contre :
- ✅ **SSRF** (Server-Side Request Forgery)
- ✅ **Path Traversal** (../../../etc/passwd)
- ✅ **XSS** (Cross-Site Scripting via URLs)
- ✅ **Protocol Injection** (javascript:, data:, file:)
- ✅ **Private IP Access** (192.168.x.x, 10.x.x.x, localhost)

---

## Protections Implémentées

### 1. Validation Stricte des Protocoles

#### ❌ BLOQUÉ
```javascript
http://example.com/image.jpg        // HTTP non sécurisé
javascript:alert('XSS')              // Injection JavaScript
data:text/html,<script>...</script>  // Data URL dangereuse
file:///etc/passwd                   // Accès fichiers système
ftp://example.com/file.pdf           // FTP non autorisé
```

#### ✅ AUTORISÉ
```javascript
https://example.com/image.jpg       // HTTPS uniquement
/uploads/livres/book-123.jpg        // Uploads locaux
/uploads/pdfs/document.pdf          // PDFs locaux
```

---

### 2. Protection SSRF (Server-Side Request Forgery)

#### Qu'est-ce que SSRF ?
Attaque où un attaquant force le serveur à faire des requêtes vers des ressources internes.

#### ❌ BLOQUÉ
```javascript
// Tentatives d'accès à localhost
https://localhost/admin
https://127.0.0.1/secret
https://[::1]/internal

// IPs privées (réseau interne)
https://192.168.1.1/router-config
https://10.0.0.1/database
https://172.16.0.1/admin
```

#### ✅ AUTORISÉ
```javascript
// Domaines publics uniquement
https://youtube.com/watch?v=...
https://cdn.example.com/image.jpg
https://storage.googleapis.com/bucket/file.pdf
```

---

### 3. Protection Path Traversal

#### ❌ BLOQUÉ
```javascript
/uploads/../../../etc/passwd        // Remonte dans l'arborescence
/uploads/livres//secret.pdf         // Double slash
/uploads/livres\..\windows\system32 // Backslash Windows
```

#### ✅ AUTORISÉ
```javascript
/uploads/livres/book-123.jpg
/uploads/pdfs/document-456.pdf
/uploads/evenements/conference.jpg
```

---

### 4. Protection XSS via URLs

#### ❌ BLOQUÉ
```javascript
https://example.com/image.jpg?param=<script>alert('XSS')</script>
https://example.com/page.html#<iframe src="evil.com">
https://example.com/file?onclick=malicious()
https://example.com/img?onerror=alert(1)
```

---

### 5. Whitelist de Domaines (YouTube)

Pour les vidéos YouTube, **seuls les domaines officiels** sont autorisés :

#### ✅ AUTORISÉ
```javascript
https://youtube.com/watch?v=abcd1234
https://www.youtube.com/watch?v=abcd1234
https://youtu.be/abcd1234
https://youtube.com/embed/abcd1234
```

#### ❌ BLOQUÉ
```javascript
https://youtube-fake.com/watch?v=...  // Domaine similaire
https://evil.com/youtube/video.mp4    // Faux YouTube
http://youtube.com/watch?v=...        // HTTP non sécurisé
```

---

## Middlewares Disponibles

### `validateImageUrl`
Valide les URLs d'images (image_url).

```javascript
// Routes protégées
router.post('/livres', validateImageUrl, async (req, res) => {
  // req.body.image_url est sanitizée
});
```

**Règles** :
- HTTPS obligatoire (URLs externes)
- `/uploads/` autorisé (uploads locaux)
- Pas de localhost/IPs privées
- Pas de path traversal

---

### `validatePdfUrl`
Valide les URLs de PDF (pdf_url).

```javascript
router.post('/livres', validatePdfUrl, async (req, res) => {
  // req.body.pdf_url est sanitizée et doit finir par .pdf
});
```

**Règles** :
- HTTPS obligatoire
- Extension `.pdf` obligatoire
- `/uploads/pdfs/` autorisé
- Pas de localhost/IPs privées

---

### `validateYoutubeUrl`
Valide les URLs YouTube (video_url).

```javascript
router.post('/multimedia', validateYoutubeUrl, async (req, res) => {
  // req.body.video_url est validée (youtube.com uniquement)
});
```

**Règles** :
- Domaines : `youtube.com`, `www.youtube.com`, `youtu.be`
- HTTPS obligatoire
- Aucun autre domaine accepté

---

## Fonction Utilitaire

### `validateAndSanitizeUrl(url, options)`

Fonction générique de validation d'URL.

```javascript
const { validateAndSanitizeUrl } = require('./middleware/urlSecurity');

const result = validateAndSanitizeUrl('https://example.com/image.jpg', {
  allowHttp: false,           // HTTPS uniquement
  allowLocalhost: false,      // Bloquer localhost
  allowPrivateIPs: false,     // Bloquer IPs privées
  allowedDomains: [],         // Whitelist (vide = tous)
  allowedProtocols: ['https:'],
  requireExtension: '.jpg'    // Extension requise
});

if (result.valid) {
  console.log('URL saine:', result.sanitized);
} else {
  console.error('URL dangereuse:', result.error);
  console.error('Type d\'attaque:', result.attack);
}
```

**Retour** :
```javascript
{
  valid: true,
  sanitized: "https://example.com/image.jpg"
}
// OU
{
  valid: false,
  error: "Accès à localhost interdit",
  attack: "SSRF_LOCALHOST"
}
```

---

## Types d'Attaques Détectées

| Code | Description | Exemple |
|------|-------------|---------|
| `PATH_TRAVERSAL` | Tentative de sortir du dossier | `../../../etc/passwd` |
| `INVALID_PROTOCOL` | Protocole non autorisé | `ftp://`, `file://` |
| `INSECURE_PROTOCOL` | HTTP au lieu de HTTPS | `http://example.com` |
| `DANGEROUS_PROTOCOL` | Protocole malveillant | `javascript:`, `data:` |
| `SSRF_LOCALHOST` | Tentative d'accès à localhost | `127.0.0.1` |
| `SSRF_PRIVATE_IP` | Tentative d'accès IP privée | `192.168.1.1` |
| `DOMAIN_NOT_WHITELISTED` | Domaine non autorisé | Non-YouTube pour vidéo |
| `XSS_ATTEMPT` | Injection de code | `<script>`, `onclick=` |
| `MALFORMED_URL` | URL invalide | `ht!tp://bad` |

---

## Logging et Alertes

Toutes les tentatives d'attaque sont **loggées** :

```javascript
console.warn('🚨 URL invalide:', {
  url: 'https://192.168.1.1/admin',
  error: 'Accès aux IPs privées interdit',
  attack: 'SSRF_PRIVATE_IP',
  ip: '45.67.89.123',
  user: 'admin@luchnos.com'
});
```

**Recommandation** : Intégrer un système d'alertes (email, Slack, Sentry) pour les attaques répétées.

---

## Tests de Sécurité

### Test 1 : SSRF vers localhost
```bash
curl -X POST https://luchnos.onrender.com/api/livres \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://localhost/admin"}'

# Résultat attendu : 400 Bad Request
# { "success": false, "code": "SSRF_LOCALHOST" }
```

### Test 2 : Path Traversal
```bash
curl -X POST https://luchnos.onrender.com/api/livres \
  -H "Content-Type: application/json" \
  -d '{"image_url": "/uploads/../../../etc/passwd"}'

# Résultat attendu : 400 Bad Request
# { "success": false, "code": "PATH_TRAVERSAL" }
```

### Test 3 : Protocol Injection
```bash
curl -X POST https://luchnos.onrender.com/api/livres \
  -H "Content-Type: application/json" \
  -d '{"image_url": "javascript:alert(1)"}'

# Résultat attendu : 400 Bad Request
# { "success": false, "code": "DANGEROUS_PROTOCOL" }
```

### Test 4 : YouTube Fake Domain
```bash
curl -X POST https://luchnos.onrender.com/api/multimedia \
  -H "Content-Type: application/json" \
  -d '{"video_url": "https://youtube-fake.com/watch?v=123"}'

# Résultat attendu : 400 Bad Request
# { "success": false, "code": "DOMAIN_NOT_WHITELISTED" }
```

---

## Configuration Avancée

### Autoriser HTTP en Développement

**⚠️ DANGER** : Ne jamais faire en production !

```javascript
// backend/middleware/urlSecurity.js
const allowHttp = process.env.NODE_ENV === 'development';

const result = validateAndSanitizeUrl(url, {
  allowHttp: allowHttp,  // HTTP OK en dev uniquement
  // ...
});
```

### Ajouter des Domaines de Confiance

Pour autoriser des CDN spécifiques :

```javascript
const result = validateAndSanitizeUrl(url, {
  allowedDomains: [
    'cloudflare.com',
    'cdn.example.com',
    'storage.googleapis.com'
  ]
});
```

---

## Checklist de Sécurité URL

- [x] HTTPS obligatoire (URLs externes)
- [x] Protocoles dangereux bloqués (javascript:, data:, file:)
- [x] SSRF localhost bloqué (127.0.0.1, ::1)
- [x] SSRF IPs privées bloqué (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
- [x] Path traversal bloqué (../, //, \\)
- [x] XSS via URL bloqué (<script>, onclick=, etc.)
- [x] Whitelist YouTube (domaines officiels uniquement)
- [x] Validation extensions (.pdf, .jpg, etc.)
- [x] Logging des tentatives d'attaque
- [x] Sanitization automatique des URLs valides
- [x] Codes d'erreur explicites (SSRF_LOCALHOST, etc.)

---

## Conformité OWASP

| Vulnérabilité OWASP | Status | Mesure |
|---------------------|--------|--------|
| **A03:2021 - Injection** | ✅ | Validation stricte, sanitization |
| **A10:2021 - SSRF** | ✅ | Blocage localhost/IPs privées |
| **A05:2021 - Misconfiguration** | ✅ | HTTPS obligatoire, protocoles restreints |
| **A07:2021 - XSS** | ✅ | Détection <script>, onclick=, etc. |

---

## Références

- [OWASP SSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
- [CWE-918: SSRF](https://cwe.mitre.org/data/definitions/918.html)
- [RFC 3986: URI Generic Syntax](https://www.rfc-editor.org/rfc/rfc3986)

---

**Date** : 2024  
**Version** : 1.0  
**Auteur** : GitHub Copilot (AI Security)  
**Status** : ✅ Production Ready
