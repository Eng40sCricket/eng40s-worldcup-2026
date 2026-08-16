// DESIGN: "Stadium Broadcast" — Stat pill cards in a horizontal row
import { QUICK_FACTS, ASSETS } from '@/lib/data';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Trophy, Users, Target, Shield } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const ICONS = [Trophy, MapPin, Calendar, Target, Users, Shield];

// Extract numeric values from fact strings for counter animation
function extractNumber(value: string): number | null {
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

export default function QuickFacts() {
  return (
    <section id="facts" aria-labelledby="facts-heading" className="section-white py-16 sm:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 id="facts-heading" className="font-display text-navy text-3xl sm:text-4xl font-bold tracking-wide uppercase">
            Tournament at a Glance
          </h2>
          <div className="w-16 h-1 bg-sky mx-auto mt-3 rounded-full" />
          <a
            href="https://masterscricket.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-5 opacity-80 hover:opacity-100 transition-opacity"
            aria-label="Visit International Masters Cricket website"
          >
            <img
              src={ASSETS.imcTextLogo}
              alt="International Masters Cricket"
              className="h-10 sm:h-12 w-auto mx-auto rounded-md shadow-sm"
            />
          </a>
          <p className="font-body text-muted-foreground text-xs mt-2 tracking-wide">
            Organised by International Masters Cricket (IMC)
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" role="list" aria-label="Tournament facts">
          {QUICK_FACTS.map((fact, i) => {
            const Icon = ICONS[i] || Trophy;
            return (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white rounded-lg border border-border p-5 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-sky" />
                </div>
                <p className="font-display text-navy text-base sm:text-lg font-semibold leading-tight">
                  {extractNumber(fact.value) !== null ? (
                    <AnimatedCounter
                      value={extractNumber(fact.value)!}
                      className="font-display text-navy text-base sm:text-lg font-semibold"
                      suffix={fact.value.replace(/\d+/, '')}
                    />
                  ) : (
                    fact.value
                  )}
                </p>
                <p className="font-body text-muted-foreground text-xs mt-1 tracking-wider uppercase">
                  {fact.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Stadium image strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 rounded-xl overflow-hidden relative h-48 sm:h-64"
        >
          <img
            src={ASSETS.guyanaStadium}
            alt="Aerial view of cricket stadium in Georgetown, Guyana"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <p className="font-display text-white text-lg sm:text-xl font-semibold">
              Georgetown, Guyana
            </p>
            <p className="font-body text-white/70 text-sm">
              Host city for the IMC Over 40s ODI World Cup 2026
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
