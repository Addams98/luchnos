import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFire, FaFacebook, FaYoutube, FaInstagram, FaTwitter, FaEnvelope, FaWhatsapp, FaPhone } from 'react-icons/fa';
import { parametresAPI } from '../services/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState({
    facebook_url: '#',
    youtube_url: '#',
    instagram_url: '#',
    whatsapp_url: '#'
  });

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      const response = await parametresAPI.getPublics();
      if (response.data.success) {
        setSocialLinks(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement liens sociaux:', error);
      // Ignorer silencieusement l'erreur côté public
    }
  };

  return (
    <footer className="bg-primary text-white">
      {/* Section principale */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Lampe Allumée (Luchnos)" 
                className="h-16 w-16 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl">
                  LAMPE ALLUMÉE
                </span>
                <span className="text-gold text-xs font-semibold">
                  (LUCHNOS)
                </span>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Centre Missionnaire dédié à rallumer, éclairer, encourager et équiper les saints en vue de la préparation au retour de l'Époux et de répondre à son appel.
            </p>
            {/* Réseaux sociaux */}
            <div className="flex space-x-4">
              <a
                href={socialLinks.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-gold transition-colors text-xl"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href={socialLinks.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-gold transition-colors text-xl"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
              <a
                href={socialLinks.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-gold transition-colors text-xl"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href={socialLinks.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-gold transition-colors text-xl"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-gold font-bold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-gold transition-colors text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/presentation" className="text-slate-300 hover:text-gold transition-colors text-sm">
                  Présentation
                </Link>
              </li>
              <li>
                <Link to="/qui-sommes-nous" className="text-slate-300 hover:text-gold transition-colors text-sm">
                  Qui Sommes-Nous ?
                </Link>
              </li>
              <li>
                <Link to="/multimedia" className="text-slate-300 hover:text-gold transition-colors text-sm">
                  Multimédia
                </Link>
              </li>
              <li>
                <Link to="/edition" className="text-slate-300 hover:text-gold transition-colors text-sm">
                  Édition Plumage
                </Link>
              </li>
              <li>
                <Link to="/evenements" className="text-slate-300 hover:text-gold transition-colors text-sm">
                  Événements
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-gold transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:Luchnos2020@gmail.com"
                  className="flex items-center space-x-2 text-slate-300 hover:text-gold transition-colors text-sm"
                >
                  <FaEnvelope />
                  <span>Luchnos2020@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:fillesdesaray@gmail.com"
                  className="flex items-center space-x-2 text-slate-300 hover:text-gold transition-colors text-sm"
                >
                  <FaEnvelope />
                  <span>fillesdesaray@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+24162562910"
                  className="flex items-center space-x-2 text-slate-300 hover:text-gold transition-colors text-sm"
                >
                  <FaPhone />
                  <span>+241 62 56 29 10</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+27787220419"
                  className="flex items-center space-x-2 text-slate-300 hover:text-gold transition-colors text-sm"
                >
                  <FaPhone />
                  <span>+27 78 722 0419</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Nous Soutenir */}
          <div>
            <h3 className="text-gold font-bold text-lg mb-4">Nous Soutenir</h3>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              Votre soutien permet de faire avancer l'oeuvre du Père céleste. Il ne s'agit pas de semer pour un Homme ou un groupe de personne, mais pour l'avancement du Royaume.
            </p>
            <div className="flex flex-col space-y-2">
              <Link to="/dons" className="btn-primary inline-block text-sm text-center">
                Faire un Don
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de copyright */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex justify-center items-center">
            <p className="text-slate-400 text-sm text-center">
              © {currentYear} Centre Missionnaire Lampe Allumée (LUCHNOS). Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
