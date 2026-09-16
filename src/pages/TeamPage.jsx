import { useParams, Link as RouterLink, Navigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Stack,
  Button,
  Chip,
  Paper,
  Alert,
} from '@mui/material';
import Head from '../components/Head.jsx';
import QualificationCalculator from '../components/QualificationCalculator.jsx';
import { formatNRR } from '../utils/nrr.js';
import { activeTournament as t, activeSeason as s } from '../config/tournaments.js';
import {
  isComplete,
  hasResults,
  teamResult,
  seasonLabel,
  nextSeasonLabel,
  playoffOutcome,
  lastUpdated,
  formatDate,
} from '../utils/season.js';

export default function TeamPage() {
  const { team } = useParams();
  const info = t.teams.find((x) => x.id === team);
  if (!info) return <Navigate to={`${t.basePath}/table`} replace />;

  const done = isComplete(s);
  const label = seasonLabel(t, s);
  const next = nextSeasonLabel(t, s);
  const result = teamResult(t, s, info.id);
  const outcome = playoffOutcome(t, s, info.id);
  const updated = formatDate(lastUpdated(s));
  const remaining =
    result?.played != null ? Math.max(0, t.format.matchesPerTeam - result.played) : null;

  return (
    <>
      <Head
        title={
          done
            ? `${info.name} (${info.short}) — ${label} Final Standing`
            : `${info.name} (${info.short}) — ${t.short} Playoff Qualification Scenarios`
        }
        description={metaDescription({ info, label, next, done, result, remaining, outcome })}
      />
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap' }}>
        <Box sx={{ width: 12, height: 32, bgcolor: info.color, borderRadius: 0.5 }} />
        <Typography variant="h1">{info.name}</Typography>
        <Chip label={info.short} />
      </Stack>
      <Typography variant="h2" gutterBottom>
        {done ? `${label} season summary` : `${label} qualification scenarios`}
      </Typography>

      {result ? (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
            {done && <Stat label="Final position" value={ordinal(result.position)} />}
            <Stat label="Played" value={result.played} />
            <Stat label="Wins" value={result.wins} />
            <Stat label="Losses" value={result.losses} />
            <Stat label="Points" value={result.points} />
            <Stat label="NRR" value={formatNRR(result.nrr)} />
            {done ? (
              <Stat label="Playoff outcome" value={outcome ?? '—'} />
            ) : (
              <Stat label="Remaining" value={remaining} />
            )}
          </Stack>
          {updated && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
              Last updated {updated}
            </Typography>
          )}
        </Paper>
      ) : (
        <Alert severity="warning" variant="outlined" sx={{ mb: 3 }}>
          {info.short}&apos;s {label} figures are being checked against the official
          source and will appear here once confirmed.
        </Alert>
      )}

      {done ? (
        <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
          {label} is finished, so there are no live qualification scenarios to run for{' '}
          {info.short}. Per-team scenarios return when {next} starts — the{' '}
          <Button
            component={RouterLink}
            to={`${t.basePath}/calculators`}
            size="small"
            sx={{ p: 0, minWidth: 0, verticalAlign: 'baseline' }}
          >
            qualification calculator
          </Button>{' '}
          works year-round in the meantime.
        </Alert>
      ) : (
        hasResults(s) &&
        result && (
          <QualificationCalculator
            heading={`${info.short} qualification scenarios`}
            format={t.format}
            initial={{ points: result.points, remaining, nrr: result.nrr }}
          />
        )
      )}

      <Stack direction="row" spacing={1} sx={{ mt: 3 }} flexWrap="wrap" useFlexGap>
        <Button component={RouterLink} to={`${t.basePath}/table`} variant="outlined">
          {done ? `${label} Final Table` : 'Back to Points Table'}
        </Button>
        <Button component={RouterLink} to={`${t.basePath}/nrr`} variant="outlined">
          NRR Calculator
        </Button>
        <Button component={RouterLink} to={`${t.basePath}/calculators`} variant="outlined">
          Qualification Calculator
        </Button>
      </Stack>
    </>
  );
}

// Never states a figure that isn't in the verified season data.
function metaDescription({ info, label, next, done, result, remaining, outcome }) {
  if (done && result) {
    const tail = outcome ? ` — ${outcome}.` : '.';
    return `${info.name} finished ${ordinal(result.position)} in ${label} with ${result.points} points and an NRR of ${formatNRR(result.nrr)}${tail} Qualification scenarios return for ${next}.`;
  }
  if (done) {
    return `${info.name}'s ${label} season page. The final league table is being confirmed against the official source; qualification scenarios return for ${next}. Free playoff and net run rate calculators anytime.`;
  }
  if (result) {
    return `How many wins ${info.name} need to qualify for the ${label} playoffs. Currently ${result.points} pts, NRR ${formatNRR(result.nrr)}, ${remaining} matches left.`;
  }
  return `${info.name} ${label} points, net run rate and playoff qualification scenarios.`;
}

function ordinal(n) {
  if (n == null) return '—';
  const v = Number(n);
  const suffix = v % 100 >= 11 && v % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][v % 10] || 'th';
  return `${v}${suffix}`;
}

function Stat({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Box>
  );
}
