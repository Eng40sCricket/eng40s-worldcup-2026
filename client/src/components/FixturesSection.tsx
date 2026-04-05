// DESIGN: "Stadium Broadcast" — Fixtures section with list + calendar views, filters, England prominence
// Uses enhanced Fixture schema: stage, isEngland, matchCentreUrl, group
import { useState, useMemo } from 'react';
import {
  fixtureData,
  type Fixture,
} from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  List,
  MapPin,
  ExternalLink,
  Clock,
  Shield,
  ChevronRight,
  CalendarX2,
} from 'lucide-react';

// ---- Date helpers ----
function formatDate(iso: string): string {
  if (iso === 'TBC') return 'Date TBC';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function formatShortDate(iso: string): string {
  if (iso === 'TBC') return 'TBC';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function getDayOfWeek(iso: string): string {
  if (iso === 'TBC') return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'short' });
}

// ---- Status badge ----
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  upcoming: { label: 'Upcoming', className: 'bg-sky/15 text-sky' },
  'in-progress': { label: 'LIVE', className: 'bg-red-500/15 text-red-600 animate-pulse' },
  completed: { label: 'Completed', className: 'bg-emerald-500/15 text-emerald-600' },
  abandoned: { label: 'Abandoned', className: 'bg-amber-500/15 text-amber-600' },
  'no-result': { label: 'No Result', className: 'bg-gray-500/15 text-gray-600' },
  tbc: { label: 'TBC', className: 'bg-white/10 text-white/50' },
};

// ---- View mode ----
type ViewMode = 'list' | 'calendar';

