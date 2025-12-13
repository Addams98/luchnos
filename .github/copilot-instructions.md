# Luchnos (Lampe Allumée) - AI Coding Agent Instructions

## Project Overview
Christian ministry website "Lampe Allumée (Luchnos)" - mission: "Présenter Yéhoshoua (Jésus) car il est le salut des humains et il revient". French-language spiritual platform with multimedia content, book publishing (Édition Plumage), events, testimonials, and 4 ministry compartments (Missions, Formations Bibliques, Édition Plumage, Luchnos Héritage).

## Architecture

### Stack
- **Backend**: Node.js + Express + PostgreSQL on port 5000
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion on port 3000
- **Database**: PostgreSQL (`luchnos_db` database)

### Key Structure
```
backend/
  server.js           # Express app with 9 API routes
  config/database.js  # PostgreSQL pool connection (pg)
  routes/             # RESTful API endpoints (auth, livres, evenements, etc.)
  middleware/auth.js  # JWT authentication (Bearer token)
  uploads/            # Multer file storage (livres/, evenements/, pdfs/)
frontend/
  src/
    App.jsx           # React Router v7 with admin/public route split
    services/api.js   # Axios instance with JWT interceptors
    pages/            # Public pages + admin/ subdirectory
    components/       # Reusable (Header, Footer, AdminLayout, ProtectedRoute)
```

## Critical Patterns

### Authentication Flow
- JWT stored in `localStorage` as `luchnos_token` and `luchnos_user`
- Axios interceptor (`frontend/src/services/api.js`) auto-adds `Authorization: Bearer ${token}`
- Middleware (`backend/middleware/auth.js`) validates JWT, sets `req.user = {id, email, role}`
- Admin routes protected by `ProtectedRoute` component (checks localStorage + redirects)

### API Convention
All backend routes return JSON with structure:
```javascript
{ success: true, data: {...} }         // Success
{ success: false, message: "...", error: "..." } // Error
```

Frontend API calls in `services/api.js` organized by domain:
```javascript
export const livresAPI = { getAll, getById, create, update, delete, upload }
export const evenementsAPI = { ... }
// etc.
```

### File Upload Pattern
Three separate Multer configurations in `backend/config/upload.js`:
- `uploadLivre` → `uploads/livres/` (images)
- `uploadEvenement` → `uploads/evenements/` (images)
- `uploadPDF` → `uploads/pdfs/` (book PDFs)

Upload endpoints return: `{ success: true, imageUrl: "/uploads/livres/livre-123.jpg" }`
Then pass URL to POST/PUT endpoints for database storage.

### Database Schema Key Tables
- `evenements` - type_evenement (conference|seminaire|culte|autre), statut (a_venir|en_cours|termine)
- `livres` - gratuit BOOLEAN, pdf_url for free downloads
- `multimedia` - synced from YouTube API, stores video_url + thumbnail_url
- `temoignages` - approuve BOOLEAN (admin approval required)
- `utilisateurs` - role ENUM('admin', 'user'), bcrypt passwords

## Development Workflow

### Quick Start
```powershell
# Ensure PostgreSQL running (port 5432)
# Start both servers:
.\START.bat   # Launches backend + frontend + auto-opens browser

# Or individually:
.\start-backend.bat   # cd backend; npm start
.\start-frontend.bat  # cd frontend; npm run dev
```

### Database Setup
Database schema in `backend/config/database.sql` - run via:
```powershell
.\setup-database.bat  # Creates luchnos DB + imports schema
```

Admin user creation: Import `backend/config/admin-migration.sql` or `update-admin-password.sql`

### Testing Admin Access
```powershell
.\TESTER-ADMIN.bat    # Opens admin login at http://localhost:3000/admin/login
```

## Design System (from `CHARTE-GRAPHIQUE.md`)

