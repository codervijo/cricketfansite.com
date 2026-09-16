import { SEASON_STATUS } from '../config/tournaments.js';

// Season-state helpers. Every "is the season over?" and "do we actually have
// the numbers?" question funnels through here so no page decides on its own.

export const isLive = (s) => s?.status === SEASON_STATUS.LIVE;
export const isComplete = (s) => s?.status === SEASON_STATUS.COMPLETE;
export const isUpcoming = (s) => s?.status === SEASON_STATUS.UPCOMING;

// Results are renderable only once a human has filled the season data file and
// flipped `verified`. Unverified => the site shows a labelled gap, never a guess.
export const hasResults = (s) => Boolean(s?.data?.verified);

export const seasonLabel = (t, s) => `${t.short} ${s.year}`;
export const nextSeasonLabel = (t, s) => `${t.short} ${s.year + 1}`;

// Standings joined with team identity, ordered by final position when present,
// otherwise by points then NRR. Returns [] when there is nothing verified to show.
export function standingsRows(t, s) {
  if (!hasResults(s)) return [];
  const byId = new Map(t.teams.map((team) => [team.id, team]));
  return s.data.standings
    .map((row) => ({ ...byId.get(row.teamId), ...row, id: row.teamId }))
    .filter((row) => row.name)
    .sort((a, b) => {
      if (a.position != null && b.position != null) return a.position - b.position;
      if (b.points !== a.points) return b.points - a.points;
      return b.nrr - a.nrr;
    });
}

export function teamResult(t, s, teamId) {
  if (!hasResults(s)) return null;
  return s.data.standings.find((row) => row.teamId === teamId) ?? null;
}
