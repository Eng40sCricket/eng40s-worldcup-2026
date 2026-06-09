// DESIGN: "Stadium Broadcast" — Slide-up modal sheet for player detail
// Enhanced: Maximised font clarity, prominent captain/VC badges, larger text across all views
import type { Player } from '@/lib/data';
import { getDisplayBowling, getBowlingLabel, getPlayerFirstName, getPlayerSurname } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User, Shield, Star, MapPin, Clock, Info, Share2, Award } from 'lucide-react';
import { toast } from 'sonner';

interface PlayerModalProps {
  player: Player | null;
  open: boolean;
  onClose: () => void;
}

const ROLE_COLORS: Record<string, string> = {
  Batter: 'bg-sky/15 text-sky',
  Seamer: 'bg-emerald-500/15 text-emerald-600',
  Spinner: 'bg-amber-500/15 text-amber-600',
  'All-rounder': 'bg-violet-500/15 text-violet-600',
  Wicketkeeper: 'bg-gold/20 text-gold-dark',
};

export default function PlayerModal({ player, open, onClose }: PlayerModalProps) {
  if (!player) return null;

  const roleColor = ROLE_COLORS[player.roleCategory] || 'bg-sky/15 text-sky';
  const firstName = getPlayerFirstName(player);
  const surname = getPlayerSurname(player);
  const displayBowling = getDisplayBowling(player);
  const bowlingLabel = getBowlingLabel(player);

  const handleSharePlayer = async () => {
    const text = `${player.fullName} — ${player.roleCategory}, ${player.clubEngland} | England Over 40s World Cup 2026`;
    try {
      if (navigator.share) {
        await navigator.share({ title: player.fullName, text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success('Player profile copied to clipboard');
      }
    } catch {
      // User cancelled
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-white border-none">
        {/* Header with photo */}
        <div className="relative h-60 sm:h-72 bg-gradient-to-br from-navy to-navy-light flex items-end overflow-hidden">
          {player.image ? (
            <img
              src={player.image}
              alt={`Portrait of ${player.fullName}, ${player.roleCategory} for England Over 40s`}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <User className="w-24 h-24 text-white/10" strokeWidth={1} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" aria-hidden="true" />

          <div className="relative z-10 p-6 pb-5 w-full">
            {player.leadershipTag && (
              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-display font-bold text-base sm:text-lg tracking-wide shadow-lg mb-3 ${
                player.leadershipTag === 'Captain' 
                  ? 'bg-gold text-navy' 
                  : player.leadershipTag === 'Vice-Captain'
                  ? 'bg-gold/80 text-navy'
                  : 'bg-white/20 text-white'
              }`}>
                {player.leadershipTag === 'Captain' && <Shield className="w-5 h-5" aria-hidden="true" />}
                {player.leadershipTag === 'Vice-Captain' && <Star className="w-5 h-5" aria-hidden="true" />}
                {player.leadershipTag === 'Head Coach' && <Award className="w-5 h-5" aria-hidden="true" />}
                {player.leadershipTag.toUpperCase()}
              </span>
            )}
            <DialogHeader>
              <DialogTitle className="font-display text-white text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-none">
                {firstName}{' '}
                <span className="block text-4xl sm:text-5xl lg:text-6xl">{surname.toUpperCase()}</span>
              </DialogTitle>
              <DialogDescription className="sr-only">
                Player profile for {player.fullName}, {player.roleCategory} from {player.clubEngland}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Profile status banner */}
          {player.profileStatus !== 'confirmed' && (
            <div
              role="status"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-body ${
                player.profileStatus === 'provisional'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-gray-50 text-gray-500 border border-gray-200'
              }`}
            >
              <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
              {player.profileStatus === 'provisional'
                ? 'This profile is subject to confirmation. Details may change before the final squad announcement.'
                : 'Profile details are pending. This entry will be updated when the squad is officially announced.'}
            </div>
          )}

          {/* Role + badges — larger pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            {player.isCoachingStaff ? (
              <span className="pill text-base font-bold px-4 py-1.5 bg-navy/15 text-navy">{player.leadershipTag || 'Staff'}</span>
            ) : (
              <span className={`pill text-base font-bold px-4 py-1.5 ${roleColor}`}>{player.roleCategory.toUpperCase()}</span>
            )}
            {player.wicketkeeperFlag && player.roleCategory !== 'Wicketkeeper' && !player.isCoachingStaff && (
              <span className="pill text-base font-bold px-4 py-1.5 bg-gold/20 text-gold-dark">Wicketkeeper</span>
            )}
            {player.squadNumber !== undefined && !player.isCoachingStaff && (
              <span className="pill text-base font-bold px-4 py-1.5 bg-navy/10 text-navy font-display">#{player.squadNumber}</span>
            )}
            {player.capNumber && (
              <span className="pill text-base font-bold px-4 py-1.5 bg-navy/10 text-navy">Cap #{player.capNumber}</span>
            )}
            {/* Share button */}
            <button
              onClick={handleSharePlayer}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy transition-colors font-body text-sm font-semibold min-h-[40px]"
              aria-label={`Share ${player.fullName}'s profile`}
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Details grid — larger font */}
          <dl className="grid grid-cols-2 gap-5">
            {!player.isCoachingStaff && (
              <>
                <DetailItem label="BATTING" value={player.battingStyle} />
                <DetailItem label={bowlingLabel.toUpperCase()} value={displayBowling} />
              </>
            )}
            <DetailItem label="CLUB" value={player.clubEngland} icon={<MapPin className="w-4 h-4" />} />
            {player.county && <DetailItem label="COUNTY" value={player.county} />}
          </dl>

          {/* Bio — larger text for readability */}
          <div className="pt-4 border-t border-border">
            <dt className="font-body text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Biography</dt>
            {player.shortBio ? (
              <p className="font-body text-base text-navy/80 leading-relaxed">
                {player.shortBio}
              </p>
            ) : (
              <p className="font-body text-base text-navy/30 italic leading-relaxed">
                Biography coming soon — max. 50 words
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-body text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </dt>
      <dd className="font-body text-base sm:text-lg text-navy font-semibold flex items-center gap-1.5">
        {icon && <span aria-hidden="true">{icon}</span>}
        {value}
      </dd>
    </div>
  );
}
