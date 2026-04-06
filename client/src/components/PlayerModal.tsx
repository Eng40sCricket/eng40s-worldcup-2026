// DESIGN: "Stadium Broadcast" — Slide-up modal sheet for player detail
// Enhanced: share button, semantic HTML, keyboard nav, larger touch targets
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
        <div className="relative h-56 sm:h-64 bg-gradient-to-br from-navy to-navy-light flex items-end overflow-hidden">
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
              <span className="pill bg-gold/30 text-gold mb-2 inline-flex items-center">
                {player.leadershipTag === 'Captain' && <Shield className="w-3 h-3 mr-1" aria-hidden="true" />}
                {player.leadershipTag === 'Vice-Captain' && <Star className="w-3 h-3 mr-1" aria-hidden="true" />}
                {player.leadershipTag === 'Head Coach' && <Award className="w-3 h-3 mr-1" aria-hidden="true" />}
                {player.leadershipTag}
              </span>
            )}
            <DialogHeader>
              <DialogTitle className="font-display text-white text-3xl sm:text-4xl font-bold tracking-tight leading-none">
                {firstName}{' '}
                <span className="block">{surname.toUpperCase()}</span>
              </DialogTitle>
              <DialogDescription className="sr-only">
                Player profile for {player.fullName}, {player.roleCategory} from {player.clubEngland}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Profile status banner */}
          {player.profileStatus !== 'confirmed' && (
            <div
              role="status"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-xs font-body ${
                player.profileStatus === 'provisional'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-gray-50 text-gray-500 border border-gray-200'
              }`}
            >
              <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {player.profileStatus === 'provisional'
                ? 'This profile is subject to confirmation. Details may change before the final squad announcement.'
                : 'Profile details are pending. This entry will be updated when the squad is officially announced.'}
            </div>
          )}

          {/* Role + badges */}
          <div className="flex flex-wrap items-center gap-2">
            {player.isCoachingStaff ? (
              <span className="pill text-sm bg-navy/15 text-navy">Coaching Staff</span>
            ) : (
              <span className={`pill text-sm ${roleColor}`}>{player.roleCategory}</span>
            )}
            {player.wicketkeeperFlag && player.roleCategory !== 'Wicketkeeper' && !player.isCoachingStaff && (
              <span className="pill text-sm bg-gold/20 text-gold-dark">Wicketkeeper</span>
            )}
            {player.squadNumber !== undefined && !player.isCoachingStaff && (
              <span className="pill text-sm bg-navy/10 text-navy font-display">#{player.squadNumber}</span>
            )}
            {player.capNumber && (
              <span className="pill text-sm bg-navy/10 text-navy">Cap #{player.capNumber}</span>
            )}
            {/* Share button */}
            <button
              onClick={handleSharePlayer}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy transition-colors font-body text-xs min-h-[36px]"
              aria-label={`Share ${player.fullName}'s profile`}
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>

          {/* Details grid — using definition list for semantics */}
          <dl className="grid grid-cols-2 gap-4">
            {!player.isCoachingStaff && (
              <>
                <DetailItem label="Batting" value={player.battingStyle} />
                <DetailItem label={bowlingLabel} value={displayBowling} />
              </>
            )}
            <DetailItem label="Club" value={player.clubEngland} icon={<MapPin className="w-3.5 h-3.5" />} />
            {player.county && <DetailItem label="County" value={player.county} />}
          </dl>

          {/* Bio */}
          <div className="pt-3 border-t border-border">
            <dt className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Biography</dt>
            {player.shortBio ? (
              <p className="font-body text-sm text-navy/70 leading-relaxed">
                {player.shortBio}
              </p>
            ) : (
              <p className="font-body text-sm text-navy/30 italic leading-relaxed">
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
      <dt className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
        {label}
      </dt>
      <dd className="font-body text-sm text-navy font-medium flex items-center gap-1.5">
        {icon && <span aria-hidden="true">{icon}</span>}
        {value}
      </dd>
    </div>
  );
}
