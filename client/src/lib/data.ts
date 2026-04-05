// ============================================================
// DATA LAYER — Content separated from presentation
// ============================================================
// All editable content lives in five named data objects:
//   squadData, fixtureData, groupData, newsData, pressReleaseData
//
// The UI maps over these objects and renders automatically.
// Editors only need to modify the data constants below;
// no component code changes are required for content updates.
//
// PENDING CONTENT STATES supported throughout:
//   • Empty arrays          → placeholder / empty-state UI
//   • undefined / null      → graceful fallback text
//   • 'TBC' / 'TBA' values  → styled as pending badges
//   • isPlaceholder flags   → skeleton / shell rendering
// ============================================================


// ============================================================
// 1. SHARED CONSTANTS — Assets, tournament info, navigation
// ============================================================

export const ASSETS = {
  heroBanner: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/hero-banner-H3FibL23yGG2SMFpVtFEtc.webp',
  squadBg: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/squad-section-bg-cJfGYD9487B6bkNyduVV3N.webp',
  cricketAction: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/england-cricket-action-LCVTpzjaUmfkpnrjzSDtYw.webp',
  guyanaStadium: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/guyana-stadium-f9TnX5GJjUKewEtHM47nM2.webp',
  cricketBall: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/cricket-ball-texture-PKPxPpgnLXUsqBvQkBMHrk.webp',
  englandLogo: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Eng40s_51bd7799.png',
} as const;

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
// 2. SQUAD DATA — squadData
// ============================================================

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
 * image           CDN URL for profile photo (undefined → "PHOTO TBC")
 * roleCategory    Primary playing role
 * battingStyle    Batting hand
 * bowlingStyle    Bowling type (ignored in UI when wicketkeeperFlag is true)
 * wicketkeeperFlag  If true, UI displays 'Wicketkeeper' or 'Wicketkeeper-batter'
 *                    in place of bowling style
 * clubEngland     The player's English club
 * shortBio        1–2 sentence biography (undefined → hidden)
 * leadershipTag   e.g. 'Captain', 'Vice-Captain' (undefined → hidden)
 * profileStatus   Controls rendering mode
 * county          County cricket background (undefined → hidden)
 * capNumber       England Over 40s cap number (undefined → hidden)
 * squadNumber     Tournament squad number (undefined → hidden)
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
  squadNumber?: number;
}

// ---- HELPERS ----

export function getDisplayBowling(player: Player): string {
  if (player.wicketkeeperFlag) {
    return player.roleCategory === 'Wicketkeeper'
      ? 'Wicketkeeper-batter'
      : 'Wicketkeeper';
  }
  return player.bowlingStyle;
}

export function getBowlingLabel(player: Player): string {
  return player.wicketkeeperFlag ? 'Designation' : 'Bowling';
}

export function getPlayerSurname(player: Player): string {
  const parts = player.fullName.trim().split(/\s+/);
  return parts[parts.length - 1];
}

export function getPlayerFirstName(player: Player): string {
  const parts = player.fullName.trim().split(/\s+/);
  return parts.slice(0, -1).join(' ') || parts[0];
}

/**
 * squadData — The single source of truth for squad content.
 *
 * EDITING GUIDE:
 * • To add a player: append an object to the `players` array
 * • To add a photo: set the `image` field to a CDN URL
 * • To mark a player confirmed: set profileStatus to 'confirmed'
 * • Missing optional fields (image, shortBio, county, capNumber)
 *   are handled gracefully — the UI hides them or shows fallbacks
 */
