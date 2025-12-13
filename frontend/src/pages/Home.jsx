import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaBookOpen, FaVideo, FaUsers } from 'react-icons/fa';
import { evenementsAPI, livresAPI, temoignagesAPI } from '../services/api';
import HeroCarousel from '../components/HeroCarousel';
import NewsletterSection from '../components/NewsletterSection';

// Icône Calendrier personnalisée
const CalendarIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M8 2v4"></path>
    <path d="M16 2v4"></path>
    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
    <path d="M3 10h18"></path>
  </svg>
);

const Home = () => {
  const [evenements, setEvenements] = useState([]);
  const [livres, setLivres] = useState([]);
  const [temoignages, setTemoignages] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsRes, livresRes, temoignagesRes] = await Promise.all([
        evenementsAPI.getAll(),
        livresAPI.getAll(),
        temoignagesAPI.getAll(),
      ]);
      
      // Filtrer les événements à venir ou en cours
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingEvents = eventsRes.data.data?.filter(event => {
        const eventDate = new Date(event.date_evenement);
        eventDate.setHours(0, 0, 0, 0);
        return (event.statut === 'a_venir' || event.statut === 'en_cours') && eventDate >= today;
      }).sort((a, b) => new Date(a.date_evenement) - new Date(b.date_evenement)).slice(0, 3) || [];
      
      // Prendre les 3 livres les plus récents
      const recentBooks = livresRes.data.data?.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      ).slice(0, 3) || [];
      
      // Prendre les témoignages approuvés
      const approvedTestimonials = temoignagesRes.data.data?.filter(t => t.approuve).slice(0, 3) || [];
      
      setEvenements(upcomingEvents);
      setLivres(recentBooks);
      setTemoignages(approvedTestimonials);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const ministeres = [
    {
      icon: FaVideo,
      title: 'Luchnos Multimédia',
      description: 'Découvrez nos enseignements et nos divers  contenus spirituels enrichissants.',
      link: '/multimedia',
      borderColor: 'border-l-yellow-500',
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-500',
      buttonColor: 'text-yellow-600 border-yellow-600 hover:bg-yellow-600'
    },
    {
      icon: FaBookOpen,
      title: 'Édition Plumage',
      description: 'Découvrez nos livres à consulter en ligne ou à télécharger gratuitement.',
      link: '/edition',
      borderColor: 'border-l-blue-500',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      buttonColor: 'text-blue-600 border-blue-600 hover:bg-blue-600'
    },
    {
      icon: CalendarIcon,
      title: 'Événements',
      description: 'Restez informé de nos différents programmes.',
      link: '/evenements',
      borderColor: 'border-l-accent-green',
      iconBg: 'bg-green-50',
      iconColor: 'text-accent-green',
      buttonColor: 'text-accent-green border-accent-green hover:bg-accent-green'
    },
    {
      icon: FaUsers,
      title: 'Contact',
      description: 'Contactez-nous pour toute question, prière, suggestion ou soutient.',
      link: '/contact',
      borderColor: 'border-l-accent-orange',
      iconBg: 'bg-orange-50',
      iconColor: 'text-accent-orange',
      buttonColor: 'text-accent-orange border-accent-orange hover:bg-accent-orange'
    }
  ];

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel evenements={evenements} livres={livres} />

      {/* Section Mission */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
               Présenter Yéhoshoua car  il est le salut et il revient
            </h2>
            <p className="text-xl text-slate-200 mb-8 leading-relaxed">
               Notre mission est d’éclairer, rallumer,
                équiper et encourager les saints dans les nations en vue de la préparation au retour de l’époux et de répondre à l’appel du Seigneur.
            </p>
            <Link to="/presentation" className="btn-primary inline-flex items-center space-x-2">
              <span>Découvrir Nos missions</span>
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section Ministères */}
      <section className="py-20 bg-slate-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            
            <p className="section-subtitle">
              
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {ministeres.map((ministere, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex"
              >
                <div className={`rounded-lg border bg-white shadow-sm hover:shadow-lg transition-shadow w-full flex flex-col border-l-4 ${ministere.borderColor}`}>
                  {/* Header avec icône et titre */}
                  <div className="flex flex-col space-y-1.5 p-6 text-center">
                    <ministere.icon className={`${ministere.iconColor} w-12 h-12 mx-auto mb-4`} />
                    <h3 className="text-2xl font-semibold leading-none tracking-tight text-slate-900">
                      {ministere.title}
                    </h3>
                  </div>
                  {/* Contenu */}
                  <div className="p-6 pt-0 text-center">
                    <p className="text-slate-600 mb-4">
                      {ministere.description}
                    </p>
                    <Link to={ministere.link}>
                      <button className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:text-accent-foreground h-10 px-4 py-2 ${ministere.buttonColor}`}>
                        {ministere.title === 'Luchnos Multimédia' ? 'Voir les Vidéos' :
                         ministere.title === 'Édition Plumage' ? 'Parcourir les Livres' :
                         ministere.title === 'Événements' ? 'Voir les Événements' :
                         'Nous Contacter'}
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
