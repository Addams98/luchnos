import { motion } from 'framer-motion';
import { FaBullhorn, FaUsers, FaHandHoldingHeart, FaBible, FaFire, FaBookOpen, FaGraduationCap, FaChild } from 'react-icons/fa';
import { useEffect } from 'react';

const MissionsFormations = () => {
  // Gérer le scroll vers une section spécifique si présent dans l'URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Hauteur du header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const missionsData = [
    {
      title: "Mission évangélique",
      description: "Conquérir des champs pour le Royaume (prédication, encouragement et implantation)",
      icon: FaBullhorn,
      color: "bg-gold",
      iconColor: "text-red-700"
    },
    {
      title: "Mission Filles2SaraY",
      description: "Restaurer l'identité de la Femme (Sous la tente de Sarah et les programmes divers)",
      icon: FaUsers,
      color: "bg-gold",
      iconColor: "text-primary"
    },
    {
      title: "Mission sociale",
      description: "Empreinte de l'amour (distribution gratuite et programmes divers)",
      icon: FaHandHoldingHeart,
      color: "bg-copper",
      iconColor: "text-white"
    }
  ];

  const formationsData = [
    {
      title: "Formation et équipement",
      description: "Adressée aux personnes converties et les aspirants au service",
      icon: FaBible,
      color: "bg-primary",
      iconColor: "text-gold"
    },
    {
      title: "Formation des Kephale",
      description: "Adressée aux hommes (époux, fiancé et aspirant)",
      icon: FaUsers,
      color: "bg-gold",
      iconColor: "text-primary"
    },
    {
      title: "Formation Khayil/Ezer",
      description: "Adressées à toutes les catégories de femme",
      icon: FaUsers,
      color: "bg-copper",
      iconColor: "text-white"
    },
    {
      title: "Formation Tsaphah",
      description: "Adressés aux sentinelles",
      icon: FaFire,
      color: "bg-red-500",
      iconColor: "text-white"
    }
  ];

  const editionPlumage = {
    title: "EDITION PLUMAGE",
    verse: "Jérémie 30:2",
    description: "Rassemble toutes les œuvres écrites inspirées du Seigneur.",
    items: ["Livres", "Recueils", "Magazine", "etc"],
    icon: FaBookOpen,
    color: "bg-primary"
  };

  const luchnosHeritage = {
    title: "LUCHNOS HÉRITAGE",
    verse: "Proverbes 22:6",
    description: "Préparer la relève et instruire notre progéniture dans les voies du Seigneur.",
    programs: [
      {
        name: "JADY",
        description: "Journée des amis de Yéhoshoua, programmes organisés pour l'épanouissement spirituel des enfants"
      },
      {
        name: "JEY",
        description: "Programmes adressés exclusivement à la jeunesse chrétienne"
      }
    ],
    icon: FaChild,
    color: "bg-red-500"
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-primary flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(/assets/hero-banner-lamp.jpg)' }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gold/20 rounded-full mb-6">
            <FaFire className="text-gold text-4xl animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            MISSIONS & FORMATIONS BIBLIQUES
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            Les 4 Compartiments du Centre Missionnaire Lampe Allumée
          </p>
        </motion.div>
      </section>

      {/* Menu de navigation flottant */}
      <div className="sticky top-24 z-30 bg-white/95 backdrop-blur-sm shadow-md py-4 mb-8">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => scrollToSection('missions')}
              className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
            >
              <span className="font-bold">1</span> Missions
            </button>
            <button
              onClick={() => scrollToSection('formations')}
              className="px-4 py-2 bg-copper text-white rounded-lg hover:bg-copper/90 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
            >
              <span className="font-bold">2</span> Formations
            </button>
            <button
              onClick={() => scrollToSection('edition')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
            >
              <span className="font-bold">3</span> Édition Plumage
            </button>
            <button
              onClick={() => scrollToSection('heritage')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
            >
              <span className="font-bold">4</span> Luchnos Héritage
            </button>
          </div>
        </div>
      </div>

      {/* 1. MISSIONS */}
      <section id="missions" className="py-20 bg-white scroll-mt-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold rounded-full mb-4">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <h2 className="text-4xl font-bold text-primary mb-2">MISSIONS</h2>
            <p className="text-gold text-xl italic mb-4">Romains 15:20</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {missionsData.map((mission, index) => {
              const IconComponent = mission.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-8 text-center"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${mission.color} rounded-full mb-6 shadow-lg`}>
                    <IconComponent className={`${mission.iconColor} text-5xl`} />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-4">
                    {mission.title}
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {mission.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. FORMATIONS BIBLIQUES */}
      <section id="formations" className="py-20 bg-slate-light scroll-mt-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-copper rounded-full mb-4">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <h2 className="text-4xl font-bold text-primary mb-2">FORMATIONS BIBLIQUES</h2>
            <p className="text-gold text-xl italic mb-4">Éphésiens 4:11-14</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formationsData.map((formation, index) => {
              const IconComponent = formation.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-6"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${formation.color} rounded-full mb-4 shadow-lg`}>
                    <IconComponent className={`${formation.iconColor} text-xl`} />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {formation.title}
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {formation.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. EDITION PLUMAGE */}
      <section id="edition" className="py-20 bg-white scroll-mt-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="card p-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h2 className="text-4xl font-bold text-primary mb-2">{editionPlumage.title}</h2>
              <p className="text-gold text-xl italic mb-6">{editionPlumage.verse}</p>
              <p className="text-slate-700 text-lg mb-6 leading-relaxed">
                {editionPlumage.description}
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {editionPlumage.items.map((item, index) => (
                  <span key={index} className="px-4 py-2 bg-gold/10 text-gold rounded-full font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. LUCHNOS HÉRITAGE */}
      <section id="heritage" className="py-20 bg-gradient-primary text-white scroll-mt-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
              <span className="text-white text-2xl font-bold">4</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">{luchnosHeritage.title}</h2>
            <p className="text-gold text-xl italic mb-6">{luchnosHeritage.verse}</p>
            <p className="text-slate-200 text-lg mb-12 leading-relaxed">
              {luchnosHeritage.description}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {luchnosHeritage.programs.map((program, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20"
                >
                  <FaChild className="text-gold text-4xl mb-4 mx-auto" />
                  <h3 className="text-2xl font-bold text-gold mb-4">{program.name}</h3>
                  <p className="text-slate-200 leading-relaxed">
                    {program.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <FaFire className="text-gold text-6xl mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold text-primary mb-6">
              Rejoignez-nous dans cette mission
            </h2>
            <p className="text-slate-700 text-lg mb-8 leading-relaxed">
              Que vous soyez appelé aux missions, aux formations bibliques, à l'édition ou au ministère auprès des jeunes,
              il y a une place pour vous dans le Centre Missionnaire Lampe Allumée.
            </p>
            <a
              href="/contact"
              className="inline-block bg-gradient-gold text-white font-bold py-4 px-8 rounded-full shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105"
            >
              Contactez-nous
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MissionsFormations;
