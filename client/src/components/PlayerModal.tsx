// DESIGN: "Stadium Broadcast" — Slide-up modal sheet for player detail
// Uses new schema: fullName, roleCategory, wicketkeeperFlag, clubEngland, profileStatus
import type { Player } from '@/lib/data';
import { getDisplayBowling, getBowlingLabel, getPlayerFirstName, getPlayerSurname } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Shield, Star, MapPin, Clock, Info } from 'lucide-react';

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-white border-none">
        {/* Header with photo */}
        <div className="relative h-56 sm:h-64 bg-gradient-to-br from-navy to-navy-light flex items-end overflow-hidden">
          {player.image ? (
            <img
              src={player.image}
              alt={player.fullName}
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
                {player.leadershipTag === 'Captain' && <Shield className="w-3 h-3 mr-1" />}
                {player.leadershipTag === 'Vice-Captain' && <Star className="w-3 h-3 mr-1" />}
                {player.leadershipTag}
              </span>
            )}
            <DialogHeader>
              <DialogTitle className="font-display text-white text-3xl sm:text-4xl font-bold tracking-tight leading-none">
                {firstName}{' '}
                <span className="block">{surname.toUpperCase()}</span>
              </DialogTitle>
            </DialogHeader>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Profile status banner */}
          {player.profileStatus !== 'confirmed' && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-body ${
              player.profileStatus === 'provisional'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-gray-50 text-gray-500 border border-gray-200'
            }`}>
              <Info className="w-3.5 h-3.5 shrink-0" />
              {player.profileStatus === 'provisional'
                ? 'This profile is subject to confirmation. Details may change before the final squad announcement.'
                : 'Profile details are pending. This entry will be updated when the squad is officially announced.'}
            </div>
          )}

          {/* Role + badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`pill text-sm ${roleColor}`}>{player.roleCategory}</span>
            {player.wicketkeeperFlag && player.roleCategory !== 'Wicketkeeper' && (
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
              label={bowlingLabel}
              value={displayBowling}
            />
            <DetailItem label="Club" value={player.clubEngland} icon={<MapPin className="w-3.5 h-3.5" />} />
            {player.county && (
              <DetailItem label="County" value={player.county} />
            )}
          </div>

          {/* Bio */}
          {player.shortBio && (
            <div className="pt-3 border-t border-border">
              <p className="font-body text-sm text-navy/70 leading-relaxed">
                {player.shortBio}
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
