// Cricket overs use a base-6 fractional part: "19.5" = 19 overs + 5 balls.
export function oversToDecimal(overs) {
  const n = Number(overs);
  if (!Number.isFinite(n) || n < 0) return 0;
  const whole = Math.floor(n);
  const balls = Math.round((n - whole) * 10);
  if (balls > 5) return whole + 1;
  return whole + balls / 6;
}

export function calculateNRR({ runsFor, oversFor, runsAgainst, oversAgainst }) {
  const of = oversToDecimal(oversFor);
  const oa = oversToDecimal(oversAgainst);
  if (of === 0 || oa === 0) return null;
  return Number(runsFor) / of - Number(runsAgainst) / oa;
}

export function formatNRR(nrr) {
  if (nrr == null || !Number.isFinite(Number(nrr))) return '—';
  const n = Number(nrr);
  return (n >= 0 ? '+' : '') + n.toFixed(3);
}

// Run rate: runs per over for a single innings or a whole tournament.
export function runRate({ runs, overs }) {
  const o = oversToDecimal(overs);
  if (o === 0) return null;
  return Number(runs) / o;
}

// Required run rate for a chase: runs still needed per over. `target` is the
// score to beat plus one (the total the chasing side must reach).
export function requiredRunRate({ target, scored = 0, oversRemaining }) {
  const o = oversToDecimal(oversRemaining);
  if (o === 0) return null;
  const needed = Number(target) - Number(scored || 0);
  if (!Number.isFinite(needed)) return null;
  return Math.max(0, needed) / o;
}

// Balls left, for the "x off y balls" phrasing a chase is usually quoted in.
export function ballsRemaining(overs) {
  const o = oversToDecimal(overs);
  return Math.round(o * 6);
}

export function formatRate(rate) {
  if (rate == null || !Number.isFinite(Number(rate))) return '—';
  return Number(rate).toFixed(2);
}
