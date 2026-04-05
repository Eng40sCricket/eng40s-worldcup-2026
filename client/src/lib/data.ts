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


// ============================================================
// SQUAD SCHEMA — Reusable player data model
// ============================================================

/**
 * roleCategory: The player's primary role in the squad.
 * Used for filtering and display.
 */
export type RoleCategory =
  | 'Batter'
  | 'Seamer'
  | 'Spinner'
  | 'All-rounder'
  | 'Wicketkeeper';

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
  | 'N/A';

/**
 * profileStatus controls how the card renders:
 * - 'confirmed': Full profile with all details visible
 * - 'provisional': Shown with a "Subject to confirmation" label
 * - 'placeholder': Minimal card with "Profile pending" messaging
 */
export type ProfileStatus = 'confirmed' | 'provisional' | 'placeholder';

/**
 * Player — The canonical squad data schema.
 *
 * FIELD REFERENCE:
 * ─────────────────────────────────────────────────────────
 * id              Unique identifier (e.g. 'eng-wc-001')
 * fullName        Player's full display name
 * image           CDN URL for profile photo (optional)
 * roleCategory    Primary playing role
 * battingStyle    Batting hand
 * bowlingStyle    Bowling type (ignored in UI when wicketkeeperFlag is true)
 * wicketkeeperFlag  If true, UI displays 'Wicketkeeper' or 'Wicketkeeper-batter'
 *                    in place of bowling style
 * clubEngland     The player's English club
 * shortBio        1–2 sentence biography (optional)
 * leadershipTag   e.g. 'Captain', 'Vice-Captain' (optional)
 * profileStatus   Controls rendering mode
 * county          County cricket background (optional)
 * capNumber       England Over 40s cap number (optional)
 * ─────────────────────────────────────────────────────────
 */
export interface Player {
  id: string;
  fullName: string;
  image?: string;
  roleCategory: RoleCategory;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  wicketkeeperFlag: boolean;
  clubEngland: string;
  shortBio?: string;
  leadershipTag?: string;
  profileStatus: ProfileStatus;
  county?: string;
  capNumber?: number;
}

// ---- HELPER: Display bowling/wicketkeeper designation ----
/**
 * Returns the appropriate display string for the bowling/designation field.
 * If wicketkeeperFlag is true:
 *   - roleCategory is 'Wicketkeeper' AND battingStyle exists → 'Wicketkeeper-batter'
 *   - otherwise → 'Wicketkeeper'
 * If wicketkeeperFlag is false:
 *   - returns the bowlingStyle as-is
 */
export function getDisplayBowling(player: Player): string {
  if (player.wicketkeeperFlag) {
    return player.roleCategory === 'Wicketkeeper'
      ? 'Wicketkeeper-batter'
      : 'Wicketkeeper';
  }
  return player.bowlingStyle;
}

/**
 * Returns the label for the bowling/designation row.
 * 'Designation' for wicketkeepers, 'Bowling' for everyone else.
 */
export function getBowlingLabel(player: Player): string {
  return player.wicketkeeperFlag ? 'Designation' : 'Bowling';
}

/**
 * Extracts surname (last word of fullName) for sorting.
 */
export function getPlayerSurname(player: Player): string {
  const parts = player.fullName.trim().split(/\s+/);
  return parts[parts.length - 1];
}

/**
 * Extracts first name(s) for display.
 */
export function getPlayerFirstName(player: Player): string {
  const parts = player.fullName.trim().split(/\s+/);
  return parts.slice(0, -1).join(' ') || parts[0];
}


// ============================================================
// SQUAD DATA — 3 example placeholder players + 13 TBA slots
// ============================================================
// EDITORIAL NOTE: Only clearly-marked placeholder values are used below.
// Real player details require editorial verification before publishing.
// Replace each entry with verified data as it becomes available.

