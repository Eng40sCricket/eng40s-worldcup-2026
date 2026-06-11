// DESIGN: "Stadium Broadcast" — Groups composition display (information only)
// Shows which teams are in which group, with a CTA to the live standings page
import { groupData, type Group, type GroupTeam } from '@/lib/data';
import { motion } from 'framer-motion';
import {
  Trophy,
  Shield,
  ArrowRight,
  BarChart3,
} from 'lucide-react';

/** Three-letter acronym map for all tournament teams */
const TEAM_ACRONYMS: Record<string, string> = {
  'West Indies': 'WI',
  'Australia': 'AUS',
  'Wales': 'WAL',
  'Sri Lanka': 'SL',
  'Canada': 'CAN',
  'South Africa': 'SA',
  'Namibia': 'NAM',
  'Colombia': 'COL',
  'New Zealand': 'NZ',
  'Pakistan': 'PAK',
  'UAE': 'UAE',
  'India': 'IND',
  'England': 'ENG',
  'Scotland': 'SCO',
  'USA': 'USA',
  'Rest of the World': 'ROW',
};

function getTeamAcronym(team: string): string {
  return TEAM_ACRONYMS[team] || team.slice(0, 3).toUpperCase();
}

export default function GroupsSection() {
  const groups = groupData.groups;

  if (!groups || groups.length === 0) return null;

  return (
    <section id="groups" aria-labelledby="groups-heading" className="relative py-16 sm:py-24 overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-navy" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.08),transparent_60%)]" />

      <div className="relative z-10 container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="font-body text-sky-light text-sm tracking-[0.25em] uppercase mb-2 font-medium">
            Tournament
          </p>
          <h2 id="groups-heading" className="font-display text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase">
            World Cup Groups
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded-full" />
        </motion.div>

        {/* Group composition cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-10">
          {groups.map((group, gi) => (
            <GroupCard key={group.id} group={group} index={gi} />
          ))}
        </div>

        {/* CTA button to live standings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <a
            href="https://www.eng40scricket.co.uk/tournaments/wc2026/"
            className="block rounded-xl border border-sky/30 bg-gradient-to-br from-sky/10 to-sky/5 p-6 sm:p-8 text-center hover:border-sky/50 hover:shadow-lg hover:shadow-sky/10 transition-all group"
          >
            <div className="flex justify-center mb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky/15 group-hover:bg-sky/25 transition-colors">
                <BarChart3 className="w-6 h-6 text-sky" />
              </div>
            </div>
            <h3 className="font-display text-white text-xl sm:text-2xl font-bold tracking-wide mb-2">
              Live Group Standings &amp; Results
            </h3>
            <p className="font-body text-white/60 text-sm sm:text-base leading-relaxed mb-4 max-w-lg mx-auto">
              View the latest group tables, match results and England's tournament progress
            </p>
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky text-white font-display text-sm font-semibold tracking-wider uppercase shadow-lg shadow-sky/25 group-hover:bg-sky-light group-hover:shadow-sky/40 transition-all">
              View Standings
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}


// ============================================================
// GROUP CARD — Team composition only (no results/standings)
// ============================================================

function GroupCard({ group, index }: { group: Group; index: number }) {
  const isEnglandGroup = group.isEnglandGroup;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`rounded-lg overflow-hidden ${
        isEnglandGroup
          ? 'ring-2 ring-gold/50 shadow-lg shadow-gold/10'
          : 'ring-1 ring-white/10'
      }`}
    >
      {/* Group header */}
      <div className={`px-5 py-3 flex items-center justify-between ${
        isEnglandGroup
          ? 'bg-gradient-to-r from-gold/20 to-gold/10'
          : 'bg-white/5'
      }`}>
        <div className="flex items-center gap-2">
          <Trophy className={`w-4 h-4 ${isEnglandGroup ? 'text-gold' : 'text-sky'}`} />
          <h3 className="font-display text-white text-lg font-semibold tracking-wide">
            {group.name}
          </h3>
          {isEnglandGroup && (
            <span className="pill text-[10px] bg-sky/20 text-sky">
              <Shield className="w-2.5 h-2.5 mr-0.5" />
              England
            </span>
          )}
        </div>
        <span className="font-body text-xs text-white/30">
          {group.teams.length} teams
        </span>
      </div>

      {/* Team list */}
      <div className="p-4 space-y-2">
        {group.teams.map((team: GroupTeam, ti: number) => (
          <div
            key={team.team}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-md transition-colors ${
              team.isEngland
                ? 'bg-sky/10 border border-sky/20'
                : 'bg-white/[0.03] hover:bg-white/[0.05]'
            }`}
          >
            <span className={`font-display text-xs font-semibold w-5 text-center ${
              team.isEngland ? 'text-sky' : 'text-white/30'
            }`}>
              {ti + 1}
            </span>
            {/* Team badge */}
            {team.logo ? (
              <span className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg shrink-0 overflow-hidden p-1 sm:p-1.5 ${
                team.isEngland
                  ? 'bg-white/95 border border-sky/30'
                  : 'bg-white/95 border border-white/10'
              }`}>
                <img src={team.logo} alt={team.team} className="w-full h-full object-contain" />
              </span>
            ) : (
              <span className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg text-xs font-display font-bold tracking-wide shrink-0 ${
                team.isEngland
                  ? 'bg-sky/20 text-sky border border-sky/30'
                  : 'bg-white/10 text-white/60 border border-white/10'
              }`}>
                {getTeamAcronym(team.team)}
              </span>
            )}
            <span className={`font-display text-base sm:text-lg font-bold tracking-wide ${
              team.isEngland ? 'text-sky' : 'text-white/90'
            }`}>
              {team.team}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
