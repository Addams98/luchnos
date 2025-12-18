import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFire, FaBullseye, FaHeart, FaUsers, FaHandHoldingHeart, FaBible, FaArrowRight, FaBook, FaGraduationCap, FaPray } from 'react-icons/fa';

const QuiSommesNous = () => {
  const valeurs = [
    {
      icon: FaBible,
      title: 'Fidélité à la Parole',
      description: 'Nous nous appuyons entièrement sur les Saintes Écritures comme fondement de notre foi et de notre enseignement.',
      color: 'text-gold',
      bgColor: 'bg-gold/10',
      borderColor: 'border-gold/20'
    },
    {
      icon: FaHeart,
      title: 'Amour Fraternel',
      description: 'Nous cultivons une communauté unie dans l\'amour du Christ, où chacun est accueilli et encouragé.',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      icon: FaBullseye,
      title: 'Excellence',
      description: 'Nous nous efforçons d\'offrir le meilleur dans tout ce que nous faisons pour la gloire de Dieu.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: FaHandHoldingHeart,
      title: 'Service',
      description: 'Nous sommes engagés à servir notre communauté et à répondre aux besoins spirituels et matériels.',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const equipe = [
    {
      nom: 'Pasteur Fondateur',
      role: 'Visionnaire & Enseignant',
      icon: FaPray,
      description: 'Conduit par une vision divine pour rallumer les lampes dans les nations.'
    },
    {
      nom: 'Équipe Éditoriale',
      role: 'Édition Plumage',
      icon: FaBook,
      description: 'Dédiée à la production d\'ouvrages spirituels qui édifient et encouragent.'
    },
    {
      nom: 'Équipe Formation',
      role: 'Formations Bibliques',
      icon: FaGraduationCap,
      description: 'Engagée dans l\'enseignement et l\'équipement des saints pour le service.'
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-white py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gold/20 rounded-full mb-8 backdrop-blur-sm border-2 border-gold/30"
            >
              <FaFire className="text-gold text-5xl animate-pulse" />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Qui</span>{' '}
              <span className="text-gold">Sommes</span>
              <span className="text-white">-Nous ?</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-200 leading-relaxed mb-8">
              Centre Missionnaire dédié à rallumer, éclairer, encourager et équiper les saints
            </p>
            
          </motion.div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-gold/10 text-gold rounded-full text-sm font-semibold mb-4">
                Notre Histoire
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                Début de la Vision
              </h2>
              <div className="w-24 h-1 bg-gradient-gold mx-auto"></div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Bloc 1 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-gold hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                    <FaFire className="text-gold text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2"></h3>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed text-justify">
                  Le Centre Missionnaire Lampe Allumée (LUCHNOS) est né d'une visitation divine. 
                  En 2006, le Seigneur me visita et plaça dans mon cœur un fardeau par rapport à son œuvre. 
                  Au fil des temps, il l'a fait grandir et a affermi la vision.
                </p>
              </motion.div>

              {/* Bloc 2 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-copper hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-copper/10 rounded-lg flex items-center justify-center">
                    <FaHeart className="text-copper text-xl" />
                  </div>
                  <div>
                    
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed text-justify">
                  Par la suite, j'ai rencontré celle qui est devenue mon épouse, et le Seigneur me dira qu'Il nous mettait ensemble pour faire son œuvre. 
                  Pendant que nous avancions, Il nous montra une vision : des vases d'huile qui allumaient des lampes partout dans les nations.
                </p>
              </motion.div>

              {/* Bloc 3 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-500 hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FaPray className="text-blue-500 text-xl" />
                  </div>
                  <div>
                   
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed text-justify">
                  Des années plus tard, j'eus une autre visitation divine dans laquelle le Seigneur m'imposa les mains et m'envoya accomplir l'œuvre pour laquelle il nous avait appelés : 
                  rallumer, éclairer, encourager et équiper les saints en vue de la préparation à son retour et de réponde à son appel.
                </p>
              </motion.div>

              {/* Bloc 4 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500 hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <FaUsers className="text-green-500 text-xl" />
                  </div>
                  <div>
                    
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed text-justify">
                  Après cela, Lampe Allumée (Luchnos) est né : un service destiné à la mission, la formation, l'équipement spirituel des hommes, 
                  des femmes, des enfants et des jeunes par différents programmes ainsi que la production d'ouvrages. Avec une équipe des frères et des sœurs, nous œuvrons dans ce sens depuis quelques années.
                </p>
              </motion.div>
            </div>

            {/* Citation Finale */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-primary text-white rounded-2xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10">
                
                <p className="text-xl md:text-2xl leading-relaxed mb-4">
                  « Nous bénissons le Seigneur pour ce qu'il accomplit depuis toutes ces années. 
                  Nous restons convaincus que nous n'avons encore rien vu au regard des promesses qu'il nous a faites. »
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gold">
                  À Yéhoshoua seul toute la gloire !
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default QuiSommesNous;
