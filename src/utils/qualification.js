// IPL: 10 teams, 14 league matches each, top 4 advance to playoffs.
// 16 points (8 wins) is the conventional "safe" qualification threshold.

export const TOTAL_MATCHES = 14;
export const SAFE_POINTS = 16;

export function maxPossiblePoints(currentPoints, remaining) {
  return Number(currentPoints) + Number(remaining) * 2;
}

export function winsNeeded(currentPoints, target = SAFE_POINTS) {
  const deficit = Math.max(0, Number(target) - Number(currentPoints));
  return Math.ceil(deficit / 2);
}

export function qualifyStatus({ points, remaining, target = SAFE_POINTS }) {
  const p = Number(points) || 0;
  const r = Number(remaining) || 0;
  const t = Number(target) || SAFE_POINTS;
  const max = maxPossiblePoints(p, r);
  const need = winsNeeded(p, t);

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