### Tailwind Theme (`frontend/tailwind.config.js`)
```javascript
colors: {
  primary: '#191F34',      // Navy blue (logo background)
  gold: '#FFC100',         // Yellow text/flame from logo
  copper: '#CC7447',       // Orange/brown lamp color
  flame: { yellow: '#FFC100', orange: '#FF8C00', glow: '#FFD700' }
}
boxShadow: {
  'glow': '0 0 20px rgba(244, 196, 48, 0.3)',  // Use for gold accents
  'flame': '0 0 30px rgba(255, 244, 79, 0.5)'  // Use for buttons/CTAs
}
```

**Never use generic blue/yellow** - always reference brand colors: `bg-primary`, `text-gold`, `shadow-glow`

### Typography
- Headers: Serif (Georgia fallback) for spiritual/traditional feel
- Body: Inter sans-serif
- Always French text, formal tone ("vous" not "tu")

## Common Tasks

### Adding New API Endpoint
1. Create route handler in `backend/routes/{domain}.js`
2. Add to `backend/server.js`: `app.use('/api/{domain}', require('./routes/{domain}'));`
3. Add corresponding method in `frontend/src/services/api.js` export
4. Backend routes use async/await with `db.query()` (pg pool)

### Adding Admin Page
1. Create `frontend/src/pages/admin/{Page}.jsx`
2. Import in `frontend/src/App.jsx`
3. Add route inside `<Route path="/admin" element={<ProtectedRoute>...}>` block
4. Use `<AdminLayout>` wrapper for consistent sidebar navigation

### File Upload Feature
1. Add Multer config in `backend/config/upload.js` (define storage + filter)
2. Create POST route: `router.post('/upload', upload.single('file'), (req, res) => ...)`
3. Frontend: Use FormData, `api.post('/upload', formData, {headers: {'Content-Type': 'multipart/form-data'}})`
4. Return file URL, then include in subsequent POST/PUT to main resource endpoint

## Important Context

### Batch Files (Windows-Specific)
Project uses `.bat` scripts for dev convenience on Windows:
- `START.bat` - Production-like full startup (checks PostgreSQL, seeds DB if needed)
- All batch files check PostgreSQL port 5432 availability before proceeding
- PowerShell alternatives exist (`.ps1` files) but batch preferred

### French Localization
All UI text, error messages, and documentation in French. When generating:
- Form labels: "Nom", "Email", "Message", not "Name", "Email", "Message"
- Buttons: "Envoyer", "Télécharger", "Créer", not "Submit", "Download", "Create"
- Dates: Use `fr-FR` locale formatting

### YouTube Integration
`backend/routes/youtube.js` syncs videos from YouTube Data API v3:
- `/api/youtube/sync` fetches channel uploads, stores in `multimedia` table
- Requires `YOUTUBE_API_KEY` in `.env`
- Stores `video_url` (embed format) and `thumbnail_url` (maxres)

### Asset Management
Static files in `frontend/public/assets/` served at `/assets/` path. 
User uploads in `backend/uploads/` served at `/uploads/` via `express.static`.
Logo: `frontend/public/assets/logo.png` (transparent PNG with lamp motif)

## Common Gotchas

1. **Port conflicts**: Backend 5000, Frontend 3000 - check if occupied before starting
2. **CORS**: Already configured in `server.js` - don't add more middleware
3. **JWT expiration**: 24h default - frontend auto-redirects on 401
4. **PostgreSQL syntax**: Use $1, $2 placeholders (not ?), rowCount (not affectedRows), RETURNING * (not insertId)
5. **File paths**: Use `path.join(__dirname, ...)` in Node, never hardcode C:\
6. **React Router**: Using v7 syntax (`createBrowserRouter` compatible but using old `<Routes>`)

## Documentation References
- Full setup: `README.md`
- Quick start: `LIRE-MOI-D-ABORD.md`
- Design specs: `CHARTE-GRAPHIQUE.md`
- Asset guide: `GUIDE-ASSETS.md`
- Completion status: `PROJET-TERMINE.md`

## Preferred Practices
- Backend: `async/await` with try/catch, return early on errors
- Frontend: Functional components with hooks, no class components
- State: Local `useState` for forms, no global state library needed
- Styling: Tailwind utility classes, custom `3d-effects.css` for animations
- Error handling: Toast-like notifications (not implemented - just console.error currently)
