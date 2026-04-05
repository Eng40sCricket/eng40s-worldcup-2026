// DESIGN: "Stadium Broadcast" — Player card with stat pills, role badge, hover lift
// Enhanced: semantic HTML, ARIA labels, larger touch targets, focus-visible ring
import type { Player } from '@/lib/data';
import { getDisplayBowling, getBowlingLabel, getPlayerFirstName, getPlayerSurname } from '@/lib/data';
import { motion } from 'framer-motion';
import { User, Shield, Star, Clock } from 'lucide-react';

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

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  confirmed: { label: 'Confirmed', className: 'bg-emerald-500/15 text-emerald-600' },
  provisional: { label: 'Subject to confirmation', className: 'bg-amber-500/15 text-amber-600' },
  placeholder: { label: 'Profile pending', className: 'bg-white/10 text-muted-foreground' },
};

export default function PlayerCard({ player, index, onClick }: PlayerCardProps) {
  const roleColor = ROLE_COLORS[player.roleCategory] || 'bg-sky/15 text-sky';
  const displayBowling = getDisplayBowling(player);
  const bowlingLabel = getBowlingLabel(player);
  const firstName = getPlayerFirstName(player);
  const surname = getPlayerSurname(player);
  const statusInfo = STATUS_BADGE[player.profileStatus];
  const isPlaceholder = player.profileStatus === 'placeholder';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className={`group relative bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
        isPlaceholder ? 'border-dashed border-border/60 opacity-75' : 'border-border'
      }`}
    >
      <button
        onClick={() => onClick(player)}
        className="w-full text-left focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2 rounded-lg"
        aria-label={`View profile for ${player.fullName}, ${player.roleCategory} from ${player.clubEngland}`}
      >
        {/* Leadership badge */}
        {player.leadershipTag && (
          <div className="absolute top-3 right-3 z-10">
            <span className="pill bg-gold/20 text-gold-dark">
              {player.leadershipTag === 'Captain' && <Shield className="w-3 h-3 mr-1" aria-hidden="true" />}
              {player.leadershipTag === 'Vice-Captain' && <Star className="w-3 h-3 mr-1" aria-hidden="true" />}
              {player.leadershipTag}
            </span>
          </div>
        )}

        {/* Photo area */}
        <div className="relative h-48 bg-gradient-to-br from-navy/5 to-navy/10 flex items-center justify-center overflow-hidden">
          {player.image ? (
            <img
              src={player.image}
              alt={`${player.fullName}, ${player.roleCategory}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-navy/20" aria-hidden="true">
              <User className="w-16 h-16" strokeWidth={1} />
              <span className="font-body text-xs tracking-wider uppercase">Photo TBC</span>
            </div>
          )}
          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
        </div>

        {/* Info area */}
        <div className="p-4 pt-2">
          {/* Name */}
          <h3 className="font-display text-navy text-lg font-semibold leading-tight">
            {firstName}{' '}
            <span className="text-xl">{surname.toUpperCase()}</span>
          </h3>

          {/* Role pill + status */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className={`pill ${roleColor}`}>{player.roleCategory}</span>
            {player.wicketkeeperFlag && player.roleCategory !== 'Wicketkeeper' && (
              <span className="pill bg-gold/20 text-gold-dark">WK</span>
            )}
            {player.profileStatus !== 'confirmed' && statusInfo && (
              <span className={`pill ${statusInfo.className} text-[10px]`}>
                <Clock className="w-2.5 h-2.5 mr-0.5" aria-hidden="true" />
                {statusInfo.label}
              </span>
            )}
          </div>

          {/* Stats — using definition list for semantics */}
          <dl className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <dt className="font-body text-xs text-muted-foreground uppercase tracking-wider w-16 shrink-0">Bat</dt>
              <dd className="font-body text-sm text-navy/80">{player.battingStyle}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="font-body text-xs text-muted-foreground uppercase tracking-wider w-16 shrink-0">
                {bowlingLabel === 'Designation' ? 'Role' : 'Bowl'}
              </dt>
              <dd className="font-body text-sm text-navy/80">{displayBowling}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="font-body text-xs text-muted-foreground uppercase tracking-wider w-16 shrink-0">Club</dt>
              <dd className="font-body text-sm text-navy/80">{player.clubEngland}</dd>
            </div>
          </dl>

          {/* Tap hint */}
          <p className="mt-3 font-body text-xs text-sky/60 group-hover:text-sky transition-colors" aria-hidden="true">
            Tap for full profile &rarr;
          </p>
        </div>
      </button>
    </motion.article>
  );
}
