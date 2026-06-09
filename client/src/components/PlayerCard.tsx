// DESIGN: "Stadium Broadcast" — Player card with squad number, stat pills, role badge
// Enhanced: Maximised font clarity across mobile/tablet/laptop with prominent captain/vice-captain badges
import type { Player } from '@/lib/data';
import { getDisplayBowling, getBowlingLabel, getPlayerFirstName, getPlayerSurname } from '@/lib/data';
import { motion } from 'framer-motion';
import { User, Shield, Star, Clock, Award } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  index: number;
  onClick: (player: Player) => void;
  /** If true, renders a larger featured captain variant */
  featured?: boolean;
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

export default function PlayerCard({ player, index, onClick, featured = false }: PlayerCardProps) {
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
      } ${featured ? 'ring-2 ring-gold/40' : ''}`}
    >
      <button
        onClick={() => onClick(player)}
        className="w-full text-left focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2 rounded-lg"
        aria-label={`View profile for ${player.fullName}, ${player.roleCategory} from ${player.clubEngland}`}
      >
        {/* Squad number badge — top left */}
        {player.squadNumber !== undefined && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`inline-flex items-center justify-center font-display font-bold text-white rounded-md shadow-md ${
              featured ? 'w-11 h-11 text-xl bg-gold' : 'w-9 h-9 text-base bg-navy'
            }`}>
              {player.squadNumber}
            </span>
          </div>
        )}

        {/* Leadership badge — top right — LARGER and more prominent */}
        {player.leadershipTag && (
          <div className="absolute top-3 right-3 z-10">
            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md font-display font-bold text-sm sm:text-base tracking-wide shadow-md ${
              player.leadershipTag === 'Captain' 
                ? 'bg-gold text-navy' 
                : player.leadershipTag === 'Vice-Captain'
                ? 'bg-gold/80 text-navy'
                : 'bg-navy/80 text-white'
            }`}>
              {player.leadershipTag === 'Captain' && <Shield className="w-4 h-4" aria-hidden="true" />}
              {player.leadershipTag === 'Vice-Captain' && <Star className="w-4 h-4" aria-hidden="true" />}
              {player.leadershipTag === 'Head Coach' && <Award className="w-4 h-4" aria-hidden="true" />}
              {player.leadershipTag.toUpperCase()}
            </span>
          </div>
        )}

        {/* Photo area */}
        <div className="relative bg-gradient-to-br from-navy/5 to-navy/10 flex items-center justify-center overflow-hidden aspect-[5/5.5]">
          {player.image ? (
            <img
              src={player.image}
              alt={`${player.fullName}, ${player.roleCategory}`}
              className="w-full h-full object-cover object-[center_15%] sm:object-[center_20%] group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-navy/20" aria-hidden="true">
              <User className={featured ? 'w-20 h-20' : 'w-16 h-16'} strokeWidth={1} />
              <span className="font-body text-xs tracking-wider uppercase">Photo TBC</span>
            </div>
          )}
          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
        </div>

        {/* Info area — enhanced font sizes for clarity */}
        <div className={`p-4 sm:p-5 pt-2 sm:pt-3 ${featured ? 'pb-5' : ''}`}>
          {/* Name — significantly larger and bolder */}
          <h3 className={`font-display text-navy font-bold leading-tight ${
            featured ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl lg:text-2xl'
          }`}>
            {firstName}{' '}
            <span className={`block ${featured ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl lg:text-3xl'}`}>
              {surname.toUpperCase()}
            </span>
          </h3>

          {/* Role pill + status — larger pills */}
          <div className="mt-2.5 flex flex-wrap gap-2">
            {!player.isCoachingStaff && (
              <span className={`pill font-bold text-sm sm:text-base px-3 py-1 ${roleColor}`}>{player.roleCategory.toUpperCase()}</span>
            )}
            {player.isCoachingStaff && (
              <span className="pill bg-navy/15 text-navy font-bold text-sm sm:text-base px-3 py-1">{player.leadershipTag || 'Staff'}</span>
            )}
            {player.wicketkeeperFlag && player.roleCategory !== 'Wicketkeeper' && !player.isCoachingStaff && (
              <span className="pill bg-gold/20 text-gold-dark font-bold text-sm px-3 py-1">WK</span>
            )}
            {player.profileStatus !== 'confirmed' && statusInfo && (
              <span className={`pill ${statusInfo.className} text-xs px-2 py-1`}>
                <Clock className="w-3 h-3 mr-0.5" aria-hidden="true" />
                {statusInfo.label}
              </span>
            )}
          </div>

          {/* Stats — larger font for readability */}
          <dl className="mt-4 space-y-2">
            {!player.isCoachingStaff && (
              <>
                <div className="flex items-center gap-3">
                  <dt className="font-body text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider w-14 sm:w-16 shrink-0">BAT</dt>
                  <dd className="font-body text-sm sm:text-base font-semibold text-navy">{player.battingStyle}</dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt className="font-body text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider w-14 sm:w-16 shrink-0">
                    {bowlingLabel === 'Designation' ? 'ROLE' : 'BOWL'}
                  </dt>
                  <dd className="font-body text-sm sm:text-base font-semibold text-navy">{displayBowling}</dd>
                </div>
              </>
            )}
            <div className="flex items-center gap-3">
              <dt className="font-body text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider w-14 sm:w-16 shrink-0">CLUB</dt>
              <dd className="font-body text-sm sm:text-base font-semibold text-navy">{player.clubEngland}</dd>
            </div>
          </dl>

          {/* Biography — slightly larger text */}
          <div className="mt-3 pt-3 border-t border-border/50 h-[3.5rem] overflow-hidden">
            {player.shortBio ? (
              <p className="font-body text-xs sm:text-sm text-navy/60 leading-relaxed line-clamp-2">
                {player.shortBio}
              </p>
            ) : (
              <p className="font-body text-xs sm:text-sm text-navy/30 italic leading-relaxed">
                Biography coming soon
              </p>
            )}
          </div>

          {/* Tap hint */}
          <p className="mt-2 font-body text-xs sm:text-sm text-sky/60 font-medium group-hover:text-sky transition-colors" aria-hidden="true">
            Tap for full profile &rarr;
          </p>
        </div>
      </button>
    </motion.article>
  );
}
