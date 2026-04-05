// DESIGN: "Stadium Broadcast" — Slide-up modal sheet for player detail
import type { Player } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Shield, Star, MapPin } from 'lucide-react';

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

  const roleColor = ROLE_COLORS[player.role] || 'bg-sky/15 text-sky';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-white border-none">
        {/* Header with photo */}
        <div className="relative h-56 sm:h-64 bg-gradient-to-br from-navy to-navy-light flex items-end overflow-hidden">
          {player.photo ? (
            <img
              src={player.photo}
              alt={`${player.firstName} ${player.lastName}`}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-24 h-24 text-white/10" strokeWidth={1} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />

          <div className="relative z-10 p-6 pb-5 w-full">
            {player.leadershipTag && (
              <span className="pill bg-gold/30 text-gold mb-2 inline-flex items-center">
                {player.isCaptain && <Shield className="w-3 h-3 mr-1" />}
                {player.isViceCaptain && <Star className="w-3 h-3 mr-1" />}
                {player.leadershipTag}
              </span>
            )}
            <DialogHeader>
              <DialogTitle className="font-display text-white text-3xl sm:text-4xl font-bold tracking-tight leading-none">
                {player.firstName}{' '}
                <span className="block">{player.lastName.toUpperCase()}</span>
              </DialogTitle>
            </DialogHeader>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Role + badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`pill text-sm ${roleColor}`}>{player.role}</span>
            {player.isWicketkeeper && player.role !== 'Wicketkeeper' && (
              <span className="pill text-sm bg-gold/20 text-gold-dark">Wicketkeeper</span>
            )}
            {player.capNumber && (
              <span className="pill text-sm bg-navy/10 text-navy">Cap #{player.capNumber}</span>
            )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Batting" value={player.battingStyle} />
            <DetailItem
              label={player.isWicketkeeper ? 'Designation' : 'Bowling'}
              value={player.bowlingStyle}
            />
            <DetailItem label="Club" value={player.club} icon={<MapPin className="w-3.5 h-3.5" />} />
            {player.county && (
              <DetailItem label="County" value={player.county} />
            )}
          </div>

          {/* Bio */}
          {player.bio && (
            <div className="pt-3 border-t border-border">
              <p className="font-body text-sm text-navy/70 leading-relaxed">
                {player.bio}
              </p>
            </div>
          )}
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
      <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="font-body text-sm text-navy font-medium flex items-center gap-1.5">
        {icon}
        {value}
      </p>
    </div>
  );
}
