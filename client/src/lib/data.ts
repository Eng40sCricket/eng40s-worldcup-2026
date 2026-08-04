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
  englandLogo: '/manus-storage/Photoroom_20260324_072545_dcfa238a.png',
  englandLogoColor: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Eng40s_51bd7799.png',
  imcLogo: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/TRANSPwhiteback_716a617b.png',
  imcTextLogo: '/manus-storage/IMCLogo_6458ea74.jpg',
  // Sponsor logos
  anwaLogo: '/manus-storage/ANWALOGO(BLACKBG)_8fc7d198.png',
  athloLogoDark: '/manus-storage/ATHLOLOGOBLACK_a049905d.png',
  athloLogoLight: '/manus-storage/f498ab3b-bf2e-49c6-bdfc-b8dc8b158d78_dc17ed6a.jpg',
  sportaLogo: '/manus-storage/SPORTA_TOURS_GOING_FURTHER-04_3f504ebc.jpg',
  gpLogo: '/manus-storage/G&PLOGO_64cac674.jpg',
  delonghiLogo: '/manus-storage/Image04-05-2023at15.10_7290fd9b.png',
  nvPlayLogo: '/manus-storage/NVPlaylogo_aedff46b.jpg',
  bkAviationLogo: '/manus-storage/IMG_0818_1fdeb560.PNG',
} as const;

export const TOURNAMENT = {
  name: 'IMC Over 40s ODI World Cup 2026',
  shortName: 'World Cup 2026',
  location: 'Georgetown, Guyana',
  country: 'West Indies',
  dates: '17 October – 31 October 2026',
  format: '45 Overs per Side',
  teams: '16 Nations',
  organiser: 'International Masters Cricket (IMC)',
  hostAssociation: 'Cricket West Indies Masters Association (CWIMA)',
  englandTeam: 'England Over 40s',
};

export const QUICK_FACTS = [
  { label: 'Tournament', value: 'IMC ODI World Cup' },
  { label: 'Host Nation', value: 'Guyana, West Indies' },
  { label: 'Dates', value: '17–31 Oct 2026' },
  { label: 'Format', value: '45 Overs per Side' },
  { label: 'Teams', value: '16 Nations' },
  { label: 'England Squad', value: '16 Players' },
];