export const squadData = {
  /** Section heading */
  title: 'World Cup Squad',
  /** Subtitle shown below the heading */
  subtitle: '16 players selected to represent England in Georgetown, Guyana',

  /** Filter pill options */
  roleFilters: [
    { label: 'All Players', value: 'all' },
    { label: 'Batters', value: 'Batter' },
    { label: 'Seamers', value: 'Seamer' },
    { label: 'Spinners', value: 'Spinner' },
    { label: 'All-rounders', value: 'All-rounder' },
    { label: 'Wicketkeepers', value: 'Wicketkeeper' },
  ] as { label: string; value: string }[],

  /** Sort options */
  sortOptions: [
    { label: 'Squad No.', value: 'squadNumber' },
    { label: 'Surname', value: 'surname' },
    { label: 'Club', value: 'club' },
    { label: 'Role', value: 'role' },
  ] as { label: string; value: string }[],

  /**
   * The player roster.
   * EDITORIAL NOTE: Names and clubs confirmed from the 25 March 2026
   * press release. Role categories, batting/bowling styles, bios, and
   * photos still require editorial verification.
   * Update profileStatus to 'confirmed' once full profiles are verified.
   */
  players: [
    {
      id: 'eng-wc-001',
      fullName: 'Darren Stevens',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/stevens-captain_63c37db0.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      wicketkeeperFlag: false,
      clubEngland: 'St Lawrence & Highland Court CC',
      shortBio: 'Former professional cricketer and squad captain. A vastly experienced all-rounder who brings leadership and match-winning ability to the squad.',
      leadershipTag: 'Captain',
      profileStatus: 'confirmed',
      county: 'Kent',
      squadNumber: 3,
    },
    {
      id: 'eng-wc-002',
      fullName: 'Taqi Abbas',
      image: undefined,
      roleCategory: 'Spinner',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm leg-break',
      wicketkeeperFlag: false,
      clubEngland: 'Harold Wood CC',
      profileStatus: 'confirmed',
      squadNumber: 12,
    },
    {
      id: 'eng-wc-003',
      fullName: 'George Brooksbank',
      image: undefined,
      roleCategory: 'Seamer',
      battingStyle: 'Left-hand bat',
      bowlingStyle: 'Left-arm fast-medium',
      wicketkeeperFlag: false,
      clubEngland: 'Hurlingham Club',
      profileStatus: 'confirmed',
      squadNumber: 17,
    },
    {
      id: 'eng-wc-004',
      fullName: 'Ryan Canning',
      image: undefined,
      roleCategory: 'Wicketkeeper',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'N/A',
      wicketkeeperFlag: true,
      clubEngland: 'Ribblesdale Wanderers CC',
      profileStatus: 'confirmed',
      squadNumber: 22,
    },
    {
      id: 'eng-wc-005',
      fullName: 'James Duffy',
      image: undefined,
      roleCategory: 'Batter',
      battingStyle: 'Left-hand bat',
      bowlingStyle: 'N/A',
      wicketkeeperFlag: false,
      clubEngland: 'Lindow CC',
      profileStatus: 'confirmed',
      squadNumber: 15,
    },
    {
      id: 'eng-wc-006',
      fullName: 'Ben Frazer',
      image: undefined,
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm off-break',
      wicketkeeperFlag: false,
      clubEngland: 'Harpenden CC',
      profileStatus: 'confirmed',
      squadNumber: 23,
    },
    {
      id: 'eng-wc-007',
      fullName: 'James Hamblin',
      image: undefined,
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      wicketkeeperFlag: false,
      clubEngland: 'Cranleigh CC',
      profileStatus: 'confirmed',
      squadNumber: 25,
    },
    {
      id: 'eng-wc-008',
      fullName: 'Sean Heather',
      image: undefined,
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      wicketkeeperFlag: false,
      clubEngland: 'Middleton-on-sea CC',
      profileStatus: 'confirmed',
      squadNumber: 27,
    },
    {
      id: 'eng-wc-009',
      fullName: 'Jayden Levitt',
      image: undefined,
      roleCategory: 'Batter',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'N/A',
      wicketkeeperFlag: false,
      clubEngland: 'Bromsgrove CC',
      profileStatus: 'confirmed',
      squadNumber: 55,
    },
    {
      id: 'eng-wc-010',
      fullName: 'Steven Naylor',
      image: undefined,
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm off-break',
      wicketkeeperFlag: false,
      clubEngland: 'Royal Ascot CC',
      profileStatus: 'confirmed',
      squadNumber: 77,
    },
    {
      id: 'eng-wc-011',
      fullName: 'Garry Park',
      image: undefined,
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      wicketkeeperFlag: false,
      clubEngland: 'Alvaston & Boulton CC',
      profileStatus: 'confirmed',
      squadNumber: 9,
    },
    {
      id: 'eng-wc-012',
      fullName: 'Sean Park',
      image: undefined,
      roleCategory: 'Wicketkeeper',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      wicketkeeperFlag: true,
      clubEngland: 'Bury St. Edmunds CC',
      shortBio: 'Vice-captain and wicketkeeper who also contributes with right-arm seam bowling. A key figure in the squad\'s leadership group.',
      leadershipTag: 'Vice-Captain',
      profileStatus: 'confirmed',
      squadNumber: 5,
    },
    {
      id: 'eng-wc-013',
      fullName: 'Iresh Saxena',
      image: undefined,
      roleCategory: 'Spinner',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Slow left-arm orthodox',
      wicketkeeperFlag: false,
      clubEngland: 'Totteridge Millhillians CC',
      profileStatus: 'confirmed',
      squadNumber: 14,
    },
    {
      id: 'eng-wc-014',
      fullName: 'Richard Sims',
      image: undefined,
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm off-break',
      wicketkeeperFlag: false,
      clubEngland: 'Swardeston CC',
      profileStatus: 'confirmed',
      squadNumber: 90,
    },
    {
      id: 'eng-wc-015',
      fullName: 'Jonny Wightman',
      image: undefined,
      roleCategory: 'Seamer',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm fast-medium',
      wicketkeeperFlag: false,
      clubEngland: 'South Northumberland CC',
      profileStatus: 'confirmed',
      squadNumber: 11,
    },
    {
      id: 'eng-wc-016',
      fullName: 'Jake Wilson',
      image: undefined,
      roleCategory: 'Seamer',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Left-arm fast-medium',
      wicketkeeperFlag: false,
      clubEngland: 'Normandy CC',
      profileStatus: 'confirmed',
      squadNumber: 43,
    },
  ] as Player[],

  /**
   * Empty-state messaging when players array is empty.
   * The UI shows this instead of an empty grid.
   */
  emptyState: {
    heading: 'Squad Announcement Pending',
    message: 'The England Over 40s World Cup squad will be announced here once selections are confirmed. Check back for updates.',
  },
};

