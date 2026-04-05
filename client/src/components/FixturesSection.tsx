// DESIGN: "Stadium Broadcast" — Fixtures section with clean card layout and empty state
import { FIXTURES } from '@/lib/data';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';

export default function FixturesSection() {
  return (
    <section id="fixtures" className="section-white py-16 sm:py-24">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-navy text-3xl sm:text-4xl font-bold tracking-wide uppercase">
            Fixtures
          </h2>
          <div className="w-16 h-1 bg-sky mx-auto mt-3 rounded-full" />
        </motion.div>

        {FIXTURES.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {FIXTURES.map((fixture, i) => (
              <motion.div
                key={fixture.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-white rounded-lg border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-display text-navy text-lg font-semibold">
                      {fixture.homeTeam} <span className="text-muted-foreground font-body text-sm">vs</span>{' '}
                      {fixture.awayTeam}
                    </p>
                    <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground font-body">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {fixture.date === 'TBC' ? 'Date TBC' : fixture.date}
                      </span>
                      {fixture.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {fixture.time}
                        </span>
                      )}
                      {fixture.venue && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {fixture.venueLink ? (
                            <a
                              href={fixture.venueLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky hover:underline"
                            >
                              {fixture.venue}
                            </a>
                          ) : (
                            fixture.venue
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`pill ${
                        fixture.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-600'
                          : fixture.status === 'upcoming'
                          ? 'bg-sky/15 text-sky'
                          : fixture.status === 'cancelled'
                          ? 'bg-red-500/15 text-red-500'
                          : 'bg-amber-500/15 text-amber-600'
                      }`}
                    >
                      {fixture.status === 'tbc' ? 'TBC' : fixture.status}
                    </span>
                  </div>
                </div>
                {fixture.result && (
                  <p className="mt-2 font-body text-sm text-navy/70 font-medium">{fixture.result}</p>
                )}
                {fixture.playCricketUrl && (
                  <a
                    href={fixture.playCricketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-sky px-4 py-2 text-sm font-semibold text-white hover:bg-sky/90 transition-colors font-body"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on Play Cricket
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-5">
              <Calendar className="w-10 h-10 text-navy/20" />
            </div>
            <h3 className="font-display text-navy text-xl font-semibold mb-2">
              Fixture Details Pending
            </h3>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              The match schedule for the IMC Over 40s ODI World Cup 2026 has not yet been released.
              Fixtures will be published here as soon as they are confirmed by the tournament organisers.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 pill bg-amber-500/10 text-amber-600">
              <Clock className="w-3.5 h-3.5" />
              Expected: Summer 2026
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
