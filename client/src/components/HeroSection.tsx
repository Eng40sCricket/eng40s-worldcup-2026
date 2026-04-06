// DESIGN: "Stadium Broadcast" — Full-bleed hero with dark overlay, Oswald display type
import { ASSETS, TOURNAMENT } from '@/lib/data';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

function useCountdown(targetMs: number) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetMs));
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetMs)), 60000);
    return () => clearInterval(timer);
  }, [targetMs]);
  return timeLeft;
}

function getTimeLeft(targetMs: number) {
  const diff = targetMs - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
  };
}

const WORLD_CUP_START = new Date('2026-10-17T09:00:00').getTime();

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <span className="font-display text-white text-3xl sm:text-4xl font-bold tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="block font-body text-white/40 text-xs tracking-widest uppercase mt-0.5">
        {label}
      </span>
    </div>
  );
}

export default function HeroSection() {
  const countdown = useCountdown(WORLD_CUP_START);

  const scrollToFacts = () => {
    const el = document.getElementById('facts');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      role="banner"
      aria-label="England Over 40s ODI World Cup 2026"
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={ASSETS.heroBanner}
          alt="Cricket ground in Guyana at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/80 via-navy/70 to-navy-dark/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* IMC Tournament Logo */}
          <div className="flex justify-center mb-4">
            <img
              src={ASSETS.imcLogo}
              alt="IMC O40s World Cup 2026 Guyana"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-lg"
            />
          </div>
          <p className="font-body text-orange-500 text-sm sm:text-base tracking-[0.3em] uppercase mb-4 font-medium">
            {TOURNAMENT.organiser}
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
        >
          ENGLAND
          <br />
          <span className="text-sky">OVER 40s</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="inline-block">
            <p className="font-display text-gold text-xl sm:text-2xl md:text-3xl font-semibold tracking-wider uppercase">
              ODI World Cup 2026
            </p>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mt-2" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-body text-white/70 text-base sm:text-lg mt-8 max-w-xl mx-auto leading-relaxed"
        >
          {TOURNAMENT.location} &middot; {TOURNAMENT.dates}
          <br />
          <span className="text-white/50 text-sm">{TOURNAMENT.format} &middot; {TOURNAMENT.teams}</span>
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-8 inline-flex gap-4 sm:gap-6"
        >
          <CountdownUnit value={countdown.days} label="Days" />
          <CountdownUnit value={countdown.hours} label="Hours" />
          <CountdownUnit value={countdown.mins} label="Mins" />
        </motion.div>

        <div className="w-12 h-px bg-white/10 mx-auto mt-6" />

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollToFacts}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-4 inline-flex flex-col items-center gap-1 text-white/40 hover:text-white/70 transition-colors min-h-[48px] min-w-[48px] justify-center"
          aria-label="Scroll to tournament facts"
        >
          <span className="font-body text-xs tracking-widest uppercase">Explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent" />
    </section>
  );
}
