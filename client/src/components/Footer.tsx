// DESIGN: "Stadium Broadcast" — Navy footer with links and branding
import { TOURNAMENT, ASSETS } from '@/lib/data';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="section-navy py-12 border-t border-white/10">
      <div className="container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={ASSETS.englandLogo}
                alt="England Cricket Over 40s"
                className="h-10 w-auto object-contain drop-shadow-md"
              />
              <div>
                <p className="font-display text-white text-base font-semibold tracking-wide">
                  ENGLAND OVER 40s
                </p>
                <p className="font-body text-white/40 text-xs tracking-wider uppercase">
                  World Cup 2026
                </p>
              </div>
            </div>
            <p className="font-body text-white/40 text-sm leading-relaxed max-w-xs">
              England Over 40s Cricket is a not-for-profit company endorsed by the ECB to run
              high-standard recreational cricket for players over the age of 40.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'England Over 40s Website', url: 'https://www.england-over-40s-cricket.co.uk' },
                { label: 'International Masters Cricket', url: 'https://masterscricket.org' },
                { label: 'ECB', url: 'https://www.ecb.co.uk' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-white/50 hover:text-sky transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <h4 className="font-display text-white text-sm font-semibold tracking-wider uppercase mt-6 mb-3">
              Follow Us
            </h4>
            <div className="flex gap-3">
              <a
                href="https://www.youtube.com/@EnglandOver40sCricket"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-sky hover:bg-white/20 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a
                href="https://www.facebook.com/EnglandOver40sCricket"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-sky hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://x.com/EngOver40s"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-sky hover:bg-white/20 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Tournament info */}
          <div>
            <h4 className="font-display text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Tournament
            </h4>
            <dl className="space-y-2 font-body text-sm">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <dt className="text-white/40 shrink-0">Event:</dt>
                <dd className="text-white/70 break-words">{TOURNAMENT.name}</dd>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <dt className="text-white/40 shrink-0">Venue:</dt>
                <dd className="text-white/70 break-words">{TOURNAMENT.location}</dd>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <dt className="text-white/40 shrink-0">Dates:</dt>
                <dd className="text-white/70 break-words">{TOURNAMENT.dates}</dd>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <dt className="text-white/40 shrink-0">Format:</dt>
                <dd className="text-white/70 break-words">{TOURNAMENT.format}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="font-body text-xs text-white/30">
            &copy; {new Date().getFullYear()} England Over 40s Cricket. All rights reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 font-body text-xs text-white/30 hover:text-sky transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            Back to top
          </button>
          <p className="font-body text-xs text-white/20">
            {TOURNAMENT.organiser} &middot; {TOURNAMENT.hostAssociation}
          </p>
        </div>
      </div>
    </footer>
  );
}
