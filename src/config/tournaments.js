import season from './season.json';
import iplTeams from '../data/ipl/teams.json';
import ipl2026 from '../data/ipl/season-2026.json';

// Tournament registry. Everything tournament-specific lives in a config object
// here; components and utils take that config (or pieces of it) as input and
// bake in no IPL assumptions. Adding WTC / BBL / SA20 / MLC means adding an
// entry below plus its data files — no component changes.

export const SEASON_STATUS = {
  LIVE: 'live',
  COMPLETE: 'complete',
  UPCOMING: 'upcoming',
};

export const ipl = {
  id: 'ipl',
  name: 'Indian Premier League',
  short: 'IPL',
  basePath: '/ipl',
  format: {
    // League stage shape — used by the qualification math and the table.
    matchesPerTeam: 14,
    playoffSpots: 4,
    pointsPerWin: 2,
    pointsPerNoResult: 1,
    // Conventional "safe" points total for a playoff spot.
    safePoints: 16,
  },
  teams: iplTeams,
  seasons: { 2026: ipl2026 },
};

export const TOURNAMENTS = { [ipl.id]: ipl };

export function getTournament(id) {
  return TOURNAMENTS[id] ?? null;
}

// The tournament + season the site is currently presenting, per season.json.
export const activeTournament = getTournament(season.tournamentId) ?? ipl;
export const activeSeason = {
  year: season.year,
  status: season.status,
  data: activeTournament.seasons?.[season.year] ?? null,
};
