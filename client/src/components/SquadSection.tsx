// DESIGN: "Stadium Broadcast" — Squad section with navy background, pill filters, sortable grid
// Uses new schema: roleCategory, clubEngland, getPlayerSurname
import { useState, useMemo } from 'react';
import { squadData, ASSETS, type Player, getPlayerSurname } from '@/lib/data';
import PlayerCard from './PlayerCard';
import PlayerModal from './PlayerModal';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';

export default function SquadSection() {
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('surname');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let players = [...squadData.players];

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
  }, [roleFilter, sortBy]);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setModalOpen(true);
  };

  return (
    <section
      id="squad"
      className="relative py-16 sm:py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={ASSETS.squadBg}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-navy/90" />
      </div>

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
            England Over 40s
          </p>
          <h2 className="font-display text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase">
            {squadData.title}
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded-full" />
          <p className="font-body text-white/50 text-sm mt-4 max-w-md mx-auto">
            {squadData.subtitle}
          </p>
        </motion.div>

        {/* Filters + Sort */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          {/* Role filter pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {squadData.roleFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setRoleFilter(filter.value)}
                className={`pill text-sm transition-all duration-200 ${
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
          <div className="flex items-center justify-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-white/40" />
            <span className="font-body text-xs text-white/40 uppercase tracking-wider">Sort by:</span>
            {squadData.sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`font-body text-xs px-2.5 py-1 rounded transition-colors ${
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

        {/* Player count */}
        <p className="font-body text-white/40 text-xs text-center mb-6 tracking-wider">
          Showing {filteredAndSorted.length} of {squadData.players.length} players
        </p>

        {/* Player grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredAndSorted.map((player, i) => (
            <PlayerCard
              key={player.id}
              player={player}
              index={i}
              onClick={handlePlayerClick}
            />
          ))}
        </div>

        {/* Empty state — no players match filter */}
        {filteredAndSorted.length === 0 && squadData.players.length > 0 && (
          <div className="text-center py-16">
            <p className="font-display text-white/30 text-xl">No players match this filter</p>
            <button
              onClick={() => setRoleFilter('all')}
              className="mt-4 font-body text-sky text-sm hover:underline"
            >
              Show all players
            </button>
          </div>
        )}

        {/* Empty state — squad not yet announced */}
        {squadData.players.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="w-7 h-7 text-white/20" />
            </div>
            <p className="font-display text-white/40 text-xl mb-2">{squadData.emptyState.heading}</p>
            <p className="font-body text-white/25 text-sm max-w-md mx-auto">{squadData.emptyState.message}</p>
          </div>
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