// Legacy aliases — components can import these directly
// while we migrate to squadData.players / squadData.roleFilters etc.
export const SQUAD = squadData.players;
export const ROLE_FILTERS = squadData.roleFilters;
export const SORT_OPTIONS = squadData.sortOptions;


// ============================================================
// 3. FIXTURE DATA — fixtureData
// ============================================================

export type MatchStage = 'group' | 'semi-final' | 'final' | 'third-place' | 'warm-up';
export type MatchStatus = 'upcoming' | 'in-progress' | 'completed' | 'abandoned' | 'no-result' | 'tbc';

/**
 * Fixture — A single match in the tournament schedule.
 *
 * PENDING CONTENT STATES:
 * • date: 'TBC'          → renders as "Date TBC" badge
 * • time: undefined       → time row hidden
 * • venue: 'TBC'          → renders as "Venue TBC"
 * • awayTeam: 'TBA'       → renders as "Opponent TBA"
 * • result: undefined      → no result shown (upcoming match)
 * • matchCentreUrl: undef  → no "Match Centre" link
 * • venueLink: undefined   → no map icon
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

/**
 * fixtureData — The single source of truth for fixture content.
 *
 * EDITING GUIDE:
 * • To add a fixture: append an object to the `matches` array
 * • Set isEngland: true for any match involving England
 * • For TBA opponents: use awayTeam: 'TBA'
 * • For unknown venues: use venue: 'TBC'
 * • For unknown dates: use date: 'TBC'
 * • Empty `matches` array → professional placeholder state
 *
 * EXAMPLE with pending values (uncomment to test):
 * {
 *   id: 'match-01',
 *   date: '2026-10-17',
 *   time: '09:30',
 *   homeTeam: 'England',
 *   awayTeam: 'TBA',           // ← Opponent not yet drawn
 *   venue: 'TBC',              // ← Venue not yet assigned
 *   group: 'Group A',
 *   stage: 'group',
 *   status: 'tbc',
 *   isEngland: true,
 * },
 * {
 *   id: 'match-02',
 *   date: 'TBC',               // ← Date not yet confirmed
 *   homeTeam: 'Australia',
 *   awayTeam: 'South Africa',
 *   venue: 'Bourda Cricket Ground',
 *   venueLink: undefined,      // ← No map link yet
 *   stage: 'group',
 *   status: 'tbc',
 *   result: undefined,         // ← No result yet
 *   matchCentreUrl: undefined, // ← No match centre link yet
 *   isEngland: false,
 * },
 */
