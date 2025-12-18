import { motion } from 'framer-motion';
import { FaWhatsapp, FaPhone, FaMoneyBillWave } from 'react-icons/fa';

// Import des logos depuis le dossier Images
import logoMoneyGram from '../Images/png-clipart-money-gram-logo-logo-moneygram-international-inc-money-transfer-sss-logo-text-logo.png';
import logoRia from '../Images/RIA.jpg';
import logoPayPal from '../Images/paypal_logo_icon_147252.webp';
import logoGSM from '../Images/gsm_artiste_20230306101519_a33m1md3d4h58oe6gjg0hg6s0i.png';

const Dons = () => {
  const moyensPaiement = [
    {
      logo: logoMoneyGram,
      nom: "MoneyGram",
      info: "Transfert MoneyGram",
      description: "Transfert international via MoneyGram",
      color: "bg-white"
    },
    {
      logo: logoRia,
      nom: "Ria",
      info: "Transfert Ria",
      description: "Transfert international via Ria Money Transfer",
      color: "bg-white"
    },
    {
      logo: logoPayPal,
      nom: "PayPal",
      info: "fillesdesaray@gmail.com",
      description: "Paiement en ligne via PayPal",
      color: "bg-white"
    },
    {
      logo: logoGSM,
      nom: "Moov Money",
      info: "+241 62 50 29 10",
      description: "Mobile Money - Gabon",
      color: "bg-white"
    }
  ];

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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gold/20 rounded-full mb-6"
          >
            <FaMoneyBillWave className="text-gold text-5xl animate-pulse" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            NOUS SOUTENIR
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            Votre soutien permet de faire avancer l'œuvre du Père céleste
          </p>
        </motion.div>
      </section>

      {/* Message Section */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="bg-slate-50 rounded-2xl p-8 border-l-4 border-gold">
              <p className="text-slate-700 text-lg leading-relaxed text-justify mb-6">
                Votre soutien permet de faire avancer l'œuvre du Père céleste. Il ne s'agit pas de semer pour un Homme ou un groupe de personne, mais pour l'avancement du Royaume.
              </p>
              <div className="bg-primary/5 rounded-lg p-6">
                <p className="text-primary text-base italic text-center">
                  « Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte; car Dieu aime celui qui donne avec joie. »
                </p>
                <p className="text-copper font-semibold text-center mt-3">2 Corinthiens 9:7</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Moyens de Paiement */}
      <section className="py-16 bg-slate-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Moyens de Contribution
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Vous souhaitez apporter librement une contribution matérielle ou financière
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {moyensPaiement.map((moyen, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-20 h-20 ${moyen.color} rounded-xl flex items-center justify-center shadow-md border border-slate-200 p-2`}>
                      <img 
                        src={moyen.logo} 
                        alt={`Logo ${moyen.nom}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary mb-2">
                        {moyen.nom}
                      </h3>
                      <p className="text-slate-600 text-sm mb-3">
                        {moyen.description}
                      </p>
                      {moyen.link ? (
                        <a
                          href={moyen.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-gold/10 text-gold font-semibold px-4 py-2 rounded-lg hover:bg-gold hover:text-white transition-colors"
                        >
                          {moyen.info}
                        </a>
                      ) : (
                        <div className="bg-slate-100 rounded-lg px-4 py-3 font-mono text-primary font-semibold break-all text-sm">
                          {moyen.info}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RIB en cours */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <div className="inline-block bg-amber-50 border-2 border-amber-300 rounded-xl px-8 py-4">
              <p className="text-amber-800 font-semibold">
                🏦 RIB bancaire : <span className="text-amber-900">En cours de traitement</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-primary mb-6">
              Besoin d'Aide ?
            </h2>
            <p className="text-slate-700 text-lg mb-8 leading-relaxed">
              Pour toute question concernant vos dons ou pour obtenir plus d'informations, n'hésitez pas à nous contacter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/24162502910"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
              >
                <FaWhatsapp className="text-xl" />
                WhatsApp: +241 62 50 29 10
              </a>
              <a
                href="mailto:Luchnos2020@gmail.com"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
              >
                📧 Luchnos2020@gmail.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Dons;
