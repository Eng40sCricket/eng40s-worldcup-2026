// DESIGN: "Stadium Broadcast" — Groups & standings with four tournament states
// Uses standings-engine for modular ranking, state derivation, and England focus
import { useState, useMemo } from 'react';
import {
  groupData,
  fixtureData,
  type Group,
  type GroupTeam,
} from '@/lib/data';
import {
  deriveTournamentState,
  rankTeams,
  buildStandingsFromFixtures,
  getEnglandQualificationMessage,
  sortGroupsEnglandFirst,
  getGroupStageProgress,
  getQualificationStatus,
  DEFAULT_QUALIFY_SPOTS,
  type TournamentState,
} from '@/lib/standings-engine';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Shield,
  Star,
  Info,
  BarChart3,
  Eye,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function GroupsSection() {
  const [englandFocus, setEnglandFocus] = useState(false);

  // Derive tournament state from data
  const tournamentState = useMemo(
    () => deriveTournamentState(groupData.groups, fixtureData.matches),
    [],
  );

  // Build standings from fixtures when tournament is live/completed
  const computedGroups = useMemo(() => {
    if (tournamentState === 'pre-draw') return [];
    if (tournamentState === 'draw-announced') return groupData.groups;
    // Live or completed: recalculate from fixture results
    return buildStandingsFromFixtures(groupData.groups, fixtureData.matches);
  }, [tournamentState]);

  // Sort groups: England's group first when focus mode is on
  const displayGroups = useMemo(() => {
    if (computedGroups.length === 0) return [];
    if (englandFocus) return sortGroupsEnglandFirst(computedGroups);
    return computedGroups;
  }, [computedGroups, englandFocus]);

  // England qualification message
  const implication = useMemo(
    () => getEnglandQualificationMessage(computedGroups, tournamentState),
    [computedGroups, tournamentState],
  );

  // Group stage progress
  const progress = useMemo(
    () => getGroupStageProgress(computedGroups),
    [computedGroups],
  );

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
            Groups &amp; Standings
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded-full" />

          {/* Tournament state badge */}
          <div className="mt-4">
            <TournamentStateBadge state={tournamentState} progress={progress} />
          </div>
        </motion.div>

        {/* Render based on tournament state */}
        {tournamentState === 'pre-draw' ? (
          <PreDrawPlaceholder />
        ) : (
          <>
            {/* Controls: England Focus toggle */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-8"
            >
              <button
                onClick={() => setEnglandFocus(false)}
                aria-pressed={!englandFocus}
                className={`pill text-sm transition-all min-h-[44px] px-4 ${
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
                aria-pressed={englandFocus}
                className={`pill text-sm transition-all min-h-[44px] px-4 ${
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
            <AnimatePresence>
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
            </AnimatePresence>

            {/* Progress bar for live tournaments */}
            {(tournamentState === 'live') && progress > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-xl mx-auto mb-8"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-body text-xs text-white/40 uppercase tracking-wider">
                    Group stage progress
                  </span>
                  <span className="font-display text-sm text-sky font-semibold">
                    {progress}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-sky to-sky-light rounded-full"
                  />
                </div>
              </motion.div>
            )}

            {/* Group tables */}
            {tournamentState === 'draw-announced' ? (
              <DrawAnnouncedState groups={displayGroups} englandFocus={englandFocus} />
            ) : (
              <div className={`grid gap-6 ${
                displayGroups.length === 1 ? 'max-w-3xl mx-auto' :
                'grid-cols-1 lg:grid-cols-2'
              }`}>
                {displayGroups.map((group, gi) => (
                  <GroupTable
                    key={group.id}
                    group={group}
                    index={gi}
                    isHighlighted={englandFocus && group.isEnglandGroup}
                    tournamentState={tournamentState}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}


// ============================================================
// TOURNAMENT STATE BADGE
// ============================================================

function TournamentStateBadge({ state, progress }: { state: TournamentState; progress: number }) {
  const config = {
    'pre-draw': {
      icon: Eye,
      label: groupData.emptyState.badge,
      className: 'bg-white/5 text-white/40',
    },
    'draw-announced': {
      icon: Clock,
      label: 'Groups Confirmed — Awaiting First Match',
      className: 'bg-sky/10 text-sky',
    },
    'live': {
      icon: AlertCircle,
      label: `Live — ${progress}% Complete`,
      className: 'bg-emerald-500/10 text-emerald-400',
    },
    'completed': {
      icon: CheckCircle2,
      label: 'Group Stage Complete',
      className: 'bg-gold/10 text-gold',
    },
  }[state];

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-medium ${config.className}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}


// ============================================================
// GROUP TABLE COMPONENT (Live / Completed states)
// ============================================================

function GroupTable({
  group,
  index,
  isHighlighted,
  tournamentState,
}: {
  group: Group;
  index: number;
  isHighlighted: boolean;
  tournamentState: TournamentState;
}) {
  const ranked = useMemo(() => rankTeams(group.teams), [group.teams]);
  const hasResults = ranked.some((t: GroupTeam) => t.played > 0);

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
        <table className="w-full" aria-label={`${group.name} standings`}>
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
              <th className="text-center font-body text-[10px] text-white/40 uppercase tracking-wider px-2 py-2 w-20">Status</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((team: GroupTeam, ti: number) => {
              const qualStatus = hasResults
                ? getQualificationStatus(ti + 1, DEFAULT_QUALIFY_SPOTS, tournamentState)
                : '';

              return (
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
                      ti < DEFAULT_QUALIFY_SPOTS ? 'text-gold' : 'text-white/30'
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
                  <td className="text-center font-body text-sm text-white/60 px-2 py-2.5 tabular-nums">{team.played}</td>
                  <td className="text-center font-body text-sm text-white/60 px-2 py-2.5 tabular-nums">{team.won}</td>
                  <td className="text-center font-body text-sm text-white/60 px-2 py-2.5 tabular-nums">{team.lost}</td>
                  <td className="text-center font-body text-sm text-white/60 px-2 py-2.5 tabular-nums">{team.tied}</td>
                  <td className="text-center font-body text-sm text-white/60 px-2 py-2.5 tabular-nums">{team.noResult}</td>
                  <td className="text-center px-2 py-2.5">
                    <span className={`font-display text-sm font-bold tabular-nums ${
                      team.isEngland ? 'text-sky' : 'text-white'
                    }`}>
                      {team.points}
                    </span>
                  </td>
                  <td className="text-center px-2 py-2.5">
                    <span className={`font-body text-xs tabular-nums ${
                      team.nrr.startsWith('+') && parseFloat(team.nrr) > 0 ? 'text-emerald-400' :
                      team.nrr.startsWith('-') ? 'text-red-400' : 'text-white/40'
                    }`}>
                      {team.nrr}
                    </span>
                  </td>
                  <td className="text-center px-2 py-2.5">
                    {qualStatus && (
                      <span className={`pill text-[9px] ${
                        qualStatus === 'Qualified' || qualStatus === 'Qualifying'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : qualStatus === 'Eliminated'
                          ? 'bg-red-500/15 text-red-400'
                          : 'bg-white/10 text-white/40'
                      }`}>
                        {qualStatus}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Qualification line indicator */}
      {hasResults && ranked.length > DEFAULT_QUALIFY_SPOTS && (
        <div className="px-4 py-1.5 bg-white/[0.02] flex items-center gap-2">
          <div className="flex-1 h-px bg-gold/30 border-dashed" />
          <span className="font-body text-[10px] text-gold/50 uppercase tracking-wider">
            Top {DEFAULT_QUALIFY_SPOTS} qualify
          </span>
          <div className="flex-1 h-px bg-gold/30 border-dashed" />
        </div>
      )}
    </motion.div>
  );
}


// ============================================================
// DRAW ANNOUNCED STATE — Groups assigned, no matches yet
// ============================================================

function DrawAnnouncedState({ groups, englandFocus }: { groups: Group[]; englandFocus: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className={`grid gap-6 ${
        groups.length === 1 ? 'max-w-3xl mx-auto' :
        'grid-cols-1 lg:grid-cols-2'
      }`}>
        {groups.map((group, gi) => {
          const isHighlighted = englandFocus && group.isEnglandGroup;
          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.15 }}
              className={`rounded-lg overflow-hidden ${
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
                  {group.teams.length} teams
                </span>
              </div>

              {/* Team list (no stats yet) */}
              <div className="p-4 space-y-2">
                {group.teams.map((team: GroupTeam, ti: number) => (
                  <div
                    key={team.team}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
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
                    {team.isEngland && <Shield className="w-3.5 h-3.5 text-sky shrink-0" />}
                    <span className={`font-body text-sm ${
                      team.isEngland ? 'text-sky font-semibold' : 'text-white/70'
                    }`}>
                      {team.team}
                    </span>
                  </div>
                ))}
              </div>

              {/* Awaiting matches message */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded bg-white/[0.03] border border-white/5">
                  <Clock className="w-3.5 h-3.5 text-white/20" />
                  <span className="font-body text-xs text-white/30">
                    Standings will populate when matches begin
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}


// ============================================================
// PRE-DRAW PLACEHOLDER STATE
// ============================================================

function PreDrawPlaceholder() {
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
          {groupData.emptyState.heading}
        </h3>
        <p className="font-body text-white/40 text-sm max-w-lg mx-auto leading-relaxed mb-4">
          {groupData.emptyState.message}
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