export const fixtureData = {
  /** Section heading */
  title: 'Fixtures',

  /** Filter options */
  filters: {
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
  } as const,

  /** Known tournament venues (shown in placeholder state) */
  venues: [
    'Bourda Cricket Ground',
    'Providence Stadium',
    'Everest Cricket Club',
    'Demerara Cricket Club',
  ],

  /**
   * The match list.
   * Empty array → placeholder state with skeleton cards.
   * Populate when the draw is announced.
   */
  matches: [] as Fixture[],

  /** Empty-state messaging */
  emptyState: {
    heading: 'Fixture Details Pending',
    message: 'England fixtures will appear here once the official draw is released. The match schedule for the IMC Over 40s ODI World Cup 2026 has not yet been published by the tournament organisers.',
    venuesLabel: 'Expected Venues',
  },
};

// Legacy aliases
export const FIXTURES = fixtureData.matches;
export const FIXTURE_FILTERS = fixtureData.filters;
export const TOURNAMENT_VENUES = fixtureData.venues;


// ============================================================
// 4. GROUP DATA — groupData
// ============================================================

/**
 * GroupTeam — A single team row in a group standings table.
 *
 * PENDING CONTENT STATES:
 * • team: 'TBA'       → renders as "TBA" in muted text
 * • nrr: '+0.000'     → default NRR for teams with no matches
 * • status: undefined  → no qualification badge shown
 */
export interface GroupTeam {
  team: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  nrr: string;
  isEngland: boolean;
  status?: string;
}

export interface Group {
  id: string;
  name: string;
  teams: GroupTeam[];
  isEnglandGroup: boolean;
}

/**
 * groupData — The single source of truth for group/standings content.
 *
 * EDITING GUIDE:
 * • Empty `groups` array → pre-draw placeholder state
 * • Groups with all zeroes → draw-announced state (no matches played)
 * • Groups with results → live tournament state (auto-ranked)
 * • All matches completed → completed tournament state
 *
 * EXAMPLE with TBA teams (uncomment to test draw-announced state):
 * groups: [
 *   {
 *     id: 'group-a',
 *     name: 'Group A',
 *     isEnglandGroup: true,
 *     teams: [
 *       { team: 'England', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: true },
 *       { team: 'TBA', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false },
 *       { team: 'TBA', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false },
 *     ],
 *   },
 * ],
 */
export const groupData = {
  /** Section heading */
  title: 'Groups & Standings',

  /** Qualification rule (displayed in England Focus mode) */
  qualificationRule: 'The top 4 teams from each group will advance to the knockout stage.',

  /** Points awarded per result (used by standings engine) */
  pointsConfig: {
    win: 2,
    tie: 1,
    noResult: 1,
    loss: 0,
  },

  /**
   * The group compositions.
   * Empty array → pre-draw placeholder state.
   * Populate when the draw is announced.
   */
  groups: [] as Group[],

  /** Empty-state messaging */
  emptyState: {
    heading: 'Draw to Be Announced',
    message: 'Group compositions will be published here once the official draw has taken place. Standings will populate automatically when the tournament schedule is confirmed and match results are entered.',
    badge: 'Draw Pending',
    englandBadge: 'England Group TBC',
  },
};

// Legacy alias
export const GROUPS = groupData.groups;


// ============================================================
// 5. NEWS DATA — newsData
// ============================================================

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
 * PENDING CONTENT STATES:
 * • imageUrl: undefined    → no image shown on card
 * • link: undefined        → no "Read more" link
 * • author: undefined      → byline hidden
 * • isPinned: undefined    → normal sort order
 * • isFeatured: undefined  → not shown in featured area
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
 * newsData — The single source of truth for news/bulletin content.
 *
 * EDITING GUIDE:
 * • To add a bulletin: prepend an object to the `bulletins` array
 * • Set isPinned: true to keep it at the top of the feed
 * • Set isFeatured: true for the featured story area (first match wins)
 * • Set isOfficial: true for the "Official England Update" badge
 * • Empty `bulletins` array → "No updates yet" placeholder
 */
