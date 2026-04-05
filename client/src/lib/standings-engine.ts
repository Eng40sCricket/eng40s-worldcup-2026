// ============================================================
// STANDINGS ENGINE — Modular tournament standings calculator
// ============================================================
// This engine ingests fixture results and computes group standings.
// It supports four tournament data states and configurable ranking rules.
// Designed so admins can later change tournament rules without rewriting logic.
// ============================================================

import type { Fixture, Group, GroupTeam } from './data';

// ---- TOURNAMENT STATE ----

/**
 * TournamentState — The four lifecycle phases of the tournament.
 *
 * 'pre-draw'       : No groups assigned, no fixtures. Show elegant placeholders.
 * 'draw-announced' : Groups assigned but no matches played yet. Show empty tables.
 * 'live'           : Tournament in progress. At least one match has a result.
 * 'completed'      : All group matches finished. Final standings locked.
 */
export type TournamentState = 'pre-draw' | 'draw-announced' | 'live' | 'completed';

/**
 * Derives the current tournament state from groups and fixtures data.
 * This is the single source of truth for what the UI should render.
 */
export function deriveTournamentState(
  groups: Group[],
  fixtures: Fixture[],
): TournamentState {
  // No groups at all → pre-draw
  if (groups.length === 0) return 'pre-draw';

  // Groups exist but check if any matches have been played
  const groupFixtures = fixtures.filter((f) => f.stage === 'group');
  const completedMatches = groupFixtures.filter(
    (f) => f.status === 'completed' || f.status === 'no-result' || f.status === 'abandoned',
  );
  const inProgressMatches = groupFixtures.filter((f) => f.status === 'in-progress');

  // No completed or in-progress matches → draw announced but not started
  if (completedMatches.length === 0 && inProgressMatches.length === 0) {
    return 'draw-announced';
  }

  // Check if all group fixtures are resolved
  const unresolvedGroupMatches = groupFixtures.filter(
    (f) => f.status === 'upcoming' || f.status === 'in-progress' || f.status === 'tbc',
  );

  if (unresolvedGroupMatches.length === 0 && completedMatches.length > 0) {
    return 'completed';
  }

  return 'live';
}


// ---- RANKING CONFIGURATION ----

/**
 * RankingRule — A single criterion used to sort teams.
 * The engine applies rules in order; the first rule that produces a
 * non-zero comparison wins.
 *
 * Admins can reorder, add, or remove rules to change tournament behaviour.
 */
export interface RankingRule {
  /** Human-readable name for this rule */
  name: string;
  /** Comparison function: negative = a ranks higher, positive = b ranks higher */
  compare: (a: GroupTeam, b: GroupTeam) => number;
}

/**
 * Default ranking rules following standard ODI tournament conventions:
 * 1. Points (descending)
 * 2. Net Run Rate (descending)
 * 3. Head-to-head (not yet implemented — placeholder for future)
 * 4. Wins count (descending)
 * 5. Alphabetical team name (ascending) — final tiebreaker
 */
export const DEFAULT_RANKING_RULES: RankingRule[] = [
  {
    name: 'Points',
    compare: (a, b) => b.points - a.points,
  },
  {
    name: 'Net Run Rate',
    compare: (a, b) => {
      const nrrA = parseFloat(a.nrr) || 0;
      const nrrB = parseFloat(b.nrr) || 0;
      return nrrB - nrrA;
    },
  },
  {
    name: 'Wins',
    compare: (a, b) => b.won - a.won,
  },
  {
    name: 'Alphabetical',
    compare: (a, b) => a.team.localeCompare(b.team),
  },
];


// ---- POINTS CONFIGURATION ----

/**
 * PointsConfig — How many points are awarded for each match outcome.
 * Admins can override these values to match specific tournament rules.
 */
export interface PointsConfig {
  win: number;
  loss: number;
  tie: number;
  noResult: number;
  abandoned: number;
}

export const DEFAULT_POINTS_CONFIG: PointsConfig = {
  win: 2,
  loss: 0,
  tie: 1,
  noResult: 1,
  abandoned: 1,
};


