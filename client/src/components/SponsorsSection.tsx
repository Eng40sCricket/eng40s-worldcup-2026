// DESIGN: "Stadium Broadcast" — Sponsors & Partners strip
// Dark background with sponsor logos displayed in a clean grid
// BK International Group as Tournament Platinum Sponsor featured prominently
import { ASSETS } from '@/lib/data';
import { motion } from 'framer-motion';

interface Sponsor {
  name: string;
  role: string;
  logo: string;
  url: string;
  bgClass: string;
  logoClass?: string;
}

const platinumSponsor: Sponsor = {
  name: 'BK International Group',
  role: 'Tournament Platinum Sponsor',
  logo: ASSETS.bkAviationLogo,
  url: 'https://lfr.nce.mybluehost.me',
  bgClass: 'bg-white',
  logoClass: 'p-6',
};

const sponsors: Sponsor[] = [
  {
    name: 'ANWA Properties',
    role: 'Sponsor',
    logo: ASSETS.anwaLogo,
    url: 'https://www.anwaproperties.com',
    bgClass: 'bg-black',
    logoClass: 'p-4',
  },
  {
    name: 'ATHLO',
    role: 'Sponsor',
    logo: ASSETS.athloLogoDark,
    url: 'https://www.athlo.app',
    bgClass: 'bg-black',
    logoClass: 'p-5',
  },
  {
    name: "De'Longhi UK",
    role: 'Player of the Match Award',
    logo: ASSETS.delonghiLogo,
    url: 'https://www.delonghiuk.co.uk',
    bgClass: 'bg-[#0a1929]',
    logoClass: 'p-4',
  },
  {
    name: 'Sporta Tours',
    role: 'Travel Partner',
    logo: ASSETS.sportaLogo,
    url: 'https://www.sportatours.com',
    bgClass: 'bg-white',
    logoClass: 'p-3',
  },
  {
    name: 'Gentlemen & Players',
    role: 'Kit Supplier',
    logo: ASSETS.gpLogo,
    url: 'https://www.gentlemenplayers.com',
    bgClass: 'bg-white',
    logoClass: 'p-5',
  },
  {
    name: 'NV Play',
    role: 'Streaming Partner',
    logo: ASSETS.nvPlayLogo,
    url: 'https://www.nvplay.com',
    bgClass: 'bg-white',
    logoClass: 'p-4',
  },
];

export default function SponsorsSection() {
  return (
    <section
      id="sponsors"
      aria-labelledby="sponsors-heading"
      className="section-navy py-14 sm:py-20 border-t border-white/10"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-body text-sky text-xs tracking-[0.25em] uppercase mb-2">
            Proudly Supported By
          </p>
          <h2
            id="sponsors-heading"
            className="font-display text-white text-2xl sm:text-3xl font-bold tracking-wide uppercase"
          >
            Our Partners
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-3 rounded-full" />
        </motion.div>

        {/* Tournament Platinum Sponsor — featured prominently */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-center font-body text-gold text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold mb-4">
            Tournament Platinum Sponsor
          </p>
          <a
            href={platinumSponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block max-w-xs sm:max-w-sm mx-auto"
            aria-label={`Visit ${platinumSponsor.name} — ${platinumSponsor.role}`}
          >
            <div
              className={`w-full aspect-[3/2] rounded-xl ${platinumSponsor.bgClass} flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl group-hover:scale-[1.03] transition-all duration-300 ring-2 ring-gold/40`}
            >
              <img
                src={platinumSponsor.logo}
                alt={`${platinumSponsor.name} logo`}
                className={`w-full h-full object-contain ${platinumSponsor.logoClass || ''}`}
              />
            </div>
            <div className="text-center mt-3">
              <p className="font-display text-white text-base sm:text-lg font-bold tracking-wide">
                {platinumSponsor.name}
              </p>
              <p className="font-body text-gold/70 text-xs sm:text-sm tracking-wider uppercase mt-0.5">
                {platinumSponsor.role}
              </p>
            </div>
          </a>
        </motion.div>

        {/* Divider */}
        <div className="w-24 h-px bg-white/10 mx-auto mb-10" />

        {/* Other sponsor logos grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {sponsors.map((sponsor, i) => (
            <motion.a
              key={sponsor.name}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group flex flex-col items-center gap-3"
              aria-label={`Visit ${sponsor.name} — ${sponsor.role}`}
            >
              <div
                className={`w-full aspect-square rounded-xl ${sponsor.bgClass} flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl group-hover:scale-[1.04] transition-all duration-300 ring-1 ring-white/10`}
              >
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  className={`w-full h-full object-contain ${sponsor.logoClass || ''}`}
                />
              </div>
              <div className="text-center">
                <p className="font-display text-white text-xs sm:text-sm font-semibold tracking-wide leading-tight">
                  {sponsor.name}
                </p>
                <p className="font-body text-white/40 text-[10px] sm:text-xs tracking-wider uppercase mt-0.5">
                  {sponsor.role}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
