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
  imcLogo: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/TranspLOGO_ea6d3c51.png',
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
  { id: 'schedule', label: 'Schedule' },
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
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/STEVENS_25983eaa.png',
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
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Untitleddesign-Abbas_ff732eeb.png',
      roleCategory: 'Spinner',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm leg-break',
      wicketkeeperFlag: false,
      clubEngland: 'Harold Wood CC',
      shortBio: '',
      profileStatus: 'confirmed',
      squadNumber: 12,
    },
    {
      id: 'eng-wc-003',
      fullName: 'George Brooksbank',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Untitleddesign-Brooksbank_56f439d1.png',
      roleCategory: 'Seamer',
      battingStyle: 'Left-hand bat',
      bowlingStyle: 'Left-arm fast-medium',
      wicketkeeperFlag: false,
      clubEngland: 'Hurlingham Club',
      shortBio: '',
      profileStatus: 'confirmed',
      squadNumber: 17,
    },
    {
      id: 'eng-wc-004',
      fullName: 'Ryan Canning',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Untitleddesign-Canning_71a744fc.png',
      roleCategory: 'Wicketkeeper',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'N/A',
      wicketkeeperFlag: true,
      clubEngland: 'Ribblesdale Wanderers CC',
      shortBio: '',
      profileStatus: 'confirmed',
      squadNumber: 22,
    },
    {
      id: 'eng-wc-005',
      fullName: 'James Duffy',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Untitleddesign-Duffy_75f24b6e.png',
      roleCategory: 'Batter',
      battingStyle: 'Left-hand bat',
      bowlingStyle: 'N/A',
      wicketkeeperFlag: false,
      clubEngland: 'Lindow CC',
      shortBio: '',
      profileStatus: 'confirmed',
      squadNumber: 15,
    },
    {
      id: 'eng-wc-006',
      fullName: 'Ben Frazer',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Untitleddesign-Frazer_94ed3bf4.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm off-break',
      wicketkeeperFlag: false,
      clubEngland: 'Harpenden CC',
      shortBio: '',
      profileStatus: 'confirmed',
      squadNumber: 23,
    },
    {
      id: 'eng-wc-007',
      fullName: 'James Hamblin',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Untitleddesign-Hamblin_254b7ca8.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      wicketkeeperFlag: false,
      clubEngland: 'Cranleigh CC',
      shortBio: '',
      profileStatus: 'confirmed',
      squadNumber: 25,
    },
    {
      id: 'eng-wc-008',
      fullName: 'Sean Heather',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Untitleddesign-Heather_328dea83.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      wicketkeeperFlag: false,
      clubEngland: 'Middleton-on-sea CC',
      shortBio: '',
      profileStatus: 'confirmed',
      squadNumber: 27,
    },
    {
      id: 'eng-wc-009',
      fullName: 'Jayden Levitt',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Untitleddesign-Levitt_5faa5b26.png',
      roleCategory: 'Batter',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'N/A',
      wicketkeeperFlag: false,
      clubEngland: 'Bromsgrove CC',
      shortBio: '',
      profileStatus: 'confirmed',
      squadNumber: 55,
    },
    {
      id: 'eng-wc-010',
      fullName: 'Steven Naylor',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Untitleddesign-Naylor_5130f6bc.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm off-break',
      wicketkeeperFlag: false,
      clubEngland: 'Royal Ascot CC',
      shortBio: '',
      profileStatus: 'confirmed',
      squadNumber: 77,
    },
    {
      id: 'eng-wc-011',
      fullName: 'Garry Park',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Untitleddesign-ParkG_cca95954.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      wicketkeeperFlag: false,
      clubEngland: 'Alvaston & Boulton CC',
      shortBio: '',
      profileStatus: 'confirmed',
      squadNumber: 9,
    },
    {
      id: 'eng-wc-012',
      fullName: 'Sean Park',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Untitleddesign-ParkS_785fe8e2.png',
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
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Untitleddesign-Saxena_e0a62a73.png',
      roleCategory: 'Spinner',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Slow left-arm orthodox',
      wicketkeeperFlag: false,
      clubEngland: 'Totteridge Millhillians CC',
      shortBio: '',
      profileStatus: 'confirmed',
      squadNumber: 14,
    },
    {
      id: 'eng-wc-014',
      fullName: 'Richard Sims',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Untitleddesign-Sims_ab3c9aa8.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm off-break',
      wicketkeeperFlag: false,
      clubEngland: 'Swardeston CC',
      shortBio: '',
      profileStatus: 'confirmed',
      squadNumber: 90,
    },
    {
      id: 'eng-wc-015',
      fullName: 'Jonny Wightman',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Untitleddesign-Wightman_6adb6533.png',
      roleCategory: 'Seamer',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm fast-medium',
      wicketkeeperFlag: false,
      clubEngland: 'South Northumberland CC',
      shortBio: '',
      profileStatus: 'confirmed',
      squadNumber: 11,
    },
    {
      id: 'eng-wc-016',
      fullName: 'Jake Wilson',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Untitleddesign-Wilson_ac8ef8d9.png',
      roleCategory: 'Seamer',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Left-arm fast-medium',
      wicketkeeperFlag: false,
      clubEngland: 'Normandy CC',
      shortBio: '',
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

  /** Known tournament venues (from IMC Newsletter #2) */
  venues: [
    'Bourda Cricket Ground',
    'Palmyra Cricket Ground',
    'Everest Cricket Club',
    'Enmore Recreation Ground',
    'Albion Cricket Ground',
    'Demerara Cricket Club (DCC)',
    'Blairmont Cricket Ground',
    'MMZ Centre Ground',
    'Police Sports Club Ground',
    'Malteenoes Sports Club',
    'Lusignan Sports Club',
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
      id: 'bul-7',
      date: '2026-04-06',
      headline: 'Full Tournament Schedule Confirmed by IMC',
      category: 'fixtures',
      summary: 'The IMC has released the proposed tournament schedule for the Over 40s World Cup 2026 in Guyana. The itinerary includes 7 group-stage rounds, crossover games, semi-finals, and the Grand Finale on 31 October, plus rest days featuring tours to Kaieteur Falls and a Windies Legends Nostalgia Event. Practice sessions begin 15 October with the Opening Ceremony on 17 October.',
      isPinned: true,
      isFeatured: true,
      isOfficial: true,
      author: 'International Masters Cricket',
    },
    {
      id: 'bul-8',
      date: '2026-04-06',
      headline: '11 Venues Confirmed Across Guyana',
      category: 'announcements',
      summary: 'The IMC Newsletter #2 has confirmed 11 cricket grounds across Guyana that will host World Cup matches. Venues include the historic Bourda Cricket Ground in Georgetown, the new Palmyra Stadium in Berbice, Everest Cricket Club, Albion Cricket Ground, Demerara Cricket Club, and several other grounds across the Demerara and Berbice regions.',
      isOfficial: true,
      author: 'International Masters Cricket',
    },
    {
      id: 'bul-1',
      date: '2026-03-25',
      headline: 'England Over 40s Cricket Announce Squad for IMC O40s World Cup 2026',
      category: 'squad',
      summary: 'England Over 40s Cricket has today announced its squad for the IMC O40s World Cup 2026, to be held in Georgetown, Guyana, from 17\u201331 October 2026. The England party will be led on the field by captain Darren Stevens, the former professional cricketer, alongside a strong group of high-quality club players drawn from across the country.',
      isPinned: false,
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
      headline: 'World Cup Dates Confirmed: 17\u201331 October 2026',
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


// ============================================================
// 7. SCHEDULE DATA — scheduleData
// ============================================================

/**
 * ScheduleEvent — A single day/event in the tournament itinerary.
 *
 * eventType controls styling:
 * - 'match'     → Cricket ball icon, standard row
 * - 'ceremony'  → Star icon, highlighted row
 * - 'rest'      → Palm tree icon, muted row
 * - 'practice'  → Bat icon, muted row
 * - 'meeting'   → Users icon, muted row
 * - 'travel'    → Plane icon, muted row
 */
export type ScheduleEventType = 'match' | 'ceremony' | 'rest' | 'practice' | 'meeting' | 'travel';

export interface ScheduleEvent {
  id: string;
  date: string;
  dayOfWeek: string;
  time?: string;
  event: string;
  eventType: ScheduleEventType;
  description?: string;
  isHighlight?: boolean;
}

/**
 * scheduleData — The single source of truth for the tournament itinerary.
 *
 * Source: IMC Newsletter #2, February 2026
 * "Proposed Tournament Schedule — 2026 Over 40s World Cup – Guyana, West Indies"
 *
 * EDITING GUIDE:
 * • To add an event: append an object to the `events` array
 * • Events with the same date appear grouped together
 * • Set isHighlight: true for key events (opening/closing ceremonies, finals)
 * • Multiple events on the same day are supported (e.g. Oct 17 has 3 events)
 */
export const scheduleData = {
  /** Section heading */
  title: 'Tournament Schedule',
  subtitle: 'Proposed itinerary from IMC Newsletter #2',
  source: 'IMC Newsletter #2, February 2026',

  events: [
    {
      id: 'sch-01',
      date: '2026-10-15',
      dayOfWeek: 'Thursday',
      event: 'Practice Matches / Net Sessions',
      eventType: 'practice',
      description: 'Teams arrive and begin practice sessions',
    },
    {
      id: 'sch-02',
      date: '2026-10-16',
      dayOfWeek: 'Friday',
      event: 'Practice Matches / Net Sessions',
      eventType: 'practice',
    },
    {
      id: 'sch-03',
      date: '2026-10-17',
      dayOfWeek: 'Saturday',
      time: '10:00 am',
      event: 'Captains & Managers Meeting',
      eventType: 'meeting',
    },
    {
      id: 'sch-04',
      date: '2026-10-17',
      dayOfWeek: 'Saturday',
      time: '11:30 am',
      event: 'Press Conference / Media Briefing',
      eventType: 'meeting',
    },
    {
      id: 'sch-05',
      date: '2026-10-17',
      dayOfWeek: 'Saturday',
      time: '7:00 pm',
      event: 'Opening Ceremony',
      eventType: 'ceremony',
      isHighlight: true,
    },
    {
      id: 'sch-06',
      date: '2026-10-18',
      dayOfWeek: 'Sunday',
      time: '9:30 am',
      event: 'Round 1 Matches',
      eventType: 'match',
      isHighlight: true,
      description: 'Group stage begins',
    },
    {
      id: 'sch-07',
      date: '2026-10-19',
      dayOfWeek: 'Monday',
      time: '9:30 am',
      event: 'Round 2 Matches',
      eventType: 'match',
    },
    {
      id: 'sch-08',
      date: '2026-10-20',
      dayOfWeek: 'Tuesday',
      event: "Chairman's Lunch / Rest Day / Tours",
      eventType: 'rest',
    },
    {
      id: 'sch-09',
      date: '2026-10-21',
      dayOfWeek: 'Wednesday',
      time: '9:30 am',
      event: 'Round 3 Matches',
      eventType: 'match',
    },
    {
      id: 'sch-10',
      date: '2026-10-22',
      dayOfWeek: 'Thursday',
      time: '9:30 am',
      event: 'Round 4 Matches',
      eventType: 'match',
    },
    {
      id: 'sch-11',
      date: '2026-10-23',
      dayOfWeek: 'Friday',
      event: 'Rest Day / Teams Dominoes, King & Queen Tournament',
      eventType: 'rest',
    },
    {
      id: 'sch-12',
      date: '2026-10-24',
      dayOfWeek: 'Saturday',
      time: '9:30 am',
      event: 'Round 5 Matches',
      eventType: 'match',
    },
    {
      id: 'sch-13',
      date: '2026-10-25',
      dayOfWeek: 'Sunday',
      time: '9:30 am',
      event: 'Round 6 Matches',
      eventType: 'match',
    },
    {
      id: 'sch-14',
      date: '2026-10-26',
      dayOfWeek: 'Monday',
      event: 'Rest Day / Tours — Kaieteur & Orinduik Falls / Resort',
      eventType: 'rest',
      description: 'Optional excursion to Kaieteur Falls and Orinduik Falls',
    },
    {
      id: 'sch-15',
      date: '2026-10-27',
      dayOfWeek: 'Tuesday',
      time: '9:30 am',
      event: 'Round 7 Matches',
      eventType: 'match',
      description: 'Final group stage round',
    },
    {
      id: 'sch-16',
      date: '2026-10-28',
      dayOfWeek: 'Wednesday',
      time: '9:30 am',
      event: 'Crossover Games / Semi-Finals',
      eventType: 'match',
      isHighlight: true,
    },
    {
      id: 'sch-17',
      date: '2026-10-29',
      dayOfWeek: 'Thursday',
      event: 'Rest Day / Windies Legends Nostalgia Event',
      eventType: 'rest',
      description: 'Special event celebrating West Indies cricket heritage',
    },
    {
      id: 'sch-18',
      date: '2026-10-30',
      dayOfWeek: 'Friday',
      time: '9:30 am',
      event: 'Crossover Finals',
      eventType: 'match',
      isHighlight: true,
    },
    {
      id: 'sch-19',
      date: '2026-10-31',
      dayOfWeek: 'Saturday',
      time: '9:30 am',
      event: 'Grand Finale',
      eventType: 'match',
      isHighlight: true,
      description: 'World Cup Final',
    },
    {
      id: 'sch-20',
      date: '2026-10-31',
      dayOfWeek: 'Saturday',
      time: '8:00 pm',
      event: 'Closing Ceremony',
      eventType: 'ceremony',
      isHighlight: true,
    },
    {
      id: 'sch-21',
      date: '2026-11-01',
      dayOfWeek: 'Sunday',
      event: 'Teams Depart',
      eventType: 'travel',
    },
  ] as ScheduleEvent[],

  /** Venue information from IMC Newsletter #2 */
  venueInfo: [
    {
      name: 'Bourda Cricket Ground',
      location: 'Georgetown',
      description: 'One of the most historic grounds in world cricket. The first Test ground in mainland South America and the only international stadium built below sea level, uniquely protected by a surrounding moat. Home to the Georgetown Cricket Club, Bourda has hosted legends such as Sir Clive Lloyd and Brian Lara.',
    },
    {
      name: 'Palmyra Cricket Ground',
      location: 'Region Six (Berbice)',
      description: 'A new, state-of-the-art stadium currently under development, designed to international standards. The multipurpose venue will be capable of hosting top-level cricket including CPL matches, as well as major cultural and entertainment events.',
    },
    {
      name: 'Everest Cricket Club',
      location: 'Georgetown',
      description: 'A historic and active cricket ground known for hosting regional and international practice matches, including during the 2007 World Cup and CPL. Legendary player Shivnarine Chanderpaul is a member.',
    },
    {
      name: 'Enmore Recreation Ground',
      location: 'Enmore, Demerara',
      description: 'Located in Enmore, the ground first hosted top-level domestic cricket during the 1992\u201393 Geddes Grant Shield. Between 1993 and 2009, the venue staged 17 List A matches and 4 first-class matches.',
    },
    {
      name: 'Albion Cricket Ground',
      location: 'Albion, Berbice',
      description: 'Known as the Albion Sports Complex, this historic venue is one of Guyana\u2019s key cricket grounds, famous for hosting early West Indies One-day Internationals. Currently undergoing major upgrades.',
    },
    {
      name: 'Demerara Cricket Club (DCC)',
      location: 'Queenstown, Georgetown',
      description: 'A historic ground and hub for Guyanese cricket where legends like Clive Lloyd and Lance Gibbs honed their skills. While international matches moved to Providence Stadium, DCC remains a vital part of Guyana\u2019s cricket heritage.',
    },
    {
      name: 'Blairmont Cricket Ground',
      location: 'Blairmont, Berbice',
      description: 'A historic cricket venue known for hosting first-class and List A matches, famous for a record low List A score (18 all out by WI U19s). Opened in 1959, it began hosting first-class cricket in 1989.',
    },
    {
      name: 'MMZ Centre Ground',
      location: 'Region Three',
      description: 'The newly upgraded Meten-Meer-Zorg Community Centre Ground, featuring modern floodlights, a new building, and a fresh pitch for training and competitive cricket.',
    },
    {
      name: 'Police Sports Club Ground',
      location: 'Georgetown',
      description: 'A key venue for sporting events and community outreach, hosting various local matches and competitions. The dedicated home for the force\u2019s cricket and other sports activities.',
    },
    {
      name: 'Malteenoes Sports Club',
      location: 'Thomas Lands, Georgetown',
      description: 'A historic and vibrant hub for cricket, known for producing national players, hosting intense local matches, and fostering community spirit with a laid-back atmosphere.',
    },
    {
      name: 'Lusignan Sports Club',
      location: 'East Coast Demerara',
      description: 'A key community venue on the East Coast Demerara, primarily hosting local and developmental cricket matches, including youth series and inter-village competitions.',
    },
  ],

  /** Empty-state messaging */
  emptyState: {
    heading: 'Schedule to Be Announced',
    message: 'The tournament itinerary will appear here once the IMC releases the official schedule.',
  },
};