// ---- STANDINGS CALCULATION ----

/**
 * Ranks teams within a group using the provided ranking rules.
 * Falls through rules in order until a non-zero comparison is found.
 */
export function rankTeams(
  teams: GroupTeam[],
  rules: RankingRule[] = DEFAULT_RANKING_RULES,
): GroupTeam[] {
  return [...teams].sort((a, b) => {
    for (const rule of rules) {
      const result = rule.compare(a, b);
      if (result !== 0) return result;
    }
    return 0;
  });
}

/**
 * Qualification threshold — how many teams from each group advance.
 * Default is top 4 (configurable).
 */
export const DEFAULT_QUALIFY_SPOTS = 4;

/**
 * Determines the qualification status label for a team based on position.
 */
export function getQualificationStatus(
  position: number,
  qualifySpots: number = DEFAULT_QUALIFY_SPOTS,
  tournamentState: TournamentState = 'live',
): string {
  if (tournamentState === 'pre-draw' || tournamentState === 'draw-announced') return '';
  if (tournamentState === 'completed') {
    return position <= qualifySpots ? 'Qualified' : 'Eliminated';
  }
  // Live tournament — only show provisional status
  if (position <= qualifySpots) return 'Qualifying';
  return '';
}


// ---- FIXTURE → STANDINGS INGESTION ----

/**
 * MatchResult — Parsed result data from a completed fixture.
 * Used to update group standings.
 */
export interface MatchResult {
  homeTeam: string;
  awayTeam: string;
  homeScore?: { runs: number; wickets: number; overs: number };
  awayScore?: { runs: number; wickets: number; overs: number };
  winner?: string;       // Team name of the winner, or undefined for tie/NR
  outcome: 'home-win' | 'away-win' | 'tie' | 'no-result' | 'abandoned';
}

/**
 * Parses a fixture's result string into a structured MatchResult.
 * Supports common result formats:
 *   - "England won by 5 wickets"
 *   - "Australia won by 23 runs"
 *   - "Match tied"
 *   - "No result"
 *   - "Abandoned"
 *
 * For more complex results (with scores), the result string should follow:
 *   "HomeTeam 245/6 (45) vs AwayTeam 200 (42.3) — HomeTeam won by 45 runs"
 */
export function parseFixtureResult(fixture: Fixture): MatchResult | null {
  if (fixture.status !== 'completed' && fixture.status !== 'no-result' && fixture.status !== 'abandoned') {
    return null;
  }

  const result = fixture.result?.toLowerCase() ?? '';

  // Abandoned
  if (fixture.status === 'abandoned' || result.includes('abandon')) {
    return {
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      outcome: 'abandoned',
    };
  }

  // No result
  if (fixture.status === 'no-result' || result.includes('no result') || result.includes('no-result')) {
    return {
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      outcome: 'no-result',
    };
  }

  // Tie
  if (result.includes('tied') || result.includes('tie')) {
    return {
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      outcome: 'tie',
    };
  }

  // Win — check which team won
  const wonMatch = result.match(/^(.+?)\s+won\b/i);
  if (wonMatch) {
    const winnerName = wonMatch[1].trim();
    const isHomeWin = winnerName.toLowerCase() === fixture.homeTeam.toLowerCase();
    return {
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      winner: isHomeWin ? fixture.homeTeam : fixture.awayTeam,
      outcome: isHomeWin ? 'home-win' : 'away-win',
    };
  }

  // Fallback: if status is completed but we can't parse, treat as no-result
  return {
    homeTeam: fixture.homeTeam,
    awayTeam: fixture.awayTeam,
    outcome: 'no-result',
  };
}

/**
 * Builds group standings from scratch by ingesting all completed fixtures.
 * This is the primary function that connects fixtures to the standings table.
 *
 * @param groups - The group definitions with initial team lists
 * @param fixtures - All tournament fixtures
 * @param pointsConfig - Points awarded per outcome
 * @returns Updated groups with recalculated team stats
 */
