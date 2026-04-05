// DESIGN: "Stadium Broadcast" — Squad section with search, filters, sort, share, skeleton
// Enhanced: search within profiles, share button, loading skeleton, semantic HTML, ARIA
import { useState, useMemo, useEffect } from 'react';
import { squadData, ASSETS, type Player, getPlayerSurname } from '@/lib/data';
import PlayerCard from './PlayerCard';
import PlayerModal from './PlayerModal';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search, Share2, X, Users } from 'lucide-react';
import { toast } from 'sonner';

function SquadSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white/5 rounded-lg overflow-hidden animate-pulse">
          <div className="h-48 bg-white/10" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-white/10 rounded w-3/4" />
            <div className="flex gap-2">
              <div className="h-5 bg-white/8 rounded-full w-16" />
              <div className="h-5 bg-white/8 rounded-full w-24" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-white/5 rounded w-full" />
              <div className="h-3 bg-white/5 rounded w-full" />
              <div className="h-3 bg-white/5 rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SquadSection() {
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('surname');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSorted = useMemo(() => {
    let players = [...squadData.players];

    // Search filter — matches name, club, role, batting/bowling style
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      players = players.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.clubEngland.toLowerCase().includes(q) ||
          p.roleCategory.toLowerCase().includes(q) ||
          p.battingStyle.toLowerCase().includes(q) ||
          p.bowlingStyle.toLowerCase().includes(q)
      );
    }

    // Filter by roleCategory
    if (roleFilter !== 'all') {
      players = players.filter((p) => p.roleCategory === roleFilter);
    }

    // Sort
    players.sort((a, b) => {
      switch (sortBy) {
        case 'surname':
          return getPlayerSurname(a).localeCompare(getPlayerSurname(b));
        case 'club':
          return a.clubEngland.localeCompare(b.clubEngland);
        case 'role': {
          const roleOrder = ['Batter', 'All-rounder', 'Seamer', 'Spinner', 'Wicketkeeper'];
          return roleOrder.indexOf(a.roleCategory) - roleOrder.indexOf(b.roleCategory);
        }
        default:
          return 0;
      }
    });

    return players;
  }, [roleFilter, sortBy, searchQuery]);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setModalOpen(true);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'England Over 40s — World Cup Squad 2026',
      text: `Check out the England Over 40s squad for the IMC ODI World Cup 2026 in Guyana!`,
      url: window.location.href + '#squad',
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Squad link copied to clipboard');
      }
    } catch {
      // User cancelled share
    }
  };

  return (
    <section
      id="squad"
      aria-labelledby="squad-heading"
      className="relative py-16 sm:py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={ASSETS.squadBg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/90" />
      </div>

      <div className="relative z-10 container">
        {/* Section header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="font-body text-sky-light text-sm tracking-[0.25em] uppercase mb-2 font-medium">
            England Over 40s
          </p>
          <h2 id="squad-heading" className="font-display text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase">
            {squadData.title}
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded-full" aria-hidden="true" />
          <p className="font-body text-white/50 text-sm mt-4 max-w-md mx-auto">
            {squadData.subtitle}
          </p>
        </motion.header>

        {/* Search + Share row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 max-w-lg mx-auto"
        >
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search by name, club, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-3 rounded-lg bg-white/10 border border-white/15 text-white placeholder:text-white/35 font-body text-sm focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky/50 transition-all min-h-[48px]"
                aria-label="Search squad profiles"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-all font-body text-sm min-h-[48px]"
              aria-label="Share squad page"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </motion.div>

        {/* Filters + Sort */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
          role="toolbar"
          aria-label="Squad filters and sorting"
        >
          {/* Role filter pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-4" role="group" aria-label="Filter by role">
            {squadData.roleFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setRoleFilter(filter.value)}
                aria-pressed={roleFilter === filter.value}
                className={`pill text-sm transition-all duration-200 min-h-[44px] px-4 ${
                  roleFilter === filter.value
                    ? 'bg-sky text-white shadow-lg shadow-sky/25'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Sort control */}
          <div className="flex items-center justify-center gap-2" role="group" aria-label="Sort players">
            <SlidersHorizontal className="w-4 h-4 text-white/40" aria-hidden="true" />
            <span className="font-body text-xs text-white/40 uppercase tracking-wider">Sort by:</span>
            {squadData.sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                aria-pressed={sortBy === opt.value}
                className={`font-body text-xs px-3 py-1.5 rounded transition-colors min-h-[36px] ${
                  sortBy === opt.value
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Player count + active filters summary */}
        <div className="text-center mb-6" aria-live="polite" aria-atomic="true">
          <p className="font-body text-white/40 text-xs tracking-wider">
            Showing {filteredAndSorted.length} of {squadData.players.length} players
            {searchQuery && <span className="text-sky/60"> — searching "{searchQuery}"</span>}
          </p>
        </div>

        {/* Loading skeleton */}
        {isLoading ? (
          <SquadSkeleton />
        ) : (
          <>
            {/* Player grid */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              role="list"
              aria-label="Squad players"
            >
              {filteredAndSorted.map((player, i) => (
                <div key={player.id} role="listitem">
                  <PlayerCard
                    player={player}
                    index={i}
                    onClick={handlePlayerClick}
                  />
                </div>
              ))}
            </div>

            {/* Empty state — no players match filter/search */}
            {filteredAndSorted.length === 0 && squadData.players.length > 0 && (
              <div className="text-center py-16" role="status">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-white/20" />
                </div>
                <p className="font-display text-white/30 text-xl">No players match this filter</p>
                <p className="font-body text-white/20 text-sm mt-1 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => { setRoleFilter('all'); setSearchQuery(''); }}
                  className="font-body text-sky text-sm hover:underline min-h-[44px] px-4 py-2"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Empty state — squad not yet announced */}
            {squadData.players.length === 0 && (
              <div className="text-center py-20" role="status">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-white/20" />
                </div>
                <p className="font-display text-white/40 text-xl mb-2">{squadData.emptyState.heading}</p>
                <p className="font-body text-white/25 text-sm max-w-md mx-auto">{squadData.emptyState.message}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Player detail modal */}
      <PlayerModal
        player={selectedPlayer}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
