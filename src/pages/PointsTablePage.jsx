import { Link as RouterLink } from 'react-router-dom';
import { Typography, Stack, Button, Box } from '@mui/material';
import Head from '../components/Head.jsx';
import PointsTable from '../components/PointsTable.jsx';
import ResultsPending from '../components/ResultsPending.jsx';
import FormatSummary from '../components/FormatSummary.jsx';
import { activeTournament as t, activeSeason as s } from '../config/tournaments.js';
import { isComplete, hasResults, standingsRows, seasonLabel, nextSeasonLabel } from '../utils/season.js';

export default function PointsTablePage() {
  const done = isComplete(s);
  const rows = standingsRows(t, s);
  const label = seasonLabel(t, s);

  return (
    <>
      <Head
        title={done ? `${label} Final Points Table` : `${t.short} Points Table — Standings`}
        description={
          done && hasResults(s)
            ? `${label} final league table: matches, wins, losses, points and net run rate for all ${t.teams.length} teams.`
            : done
              ? `${label} final league table — being confirmed against the official source. How ${t.short} points and net run rate work, plus free calculators that run year-round.`
              : `${t.short} standings: matches, wins, losses, points and net run rate. Top ${t.format.playoffSpots} qualify for the playoffs.`
        }
      />
      <Typography variant="h1" gutterBottom>
        {done ? `${label} Final Points Table` : `${t.short} Points Table`}
      </Typography>
      <Box sx={{ mb: 2 }}>
        {done ? (
          <FormatSummary tournament={t} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Top {t.format.playoffSpots} teams advance. Click a team for its
            qualification scenarios.
          </Typography>
        )}
      </Box>
      {hasResults(s) ? (
        <PointsTable
          rows={rows}
          basePath={t.basePath}
          playoffSpots={t.format.playoffSpots}
          qualifiedKey={done ? 'madePlayoffs' : null}
          ariaLabel={`${label} points table`}
        />
      ) : (
        <ResultsPending label={label} complete={done} />
      )}
      {done && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Live standings and per-team qualification scenarios return for{' '}
          {nextSeasonLabel(t, s)}.
        </Typography>
      )}
      <Stack
        direction="row"
        spacing={1}
        sx={{ mt: 3 }}
        flexWrap="wrap"
        useFlexGap
      >
        <Button component={RouterLink} to={`${t.basePath}/calculators`} variant="outlined">
          Open Qualify Calc
        </Button>
        <Button component={RouterLink} to={`${t.basePath}/nrr`} variant="outlined">
          Open NRR Calc
        </Button>
      </Stack>
    </>
  );
}
