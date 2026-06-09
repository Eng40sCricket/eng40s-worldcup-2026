// DESIGN: "Stadium Broadcast" — Frosted glass sticky navigation
// Enhanced: England shortcut, skip-to-content, larger touch targets, keyboard nav, ARIA
import { NAV_SECTIONS, ASSETS } from '@/lib/data';
import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Shield, Facebook, Instagram, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StickyNav() {
  const [active, setActive] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
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
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileOpen(false);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    if (mobileOpen) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [mobileOpen]);

  return (
    <>
      {/* Skip to content — accessibility */}
      <a
        href="#facts"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-sky focus:text-white focus:rounded-md focus:font-body focus:text-sm focus:shadow-lg"
      >
        Skip to content
      </a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-white/10 shadow-lg shadow-black/20'
            : 'bg-navy/60 backdrop-blur-sm'
        }`}
      >
        <div className="container flex items-center justify-between h-16">
          {/* Logo / Title */}
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-3 min-h-[44px] min-w-[44px]"
            aria-label="Scroll to top"
          >
            <img
              src={ASSETS.englandLogo}
              alt="England Cricket Over 40s crest"
              className="h-10 w-auto object-contain drop-shadow-md"
            />
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
          <div className="hidden lg:flex items-center gap-0.5" role="tablist" aria-label="Page sections">
            {NAV_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                role="tab"
                aria-selected={active === section.id}
                aria-controls={section.id}
                className={`relative px-3 xl:px-4 py-2 font-display text-sm font-medium tracking-wider uppercase transition-colors min-h-[44px] ${
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

            {/* England shortcut */}
            <button
              onClick={() => scrollTo('squad')}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky/15 text-sky hover:bg-sky/25 hover:text-white transition-all font-display text-xs font-semibold tracking-wider uppercase min-h-[44px] border border-sky/20"
              aria-label="Jump to England squad"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">England</span>
            </button>
          </div>

          {/* Social media icons */}
          <div className="hidden lg:flex items-center gap-1 ml-3">
            <a
              href="https://www.facebook.com/EnglandCricketOver40s"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 text-white/60 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Facebook className="w-4.5 h-4.5" />
            </a>
            <a
              href="https://www.instagram.com/englandcricketover40s"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 text-white/60 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Instagram className="w-4.5 h-4.5" />
            </a>
            <a
              href="https://x.com/Eng40sCricket"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="p-2 text-white/60 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@EnglandCricketOver40s"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="p-2 text-white/60 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Youtube className="w-4.5 h-4.5" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
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
              role="menu"
            >
              <div className="container py-3 flex flex-col gap-1">
                {NAV_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    role="menuitem"
                    className={`text-left px-4 py-3 rounded-md font-display text-sm font-medium tracking-wider uppercase transition-colors min-h-[48px] ${
                      active === section.id
                        ? 'text-white bg-white/10'
                        : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}

                {/* Mobile England shortcut */}
                <button
                  onClick={() => scrollTo('squad')}
                  role="menuitem"
                  className="flex items-center gap-2 px-4 py-3 rounded-md bg-sky/15 text-sky font-display text-sm font-semibold tracking-wider uppercase min-h-[48px] mt-1 border border-sky/20"
                >
                  <Shield className="w-4 h-4" />
                  England Squad
                </button>

                {/* Mobile social media icons */}
                <div className="flex items-center gap-2 px-4 py-3 mt-1">
                  <a
                    href="https://www.facebook.com/EnglandCricketOver40s"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/englandcricketover40s"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://x.com/Eng40sCricket"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter)"
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/@EnglandCricketOver40s"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