export const SQUAD: Player[] = [
  // ── EXAMPLE 1: Confirmed captain with full profile ──
  {
    id: 'eng-wc-001',
    fullName: '[Captain — Name TBC]',
    image: undefined,                         // PLACEHOLDER: Photo not yet supplied
    roleCategory: 'Batter',
    battingStyle: 'Right-hand bat',           // PLACEHOLDER: Style to be confirmed
    bowlingStyle: 'Right-arm medium',         // PLACEHOLDER: Style to be confirmed
    wicketkeeperFlag: false,
    clubEngland: '[Club TBC]',                // PLACEHOLDER: Club to be confirmed
    shortBio: 'Squad captain. Full biography will be published once the touring party is officially announced.',
    leadershipTag: 'Captain',
    profileStatus: 'provisional',
    county: undefined,                        // PLACEHOLDER: County to be confirmed
    capNumber: undefined,                     // PLACEHOLDER: Cap number to be confirmed
  },

  // ── EXAMPLE 2: Wicketkeeper-batter demonstrating the wicketkeeperFlag logic ──
  {
    id: 'eng-wc-002',
    fullName: '[Wicketkeeper — Name TBC]',
    image: undefined,                         // PLACEHOLDER: Photo not yet supplied
    roleCategory: 'Wicketkeeper',
    battingStyle: 'Right-hand bat',           // PLACEHOLDER: Style to be confirmed
    bowlingStyle: 'N/A',                      // Ignored by UI — wicketkeeperFlag overrides
    wicketkeeperFlag: true,
    clubEngland: '[Club TBC]',                // PLACEHOLDER: Club to be confirmed
    shortBio: 'First-choice wicketkeeper. Profile details pending official squad announcement.',
    leadershipTag: undefined,
    profileStatus: 'provisional',
    county: undefined,
    capNumber: undefined,
  },

  // ── EXAMPLE 3: All-rounder with minimal placeholder data ──
  {
    id: 'eng-wc-003',
    fullName: '[All-rounder — Name TBC]',
    image: undefined,                         // PLACEHOLDER: Photo not yet supplied
    roleCategory: 'All-rounder',
    battingStyle: 'Left-hand bat',            // PLACEHOLDER: Style to be confirmed
    bowlingStyle: 'Left-arm fast-medium',     // PLACEHOLDER: Style to be confirmed
    wicketkeeperFlag: false,
    clubEngland: '[Club TBC]',                // PLACEHOLDER: Club to be confirmed
    shortBio: undefined,                      // Bio not yet available
    leadershipTag: 'Vice-Captain',
    profileStatus: 'placeholder',
    county: undefined,
    capNumber: undefined,
  },

  // ── REMAINING 13 TBA SLOTS ──
  // These represent the remaining squad positions. Replace with real data
  // as players are selected and verified.
  ...Array.from({ length: 13 }, (_, i) => ({
    id: `eng-wc-${String(i + 4).padStart(3, '0')}`,
    fullName: `[Player ${i + 4} — TBA]`,
    image: undefined,
    roleCategory: (
      i < 3 ? 'Batter' :
      i < 6 ? 'Seamer' :
      i < 8 ? 'Spinner' :
      i < 11 ? 'All-rounder' :
      'Wicketkeeper'
    ) as RoleCategory,
    battingStyle: (i % 3 === 0 ? 'Left-hand bat' : 'Right-hand bat') as BattingStyle,
    bowlingStyle: (
      i < 3 ? 'N/A' :
      i < 6 ? 'Right-arm fast-medium' :
      i < 8 ? 'Right-arm off-break' :
      i < 11 ? 'Right-arm medium' :
      'N/A'
    ) as BowlingStyle,
    wicketkeeperFlag: i >= 11,
    clubEngland: '[Club TBC]',
    shortBio: undefined,
    leadershipTag: undefined,
    profileStatus: 'placeholder' as ProfileStatus,
    county: undefined,
    capNumber: undefined,
  })),
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


// ============================================================
// FIXTURES SCHEMA — Enhanced for list + calendar views
// ============================================================

export type MatchStage = 'group' | 'semi-final' | 'final' | 'third-place' | 'warm-up';
export type MatchStatus = 'upcoming' | 'in-progress' | 'completed' | 'abandoned' | 'no-result' | 'tbc';

/**
 * Fixture — A single match in the tournament schedule.
 *
 * FIELD REFERENCE:
 * ─────────────────────────────────────────────────────────
 * id              Unique match identifier
 * date            ISO date string (YYYY-MM-DD) or 'TBC'
 * time            Local time string (e.g. '09:30') or undefined
 * homeTeam        Team name (use 'England' for England matches)
 * awayTeam        Team name
 * venue           Ground name
 * venueLink       Google Maps URL for the venue (optional)
 * group           Group label (e.g. 'Group A') or undefined for knockouts
 * stage           Match stage for filtering
 * status          Current match status
 * result          Result summary string (optional)
 * matchCentreUrl  Link to match centre / Play-Cricket (optional)
 * isEngland       Whether England is playing in this match
 * notes           Additional notes (optional)
 * ─────────────────────────────────────────────────────────
 */
export interface Fixture {
  id: string;
  date: string;
  time?: string;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  venueLink?: string;
  group?: string;
  stage: MatchStage;
  status: MatchStatus;
  result?: string;
  matchCentreUrl?: string;
  isEngland: boolean;
  notes?: string;
}

// Fixture filter options
export const FIXTURE_FILTERS = {
  team: [
    { label: 'All Matches', value: 'all' },
    { label: 'England Only', value: 'england' },
  ],
  stage: [
    { label: 'All Stages', value: 'all' },
    { label: 'Group Stage', value: 'group' },
    { label: 'Knockout', value: 'knockout' },
  ],
  status: [
    { label: 'All', value: 'all' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Completed', value: 'completed' },
  ],
} as const;

// ---- FIXTURES DATA ----
// Draw not yet announced — empty array triggers placeholder state.
// When fixtures are confirmed, populate this array with real data.
// Example fixture structure (for reference):
//
// {
//   id: 'match-01',
//   date: '2026-10-17',
//   time: '09:30',
//   homeTeam: 'England',
//   awayTeam: 'Australia',
//   venue: 'Bourda Cricket Ground',
//   venueLink: 'https://maps.google.com/...',
//   group: 'Group A',
//   stage: 'group',
//   status: 'upcoming',
//   isEngland: true,
// },
export const FIXTURES: Fixture[] = [];

// Known tournament venues (for venue filter when fixtures are populated)
export const TOURNAMENT_VENUES = [
  'Bourda Cricket Ground',
  'Providence Stadium',
  'Everest Cricket Club',
  'Demerara Cricket Club',
];


// ============================================================
// GROUPS & STANDINGS SCHEMA — Dynamic with auto-ranking
// ============================================================

/**
 * GroupTeam — A single team row in a group standings table.
 * Points and NRR can be entered manually or calculated from results.
 */
export interface GroupTeam {
  team: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  nrr: string;            // Net Run Rate as string (e.g. '+0.452', '-1.230')
  isEngland: boolean;
  status?: string;         // e.g. 'Qualified', 'Eliminated', ''
}

/**
 * Group — A tournament group containing multiple teams.
 */
export interface Group {
  id: string;
  name: string;
  teams: GroupTeam[];
  isEnglandGroup: boolean;
}

// NOTE: rankGroupTeams has been moved to standings-engine.ts → rankTeams()
// Import from '@/lib/standings-engine' instead.

// NOTE: getEnglandImplication has been moved to standings-engine.ts → getEnglandQualificationMessage()
// Import from '@/lib/standings-engine' instead.

// ---- GROUPS DATA ----
// Draw not yet announced — empty array triggers placeholder state.
// When the draw is confirmed, populate with real group data.
// The placeholder below shows the expected structure:
//
// {
//   id: 'group-a',
//   name: 'Group A',
//   isEnglandGroup: true,
//   teams: [
//     { team: 'England', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: true },
//     { team: 'TBA', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false },
//     ...
//   ],
// },
export const GROUPS: Group[] = [];


// ============================================================
// NEWS BULLETINS
// ============================================================

/**
 * BulletinCategory — Content categories for the team update feed.
 * Used for filtering and visual tagging.
 */
export type BulletinCategory =
  | 'squad'
  | 'fixtures'
  | 'travel'
  | 'training'
  | 'matchday'
  | 'results'
  | 'media'
  | 'announcements';

/**
 * Bulletin — A single news item in the team update feed.
 *
 * Fields:
 *   id            — Unique identifier
 *   date          — ISO date string (YYYY-MM-DD)
 *   headline      — Short, punchy title
 *   category      — One of the defined BulletinCategory values
 *   summary       — 1–3 sentence summary of the update
 *   imageUrl      — Optional hero image for the bulletin card
 *   link          — Optional URL to the full article or external source
 *   isPinned      — If true, bulletin stays at the top of the feed
 *   isFeatured    — If true, bulletin appears in the featured story area
 *   isOfficial    — If true, shows an "Official England Update" badge
 *   author        — Optional byline
 */
export interface Bulletin {
  id: string;
  date: string;
  headline: string;
  category: BulletinCategory;
  summary: string;
  imageUrl?: string;
  link?: string;
  isPinned?: boolean;
  isFeatured?: boolean;
  isOfficial?: boolean;
  author?: string;
}

/**
 * Category display configuration — label, colour, and icon mapping.
 * Used by the UI to render consistent category tags.
 */
export const BULLETIN_CATEGORIES: Record<BulletinCategory, { label: string; color: string }> = {
  squad:         { label: 'Squad',         color: 'bg-sky/15 text-sky' },
  fixtures:      { label: 'Fixtures',      color: 'bg-emerald-500/15 text-emerald-600' },
  travel:        { label: 'Travel',        color: 'bg-amber-500/15 text-amber-600' },
  training:      { label: 'Training',      color: 'bg-violet-500/15 text-violet-600' },
  matchday:      { label: 'Matchday',      color: 'bg-red-500/15 text-red-600' },
  results:       { label: 'Results',       color: 'bg-blue-500/15 text-blue-600' },
  media:         { label: 'Media',         color: 'bg-pink-500/15 text-pink-600' },
  announcements: { label: 'Announcements', color: 'bg-gold/15 text-amber-700' },
};

// ---- BULLETINS DATA ----
// Newest first. Pinned items float to the top regardless of date.
// The first isFeatured item is displayed in the featured story area.

export const BULLETINS: Bulletin[] = [
  {
    id: 'bul-1',
    date: '2026-04-05',
    headline: 'England Over 40s Squad Confirmed for World Cup 2026',
    category: 'squad',
    summary: 'England Over 40s Cricket is pleased to confirm that a squad of 16 players has been selected to represent England at the IMC Over 40s ODI World Cup in Georgetown, Guyana, from 17 to 31 October 2026. Further tournament details, including the group draw and full fixture list, are still awaited from the IMC.',
    isPinned: true,
    isFeatured: true,
    isOfficial: true,
    author: 'England Over 40s Cricket',
  },
  {
    id: 'bul-2',
    date: '2026-04-05',
    headline: 'Official World Cup Hub Now Live',
    category: 'announcements',
    summary: 'Welcome to the official England Over 40s ODI World Cup 2026 hub. This page will be your one-stop destination for squad news, fixtures, group standings, and live updates from Georgetown, Guyana. Bookmark this page and check back regularly for the latest information.',
    isOfficial: true,
    author: 'England Over 40s Cricket',
  },
  {
    id: 'bul-3',
    date: '2026-03-15',
    headline: 'World Cup Dates Confirmed: 17–31 October 2026',
    category: 'announcements',
    summary: 'The IMC has confirmed that the Over 40s ODI World Cup will take place in Georgetown, Guyana from 17 to 31 October 2026. Up to 16 nations are expected to compete in the 45-over format tournament.',
    isOfficial: true,
  },
  {
    id: 'bul-4',
    date: '2026-03-04',
    headline: 'Guyana Confirmed as Host Nation',
    category: 'announcements',
    summary: 'The Cricket West Indies Masters Association (CWIMA) has secured hosting rights for the 2026 Over 40s World Cup in the Caribbean, with Georgetown, Guyana confirmed as the primary venue. Matches are expected to be played across several grounds in the Georgetown area.',
  },
  {
    id: 'bul-5',
    date: '2026-02-20',
    headline: 'Performance Squad Training Programme Underway',
    category: 'training',
    summary: 'The England Over 40s performance squad of 50 players has begun its 2026 pre-season training programme. The coaching team is working with all squad members ahead of the domestic season, from which the final 16-player World Cup squad will be selected.',
  },
  {
    id: 'bul-6',
    date: '2026-02-10',
    headline: 'Travel and Logistics Planning Begins',
    category: 'travel',
    summary: 'The England Over 40s management team has commenced planning for travel and accommodation arrangements for the squad\'s trip to Guyana. Further details will be shared with selected players and travelling supporters in due course.',
  },
];


// ============================================================
// PRESS RELEASES
// ============================================================

/**
 * PressReleaseBlock — A single content block within a press release.
 *
 * type:
 *   'paragraph'  — Standard body paragraph
 *   'quote'      — Attributed quotation (blockquote style)
 *   'subheading' — Section subheading within the release
 *   'note'       — Editor's note or footnote (smaller, muted)
 */
export interface PressReleaseBlock {
  type: 'paragraph' | 'quote' | 'subheading' | 'note';
  text: string;
  attribution?: string;  // Used with 'quote' type
}

/**
 * PressReleaseContact — Media contact details appended to the release.
 */
export interface PressReleaseContact {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

/**
 * PressRelease — A formal press release from England Over 40s Cricket.
 *
 * Fields:
 *   id          — Unique identifier
 *   date        — ISO date string (YYYY-MM-DD)
 *   title       — Main headline
 *   subtitle    — Optional subheading / strapline
 *   author      — Issuing organisation or person
 *   embargo     — Optional embargo notice (e.g. 'Embargoed until 10:00 BST, 5 April 2026')
 *   blocks      — Ordered array of content blocks (paragraphs, quotes, subheadings, notes)
 *   contacts    — Media contact details
 *   isPlaceholder — If true, the release shell is shown but body content is pending
 */
export interface PressRelease {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  author?: string;
  embargo?: string;
  blocks: PressReleaseBlock[];
  contacts?: PressReleaseContact[];
  isPlaceholder?: boolean;
}

export const PRESS_RELEASES: PressRelease[] = [
  {
    id: 'pr-1',
    date: '2026-04-05',
    title: 'England Over 40s Announce World Cup Campaign',
    subtitle: 'Sixteen players selected for IMC Over 40s ODI World Cup 2026 in Guyana',
    author: 'England Over 40s Cricket',
    blocks: [
      {
        type: 'paragraph',
        text: 'England Over 40s Cricket is delighted to announce preparations for the IMC Over 40s ODI World Cup 2026, to be held in Georgetown, Guyana from 17 to 31 October 2026.',
      },
      {
        type: 'paragraph',
        text: 'A squad of 16 players will represent England in the 45-over format tournament, competing against up to 16 nations from across the globe. The squad will be drawn from our performance group of 50 players, all of whom have been preparing throughout the 2026 domestic season.',
      },
      {
        type: 'quote',
        text: 'We are immensely proud to be representing England at the Over 40s World Cup. The squad has been selected from a talented group of cricketers, and we look forward to competing on the world stage in Guyana.',
        attribution: 'Director of Cricket, England Over 40s',
      },
      {
        type: 'paragraph',
        text: 'England Over 40s Cricket is a not-for-profit company endorsed by the ECB to run high-standard recreational cricket for players over the age of 40, both in England and on overseas tours.',
      },
      {
        type: 'paragraph',
        text: 'Further details regarding the final squad, fixture schedule, and group draw will be announced in due course. We encourage all supporters, families, and media to follow this page for the latest updates.',
      },
      {
        type: 'subheading',
        text: 'Notes to Editors',
      },
      {
        type: 'note',
        text: 'England Over 40s Cricket is endorsed by the England and Wales Cricket Board (ECB) and operates as a not-for-profit company. The organisation manages a performance squad of approximately 50 players, from which touring squads are selected for international competition.',
      },
      {
        type: 'note',
        text: 'The IMC Over 40s ODI World Cup is organised by International Masters Cricket (IMC) and hosted by the Cricket West Indies Masters Association (CWIMA). The tournament features 45-over matches played across venues in the Georgetown area.',
      },
    ],
    contacts: [
      {
        name: 'England Over 40s Cricket Press Office',
        role: 'Media Enquiries',
        email: 'press@englandover40s.co.uk',
      },
    ],
  },
];
