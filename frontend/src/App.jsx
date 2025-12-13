import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Presentation from './pages/Presentation';
import QuiSommesNous from './pages/QuiSommesNous';
import Multimedia from './pages/Multimedia';
import Edition from './pages/Edition';
import Evenements from './pages/Evenements';
import EvenementDetails from './pages/EvenementDetails';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/3d-effects.css';

// Admin Pages
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminEvenements from './pages/admin/Evenements';
import AdminLivres from './pages/admin/Livres';
import AdminMultimedia from './pages/admin/Multimedia';
import AdminVersets from './pages/admin/Versets';
import AdminPensees from './pages/admin/Pensees';
import AdminMessages from './pages/admin/Messages';
import AdminUtilisateurs from './pages/admin/Utilisateurs';
import AdminParametres from './pages/admin/Parametres';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Header />
            <Home />
            <Footer />
          </>
        } />
        <Route path="/presentation" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Presentation />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/qui-sommes-nous" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <QuiSommesNous />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/multimedia" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Multimedia />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/edition" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Edition />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/evenements" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Evenements />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/evenements/:id" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <EvenementDetails />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/contact" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Contact />
            </main>
            <Footer />
          </div>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/evenements" element={
          <ProtectedRoute>
            <AdminEvenements />
          </ProtectedRoute>
        } />
        <Route path="/admin/livres" element={
          <ProtectedRoute>
            <AdminLivres />
          </ProtectedRoute>
        } />
        <Route path="/admin/multimedia" element={
          <ProtectedRoute>
            <AdminMultimedia />
          </ProtectedRoute>
        } />
        <Route path="/admin/versets" element={
          <ProtectedRoute>
            <AdminVersets />
          </ProtectedRoute>
        } />
        <Route path="/admin/pensees" element={
          <ProtectedRoute>
            <AdminPensees />
          </ProtectedRoute>
        } />
        <Route path="/admin/messages" element={
          <ProtectedRoute>
            <AdminMessages />
          </ProtectedRoute>
        } />
        <Route path="/admin/utilisateurs" element={
          <ProtectedRoute>
            <AdminUtilisateurs />
          </ProtectedRoute>
        } />
        <Route path="/admin/parametres" element={
          <ProtectedRoute>
            <AdminParametres />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