export function buildStandingsFromFixtures(
  groups: Group[],
  fixtures: Fixture[],
  pointsConfig: PointsConfig = DEFAULT_POINTS_CONFIG,
): Group[] {
  // Create a deep copy to avoid mutating original data
  const updatedGroups: Group[] = groups.map((g) => ({
    ...g,
    teams: g.teams.map((t) => ({
      ...t,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      noResult: 0,
      points: 0,
      nrr: '+0.000',
      status: '',
    })),
  }));

  // Build a lookup: team name → { groupIndex, teamIndex }
  const teamLookup = new Map<string, { gi: number; ti: number }>();
  updatedGroups.forEach((g, gi) => {
    g.teams.forEach((t, ti) => {
      teamLookup.set(t.team.toLowerCase(), { gi, ti });
    });
  });

  // NRR accumulators: team → { runsScored, oversPlayed, runsConceded, oversBowled }
  const nrrData = new Map<string, {
    runsScored: number;
    oversPlayed: number;
    runsConceded: number;
    oversBowled: number;
  }>();

  // Process each completed group fixture
  const groupFixtures = fixtures.filter((f) => f.stage === 'group');

  for (const fixture of groupFixtures) {
    const matchResult = parseFixtureResult(fixture);
    if (!matchResult) continue;

    const homeLookup = teamLookup.get(matchResult.homeTeam.toLowerCase());
    const awayLookup = teamLookup.get(matchResult.awayTeam.toLowerCase());

    // Helper to get/init NRR data
    const getNrr = (team: string) => {
      const key = team.toLowerCase();
      if (!nrrData.has(key)) {
        nrrData.set(key, { runsScored: 0, oversPlayed: 0, runsConceded: 0, oversBowled: 0 });
      }
      return nrrData.get(key)!;
    };

    // Update team stats based on outcome
    const updateTeam = (lookup: { gi: number; ti: number } | undefined, outcome: 'win' | 'loss' | 'tie' | 'no-result' | 'abandoned') => {
      if (!lookup) return;
      const team = updatedGroups[lookup.gi].teams[lookup.ti];
      team.played += 1;

      switch (outcome) {
        case 'win':
          team.won += 1;
          team.points += pointsConfig.win;
          break;
        case 'loss':
          team.lost += 1;
          team.points += pointsConfig.loss;
          break;
        case 'tie':
          team.tied += 1;
          team.points += pointsConfig.tie;
          break;
        case 'no-result':
          team.noResult += 1;
          team.points += pointsConfig.noResult;
          break;
        case 'abandoned':
          team.noResult += 1;
          team.points += pointsConfig.abandoned;
          break;
      }
    };

    switch (matchResult.outcome) {
      case 'home-win':
        updateTeam(homeLookup, 'win');
        updateTeam(awayLookup, 'loss');
        break;
      case 'away-win':
        updateTeam(homeLookup, 'loss');
        updateTeam(awayLookup, 'win');
        break;
      case 'tie':
        updateTeam(homeLookup, 'tie');
        updateTeam(awayLookup, 'tie');
        break;
      case 'no-result':
        updateTeam(homeLookup, 'no-result');
        updateTeam(awayLookup, 'no-result');
        break;
      case 'abandoned':
        updateTeam(homeLookup, 'abandoned');
        updateTeam(awayLookup, 'abandoned');
        break;
    }

    // Update NRR accumulators if scores are available
    if (matchResult.homeScore && matchResult.awayScore) {
      const homeNrr = getNrr(matchResult.homeTeam);
      const awayNrr = getNrr(matchResult.awayTeam);

      homeNrr.runsScored += matchResult.homeScore.runs;
      homeNrr.oversPlayed += matchResult.homeScore.overs;
      homeNrr.runsConceded += matchResult.awayScore.runs;
      homeNrr.oversBowled += matchResult.awayScore.overs;

      awayNrr.runsScored += matchResult.awayScore.runs;
      awayNrr.oversPlayed += matchResult.awayScore.overs;
      awayNrr.runsConceded += matchResult.homeScore.runs;
      awayNrr.oversBowled += matchResult.homeScore.overs;
    }
  }

  // Calculate NRR for each team
  for (const group of updatedGroups) {
    for (const team of group.teams) {
      const data = nrrData.get(team.team.toLowerCase());
      if (data && data.oversPlayed > 0 && data.oversBowled > 0) {
        const nrr = (data.runsScored / data.oversPlayed) - (data.runsConceded / data.oversBowled);
        team.nrr = (nrr >= 0 ? '+' : '') + nrr.toFixed(3);
      }
    }
  }

  return updatedGroups;
}


