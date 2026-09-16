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

// --- Playoffs -------------------------------------------------------------
// All of this is driven by the season data file's `playoffs` block. Nothing
// about a bracket is hardcoded here: each match carries its own label, the
// two teams, the winner, and `eliminationLabel` — what the LOSER of that
// match is called. A match with no winner recorded is skipped entirely.

export function playoffMatches(s) {
  if (!hasResults(s)) return [];
  return (s.data.playoffs?.matches ?? []).filter((m) => m.winner);
}

export const loserOf = (m) => m.teams?.find((id) => id !== m.winner) ?? null;

export function champion(t, s) {
  if (!hasResults(s)) return null;
  const id = s.data.playoffs?.champion;
  return id ? (t.teams.find((team) => team.id === id) ?? null) : null;
}

// Champions / Runners-up / Lost Qualifier 2 / Lost Eliminator / Did not qualify.
// Returns null when the season has no verified results to reason from.
export function playoffOutcome(t, s, teamId) {
  if (!hasResults(s)) return null;
  const p = s.data.playoffs ?? {};
  if (p.champion === teamId) return 'Champions';

  for (const m of playoffMatches(s)) {
    if (loserOf(m) === teamId && m.eliminationLabel) return m.eliminationLabel;
  }

  const row = teamResult(t, s, teamId);
  if (row?.madePlayoffs) return 'Reached the playoffs';
  return 'Did not qualify';
}

export const lastUpdated = (s) => (hasResults(s) ? s.data.lastUpdated ?? null : null);

// "2026-05-31" -> "31 May 2026". Returns null for anything unparseable so a
// missing date is omitted rather than rendered as garbage.
export function formatDate(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  if (!months[m - 1]) return null;
  return `${d} ${months[m - 1]} ${y}`;
}