export default function FixturesSection() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [teamFilter, setTeamFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [venueFilter, setVenueFilter] = useState('all');

  const hasFixtures = fixtureData.matches.length > 0;

  const filtered = useMemo(() => {
    if (!hasFixtures) return [];
    let matches = [...fixtureData.matches];

    if (teamFilter === 'england') {
      matches = matches.filter((m) => m.isEngland);
    }
    if (stageFilter === 'group') {
      matches = matches.filter((m) => m.stage === 'group');
    } else if (stageFilter === 'knockout') {
      matches = matches.filter((m) => m.stage !== 'group' && m.stage !== 'warm-up');
    }
    if (statusFilter === 'upcoming') {
      matches = matches.filter((m) => m.status === 'upcoming' || m.status === 'tbc');
    } else if (statusFilter === 'completed') {
      matches = matches.filter((m) => m.status === 'completed');
    }
    if (venueFilter !== 'all') {
      matches = matches.filter((m) => m.venue === venueFilter);
    }

    // Sort by date
    matches.sort((a, b) => {
      if (a.date === 'TBC') return 1;
      if (b.date === 'TBC') return -1;
      return a.date.localeCompare(b.date);
    });

    return matches;
  }, [teamFilter, stageFilter, statusFilter, venueFilter, hasFixtures]);

  // Group fixtures by date for calendar view
  const groupedByDate = useMemo(() => {
    const map = new Map<string, Fixture[]>();
    filtered.forEach((f) => {
      const key = f.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    });
    return map;
  }, [filtered]);

  // Unique venues for venue filter
  const venues = useMemo(() => {
    if (!hasFixtures) return fixtureData.venues;
    const set = new Set(fixtureData.matches.map((f) => f.venue));
    return Array.from(set).sort();
  }, [hasFixtures]);

  return (
    <section id="fixtures" aria-labelledby="fixtures-heading" className="section-white py-16 sm:py-24">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 id="fixtures-heading" className="font-display text-navy text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase">
            Fixtures
          </h2>
          <div className="w-16 h-1 bg-sky mx-auto mt-3 rounded-full" />
        </motion.div>

        {hasFixtures ? (
          <>
            {/* Controls bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 space-y-4"
            >
              {/* View toggle + team filter */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* View mode toggle */}
                <div className="flex items-center gap-1 bg-navy/5 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    aria-pressed={viewMode === 'list'}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-body font-medium transition-all min-h-[44px] ${
                      viewMode === 'list'
                        ? 'bg-white text-navy shadow-sm'
                        : 'text-navy/50 hover:text-navy/80'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    aria-pressed={viewMode === 'calendar'}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-body font-medium transition-all min-h-[44px] ${
                      viewMode === 'calendar'
                        ? 'bg-white text-navy shadow-sm'
                        : 'text-navy/50 hover:text-navy/80'
                    }`}
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    Calendar
                  </button>
                </div>

                {/* Team filter pills */}
                <div className="flex flex-wrap gap-2">
                  {fixtureData.filters.team.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setTeamFilter(f.value)}
                      aria-pressed={teamFilter === f.value}
                      className={`pill text-xs transition-all min-h-[44px] px-3 ${
                        teamFilter === f.value
                          ? f.value === 'england'
                            ? 'bg-navy text-white shadow-md'
                            : 'bg-sky text-white shadow-md'
                          : 'bg-navy/8 text-navy/60 hover:bg-navy/15'
                      }`}
                    >
                      {f.value === 'england' && <Shield className="w-3 h-3 mr-1" />}
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stage + status + venue filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-body text-xs text-navy/40 uppercase tracking-wider mr-1">Filter:</span>

                {/* Stage */}
                {fixtureData.filters.stage.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setStageFilter(f.value)}
                    className={`font-body text-xs px-2.5 py-1 rounded transition-colors ${
                      stageFilter === f.value
                        ? 'bg-navy/10 text-navy font-medium'
                        : 'text-navy/40 hover:text-navy/70'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}

                <span className="text-navy/15">|</span>

                {/* Status */}
                {fixtureData.filters.status.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setStatusFilter(f.value)}
                    className={`font-body text-xs px-2.5 py-1 rounded transition-colors ${
                      statusFilter === f.value
                        ? 'bg-navy/10 text-navy font-medium'
                        : 'text-navy/40 hover:text-navy/70'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}

                <span className="text-navy/15">|</span>

                {/* Venue */}
                <select
                  value={venueFilter}
                  onChange={(e) => setVenueFilter(e.target.value)}
                  className="font-body text-xs px-2.5 py-1 rounded bg-navy/5 text-navy/70 border-none outline-none cursor-pointer"
                >
                  <option value="all">All Venues</option>
                  {venues.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Match count */}
            <p className="font-body text-navy/40 text-xs text-center mb-6 tracking-wider">
              Showing {filtered.length} of {fixtureData.matches.length} matches
            </p>

            {/* List view */}
            {viewMode === 'list' && (
              <div className="space-y-3 max-w-4xl mx-auto">
                <AnimatePresence mode="popLayout">
                  {filtered.map((fixture, i) => (
                    <FixtureListCard key={fixture.id} fixture={fixture} index={i} />
                  ))}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <p className="font-display text-navy/30 text-lg">No matches match your filters</p>
                    <button
                      onClick={() => { setTeamFilter('all'); setStageFilter('all'); setStatusFilter('all'); setVenueFilter('all'); }}
                      className="mt-3 font-body text-sky text-sm hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Calendar view */}
            {viewMode === 'calendar' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                {Array.from(groupedByDate.entries()).map(([date, matches]) => (
                  <div key={date}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-sky" />
                        <span className="font-display text-navy text-lg font-semibold">
                          {formatDate(date)}
                        </span>
                      </div>
                      <div className="flex-1 h-px bg-navy/10" />
                      <span className="font-body text-xs text-navy/40">
                        {matches.length} match{matches.length !== 1 ? 'es' : ''}
                      </span>
                    </div>
                    <div className="space-y-2 pl-6 border-l-2 border-sky/20">
                      {matches.map((fixture) => (
                        <CalendarMatchCard key={fixture.id} fixture={fixture} />
                      ))}
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <p className="font-display text-navy/30 text-lg">No matches match your filters</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* ── PLACEHOLDER STATE ── */
          <FixturesPlaceholder />
        )}
      </div>
    </section>
  );
}


// ============================================================
// SUB-COMPONENTS
// ============================================================

/** List view fixture card */
function FixtureListCard({ fixture, index }: { fixture: Fixture; index: number }) {
  const statusCfg = STATUS_CONFIG[fixture.status] || STATUS_CONFIG.tbc;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className={`relative rounded-lg border overflow-hidden transition-all ${
        fixture.isEngland
          ? 'border-sky/30 bg-sky/5 shadow-md shadow-sky/5'
          : 'border-border bg-white shadow-sm'
      }`}
    >
      {/* England indicator stripe */}
      {fixture.isEngland && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky" />
      )}

      <div className={`p-4 sm:p-5 ${fixture.isEngland ? 'pl-5 sm:pl-6' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Date + time */}
          <div className="sm:w-32 shrink-0">
            <p className="font-display text-navy text-sm font-semibold">{formatShortDate(fixture.date)}</p>
            <p className="font-body text-xs text-navy/50">{getDayOfWeek(fixture.date)}</p>
            {fixture.time && (
              <p className="font-body text-xs text-navy/40 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                {fixture.time} local
              </p>
            )}
          </div>

          {/* Teams */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`font-display text-base font-semibold ${
                fixture.homeTeam === 'England' ? 'text-sky' : 'text-navy'
              }`}>
                {fixture.homeTeam}
              </span>
              <span className="font-body text-xs text-navy/30 uppercase tracking-wider">vs</span>
              <span className={`font-display text-base font-semibold ${
                fixture.awayTeam === 'England' ? 'text-sky' : 'text-navy'
              }`}>
                {fixture.awayTeam}
              </span>
            </div>

            {/* Venue + group */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {fixture.venue && (
                <span className="font-body text-xs text-navy/50 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {fixture.venueLink ? (
                    <a href={fixture.venueLink} target="_blank" rel="noopener noreferrer" className="hover:text-sky transition-colors">
                      {fixture.venue}
                    </a>
                  ) : fixture.venue}
                </span>
              )}
              {fixture.group && (
                <span className="pill text-[10px] bg-navy/8 text-navy/60">{fixture.group}</span>
              )}
            </div>

            {/* Result */}
            {fixture.result && (
              <p className="font-body text-sm text-navy/70 mt-1 font-medium">{fixture.result}</p>
            )}
          </div>

          {/* Status + match centre */}
          <div className="flex items-center gap-2 sm:flex-col sm:items-end shrink-0">
            <span className={`pill text-[10px] ${statusCfg.className}`}>{statusCfg.label}</span>
            {fixture.matchCentreUrl && (
              <a
                href={fixture.matchCentreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-body text-xs text-sky hover:text-sky-light transition-colors"
              >
                Match Centre <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


/** Calendar view match card */
function CalendarMatchCard({ fixture }: { fixture: Fixture }) {
  const statusCfg = STATUS_CONFIG[fixture.status] || STATUS_CONFIG.tbc;

  return (
    <div className={`rounded-md border p-3 transition-all ${
      fixture.isEngland
        ? 'border-sky/30 bg-sky/5'
        : 'border-border bg-white'
    }`}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {fixture.isEngland && <Shield className="w-3.5 h-3.5 text-sky shrink-0" />}
            <span className={`font-display text-sm font-semibold ${fixture.isEngland ? 'text-sky' : 'text-navy'}`}>
              {fixture.homeTeam} vs {fixture.awayTeam}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {fixture.time && (
              <span className="font-body text-xs text-navy/40">{fixture.time}</span>
            )}
            {fixture.venue && (
              <span className="font-body text-xs text-navy/40">&middot; {fixture.venue}</span>
            )}
            {fixture.group && (
              <span className="font-body text-[10px] text-navy/40">&middot; {fixture.group}</span>
            )}
          </div>
          {fixture.result && (
            <p className="font-body text-xs text-navy/60 mt-1">{fixture.result}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`pill text-[10px] ${statusCfg.className}`}>{statusCfg.label}</span>
          {fixture.matchCentreUrl && (
            <a href={fixture.matchCentreUrl} target="_blank" rel="noopener noreferrer">
              <ChevronRight className="w-4 h-4 text-sky" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}


/** Professional placeholder state when fixtures are not yet released */
function FixturesPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto"
    >
      {/* Sample card shells */}
      <div className="space-y-3 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-dashed border-navy/15 bg-navy/[0.02] p-4 sm:p-5"
            style={{ opacity: 1 - (i - 1) * 0.25 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Date placeholder */}
              <div className="sm:w-32 shrink-0">
                <div className="h-4 w-20 bg-navy/8 rounded animate-pulse" />
                <div className="h-3 w-12 bg-navy/5 rounded mt-1.5 animate-pulse" />
              </div>

              {/* Teams placeholder */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {i === 1 && (
                    <>
                      <span className="font-display text-sm font-semibold text-sky/40">England</span>
                      <span className="font-body text-xs text-navy/20">vs</span>
                    </>
                  )}
                  <div className={`h-4 bg-navy/8 rounded animate-pulse ${i === 1 ? 'w-24' : 'w-40'}`} />
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-3 w-28 bg-navy/5 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-navy/5 rounded animate-pulse" />
                </div>
              </div>

              {/* Status placeholder */}
              <div className="shrink-0">
                <div className="h-5 w-14 bg-navy/5 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state message */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy/5 mb-4">
          <CalendarX2 className="w-8 h-8 text-navy/25" />
        </div>
        <h3 className="font-display text-navy text-xl sm:text-2xl font-semibold mb-3">
          {fixtureData.emptyState.heading}
        </h3>
        <p className="font-body text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed mb-4">
          {fixtureData.emptyState.message}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy/5">
          <Clock className="w-4 h-4 text-navy/30" />
          <span className="font-body text-xs text-navy/40 tracking-wider uppercase">
            Schedule to be confirmed
          </span>
        </div>

        {/* Expected venues */}
        <div className="mt-8 pt-6 border-t border-navy/10 max-w-md mx-auto">
          <p className="font-body text-xs text-navy/30 uppercase tracking-wider mb-3">{fixtureData.emptyState.venuesLabel}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {fixtureData.venues.map((v) => (
              <span key={v} className="pill text-xs bg-navy/5 text-navy/40">
                <MapPin className="w-3 h-3 mr-1" />
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
