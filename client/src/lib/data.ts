// ============================================================
// DESIGN: "Stadium Broadcast" — Sports Broadcast Dashboard
// England Over 40s ODI World Cup 2026 — Guyana
// All data in one file for easy updates by non-technical editors
// ============================================================

// ---- ASSET URLs ----
export const ASSETS = {
  heroBanner: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/hero-banner-H3FibL23yGG2SMFpVtFEtc.webp',
  squadBg: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/squad-section-bg-cJfGYD9487B6bkNyduVV3N.webp',
  cricketAction: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/england-cricket-action-LCVTpzjaUmfkpnrjzSDtYw.webp',
  guyanaStadium: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/guyana-stadium-f9TnX5GJjUKewEtHM47nM2.webp',
  cricketBall: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/cricket-ball-texture-PKPxPpgnLXUsqBvQkBMHrk.webp',
} as const;

// ---- TOURNAMENT INFO ----
export const TOURNAMENT = {
  name: 'IMC Over 40s ODI World Cup 2026',
  shortName: 'World Cup 2026',
  location: 'Georgetown, Guyana',
  country: 'West Indies',
  dates: '17 October – 31 October 2026',
  format: '45 Overs per Side',
  teams: '14–16 Nations',
  organiser: 'International Masters Cricket (IMC)',
  hostAssociation: 'Cricket West Indies Masters Association (CWIMA)',
  englandTeam: 'England Over 40s',
};

export const QUICK_FACTS = [
  { label: 'Tournament', value: 'IMC ODI World Cup' },
  { label: 'Host Nation', value: 'Guyana, West Indies' },
  { label: 'Dates', value: '17–31 Oct 2026' },
  { label: 'Format', value: '45 Overs per Side' },
  { label: 'Teams', value: '14–16 Nations' },
  { label: 'England Squad', value: '16 Players' },
];

// ---- SECTION NAVIGATION ----
export const NAV_SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'facts', label: 'Tournament' },
  { id: 'squad', label: 'Squad' },
  { id: 'fixtures', label: 'Fixtures' },
  { id: 'groups', label: 'Groups' },
  { id: 'news', label: 'News' },
  { id: 'press', label: 'Press' },
] as const;

// ---- PLAYER ROLES ----
export type PlayerRole = 'Batter' | 'Seamer' | 'Spinner' | 'All-rounder' | 'Wicketkeeper';
export type BattingStyle = 'Right-hand bat' | 'Left-hand bat';
export type BowlingStyle =
  | 'Right-arm fast'
  | 'Right-arm fast-medium'
  | 'Right-arm medium'
  | 'Right-arm medium-fast'
  | 'Left-arm fast'
  | 'Left-arm fast-medium'
  | 'Left-arm medium'
  | 'Left-arm medium-fast'
  | 'Right-arm off-break'
  | 'Right-arm leg-break'
  | 'Left-arm orthodox'
  | 'Left-arm wrist spin'
  | 'Slow left-arm orthodox'
  | 'Wicketkeeper'
  | 'Wicketkeeper-batter'
  | 'N/A';

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  photo?: string;               // CDN URL — placeholder silhouette if missing
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  club: string;                  // English club
  county?: string;               // County background
  isWicketkeeper: boolean;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  capNumber?: number;
  bio?: string;
  leadershipTag?: string;        // e.g. 'Captain', 'Vice-Captain', 'Senior Player'
}

// ---- SQUAD DATA ----
// Placeholder squad — replace with real data when announced
export const SQUAD: Player[] = [
  {
    id: 'player-01',
    firstName: 'Player',
    lastName: 'One',
    role: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    club: 'Club TBC',
    isWicketkeeper: false,
    isCaptain: true,
    leadershipTag: 'Captain',
    bio: 'Squad details will be confirmed closer to the tournament. Check back for full player profiles.',
  },
  {
    id: 'player-02',
    firstName: 'Player',
    lastName: 'Two',
    role: 'Batter',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'N/A',
    club: 'Club TBC',
    isWicketkeeper: false,
  },
  {
    id: 'player-03',
    firstName: 'Player',
    lastName: 'Three',
    role: 'Seamer',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast-medium',
    club: 'Club TBC',
    isWicketkeeper: false,
  },
  {
    id: 'player-04',
    firstName: 'Player',
    lastName: 'Four',
    role: 'Seamer',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium-fast',
    club: 'Club TBC',
    isWicketkeeper: false,
  },
  {
    id: 'player-05',
    firstName: 'Player',
    lastName: 'Five',
    role: 'Spinner',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm off-break',
    club: 'Club TBC',
    isWicketkeeper: false,
  },
  {
    id: 'player-06',
    firstName: 'Player',
    lastName: 'Six',
    role: 'Spinner',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Slow left-arm orthodox',
    club: 'Club TBC',
    isWicketkeeper: false,
  },
  {
    id: 'player-07',
    firstName: 'Player',
    lastName: 'Seven',
    role: 'All-rounder',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    club: 'Club TBC',
    isWicketkeeper: false,
    isViceCaptain: true,
    leadershipTag: 'Vice-Captain',
  },
  {
    id: 'player-08',
    firstName: 'Player',
    lastName: 'Eight',
    role: 'All-rounder',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Left-arm fast-medium',
    club: 'Club TBC',
    isWicketkeeper: false,
  },
  {
    id: 'player-09',
    firstName: 'Player',
    lastName: 'Nine',
    role: 'Wicketkeeper',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Wicketkeeper-batter',
    club: 'Club TBC',
    isWicketkeeper: true,
  },
  {
    id: 'player-10',
    firstName: 'Player',
    lastName: 'Ten',
    role: 'Wicketkeeper',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Wicketkeeper',
    club: 'Club TBC',
    isWicketkeeper: true,
  },
  {
    id: 'player-11',
    firstName: 'Player',
    lastName: 'Eleven',
    role: 'Seamer',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    club: 'Club TBC',
    isWicketkeeper: false,
  },
  {
    id: 'player-12',
    firstName: 'Player',
    lastName: 'Twelve',
    role: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm off-break',
    club: 'Club TBC',
    isWicketkeeper: false,
  },
  {
    id: 'player-13',
    firstName: 'Player',
    lastName: 'Thirteen',
    role: 'Seamer',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Left-arm medium',
    club: 'Club TBC',
    isWicketkeeper: false,
  },
  {
    id: 'player-14',
    firstName: 'Player',
    lastName: 'Fourteen',
    role: 'All-rounder',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm leg-break',
    club: 'Club TBC',
    isWicketkeeper: false,
  },
  {
    id: 'player-15',
    firstName: 'Player',
    lastName: 'Fifteen',
    role: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    club: 'Club TBC',
    isWicketkeeper: false,
  },
  {
    id: 'player-16',
    firstName: 'Player',
    lastName: 'Sixteen',
    role: 'Spinner',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm leg-break',
    club: 'Club TBC',
    isWicketkeeper: false,
  },
];

