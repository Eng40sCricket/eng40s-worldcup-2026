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
  englandLogo: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Eng40s_51bd7799.png',
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
// SQUAD DATA — 16 confirmed players from the official press release
// ============================================================
// EDITORIAL NOTE: Names and clubs are confirmed from the 25 March 2026
// press release. Role categories, batting/bowling styles, bios, and
// photos still require editorial verification.
// Update profileStatus to 'confirmed' once full profiles are verified.

export const SQUAD: Player[] = [
  {
    id: 'eng-wc-001',
    fullName: 'Darren Stevens',
    image: undefined,
    roleCategory: 'All-rounder',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    wicketkeeperFlag: false,
    clubEngland: 'St Lawrence & Highland Court CC',
    shortBio: 'Former professional cricketer and squad captain. A vastly experienced all-rounder who brings leadership and match-winning ability to the squad.',
    leadershipTag: 'Captain',
    profileStatus: 'provisional',
    county: 'Kent',
  },
  {
    id: 'eng-wc-002',
    fullName: 'Sean Park',
    image: undefined,
    roleCategory: 'All-rounder',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    wicketkeeperFlag: false,
    clubEngland: 'Bury St. Edmunds CC',
    shortBio: 'Vice-captain and dependable all-rounder. A key figure in the squad\'s leadership group.',
    leadershipTag: 'Vice-Captain',
    profileStatus: 'provisional',
  },
  {
    id: 'eng-wc-003',
    fullName: 'Taqi Abbas',
    image: undefined,
    roleCategory: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    wicketkeeperFlag: false,
    clubEngland: 'Harold Wood CC',
    profileStatus: 'provisional',
  },
  {
    id: 'eng-wc-004',
    fullName: 'George Brooksbank',
    image: undefined,
    roleCategory: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    wicketkeeperFlag: false,
    clubEngland: 'Hurlingham Club',
    profileStatus: 'provisional',
  },
  {
    id: 'eng-wc-005',
    fullName: 'Ryan Canning',
    image: undefined,
    roleCategory: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    wicketkeeperFlag: false,
    clubEngland: 'Ribblesdale Wanderers CC',
    profileStatus: 'provisional',
  },
  {
    id: 'eng-wc-006',
    fullName: 'James Duffy',
    image: undefined,
    roleCategory: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    wicketkeeperFlag: false,
    clubEngland: 'Lindow CC',
    profileStatus: 'provisional',
  },
  {
    id: 'eng-wc-007',
    fullName: 'Ben Frazer',
    image: undefined,
    roleCategory: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    wicketkeeperFlag: false,
    clubEngland: 'Harpenden CC',
    profileStatus: 'provisional',
  },
  {
    id: 'eng-wc-008',
    fullName: 'James Hamblin',
    image: undefined,
    roleCategory: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    wicketkeeperFlag: false,
    clubEngland: 'Cranleigh CC',
    profileStatus: 'provisional',
  },
  {
    id: 'eng-wc-009',
    fullName: 'Sean Heather',
    image: undefined,
    roleCategory: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    wicketkeeperFlag: false,
    clubEngland: 'Middleton-on-sea CC',
    profileStatus: 'provisional',
  },
  {
    id: 'eng-wc-010',
    fullName: 'Jayden Levitt',
    image: undefined,
    roleCategory: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    wicketkeeperFlag: false,
    clubEngland: 'Bromsgrove CC',
    profileStatus: 'provisional',
  },
  {
    id: 'eng-wc-011',
    fullName: 'Steve Naylor',
    image: undefined,
    roleCategory: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    wicketkeeperFlag: false,
    clubEngland: 'Royal Ascot CC',
    profileStatus: 'provisional',
  },
  {
    id: 'eng-wc-012',
    fullName: 'Garry Park',
    image: undefined,
    roleCategory: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    wicketkeeperFlag: false,
    clubEngland: 'Alvaston & Boulton CC',
    profileStatus: 'provisional',
  },
  {
    id: 'eng-wc-013',
    fullName: 'Iresh Saxena',
    image: undefined,
    roleCategory: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    wicketkeeperFlag: false,
    clubEngland: 'Totteridge Millhillians CC',
    profileStatus: 'provisional',
  },
  {
    id: 'eng-wc-014',
    fullName: 'Richard Sims',
    image: undefined,
    roleCategory: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    wicketkeeperFlag: false,
    clubEngland: 'Swardeston CC',
    profileStatus: 'provisional',
  },
  {
    id: 'eng-wc-015',
    fullName: 'Jonny Wightman',
    image: undefined,
    roleCategory: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    wicketkeeperFlag: false,
    clubEngland: 'South Northumberland CC',
    profileStatus: 'provisional',
  },
  {
    id: 'eng-wc-016',
    fullName: 'Jake Wilson',
    image: undefined,
    roleCategory: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    wicketkeeperFlag: false,
    clubEngland: 'Normandy CC',
    profileStatus: 'provisional',
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
    date: '2026-03-25',
    headline: 'England Over 40s Cricket Announce Squad for IMC O40s World Cup 2026',
    category: 'squad',
    summary: 'England Over 40s Cricket has today announced its squad for the IMC O40s World Cup 2026, to be held in Georgetown, Guyana, from 17\u201331 October 2026. The England party will be led on the field by captain Darren Stevens, the former professional cricketer, alongside a strong group of high-quality club players drawn from across the country.',
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
    date: '2026-03-25',
    title: 'England Over 40s Cricket Announce Squad for IMC O40s World Cup 2026 in Guyana',
    subtitle: 'Sixteen players selected for IMC Over 40s ODI World Cup 2026 in Georgetown, Guyana (October 2026)',
    author: 'England Over 40s Cricket',
    blocks: [
      {
        type: 'paragraph',
        text: 'London, United Kingdom \u2013 Wednesday 25 March 2026 \u2013 England Over 40s Cricket has today announced its squad for the IMC O40s World Cup 2026, to be held in Georgetown, Guyana, from 17\u201331 October 2026.',
      },
      {
        type: 'paragraph',
        text: 'The England party will be led on the field by captain Darren Stevens, the former professional cricketer, alongside a strong group of high-quality club players drawn from across the country. The squad has been selected from a wider national programme, reflecting form, commitment and suitability for international tournament cricket.',
      },
      {
        type: 'quote',
        text: 'Today\u2019s announcement is a hugely exciting moment for everyone involved with England Over 40s Cricket. To represent England at a World Cup is a privilege, and we\u2019re proud of the standard of players who have earned selection. With Darren\u2019s leadership and the depth of quality in the group, we\u2019re looking forward to competing strongly in Guyana.',
        attribution: 'Chris Mays, Director and Tour Manager',
      },
      {
        type: 'quote',
        text: 'I\u2019m really excited to be leading the squad into the 2026 summer. We have lots of games through the year to help us build for the World Cup in Guyana. We\u2019ve been building a very exciting squad over the last two years. We lost in the semi-final last time out, so we\u2019ll be doing our best to go another step further.',
        attribution: 'Darren Stevens, Captain',
      },
      {
        type: 'paragraph',
        text: 'The tournament represents a major milestone in England Over 40s Cricket\u2019s international calendar and continues the organisation\u2019s mission to provide competitive, high-quality international cricket for players aged 40+, in an ECB-endorsed environment.',
      },
      {
        type: 'subheading',
        text: 'England Over 40s World Cup Squad',
      },
      {
        type: 'paragraph',
        text: 'Darren Stevens (captain) \u2013 St Lawrence & Highland Court CC\nSean Park (vice-captain) \u2013 Bury St. Edmunds CC\nTaqi Abbas \u2013 Harold Wood CC\nGeorge Brooksbank \u2013 Hurlingham Club\nRyan Canning \u2013 Ribblesdale Wanderers CC\nJames Duffy \u2013 Lindow CC\nBen Frazer \u2013 Harpenden CC\nJames Hamblin \u2013 Cranleigh CC\nSean Heather \u2013 Middleton-on-sea CC\nJayden Levitt \u2013 Bromsgrove CC\nSteve Naylor \u2013 Royal Ascot CC\nGarry Park \u2013 Alvaston & Boulton CC\nIresh Saxena \u2013 Totteridge Millhillians CC\nRichard Sims \u2013 Swardeston CC\nJonny Wightman \u2013 South Northumberland CC\nJake Wilson \u2013 Normandy CC',
      },
      {
        type: 'paragraph',
        text: 'Further announcements, including match schedule updates, player profiles and media content, will be shared via the England Over 40s Cricket website and social channels.',
      },
      {
        type: 'subheading',
        text: 'Tournament Details',
      },
      {
        type: 'note',
        text: 'Event: IMC O40s World Cup 2026',
      },
      {
        type: 'note',
        text: 'Location: Georgetown, Guyana',
      },
      {
        type: 'note',
        text: 'Dates: 17\u201331 October 2026',
      },
      {
        type: 'subheading',
        text: 'Notes to Editors',
      },
      {
        type: 'note',
        text: 'England Over 40s Cricket is a voluntary, non-profit organisation providing competitive international cricket opportunities for players aged 40+, endorsed by the ECB.',
      },
      {
        type: 'note',
        text: 'The squad will travel to Guyana in October 2026 for the IMC O40s World Cup 2026.',
      },
    ],
    contacts: [
      {
        name: 'Chris Mays',
        role: 'Director and Tour Manager, England Over 40s Cricket',
        email: 'englandover40scricket@outlook.com',
      },
    ],
  },
];
