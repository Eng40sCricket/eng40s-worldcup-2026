// DESIGN: "Stadium Broadcast" — Frosted glass sticky navigation bar
// Oswald condensed font for nav labels, sky-blue active indicator
import { NAV_SECTIONS } from '@/lib/data';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StickyNav() {
  const [active, setActive] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_SECTIONS.map((s) => ({
        id: s.id,
        el: document.getElementById(s.id),
      }));
      const scrollY = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].el;
        if (el && el.offsetTop <= scrollY) {
          setActive(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container flex items-center justify-between h-16">
        {/* Logo / Title */}
        <button
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-sky flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm leading-none">E40</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-display text-white text-lg font-semibold tracking-wide">
              ENGLAND OVER 40s
            </span>
            <span className="font-body text-sky-light text-xs block -mt-0.5 tracking-wider uppercase">
              World Cup 2026
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className={`relative px-4 py-2 font-display text-sm font-medium tracking-wider uppercase transition-colors ${
                active === section.id
                  ? 'text-white'
                  : 'text-white/60 hover:text-white/90'
              }`}
            >
              {section.label}
              {active === section.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-sky rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/10 overflow-hidden"
          >
            <div className="container py-3 flex flex-col gap-1">
              {NAV_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={`text-left px-4 py-2.5 rounded-md font-display text-sm font-medium tracking-wider uppercase transition-colors ${
                    active === section.id
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