// ---- FILTER OPTIONS ----
export const ROLE_FILTERS: { label: string; value: string }[] = [
  { label: 'All Players', value: 'all' },
  { label: 'Batters', value: 'Batter' },
  { label: 'Seamers', value: 'Seamer' },
  { label: 'Spinners', value: 'Spinner' },
  { label: 'All-rounders', value: 'All-rounder' },
  { label: 'Wicketkeepers', value: 'Wicketkeeper' },
];

export const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Surname', value: 'surname' },
  { label: 'Club', value: 'club' },
  { label: 'Role', value: 'role' },
];

// ---- FIXTURES ----
export interface Fixture {
  id: string;
  date: string;           // ISO date or 'TBC'
  time?: string;          // e.g. '09:30 local'
  homeTeam: string;
  awayTeam: string;
  venue?: string;
  venueLink?: string;     // Google Maps URL
  matchFormat: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'tbc';
  result?: string;
  playCricketUrl?: string;
  notes?: string;
}

// Fixtures not yet released — empty state
export const FIXTURES: Fixture[] = [];

// ---- GROUPS / STANDINGS ----
export interface GroupTeam {
  team: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  nrr: string;
  points: number;
  isEngland?: boolean;
}

export interface Group {
  name: string;
  teams: GroupTeam[];
}

// Groups not yet drawn — empty state
export const GROUPS: Group[] = [];

// ---- NEWS ----
export interface NewsItem {
  id: string;
  date: string;
  headline: string;
  summary: string;
  imageUrl?: string;
  link?: string;
}

export const NEWS: NewsItem[] = [
  {
    id: 'news-1',
    date: '2026-04-05',
    headline: 'England Over 40s World Cup Page Launched',
    summary: 'Welcome to the official England Over 40s ODI World Cup 2026 hub. This page will be your one-stop destination for squad news, fixtures, group standings, and live updates from Georgetown, Guyana.',
  },
  {
    id: 'news-2',
    date: '2026-03-15',
    headline: 'World Cup Dates Confirmed: 17–31 October 2026',
    summary: 'The IMC has confirmed that the Over 40s ODI World Cup will take place in Georgetown, Guyana from 17 to 31 October 2026. Up to 16 nations are expected to compete in the 45-over format.',
  },
  {
    id: 'news-3',
    date: '2026-03-04',
    headline: 'Guyana Confirmed as Host Nation',
    summary: 'The Cricket West Indies Masters Association (CWIMA) has secured hosting rights for the 2026 Over 40s World Cup in the Caribbean, with Georgetown, Guyana confirmed as the primary venue.',
  },
];

// ---- PRESS RELEASE ----
export interface PressRelease {
  id: string;
  date: string;
  title: string;
  body: string;
  author?: string;
}

export const PRESS_RELEASES: PressRelease[] = [
  {
    id: 'pr-1',
    date: '2026-04-05',
    title: 'England Over 40s Announce World Cup Campaign',
    author: 'England Over 40s Cricket',
    body: `England Over 40s Cricket is delighted to announce preparations for the IMC Over 40s ODI World Cup 2026, to be held in Georgetown, Guyana from 17 to 31 October 2026.

A squad of 16 players will represent England in the 45-over format tournament, competing against up to 16 nations from across the globe. The squad will be drawn from our performance group of 50 players, all of whom have been preparing throughout the 2026 domestic season.

England Over 40s Cricket is a not-for-profit company endorsed by the ECB to run high-standard recreational cricket for players over the age of 40, both in England and on overseas tours.

Further details regarding the final squad, fixture schedule, and group draw will be announced in due course. We encourage all supporters, families, and media to follow this page for the latest updates.

For media enquiries, please contact the England Over 40s Cricket press office.`,
  },
];
