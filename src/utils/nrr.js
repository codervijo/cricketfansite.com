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
