// DESIGN: "Stadium Broadcast" — Groups & standings with tabs, auto-ranking, England focus mode
// Uses Group schema: rankGroupTeams, getEnglandImplication
import { useState, useMemo } from 'react';
import {
  GROUPS,
  type Group,
  type GroupTeam,
  rankGroupTeams,
  getEnglandImplication,
} from '@/lib/data';
import { motion } from 'framer-motion';
import {
  Trophy,
  Shield,
  Star,
  Info,
  BarChart3,
  Eye,
  Users,
} from 'lucide-react';

export default function GroupsSection() {
  const [englandFocus, setEnglandFocus] = useState(false);
  const hasGroups = GROUPS.length > 0;

  // Sort groups: England's group first when focus mode is on
  const sortedGroups = useMemo(() => {
    if (!hasGroups) return [];
    if (!englandFocus) return GROUPS;
    return [...GROUPS].sort((a, b) => {
      if (a.isEnglandGroup && !b.isEnglandGroup) return -1;
      if (!a.isEnglandGroup && b.isEnglandGroup) return 1;
      return 0;
    });
  }, [hasGroups, englandFocus]);

  // England implication text
  const implication = useMemo(() => {
    if (!hasGroups) return '';
    return getEnglandImplication(GROUPS);
  }, [hasGroups]);

  return (
    <section id="groups" className="relative py-16 sm:py-24 overflow-hidden">
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
          <h2 className="font-display text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase">
            Groups &amp; Standings
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded-full" />
        </motion.div>

        {hasGroups ? (
          <>
            {/* England Focus toggle */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-8"
            >
              <button
                onClick={() => setEnglandFocus(false)}
                className={`pill text-sm transition-all ${
                  !englandFocus
                    ? 'bg-sky text-white shadow-lg shadow-sky/25'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 mr-1.5" />
                All Groups
              </button>
              <button
                onClick={() => setEnglandFocus(true)}
                className={`pill text-sm transition-all ${
                  englandFocus
                    ? 'bg-gold text-navy font-semibold shadow-lg shadow-gold/25'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                England Focus
              </button>
            </motion.div>

            {/* England implication banner (in focus mode) */}
            {englandFocus && implication && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-3xl mx-auto mb-8"
              >
                <div className="flex items-start gap-3 bg-sky/10 border border-sky/20 rounded-lg p-4">
                  <Info className="w-5 h-5 text-sky shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-xs text-sky-light uppercase tracking-wider mb-1 font-medium">
                      Qualification Outlook
                    </p>
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      {implication}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Group tables */}
            <div className={`grid gap-6 ${
              sortedGroups.length === 1 ? 'max-w-3xl mx-auto' :
              'grid-cols-1 lg:grid-cols-2'
            }`}>
              {sortedGroups.map((group, gi) => (
                <GroupTable
                  key={group.id}
                  group={group}
                  index={gi}
                  isHighlighted={englandFocus && group.isEnglandGroup}
                />
              ))}
            </div>
          </>
        ) : (
          /* ── PLACEHOLDER STATE ── */
          <GroupsPlaceholder />
        )}
      </div>
    </section>
  );
}


// ============================================================
// GROUP TABLE COMPONENT
// ============================================================

function GroupTable({ group, index, isHighlighted }: { group: Group; index: number; isHighlighted: boolean }) {
  const ranked = useMemo(() => rankGroupTeams(group.teams), [group.teams]);
  const hasResults = ranked.some((t) => t.played > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`rounded-lg overflow-hidden transition-all ${
        isHighlighted
          ? 'ring-2 ring-gold/50 shadow-lg shadow-gold/10'
          : 'ring-1 ring-white/10'
      }`}
    >
      {/* Group header */}
      <div className={`px-5 py-3 flex items-center justify-between ${
        isHighlighted
          ? 'bg-gradient-to-r from-gold/20 to-gold/10'
          : 'bg-white/5'
      }`}>
        <div className="flex items-center gap-2">
          <Trophy className={`w-4 h-4 ${isHighlighted ? 'text-gold' : 'text-sky'}`} />
          <h3 className="font-display text-white text-lg font-semibold tracking-wide">
            {group.name}
          </h3>
          {group.isEnglandGroup && (
            <span className="pill text-[10px] bg-sky/20 text-sky">
              <Shield className="w-2.5 h-2.5 mr-0.5" />
              England
            </span>
          )}
        </div>
        <span className="font-body text-xs text-white/30">
          {ranked.length} teams
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/[0.03]">
              <th className="text-left font-body text-[10px] text-white/40 uppercase tracking-wider px-4 py-2 w-8">#</th>
              <th className="text-left font-body text-[10px] text-white/40 uppercase tracking-wider px-2 py-2">Team</th>
              <th className="text-center font-body text-[10px] text-white/40 uppercase tracking-wider px-2 py-2 w-10">P</th>
              <th className="text-center font-body text-[10px] text-white/40 uppercase tracking-wider px-2 py-2 w-10">W</th>
              <th className="text-center font-body text-[10px] text-white/40 uppercase tracking-wider px-2 py-2 w-10">L</th>
              <th className="text-center font-body text-[10px] text-white/40 uppercase tracking-wider px-2 py-2 w-10">T</th>
              <th className="text-center font-body text-[10px] text-white/40 uppercase tracking-wider px-2 py-2 w-10">NR</th>
              <th className="text-center font-body text-[10px] text-white/40 uppercase tracking-wider px-2 py-2 w-12">Pts</th>
              <th className="text-center font-body text-[10px] text-white/40 uppercase tracking-wider px-2 py-2 w-16">NRR</th>
              {hasResults && (
                <th className="text-center font-body text-[10px] text-white/40 uppercase tracking-wider px-2 py-2 w-20">Status</th>
              )}
            </tr>
          </thead>
          <tbody>
            {ranked.map((team, ti) => (
              <tr
                key={team.team}
                className={`border-t border-white/5 transition-colors ${
                  team.isEngland
                    ? 'bg-sky/10 hover:bg-sky/15'
                    : 'hover:bg-white/[0.03]'
                }`}
              >
                <td className="px-4 py-2.5">
                  <span className={`font-display text-xs font-semibold ${
                    ti < 4 ? 'text-gold' : 'text-white/30'
                  }`}>
                    {ti + 1}
                  </span>
                </td>
                <td className="px-2 py-2.5">
                  <div className="flex items-center gap-2">
                    {team.isEngland && <Shield className="w-3.5 h-3.5 text-sky shrink-0" />}
                    <span className={`font-body text-sm ${
                      team.isEngland ? 'text-sky font-semibold' : 'text-white/80'
                    }`}>
                      {team.team}
                    </span>
                  </div>
                </td>
                <td className="text-center font-body text-sm text-white/60 px-2 py-2.5">{team.played}</td>
                <td className="text-center font-body text-sm text-white/60 px-2 py-2.5">{team.won}</td>
                <td className="text-center font-body text-sm text-white/60 px-2 py-2.5">{team.lost}</td>
                <td className="text-center font-body text-sm text-white/60 px-2 py-2.5">{team.tied}</td>
                <td className="text-center font-body text-sm text-white/60 px-2 py-2.5">{team.noResult}</td>
                <td className="text-center px-2 py-2.5">
                  <span className={`font-display text-sm font-bold ${
                    team.isEngland ? 'text-sky' : 'text-white'
                  }`}>
                    {team.points}
                  </span>
                </td>
                <td className="text-center px-2 py-2.5">
                  <span className={`font-body text-xs ${
                    team.nrr.startsWith('+') ? 'text-emerald-400' :
                    team.nrr.startsWith('-') ? 'text-red-400' : 'text-white/40'
                  }`}>
                    {team.nrr}
                  </span>
                </td>
                {hasResults && (
                  <td className="text-center px-2 py-2.5">
                    {team.status && (
                      <span className={`pill text-[9px] ${
                        team.status === 'Qualified'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : team.status === 'Eliminated'
                          ? 'bg-red-500/15 text-red-400'
                          : 'bg-white/10 text-white/40'
                      }`}>
                        {team.status}
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Qualification line indicator */}
      {hasResults && ranked.length > 4 && (
        <div className="px-4 py-1.5 bg-white/[0.02] flex items-center gap-2">
          <div className="flex-1 h-px bg-gold/30 border-dashed" />
          <span className="font-body text-[10px] text-gold/50 uppercase tracking-wider">Qualification line</span>
          <div className="flex-1 h-px bg-gold/30 border-dashed" />
        </div>
      )}
    </motion.div>
  );
}


// ============================================================
// PLACEHOLDER STATE
// ============================================================

function GroupsPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Sample group table shells */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {['Group A', 'Group B'].map((name, gi) => (
          <div
            key={name}
            className="rounded-lg overflow-hidden ring-1 ring-white/10"
            style={{ opacity: 1 - gi * 0.15 }}
          >
            {/* Header */}
            <div className="px-5 py-3 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-white/20" />
                <span className="font-display text-white/30 text-lg font-semibold">{name}</span>
              </div>
              <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
            </div>

            {/* Skeleton rows */}
            <div className="p-4 space-y-3">
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className="flex items-center gap-3" style={{ opacity: 1 - i * 0.1 }}>
                  <div className="w-5 h-4 bg-white/5 rounded animate-pulse" />
                  <div className={`h-4 bg-white/5 rounded animate-pulse ${
                    i === 0 && gi === 0 ? 'w-20' : 'w-24'
                  }`} />
                  {i === 0 && gi === 0 && (
                    <Shield className="w-3 h-3 text-sky/20" />
                  )}
                  <div className="flex-1" />
                  <div className="h-4 w-8 bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-8 bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-8 bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-10 bg-white/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state message */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
          <BarChart3 className="w-8 h-8 text-white/15" />
        </div>
        <h3 className="font-display text-white text-xl sm:text-2xl font-semibold mb-3">
          Draw to Be Announced
        </h3>
        <p className="font-body text-white/40 text-sm max-w-lg mx-auto leading-relaxed mb-4">
          Group compositions will be published here once the official draw has taken place.
          Standings will populate automatically when the tournament schedule is confirmed
          and match results are entered.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
            <Eye className="w-4 h-4 text-white/20" />
            <span className="font-body text-xs text-white/30 tracking-wider uppercase">
              Draw pending
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
            <Star className="w-4 h-4 text-gold/30" />
            <span className="font-body text-xs text-white/30 tracking-wider uppercase">
              England group TBC
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
