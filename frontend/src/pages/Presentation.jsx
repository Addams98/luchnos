import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFire, FaBible, FaBook, FaUsers, FaChild, FaBullhorn, FaHandHoldingHeart } from 'react-icons/fa';

const Presentation = () => {
  const compartiments = [
    {
      number: "1",
      title: "MISSIONS",
      verse: "Romains 15:20",
      icon: FaBullhorn,
      color: "bg-gold",
      link: "/missions-formations"
    },
    {
      number: "2",
      title: "FORMATIONS BIBLIQUES",
      verse: "Éphésiens 4:11-14",
      icon: FaBible,
      color: "bg-copper",
      link: "/missions-formations"
    },
    {
      number: "3",
      title: "EDITION PLUMAGE",
      verse: "Jérémie 30:2",
      icon: FaBook,
      color: "bg-primary",
      link: "/edition"
    },
    {
      number: "4",
      title: "LUCHNOS HÉRITAGE",
      verse: "Proverbes 22:6",
      icon: FaChild,
      color: "bg-red-500",
      link: "/missions-formations"
    }
  ];


  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-primary flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(/assets/hero-banner-lamp.jpg)' }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gold/20 rounded-full mb-6">
            <FaFire className="text-gold text-5xl animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            CENTRE MISSIONNAIRE
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-gold mb-6">
            LAMPE ALLUMÉE (LUCHNOS) 🔥
          </h2>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto mb-4">
            Matthieu 25:1-13
          </p>
          <p className="text-2xl md:text-3xl text-white font-semibold">
            Présenter Yéhoshoua (Jésus) car il est le salut des humains et il revient.
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Nos Missions</h2>
            <p className="section-subtitle max-w-4xl mx-auto">
              Le Centre Missionnaire Lampe allumée (Luchnos) a comme mission:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              "Rallumer et éclairer les saints en vue de la préparation au retour de l'Epoux.",
              "Former et équiper les disciples et les aspirants au service.",
              "Évangéliser les âmes.",
              "Encourager les chrétiens au travers des oeuvres écrites.",
              "Encourager les femmes à revenir à leur identité en Yéhoshoua.",
              "Préparer la relève et instruire la jeunesse selon les voies du Seigneur."
            ].map((mission, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center">
                  <FaFire className="text-white text-xl" />
                </div>
                <p className="text-slate-700 text-lg leading-relaxed flex-1">
                  {mission}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compartiments Section */}
      <section className="py-20 bg-slate-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Nos services s'articulent autour de 4 Compartiments</h2>
            
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {compartiments.map((comp, index) => {
              const IconComponent = comp.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-6 text-center group hover:shadow-xl transition-all duration-300"
                >
                  <Link to={comp.link} className="block">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${comp.color} rounded-full mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="text-white text-2xl" />
                    </div>
                    <div className="text-4xl font-bold text-gold mb-2">
                      {comp.number}
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {comp.title}
                    </h3>
                    <p className="text-sm text-copper italic">
                      {comp.verse}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 1. MISSIONS Details */}
      <section className="py-20 bg-white">
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
            <h2 className="section-title">MISSIONS</h2>
            <p className="section-subtitle text-copper italic">Romains 15:20</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Mission évangélique",
                description: "Conquérir des champs pour le Royaume (prédication, encouragement et implantation)",
                icon: FaBullhorn,
                color: "text-gold"
              },
              {
                title: "Mission Filles2SaraY",
                description: "Restaurer l'identité de la Femme (Sous la tente de Sarah et les programmes divers)",
                icon: FaUsers,
                color: "text-copper"
              },
              {
                title: "Mission sociale",
                description: "Empreinte de l'amour (distribution gratuite et programmes divers)",
                icon: FaHandHoldingHeart,
                color: "text-red-500"
              }
            ].map((mission, index) => {
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
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-gold rounded-full mb-6">
                    <IconComponent className={`${mission.color} text-3xl`} />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-4">
                    {mission.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {mission.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. FORMATIONS BIBLIQUES Details */}
      <section className="py-20 bg-slate-light">
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
            <h2 className="section-title">FORMATIONS BIBLIQUES</h2>
            <p className="section-subtitle text-copper italic">Éphésiens 4:11-14</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Formation et équipement",
                description: "Adressés aux personnes converties et les aspirants au service",
                icon: FaBible
              },
              {
                title: "Formation des Kephale",
                description: "Adressés aux hommes (époux, fiancé et aspirant)",
                icon: FaUsers
              },
              {
                title: "Formation Khayil/Ezer",
                description: "Adressées à toutes les catégories de femme",
                icon: FaUsers
              },
              {
                title: "Formation Tsaphah",
                description: "Adressés aux sentinelles",
                icon: FaFire
              }
            ].map((formation, index) => {
              const IconComponent = formation.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-6 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
                    <IconComponent className="text-gold text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {formation.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {formation.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. EDITION PLUMAGE */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <span className="text-gold text-2xl font-bold">3</span>
            </div>
            <h2 className="section-title">EDITION PLUMAGE</h2>
            <p className="section-subtitle text-copper italic mb-8">Jérémie 30:2</p>
            <div className="card p-10">
              <FaBook className="text-gold text-6xl mx-auto mb-6" />
              <p className="text-slate-700 text-lg leading-relaxed mb-4">
                Rassemble toutes les œuvres écrites inspirées du Seigneur.
              </p>
              <p className="text-slate-600">
                Livres, recueils, magazine etc.
              </p>
              <Link
                to="/edition"
                className="inline-block mt-6 bg-gradient-gold text-white font-bold py-3 px-8 rounded-full shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105"
              >
                Découvrir nos publications
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. LUCHNOS HÉRITAGE */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
              <span className="text-white text-2xl font-bold">4</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">LUCHNOS HÉRITAGE</h2>
            <p className="text-gold text-xl italic mb-6">Proverbes 22:6</p>
            <p className="text-xl max-w-3xl mx-auto">
              Préparer la relève et instruire notre progéniture dans les voies du Seigneur.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
            >
              <FaChild className="text-gold text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">JADY</h3>
              <p className="text-slate-200 leading-relaxed">
                Journée des amis de Yéhoshoua, programmes organisés pour l'épanouissement spirituel des enfants.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
            >
              <FaUsers className="text-gold text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">JEY</h3>
              <p className="text-slate-200 leading-relaxed">
                Programmes adressés exclusivement à la jeunesse chrétienne.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Notre Vision Section */}
      <section className="py-20 bg-slate-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Notre <span className="text-gold">Vision</span>
            </h2>
            <div className="bg-slate-800 rounded-2xl p-8 md:p-12 mb-8">
              <p className="text-white text-xl md:text-2xl italic mb-6">
                "Encourager les saints à se préparer au retour du Seigneur et à répondre à son appel. "
              </p>
              <p className="text-slate-300 text-lg leading-relaxed">
                Nous œuvrons pour que chaque enfant du Seigneur soit responsable de son salut et de l’appel qu’il a reçu afin de bien le remplir. Nous travaillons également pour que chaque femme retrouve sa véritable identité dans le Seigneur. 
Et  enfin  nous œuvrons  pour préparer la relève à marcher dans les voies du Seigneur.
              </p>
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
              Il ne s’agit pas  d'une adhésion à un ministère, mais plutôt d'une participation ou d'une contribution  volontaire pour  l’avancement de l’œuvre du Seigneur, avec ton don, ton talent et ce qu’il t’a donné en tant que membre du Corps de Christ. 
              Nous devons conjuguer ensemble nos talents pour le Royaume du Père
            </p>
            <Link
              to="/contact"
              className="inline-block bg-gradient-gold text-white font-bold py-4 px-8 rounded-full shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105"
            >
              Contactez-nous
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Presentation;
