// DESIGN: "Stadium Broadcast" — Groups/standings with navy background, table layout, empty state
import { GROUPS } from '@/lib/data';
import { motion } from 'framer-motion';
import { Trophy, Clock, BarChart3 } from 'lucide-react';

export default function GroupsSection() {
  return (
    <section id="groups" className="section-navy py-16 sm:py-24 clip-top">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-white text-3xl sm:text-4xl font-bold tracking-wide uppercase">
            Groups &amp; Standings
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded-full" />
        </motion.div>

        {GROUPS.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {GROUPS.map((group, gi) => (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: gi * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden"
              >
                <div className="px-5 py-3 bg-white/5 border-b border-white/10">
                  <h3 className="font-display text-white text-lg font-semibold tracking-wider uppercase">
                    {group.name}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-4 py-2.5 font-body text-white/50 text-xs uppercase tracking-wider">Team</th>
                        <th className="text-center px-2 py-2.5 font-body text-white/50 text-xs uppercase tracking-wider">P</th>
                        <th className="text-center px-2 py-2.5 font-body text-white/50 text-xs uppercase tracking-wider">W</th>
                        <th className="text-center px-2 py-2.5 font-body text-white/50 text-xs uppercase tracking-wider">L</th>
                        <th className="text-center px-2 py-2.5 font-body text-white/50 text-xs uppercase tracking-wider">T</th>
                        <th className="text-center px-2 py-2.5 font-body text-white/50 text-xs uppercase tracking-wider">NRR</th>
                        <th className="text-center px-2 py-2.5 font-body text-white/50 text-xs uppercase tracking-wider">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.teams.map((team, ti) => (
                        <tr
                          key={team.team}
                          className={`border-b border-white/5 ${
                            team.isEngland ? 'bg-sky/10' : ''
                          }`}
                        >
                          <td className={`px-4 py-2.5 font-body text-sm ${
                            team.isEngland ? 'text-sky font-semibold' : 'text-white/80'
                          }`}>
                            {team.team}
                          </td>
                          <td className="text-center px-2 py-2.5 font-body text-white/60">{team.played}</td>
                          <td className="text-center px-2 py-2.5 font-body text-white/60">{team.won}</td>
                          <td className="text-center px-2 py-2.5 font-body text-white/60">{team.lost}</td>
                          <td className="text-center px-2 py-2.5 font-body text-white/60">{team.tied}</td>
                          <td className="text-center px-2 py-2.5 font-body text-white/60">{team.nrr}</td>
                          <td className="text-center px-2 py-2.5 font-body text-white font-semibold">{team.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-5">
              <BarChart3 className="w-10 h-10 text-white/15" />
            </div>
            <h3 className="font-display text-white text-xl font-semibold mb-2">
              Draw to Be Announced
            </h3>
            <p className="font-body text-white/50 text-sm leading-relaxed">
              The group draw for the IMC Over 40s ODI World Cup 2026 has not yet taken place.
              Standings will populate when the tournament schedule is confirmed.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 pill bg-amber-500/15 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              Draw date to be confirmed
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
