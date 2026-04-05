// DESIGN: "Stadium Broadcast" — Press release section with editorial card layout
import { PRESS_RELEASES } from '@/lib/data';
import { motion } from 'framer-motion';
import { FileText, Calendar } from 'lucide-react';

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function PressReleaseSection() {
  return (
    <section id="press" className="section-white py-16 sm:py-24">
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
            Official Press Releases
          </h2>
          <div className="w-16 h-1 bg-sky mx-auto mt-3 rounded-full" />
        </motion.div>

        {PRESS_RELEASES.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-8">
            {PRESS_RELEASES.map((pr, i) => (
              <motion.article
                key={pr.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-lg border border-border p-6 sm:p-8 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-sky" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="pill bg-sky/10 text-sky">Press Release</span>
                      <span className="flex items-center gap-1 font-body text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(pr.date)}
                      </span>
                    </div>
                    <h3 className="font-display text-navy text-xl sm:text-2xl font-bold leading-tight">
                      {pr.title}
                    </h3>
                    {pr.author && (
                      <p className="font-body text-sm text-muted-foreground mt-1">
                        By {pr.author}
                      </p>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="border-t border-border pt-5">
                  {pr.body.split('\n\n').map((paragraph, pi) => (
                    <p
                      key={pi}
                      className="font-body text-sm sm:text-base text-navy/75 leading-relaxed mb-4 last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}
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
              <FileText className="w-10 h-10 text-navy/20" />
            </div>
            <h3 className="font-display text-navy text-xl font-semibold mb-2">
              No Press Releases Yet
            </h3>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              Official press releases from England Over 40s Cricket will be published here.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
