// DESIGN: "Stadium Broadcast" — News bulletins with card layout
import { NEWS, ASSETS } from '@/lib/data';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function NewsSection() {
  return (
    <section id="news" className="section-slate py-16 sm:py-24 clip-top">
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
            News &amp; Updates
          </h2>
          <div className="w-16 h-1 bg-sky mx-auto mt-3 rounded-full" />
        </motion.div>

        {NEWS.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {NEWS.map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Image or placeholder */}
                <div className="h-40 bg-gradient-to-br from-navy/5 to-sky/5 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={i === 0 ? ASSETS.cricketAction : i === 1 ? ASSETS.guyanaStadium : ASSETS.cricketBall}
                        alt=""
                        className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <time className="font-body text-xs text-muted-foreground">
                      {formatDate(item.date)}
                    </time>
                  </div>
                  <h3 className="font-display text-navy text-base font-semibold leading-snug mb-2">
                    {item.headline}
                  </h3>
                  <p className="font-body text-sm text-navy/60 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 font-body text-sm text-sky font-medium hover:underline"
                    >
                      Read more <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-5">
              <Newspaper className="w-10 h-10 text-navy/20" />
            </div>
            <h3 className="font-display text-navy text-xl font-semibold mb-2">
              No News Yet
            </h3>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              News bulletins will appear here as the tournament approaches.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
