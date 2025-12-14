import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaArrowRight, FaBook, FaBible, FaLightbulb } from 'react-icons/fa';
import { versetsAPI, penseesAPI, BASE_URL } from '../services/api';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroCarousel = ({ evenements = [], livres = [] }) => {
  const [versets, setVersets] = useState([]);
  const [pensees, setPensees] = useState([]);
  const slides = [];

  useEffect(() => {
    loadVersets();
    loadPensees();
  }, []);

  const loadVersets = async () => {
    try {
      const response = await versetsAPI.getActifs();
      if (response.data.success) {
        setVersets(response.data.data || []);
      }
    } catch (error) {
      console.error('Erreur chargement versets:', error);
    }
  };

  const loadPensees = async () => {
    try {
      const response = await penseesAPI.getActifs();
      if (response.data.success) {
        setPensees(response.data.data || []);
      }
    } catch (error) {
      console.error('Erreur chargement pensées:', error);
    }
  };

  // Image par défaut pour versets et pensées
  const defaultBibleImage = '/assets/bible-default.jpg';

  // Ajouter les versets bibliques en premier
  versets.forEach(verset => {
    slides.push({
      type: 'verset',
      badge: 'PAROLE DE DIEU',
      title: verset.texte,
      description: verset.reference,
      image: verset.image_url ? `${BASE_URL}${verset.image_url}` : defaultBibleImage,
      link: '/presentation'
    });
  });

  // Ajouter les pensées
  pensees.forEach(pensee => {
    slides.push({
      type: 'pensee',
      badge: `PENSÉE DE LA ${pensee.type_periode === 'semaine' ? 'SEMAINE' : 'MOIS'}`,
      title: pensee.contenu,
      description: '',
      image: pensee.image_url ? `${BASE_URL}${pensee.image_url}` : defaultBibleImage,
      link: '/presentation'
    });
  });

  // Ajouter les événements (max 3) - seulement ceux activés pour le carousel
  evenements
    .filter(event => event.actif === 1 || event.actif === true)
    .slice(0, 3)
    .forEach(event => {
      if (!event.image_url) return; // Ignorer si pas d'image
      
      const eventDate = new Date(event.date_evenement);
      const eventLocation = event.lieu ? ` • ${event.lieu}` : '';
      
      slides.push({
        type: 'event',
        badge: 'ÉVÉNEMENT',
        title: event.titre,
        description: event.description || `Rejoignez-nous pour cet événement spirituel exceptionnel${eventLocation}`,
        date: eventDate.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        time: event.heure_evenement || '',
        location: event.lieu || '',
        image: `${BASE_URL}${event.image_url}`,
        link: '/evenements'
      });
    });

  // Ajouter les livres récents (max 3) - seulement ceux activés pour le carousel
  livres
    .filter(livre => livre.afficher_carousel === 1 || livre.afficher_carousel === true)
    .slice(0, 3)
    .forEach(livre => {
      if (!livre.image_couverture) return; // Ignorer si pas d'image
      
      const gratuitBadge = livre.gratuit ? ' • GRATUIT' : '';
      
      slides.push({
        type: 'book',
        badge: 'NOUVEAU LIVRE' + gratuitBadge,
        title: livre.titre,
        description: livre.description || `Découvrez ce nouvel ouvrage spirituel enrichissant de ${livre.auteur}`,
        author: livre.auteur,
        pages: livre.nombre_pages || '',
        category: livre.categorie || '',
        image: `${BASE_URL}${livre.image_couverture}`,
        link: '/edition'
      });
    });

  // Slide par défaut - toujours en premier
  slides.unshift({
    type: 'default',
    badge: 'BIENVENUE',
    title: 'Lampe Allumée (Luchnos)',
    description: 'Présenter Yéhoshoua car IL revient',
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600',
    link: '/presentation'
  });

  return (
    <div className="bg-white pt-32 pb-12">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="relative h-[450px] md:h-[520px] rounded-2xl overflow-hidden shadow-2xl">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            loop={true}
            className="h-full"
            fadeEffect={{
              crossFade: true
            }}
          >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="swiper-slide-custom">
            <div className="relative h-full w-full">
              {/* Image de fond avec overlay sombre */}
              <div className="absolute inset-0 z-0">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                  }}
                />
                <div className="absolute inset-0 bg-slate-900/60" />
              </div>

              {/* Contenu aligné à GAUCHE */}
              <div className="relative h-full flex items-center z-10">
                <div className="container-custom pl-8 md:pl-12 lg:pl-16">
                  <div className="max-w-2xl">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="flex flex-col items-start"
                    >
                      {/* Badge en haut avec icône */}
                      <div className="flex items-center gap-2 mb-3">
                        {slide.type === 'verset' ? (
                          <FaBible className="text-gold text-base" />
                        ) : slide.type === 'pensee' ? (
                          <FaLightbulb className="text-gold text-base" />
                        ) : slide.type === 'book' ? (
                          <FaBook className="text-gold text-base" />
                        ) : slide.type === 'event' ? (
                          <FaCalendarAlt className="text-gold text-base" />
                        ) : null}
                        <span className="text-gold font-bold text-xs uppercase tracking-wider">
                          {slide.badge}
                        </span>
                      </div>
                      
                      {/* Titre en grand */}
                      <h1 className={`font-bold text-white leading-tight ${
                        slide.type === 'verset'
                          ? 'text-xl md:text-2xl lg:text-3xl italic mb-3' 
                          : slide.type === 'pensee'
                          ? 'text-xl md:text-2xl lg:text-3xl mb-4'
                          : 'text-3xl md:text-4xl lg:text-5xl mb-4'
                      }`}>
                        {slide.type === 'verset' ? `« ${slide.title} »` : slide.title}
                      </h1>
                      
                      {/* Description / Référence */}
                      {slide.description && (
                        <p className={`text-white/90 leading-relaxed ${
                          slide.type === 'verset' 
                            ? 'text-lg md:text-xl font-semibold mb-8 text-gold' 
                            : slide.type === 'pensee'
                            ? 'text-sm md:text-base mb-8'
                            : 'text-sm md:text-base mb-6'
                        }`}>
                          {slide.description}
                        </p>
                      )}
                      
                      {/* Auteur avec emoji pour livres */}
                      {slide.type === 'book' && slide.author && (
                        <div className="flex items-center text-gold text-sm mb-6">
                          <span className="mr-2">✍️</span>
                          <span className="font-medium">Par {slide.author}</span>
                        </div>
                      )}
                      
                      {/* Date pour événements */}
                      {slide.type === 'event' && slide.date && (
                        <div className="flex items-center text-white/90 text-sm mb-6">
                          <FaCalendarAlt className="mr-2 text-gold" />
                          <span>{slide.date}</span>
                        </div>
                      )}
                      
                      {/* Bouton jaune/or */}
                      {slide.type !== 'verset' && slide.type !== 'pensee' && (
                        <Link
                          to={slide.link}
                          className="bg-gradient-gold text-slate-900 font-bold text-base px-8 py-3 rounded-lg hover:shadow-glow transition-all duration-300 inline-block"
                        >
                          {slide.type === 'book' ? 'Découvrir le Livre' : 'En Savoir Plus'}
                        </Link>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Style personnalisé pour la pagination et navigation */}
      <style>{`
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: white;
          opacity: 0.7;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #FFC100;
          opacity: 1;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 20px;
          font-weight: bold;
        }
      `}</style>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