export const NAV_SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'facts', label: 'Tournament' },
  { id: 'squad', label: 'Squad' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'groups', label: 'Groups' },
  { id: 'fixtures', label: 'Fixtures' },
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
  /** If true, this person is coaching staff — card hides batting/bowling stats */
  isCoachingStaff?: boolean;
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
      image: '/manus-storage/STEVENS-capt-v2_4bdc0d84.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      wicketkeeperFlag: false,
      clubEngland: 'St Lawrence & Highland Court',
      shortBio: 'A legendary English all-rounder who enjoyed an illustrious county career spanning decades with Leicestershire and Kent. Renowned for his exceptional longevity and consistent performances, he amassed over 16,000 first-class runs and nearly 600 wickets. A Wisden Cricketer of the Year, he also featured in overseas leagues in Zimbabwe (Mid-West Rhinos), New Zealand (Otago), and won Bangladesh Premier League titles with Dhaka Gladiators and Comilla Victorians.',
      leadershipTag: 'Captain',
      profileStatus: 'confirmed',
      county: 'Kent',
      squadNumber: 3,
    },
    {
      id: 'eng-wc-002',
      fullName: 'Taqi Abbas',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Abbas_faf36198.png',
      roleCategory: 'Spinner',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm leg-break',
      wicketkeeperFlag: false,
      clubEngland: 'Harold Wood',
      shortBio: 'A prolific English all-rounder and a mainstay of Harold Wood Cricket Club in the Essex League. A consistent performer with both bat and ball, he has earned multiple Player of the Year awards and surpassed 10,000 career runs. His exceptional domestic form led to his selection for the England Over-40s squad for the 2026 World Cup in Guyana. Club stats: 703 wkts, BB 9-90 with 14 5wkt hauls.',
      profileStatus: 'confirmed',
      squadNumber: 12,
    },
    {
      id: 'eng-wc-003',
      fullName: 'George Brooksbank',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Brooksbank_172557a6.png',
      roleCategory: 'Seamer',
      battingStyle: 'Left-hand bat',
      bowlingStyle: 'Left-arm fast-medium',
      wicketkeeperFlag: false,
      clubEngland: 'Hurlingham Club',
      shortBio: 'Experienced club cricketer who has represented Hertfordshire at Minor Counties level and MCC on multiple tours. A former captain of Cheltenham CC in the West of England Premier League, Brooksbank is a useful left-arm seam bowler with a reputation for match-winning contributions throughout a long and distinguished career. This is his second Over-40s World Cup.',
      profileStatus: 'confirmed',
      squadNumber: 17,
    },
    {
      id: 'eng-wc-004',
      fullName: 'Ryan Canning',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Canning_b7fc5d02.png',
      roleCategory: 'Wicketkeeper',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'N/A',
      wicketkeeperFlag: true,
      clubEngland: 'Ribblesdale Wanderers',
      shortBio: 'A seasoned wicketkeeper-batsman from South Africa, known for his extensive first-class career with Western Province, Cape Cobras, and Boland. He has also played club cricket in the UK and represented England Over-40s, showcasing his enduring talent and international experience. Over 300 first-class dismissals. 105 first-class matches, 5,084 runs (avg 37.38, 9x100s, 29x50s). 318 catches and 27 stumpings. 68 List A matches, 1,521 runs (avg 32.36).',
      profileStatus: 'confirmed',
      squadNumber: 22,
    },
    {
      id: 'eng-wc-005',
      fullName: 'James Duffy',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Duffy_f4285b1e.png',
      roleCategory: 'Batter',
      battingStyle: 'Left-hand bat',
      bowlingStyle: 'N/A',
      wicketkeeperFlag: false,
      clubEngland: 'Lindow',
      shortBio: 'Hard-hitting batsman with extensive club cricket experience at the highest recreational levels. Duffy has represented his county in representative fixtures and brings considerable experience and competitive determination to the England Over-40s squad. Stats: over 20,000 runs (avg 44.17), and 13 centuries.',
      profileStatus: 'confirmed',
      squadNumber: 15,
    },
    {
      id: 'eng-wc-006',
      fullName: 'Ben Frazer',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Frazer_a5d5d3d0.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm off-break',
      wicketkeeperFlag: false,
      clubEngland: 'Harpenden',
      shortBio: 'A seasoned English cricketer, renowned for his right-arm off-break bowling and right-handed batting. He represented Hertfordshire in Minor Counties cricket for nearly two decades and played for Middlesex Second XI. A key member of the England Over 40s squad, he showcased his skills at the 2024 IMC Over 40s World Cup in South Africa.',
      profileStatus: 'confirmed',
      squadNumber: 23,
    },
    {
      id: 'eng-wc-007',
      fullName: 'James Hamblin',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Hamblin_0c270a3c.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      wicketkeeperFlag: false,
      clubEngland: 'Cranleigh',
      shortBio: 'An English all-rounder who represented Hampshire from 2001 to 2004. He toured South Africa with the British Universities cricket team in 1999 and made a significant impact in both first-class and one-day cricket, including a Man of the Match performance in Hampshire\'s inaugural Twenty20 match. First-class: 440 runs (avg 27.50) and 14 wickets (avg 51.64). List A: 656 runs (avg 16.82) and 28 wickets (avg 32.39).',
      profileStatus: 'confirmed',
      squadNumber: 25,
    },
    {
      id: 'eng-wc-008',
      fullName: 'Sean Heather',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Heather_68cf752a.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      wicketkeeperFlag: false,
      clubEngland: 'Middleton-on-sea',
      shortBio: 'A distinguished English cricketer, known for his prolific batting in the Sussex Cricket League, including a record-breaking 1082 runs in 2005. A stalwart for Middleton CC, he has also proudly represented England Over 40s, showcasing his enduring talent and commitment to the sport. Scored a century (100*) for England Over 40s against Wales in 2025.',
      profileStatus: 'confirmed',
      squadNumber: 27,
    },
    {
      id: 'eng-wc-009',
      fullName: 'Jayden Levitt',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Levitt_edb2fd1a.png',
      roleCategory: 'Batter',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'N/A',
      wicketkeeperFlag: false,
      clubEngland: 'Bromsgrove',
      shortBio: 'Right-hander Jayden Levitt, a former Wiltshire and Unicorns List A batter, now captains Bromsgrove CC, where he has amassed over 19,000 runs at 41, including 46 centuries and a 74-average 2025 season, marking him as a prolific, match-winning club star.',
      profileStatus: 'confirmed',
      squadNumber: 55,
    },
    {
      id: 'eng-wc-010',
      fullName: 'Steven Naylor',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Naylor_a8178569.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm off-break',
      wicketkeeperFlag: false,
      clubEngland: 'Royal Ascot',
      shortBio: 'An English cricketer with a notable career in minor counties cricket. A right-handed batsman and right-arm offspin bowler, he has represented Huntingdonshire, Buckinghamshire, and Berkshire, accumulating significant experience in Minor Counties Championship and List A matches. Featured in List A matches for Buckinghamshire and Berkshire, including against Ireland.',
      profileStatus: 'confirmed',
      squadNumber: 77,
    },
    {
      id: 'eng-wc-011',
      fullName: 'Garry Park',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/ParkG_19b4e30b.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      wicketkeeperFlag: false,
      clubEngland: 'Alvaston & Boulton',
      shortBio: 'South African-born all-rounder Garry Park built his professional career in England with CUCCE, Durham and Derbyshire, scoring over 1,000 County Championship runs in 2009 and earning a reputation as one of Derbyshire\'s finest fielders, before later starring in Premier League club cricket for Alvaston & Boulton.',
      profileStatus: 'confirmed',
      squadNumber: 9,
    },
    {
      id: 'eng-wc-012',
      fullName: 'Sean Park',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/ParkS_1fe913fe.png',
      roleCategory: 'Wicketkeeper',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
      wicketkeeperFlag: true,
      clubEngland: 'Bury St. Edmunds',
      shortBio: 'He has represented Unicorns and England Over-40s, participating in the 2024 Over-40s World Cup in South Africa. Formerly a Cambridgeshire all-rounder, he played for Cambridge Granta CC in the East Anglian Premier League. Currently Head of Cricket at The Perse School, Cambridge. Played 8 List A matches, scoring 62 runs. Primary role as a batting all-rounder who also keeps.',
      leadershipTag: 'Vice-Captain',
      profileStatus: 'confirmed',
      squadNumber: 5,
    },
    {
      id: 'eng-wc-013',
      fullName: 'Iresh Saxena',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Saxena_11b2c1f3.png',
      roleCategory: 'Spinner',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Slow left-arm orthodox',
      wicketkeeperFlag: false,
      clubEngland: 'Totteridge Millhillians',
      shortBio: 'A seasoned slow left-arm orthodox bowler from India, known for his domestic career with Bengal and a stint with Kolkata Knight Riders in the IPL. He has also made a significant impact in English club cricket, notably with Totteridge Millhillians CC. Played first-class cricket for Bengal (2007/08–2014/15). Represented East Zone in Indian domestic competitions. Multiple 6-wicket hauls for Totteridge Millhillians CC.',
      profileStatus: 'confirmed',
      squadNumber: 14,
    },
    {
      id: 'eng-wc-014',
      fullName: 'Richard Sims',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Sims_efcd740b.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm off-break',
      wicketkeeperFlag: false,
      clubEngland: 'Swardeston',
      shortBio: 'Raised in Zimbabwe, he represented his country in ODIs. He presently plays cricket for the English team Swardeston. Currently serves as the Head of Sixth Form at Norwich School. Zimbabwe ODI debut (2002), Manicaland player (2001–04), record 314-run opening partnership v Matabeleland, scored 204 (2002), won 3 national titles with Swardeston. 3 ODIs, First Class: 21 matches, 1325 runs and 30 wickets. List A: 30 matches.',
      profileStatus: 'confirmed',
      squadNumber: 90,
    },
    {
      id: 'eng-wc-015',
      fullName: 'Jonny Wightman',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Wightman_4f00aa52.png',
      roleCategory: 'Seamer',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm fast-medium',
      wicketkeeperFlag: false,
      clubEngland: 'South Northumberland',
      shortBio: 'A formidable right-arm pace bowler for England Over 40s and a legend at South Northumberland CC. With over 500 NEPL wickets and a best of 8-31, he\'s been instrumental in 16 trophy wins. Leading wicket-taker for England Over 40s (25 wickets in 13 games, BB 5-24). NEPL Player of the Year in 2014. NEPL: 501 wickets (avg 18.64, 22x5-wicket hauls, BB 8-31). England Over 40s: 25 wickets in 13 games (avg 16.36, BB 5-24).',
      profileStatus: 'confirmed',
      squadNumber: 11,
    },
    {
      id: 'eng-wc-016',
      fullName: 'Jake Wilson',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Wilson_f2e292ab.png',
      roleCategory: 'Seamer',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Left-arm fast-medium',
      wicketkeeperFlag: false,
      clubEngland: 'Normandy',
      shortBio: 'Jake Wilson is a Level 3 ECB coach with extensive playing and coaching experience in both Australia and the UK. He boasts a distinguished career, including over 20 years and 300 wickets in New South Wales Premier Cricket first grade, alongside significant contributions to English club cricket. Played for and coached Sutherland DCC (Australia). Played for Ansty and Normandy CC (UK).',
      profileStatus: 'confirmed',
      squadNumber: 43,
    },
    {
      id: 'david-hughes',
      fullName: 'David Hughes',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/Hughes_512eb22b.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'N/A',
      wicketkeeperFlag: false,
      clubEngland: "Bishop's Stortford",
      shortBio: 'An experienced cricket coach and former player, serving as Assistant Coach for England Over 40s. He captained Bishop\'s Stortford and Hoddesdon Cricket Clubs for over 14 years, played for Hertfordshire, Hampshire 2nd XI, and Surrey 2nd XI, and has coaching experience in South Africa. Head of Cricket, Bishop\'s Stortford College.',
      leadershipTag: 'Head Coach',
      profileStatus: 'confirmed',
      isCoachingStaff: true,
    },
    {
      id: 'eng-wc-018',
      fullName: 'Chris Mays',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663465975897/gtxNv2Yu4YkRqMHrRDNsLW/651afd6b-681c-46e2-ab40-5c5487017f96_71963377.png',
      roleCategory: 'All-rounder',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm off-break',
      wicketkeeperFlag: false,
      clubEngland: 'Finchley CC',
      shortBio: 'A former English cricketer who represented Sussex and Surrey at first-class county level. He also played for England-U19s, notably against West Indies Young Cricketers. A right-handed batsman and off-break bowler, Chris retired from county cricket to pursue a medical career as a GP for 30yrs. Played for Sussex (1986) and Surrey (1987-1988). Represented England-U19 (1985).',
      leadershipTag: 'Tour Manager',
      profileStatus: 'confirmed',
      isCoachingStaff: true,
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

  /** Confirmed tournament venues (from official IMC fixture list, August 2026) */
  venues: [
    'Georgetown Cricket Club (GCC)',
    'Guyana National Stadium — Providence',
    'Malteenoes CC',
    'Demerara Cricket Club (DCC)',
    'Lusignan',
    'Enmore Community Centre Ground',
    'Police Sports Club Ground at Eve Leary',
    'Anna Regina National Stadium — Essequibo',
    'Joe Jagmohan Ground — Essequibo',
    'MacKenzie National Stadium — Linden',
  ],

  /**
   * The match list — England's confirmed Zone B fixtures.
   * Source: worldcup.windiesmasters.org/fixtures-results/ (confirmed Aug 2026)
   * Note: Venues at Malteenoes CC may be subject to change — update if IMC revises.
   */
  matches: [
    {
      id: 'group-b-eng-usa',
      date: '2026-10-17',
      time: '09:30',
      homeTeam: 'USA',
      awayTeam: 'England',
      venue: 'Georgetown Cricket Club (GCC)',
      group: 'Zone B',
      stage: 'group',
      status: 'upcoming',
      isEngland: true,
      notes: 'League Day 1 — Match 4',
    },
    {
      id: 'group-b-eng-nz',
      date: '2026-10-18',
      time: '09:30',
      homeTeam: 'New Zealand',
      awayTeam: 'England',
      venue: 'Malteenoes CC',
      group: 'Zone B',
      stage: 'group',
      status: 'upcoming',
      isEngland: true,
      notes: 'League Day 2 — Match 11',
    },
    {
      id: 'group-b-eng-row',
      date: '2026-10-20',
      time: '09:30',
      homeTeam: 'Rest of the World',
      awayTeam: 'England',
      venue: 'Lusignan',
      group: 'Zone B',
      stage: 'group',
      status: 'upcoming',
      isEngland: true,
      notes: 'League Day 4 — Match 21',
    },
    {
      id: 'group-b-eng-pak',
      date: '2026-10-21',
      time: '09:30',
      homeTeam: 'Pakistan',
      awayTeam: 'England',
      venue: 'Malteenoes CC',
      group: 'Zone B',
      stage: 'group',
      status: 'upcoming',
      isEngland: true,
      notes: 'League Day 5 — Match 28',
    },
    {
      id: 'group-b-eng-sco',
      date: '2026-10-23',
      time: '09:30',
      homeTeam: 'Scotland',
      awayTeam: 'England',
      venue: 'Malteenoes CC',
      group: 'Zone B',
      stage: 'group',
      status: 'upcoming',
      isEngland: true,
      notes: 'League Day 7 — Match 37',
    },
    {
      id: 'group-b-eng-ind',
      date: '2026-10-24',
      time: '09:30',
      homeTeam: 'India',
      awayTeam: 'England',
      venue: 'Malteenoes CC',
      group: 'Zone B',
      stage: 'group',
      status: 'upcoming',
      isEngland: true,
      notes: 'League Day 8 — Match 43',
    },
    {
      id: 'group-b-eng-rotc',
      date: '2026-10-26',
      time: '09:30',
      homeTeam: 'Rest of the Caribbean',
      awayTeam: 'England',
      venue: 'Enmore Community Centre Ground',
      group: 'Zone B',
      stage: 'group',
      status: 'upcoming',
      isEngland: true,
      notes: 'League Day 10 — Match 52',
    },
  ] as Fixture[],

  /** Empty-state messaging */
  emptyState: {
    heading: 'Fixture Details Pending',
    message: 'The full tournament match schedule will be published here once confirmed by the IMC. Detailed England match coverage including scorecards and live streams will also be available on www.eng40scricket.co.uk.',
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
  logo?: string;
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
  qualificationRule: 'The top 4 teams from each zone will advance to the knockout stage.',

  /** Points awarded per result (used by standings engine) */
  pointsConfig: {
    win: 2,
    tie: 1,
    noResult: 1,
    loss: 0,
  },

  /**
   * The group compositions.
   * Confirmed draw: 2 zones of 8 teams.
   * England in Zone B.
   */
  groups: [
    {
      id: 'group-a',
      name: 'Zone A',
      isEnglandGroup: false,
      teams: [
        { team: 'Australia', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false, logo: '/manus-storage/australia_ab32dd24.png' },
        { team: 'Canada', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false, logo: '/manus-storage/canada_3c61dabf.png' },
        { team: 'Colombia', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false, logo: '/manus-storage/colombia_feef8445.png' },
        { team: 'Namibia', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false, logo: '/manus-storage/namibia_4f321dde.png' },
        { team: 'South Africa', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false, logo: '/manus-storage/southafrica_e11a94fc.png' },
        { team: 'Sri Lanka', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false, logo: '/manus-storage/srilanka_5a26be10.png' },
        { team: 'Wales', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false, logo: '/manus-storage/wales_20b83712.png' },
        { team: 'West Indies', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false, logo: '/manus-storage/westindies_15f564fe.png' },
      ],
    },
    {
      id: 'group-b',
      name: 'Zone B',
      isEnglandGroup: true,
      teams: [
        { team: 'England', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: true, logo: '/manus-storage/england_3b15416d.png' },
        { team: 'India', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false, logo: '/manus-storage/india_d6e6441e.png' },
        { team: 'New Zealand', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false, logo: '/manus-storage/newzealand_25df8696.png' },
        { team: 'Pakistan', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false, logo: '/manus-storage/pakistan_9bd9057e.png' },
        { team: 'Rest of the Caribbean', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false, logo: '/manus-storage/rotc_emblem_63346aaf.webp' },
        { team: 'Rest of the World', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false, logo: '/manus-storage/restofworld_e1cbd9c6.png' },
        { team: 'Scotland', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false, logo: '/manus-storage/scotland_9d64bc4c.png' },
        { team: 'USA', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: '+0.000', isEngland: false, logo: '/manus-storage/usa_0e4fc04e.png' },
      ],
    },
  ] as Group[],

  /** Last time standings were updated (ISO date string) */
  standingsLastUpdated: '2026-06-02',

  /** Empty-state messaging */
  emptyState: {
    heading: 'Draw Confirmed',
    message: 'The official draw has been confirmed by the IMC. Standings will populate automatically when match results are entered during the tournament.',
    badge: 'Draw Confirmed',
    englandBadge: 'England — Zone B',
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
      id: 'bul-9',
      date: '2026-06-02',
      headline: 'World Cup Draw Confirmed — England in Zone B',
      category: 'fixtures',
      summary: 'The IMC has confirmed the group draw for the Over 40s World Cup 2026. England have been placed in Zone B alongside New Zealand, Pakistan, India, Rest of the Caribbean, Rest of the World, Scotland, and USA. Tournament preparations begin with net sessions on 16 October at Malteenoes Cricket Club, followed by the Opening Ceremony and League Day 1 on 17 October (9:30 AM GYT).',
      imageUrl: '/manus-storage/IMG_6895_61431b21.jpeg',
      isPinned: true,
      isFeatured: true,
      isOfficial: true,
      author: 'England Over 40s Cricket',
    },
    {
      id: 'bul-7',
      date: '2026-04-06',
      headline: 'Full Tournament Schedule Confirmed by IMC',
      category: 'fixtures',
      summary: 'The IMC has released the confirmed tournament schedule for the Over 40s World Cup 2026 in Guyana. The itinerary covers 11 group-stage league days (17–27 October), Lower and Upper Crossovers (28–29 October), Placement Matches (30 October), and the Cup Final on 31 October. England play 7 Zone B fixtures across 10 days. Practice sessions begin 15 October, with the Opening Ceremony on the evening of 16 October.',
      isPinned: false,
      isFeatured: false,
      isOfficial: true,
      author: 'International Masters Cricket',
    },
    {
      id: 'bul-8',
      date: '2026-04-06',
      headline: '10 Venues Confirmed Across Guyana',
      category: 'announcements',
      summary: 'The IMC has confirmed 10 cricket grounds across Guyana that will host World Cup matches. Venues include Georgetown Cricket Club (GCC) — formerly Bourda — the Guyana National Stadium at Providence, Malteenoes CC, Demerara Cricket Club (DCC), Lusignan, Enmore Community Centre Ground, Police Sports Club Ground at Eve Leary, Anna Regina National Stadium in Essequibo, Joe Jagmohan Ground in Essequibo, and MacKenzie National Stadium in Linden.',
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
  link?: string;
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
  subtitle: 'Confirmed tournament schedule — IMC Official Fixture List, August 2026',
  source: 'IMC Official Fixture List, August 2026',

  events: [
    // ── PRE-TOURNAMENT ──────────────────────────────────────────
    {
      id: 'sch-01',
      date: '2026-10-15',
      dayOfWeek: 'Thursday',
      event: 'Teams Arrive / Practice Sessions',
      eventType: 'practice',
      description: 'All squads arrive in Georgetown and begin preparation sessions',
    },
    {
      id: 'sch-02',
      date: '2026-10-16',
      dayOfWeek: 'Friday',
      time: 'TBC',
      event: 'England Net Session',
      eventType: 'practice',
      description: 'Preparation nets at Malteenoes Cricket Club',
    },
    {
      id: 'sch-03',
      date: '2026-10-16',
      dayOfWeek: 'Friday',
      time: 'TBC',
      event: 'Captains & Managers Meeting',
      eventType: 'meeting',
      description: 'Pre-tournament briefing for all team captains and managers',
    },
    {
      id: 'sch-04',
      date: '2026-10-16',
      dayOfWeek: 'Friday',
      time: 'TBC',
      event: 'Press Conference / Media Briefing',
      eventType: 'meeting',
      description: 'Official pre-tournament media briefing',
    },
    {
      id: 'sch-05',
      date: '2026-10-16',
      dayOfWeek: 'Friday',
      time: '7:00 pm',
      event: 'Opening Ceremony',
      eventType: 'ceremony',
      isHighlight: true,
      description: 'Official opening of the IMC Over 40s World Cup 2026 — Railway Courtyard, Georgetown',
    },
    // ── GROUP STAGE ─────────────────────────────────────────────
    {
      id: 'sch-06',
      date: '2026-10-17',
      dayOfWeek: 'Saturday',
      time: '9:30 am',
      event: 'League Day 1 — England vs USA',
      eventType: 'match',
      isHighlight: true,
      description: 'Tournament begins. England open their campaign against USA at Georgetown Cricket Club (GCC)',
    },
    {
      id: 'sch-07',
      date: '2026-10-18',
      dayOfWeek: 'Sunday',
      time: '9:30 am',
      event: 'League Day 2 — England vs New Zealand',
      eventType: 'match',
      isHighlight: true,
      description: 'England face New Zealand at Malteenoes CC',
    },
    {
      id: 'sch-08',
      date: '2026-10-19',
      dayOfWeek: 'Monday',
      time: '9:30 am',
      event: 'League Day 3 — England Rest Day',
      eventType: 'rest',
      description: 'No England fixture today. Other Zone B matches continue',
    },
    {
      id: 'sch-09',
      date: '2026-10-20',
      dayOfWeek: 'Tuesday',
      time: '9:30 am',
      event: 'League Day 4 — England vs Rest of the World',
      eventType: 'match',
      isHighlight: true,
      description: 'England face Rest of the World at Lusignan',
    },
    {
      id: 'sch-10',
      date: '2026-10-21',
      dayOfWeek: 'Wednesday',
      time: '9:30 am',
      event: 'League Day 5 — England vs Pakistan',
      eventType: 'match',
      isHighlight: true,
      description: 'England face Pakistan at Malteenoes CC',
    },
    {
      id: 'sch-11',
      date: '2026-10-22',
      dayOfWeek: 'Thursday',
      time: '9:30 am',
      event: 'League Day 6 — England Rest Day',
      eventType: 'rest',
      description: 'No England fixture today. Other Zone B matches continue',
    },
    {
      id: 'sch-12',
      date: '2026-10-23',
      dayOfWeek: 'Friday',
      time: '9:30 am',
      event: 'League Day 7 — England vs Scotland',
      eventType: 'match',
      isHighlight: true,
      description: 'England face Scotland at Malteenoes CC',
    },
    {
      id: 'sch-13',
      date: '2026-10-24',
      dayOfWeek: 'Saturday',
      time: '9:30 am',
      event: 'League Day 8 — England vs India',
      eventType: 'match',
      isHighlight: true,
      description: 'England face India at Malteenoes CC',
    },
    {
      id: 'sch-14',
      date: '2026-10-25',
      dayOfWeek: 'Sunday',
      time: '9:30 am',
      event: 'League Day 9 — England Rest Day',
      eventType: 'rest',
      description: 'No England fixture today. Other Zone B matches continue',
    },
    {
      id: 'sch-15',
      date: '2026-10-26',
      dayOfWeek: 'Monday',
      time: '9:30 am',
      event: 'League Day 10 — England vs Rest of the Caribbean',
      eventType: 'match',
      isHighlight: true,
      description: 'England\'s final group stage match against Rest of the Caribbean at Enmore Community Centre Ground',
    },
    {
      id: 'sch-16',
      date: '2026-10-27',
      dayOfWeek: 'Tuesday',
      time: '9:30 am',
      event: 'League Day 11 — England Rest Day',
      eventType: 'rest',
      description: 'Final group stage round. No England fixture — Zone A teams complete their schedule',
    },
    // ── KNOCKOUT STAGE ──────────────────────────────────────────
    {
      id: 'sch-17',
      date: '2026-10-28',
      dayOfWeek: 'Wednesday',
      time: '9:30 am',
      event: 'Lower Crossovers',
      eventType: 'match',
      isHighlight: true,
      description: 'Positions 5th–8th from each zone compete to determine final standings',
    },
    {
      id: 'sch-18',
      date: '2026-10-29',
      dayOfWeek: 'Thursday',
      time: '9:30 am',
      event: 'Upper Crossovers',
      eventType: 'match',
      isHighlight: true,
      description: 'Top 4 from each zone cross over — semi-final positions decided',
    },
    {
      id: 'sch-19',
      date: '2026-10-30',
      dayOfWeek: 'Friday',
      time: '9:30 am',
      event: 'Placement Matches',
      eventType: 'match',
      isHighlight: true,
      description: 'Final placement matches to determine positions 5th–16th',
    },
    // ── FINAL DAY ───────────────────────────────────────────────
    {
      id: 'sch-20',
      date: '2026-10-31',
      dayOfWeek: 'Saturday',
      time: '9:30 am',
      event: 'Cup Final',
      eventType: 'match',
      isHighlight: true,
      description: 'IMC Over 40s World Cup Final — Guyana National Stadium, Providence',
    },
    {
      id: 'sch-21',
      date: '2026-10-31',
      dayOfWeek: 'Saturday',
      time: '8:00 pm',
      event: 'Closing Ceremony',
      eventType: 'ceremony',
      isHighlight: true,
      description: 'Closing ceremony and prize presentation — Police Officers Mess',
    },
    {
      id: 'sch-22',
      date: '2026-11-01',
      dayOfWeek: 'Sunday',
      event: 'Teams Depart',
      eventType: 'travel',
      description: 'Squads depart Georgetown',
    },
  ] as ScheduleEvent[],

  /** Venue information — confirmed from official IMC fixture list, August 2026 */
  venueInfo: [
    {
      name: 'Georgetown Cricket Club (GCC)',
      location: 'Georgetown',
      description: 'One of the most historic grounds in world cricket, formerly known as Bourda. The first Test ground in mainland South America and the only international stadium built below sea level, uniquely protected by a surrounding moat. Home to the Georgetown Cricket Club, the ground has hosted legends such as Sir Clive Lloyd and Brian Lara. England face USA here on League Day 1.',
    },
    {
      name: 'Guyana National Stadium — Providence',
      location: 'Providence, East Bank Demerara',
      description: 'Guyana\'s premier international cricket venue, built for the 2007 ICC Cricket World Cup. The modern stadium holds over 15,000 spectators and has hosted numerous West Indies internationals and CPL matches. Venue for the Cup Final on 31 October.',
    },
    {
      name: 'Malteenoes CC',
      location: 'Thomas Lands, Georgetown',
      description: 'A historic and vibrant hub for cricket in Georgetown, known for producing national players and hosting intense local matches. England play four of their seven group stage fixtures here, including matches against New Zealand, Pakistan, Scotland, and India.',
    },
    {
      name: 'Demerara Cricket Club (DCC)',
      location: 'Queenstown, Georgetown',
      description: 'A historic ground and hub for Guyanese cricket where legends like Clive Lloyd and Lance Gibbs honed their skills. While international matches moved to Providence Stadium, DCC remains a vital part of Guyana\'s cricket heritage.',
    },
    {
      name: 'Lusignan',
      location: 'East Coast Demerara',
      description: 'A key community venue on the East Coast Demerara hosting World Cup group stage matches. England face Rest of the World here on League Day 4.',
    },
    {
      name: 'Enmore Community Centre Ground',
      location: 'Enmore, Demerara',
      description: 'Located in Enmore on the East Coast Demerara, this ground hosts World Cup group stage fixtures including England\'s final group match against Rest of the Caribbean on League Day 10.',
    },
    {
      name: 'Police Sports Club Ground at Eve Leary',
      location: 'Georgetown',
      description: 'A key venue for sporting events in Georgetown, hosting World Cup group stage and knockout matches. The dedicated home for the Guyana Police Force\'s cricket and other sports activities.',
    },
    {
      name: 'Anna Regina National Stadium',
      location: 'Essequibo Coast',
      description: 'A national stadium on the Essequibo Coast hosting World Cup group stage fixtures, bringing the tournament to Guyana\'s western region.',
    },
    {
      name: 'Joe Jagmohan Ground',
      location: 'Essequibo',
      description: 'An Essequibo venue hosting World Cup group stage matches, named in honour of a prominent figure in Guyanese sport.',
    },
    {
      name: 'MacKenzie National Stadium',
      location: 'Linden',
      description: 'A national stadium in Linden, Guyana\'s second-largest city, hosting World Cup group stage fixtures and bringing the tournament to the interior of the country.',
    },
  ],

  /** Empty-state messaging */
  emptyState: {
    heading: 'Schedule to Be Announced',
    message: 'The tournament itinerary will appear here once the IMC releases the official schedule.',
  },
};
