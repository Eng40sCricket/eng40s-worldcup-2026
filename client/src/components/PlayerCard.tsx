// DESIGN: "Stadium Broadcast" — Player card with stat pills, role badge, hover lift
import type { Player } from '@/lib/data';
import { motion } from 'framer-motion';
import { User, Shield, Star } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  index: number;
  onClick: (player: Player) => void;
}

const ROLE_COLORS: Record<string, string> = {
  Batter: 'bg-sky/15 text-sky',
  Seamer: 'bg-emerald-500/15 text-emerald-600',
  Spinner: 'bg-amber-500/15 text-amber-600',
  'All-rounder': 'bg-violet-500/15 text-violet-600',
  Wicketkeeper: 'bg-gold/20 text-gold-dark',
};

export default function PlayerCard({ player, index, onClick }: PlayerCardProps) {
  const roleColor = ROLE_COLORS[player.role] || 'bg-sky/15 text-sky';
  const displayBowling = player.bowlingStyle;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => onClick(player)}
      className="group relative bg-white rounded-lg border border-border overflow-hidden text-left shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-full"
    >
      {/* Leadership badge */}
      {player.leadershipTag && (
        <div className="absolute top-3 right-3 z-10">
          <span className="pill bg-gold/20 text-gold-dark">
            {player.isCaptain && <Shield className="w-3 h-3 mr-1" />}
            {player.isViceCaptain && <Star className="w-3 h-3 mr-1" />}
            {player.leadershipTag}
          </span>
        </div>
      )}

      {/* Photo area */}
      <div className="relative h-48 bg-gradient-to-br from-navy/5 to-navy/10 flex items-center justify-center overflow-hidden">
        {player.photo ? (
          <img
            src={player.photo}
            alt={`${player.firstName} ${player.lastName}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-navy/20">
            <User className="w-16 h-16" strokeWidth={1} />
            <span className="font-body text-xs tracking-wider uppercase">Photo TBC</span>
          </div>
        )}
        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Info area */}
      <div className="p-4 pt-2">
        {/* Name */}
        <h3 className="font-display text-navy text-lg font-semibold leading-tight">
          {player.firstName}{' '}
          <span className="text-xl">{player.lastName.toUpperCase()}</span>
        </h3>

        {/* Role pill */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className={`pill ${roleColor}`}>{player.role}</span>
          {player.isWicketkeeper && player.role !== 'Wicketkeeper' && (
            <span className="pill bg-gold/20 text-gold-dark">WK</span>
          )}
        </div>

        {/* Stats */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-body text-xs text-muted-foreground uppercase tracking-wider w-16 shrink-0">Bat</span>
            <span className="font-body text-sm text-navy/80">{player.battingStyle}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-body text-xs text-muted-foreground uppercase tracking-wider w-16 shrink-0">
              {player.isWicketkeeper ? 'Role' : 'Bowl'}
            </span>
            <span className="font-body text-sm text-navy/80">{displayBowling}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-body text-xs text-muted-foreground uppercase tracking-wider w-16 shrink-0">Club</span>
            <span className="font-body text-sm text-navy/80">{player.club}</span>
          </div>
        </div>

        {/* Tap hint */}
        <p className="mt-3 font-body text-xs text-sky/60 group-hover:text-sky transition-colors">
          Tap for full profile &rarr;
        </p>
      </div>
    </motion.button>
  );
}
