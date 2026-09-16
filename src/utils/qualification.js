// Tournament-agnostic qualification math. Callers pass the tournament's format
// (see src/config/tournaments.js); the defaults below are a plain round-robin
// two-points-a-win league and exist only so the generic calculator can run
// before a format is chosen.

export const DEFAULT_FORMAT = {
  matchesPerTeam: 14,
  playoffSpots: 4,
  pointsPerWin: 2,
  pointsPerNoResult: 1,
  safePoints: 16,
};

export function maxPossiblePoints(currentPoints, remaining, pointsPerWin = DEFAULT_FORMAT.pointsPerWin) {
  return Number(currentPoints) + Number(remaining) * Number(pointsPerWin);
}

export function winsNeeded(currentPoints, target, pointsPerWin = DEFAULT_FORMAT.pointsPerWin) {
  const deficit = Math.max(0, Number(target) - Number(currentPoints));
  return Math.ceil(deficit / Number(pointsPerWin));
}

export function qualifyStatus({ points, remaining, target, pointsPerWin } = {}) {
  const p = Number(points) || 0;
  const r = Number(remaining) || 0;
  const t = Number(target) || DEFAULT_FORMAT.safePoints;
  const ppw = Number(pointsPerWin) || DEFAULT_FORMAT.pointsPerWin;
  const max = maxPossiblePoints(p, r, ppw);
  const need = winsNeeded(p, t, ppw);

  if (p >= t) {
    return {
      status: 'qualified',
      message: `Already at the safe threshold (${t} pts). Playoff spot very likely.`,
      need: 0,
      max,
    };
  }
  if (max < t) {
    return {
      status: 'eliminated',
      message: `Cannot reach ${t} pts even by winning all ${r} remaining match(es). Effectively out of safe contention.`,
      need: Infinity,
      max,
    };
  }
  if (need === r) {
    return {
      status: 'must-win-all',
      message: `Must win all ${r} remaining match(es) to reach ${t} pts.`,
      need,
      max,
    };
  }
  return {
    status: 'in-contention',
    message: `Win at least ${need} of the next ${r} match(es) to reach ${t} pts.`,
    need,
    max,
  };
}
