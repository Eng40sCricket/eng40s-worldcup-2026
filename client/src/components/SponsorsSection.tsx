// DESIGN: "Stadium Broadcast" — Sponsors & Partners strip
// Dark background with sponsor logos displayed in a clean grid
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
    name: 'Athlo',
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

        {/* Sponsor logos grid */}
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

        {/* Placeholder for West Indies Platinum Sponsor */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center font-body text-white/30 text-xs mt-10 tracking-wide"
        >
          Additional partner announcements coming soon
        </motion.p>
      </div>
    </section>
  );
}