// ---- ENGLAND-SPECIFIC HELPERS ----

/**
 * Returns a plain-language qualification implication for England.
 * Adapts messaging based on tournament state.
 */
export function getEnglandQualificationMessage(
  groups: Group[],
  tournamentState: TournamentState,
  qualifySpots: number = DEFAULT_QUALIFY_SPOTS,
  rules: RankingRule[] = DEFAULT_RANKING_RULES,
): string {
  if (tournamentState === 'pre-draw') {
    return 'England\'s group has not yet been confirmed. The draw will determine which nations England face in the group stage.';
  }

  const englandGroup = groups.find((g) => g.isEnglandGroup);
  if (!englandGroup) {
    return 'England\'s group assignment could not be determined.';
  }

  if (tournamentState === 'draw-announced') {
    const opponents = englandGroup.teams
      .filter((t) => !t.isEngland)
      .map((t) => t.team)
      .join(', ');
    return `England have been drawn in ${englandGroup.name} alongside ${opponents}. The top ${qualifySpots} teams from each group will advance to the knockout stage.`;
  }

  // Live or completed
  const ranked = rankTeams(englandGroup.teams, rules);
  const englandIdx = ranked.findIndex((t) => t.isEngland);
  const england = ranked[englandIdx];

  if (!england) return 'England\'s position could not be determined.';

  const position = englandIdx + 1;
  const ordinal = getOrdinal(position);

  if (tournamentState === 'completed') {
    if (position <= qualifySpots) {
      return `England finished ${ordinal} in ${englandGroup.name} with ${england.points} points (NRR: ${england.nrr}). They have qualified for the knockout stage.`;
    }
    return `England finished ${ordinal} in ${englandGroup.name} with ${england.points} points. They did not advance to the knockout stage.`;
  }

  // Live
  if (position <= qualifySpots) {
    if (position === 1) {
      return `England lead ${englandGroup.name} with ${england.points} points and a net run rate of ${england.nrr}. They are on course to qualify for the knockout stage.`;
    }
    return `England are ${ordinal} in ${englandGroup.name} with ${england.points} points. They currently occupy a qualifying position for the knockout stage.`;
  }

  const gap = ranked[qualifySpots - 1].points - england.points;
  return `England are ${ordinal} in ${englandGroup.name} with ${england.points} points, ${gap} point${gap !== 1 ? 's' : ''} behind the final qualifying spot. They need results to go their way to progress.`;
}


// ---- UTILITY ----

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Sorts groups so England's group appears first.
 */
export function sortGroupsEnglandFirst(groups: Group[]): Group[] {
  return [...groups].sort((a, b) => {
    if (a.isEnglandGroup && !b.isEnglandGroup) return -1;
    if (!a.isEnglandGroup && b.isEnglandGroup) return 1;
    return 0;
  });
}

/**
 * Counts total matches played across all groups.
 */
export function getTotalMatchesPlayed(groups: Group[]): number {
  return groups.reduce(
    (sum, g) => sum + g.teams.reduce((s, t) => s + t.played, 0),
    0,
  ) / 2; // Each match is counted twice (once per team)
}

/**
 * Returns the total number of group matches expected.
 * For a group of N teams where each plays every other once: N*(N-1)/2
 */
export function getTotalGroupMatches(groups: Group[]): number {
  return groups.reduce((sum, g) => {
    const n = g.teams.length;
    return sum + (n * (n - 1)) / 2;
  }, 0);
}

/**
 * Returns a progress percentage for the group stage.
 */
export function getGroupStageProgress(groups: Group[]): number {
  const total = getTotalGroupMatches(groups);
  if (total === 0) return 0;
  const played = getTotalMatchesPlayed(groups);
  return Math.round((played / total) * 100);
}