export const newsData = {
  /** Section heading */
  title: 'News & Bulletins',

  /** Category display configuration */
  categories: {
    squad:         { label: 'Squad',         color: 'bg-sky/15 text-sky' },
    fixtures:      { label: 'Fixtures',      color: 'bg-emerald-500/15 text-emerald-600' },
    travel:        { label: 'Travel',        color: 'bg-amber-500/15 text-amber-600' },
    training:      { label: 'Training',      color: 'bg-violet-500/15 text-violet-600' },
    matchday:      { label: 'Matchday',      color: 'bg-red-500/15 text-red-600' },
    results:       { label: 'Results',       color: 'bg-blue-500/15 text-blue-600' },
    media:         { label: 'Media',         color: 'bg-pink-500/15 text-pink-600' },
    announcements: { label: 'Announcements', color: 'bg-gold/15 text-amber-700' },
  } as Record<BulletinCategory, { label: string; color: string }>,

  /** The bulletin feed (newest first, pinned items float to top) */
  bulletins: [
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
  ] as Bulletin[],

  /** Empty-state messaging */
  emptyState: {
    heading: 'No Updates Yet',
    message: 'Team news and bulletins will appear here as the tournament approaches. Check back for the latest updates from England Over 40s Cricket.',
  },
};

// Legacy aliases
export const BULLETINS = newsData.bulletins;
export const BULLETIN_CATEGORIES = newsData.categories;


// ============================================================
// 6. PRESS RELEASE DATA — pressReleaseData
// ============================================================

/**
 * PressReleaseBlock — A single content block within a press release.
 *
 * PENDING CONTENT STATES:
 * • isPlaceholder on the parent PressRelease → skeleton body lines
 * • Empty blocks array → "Official press release text to be inserted here"
 */
export interface PressReleaseBlock {
  type: 'paragraph' | 'quote' | 'subheading' | 'note';
  text: string;
  attribution?: string;
}

export interface PressReleaseContact {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

/**
 * PressRelease — A formal press release from England Over 40s Cricket.
 *
 * PENDING CONTENT STATES:
 * • isPlaceholder: true   → shell with title/date but skeleton body
 * • blocks: []            → "Official press release text to be inserted here"
 * • contacts: undefined   → contacts section hidden
 * • embargo: undefined    → no embargo badge
 * • subtitle: undefined   → subtitle hidden
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

/**
 * pressReleaseData — The single source of truth for press release content.
 *
 * EDITING GUIDE:
 * • To add a new release: append an object to the `releases` array
 * • For a placeholder shell (title/date only, body pending):
 *   set isPlaceholder: true and blocks: []
 * • For a release with body text pending insertion:
 *   set blocks: [] (renders "Official press release text to be inserted here")
 * • Empty `releases` array → "No press releases published yet" placeholder
 *
 * EXAMPLE placeholder release:
 * {
 *   id: 'pr-draft',
 *   date: '2026-09-01',
 *   title: 'England Over 40s World Cup Match Preview',
 *   subtitle: undefined,                    // ← Not yet written
 *   author: 'England Over 40s Cricket',
 *   blocks: [],                             // ← Body text pending
 *   contacts: undefined,                    // ← Contacts pending
 *   isPlaceholder: true,                    // ← Renders as shell
 * },
 */
export const pressReleaseData = {
  /** Section heading */
  title: 'Official Press Releases',

  /** The press releases (newest first) */
  releases: [
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
        { type: 'note', text: 'Event: IMC O40s World Cup 2026' },
        { type: 'note', text: 'Location: Georgetown, Guyana' },
        { type: 'note', text: 'Dates: 17\u201331 October 2026' },
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
  ] as PressRelease[],

  /** Empty-state messaging */
  emptyState: {
    heading: 'No Press Releases Published',
    message: 'Official England Over 40s Cricket press releases will appear here when published. Media enquiries can be directed to the contacts listed on the England Over 40s website.',
  },
};

// Legacy alias
export const PRESS_RELEASES = pressReleaseData.releases;
