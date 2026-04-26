import { useParams, Link as RouterLink, Navigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Stack,
  Button,
  Chip,
  Paper,
} from '@mui/material';
import Head from '../components/Head.jsx';
import QualificationCalculator from '../components/QualificationCalculator.jsx';
import { TOTAL_MATCHES } from '../utils/qualification.js';
import { formatNRR } from '../utils/nrr.js';
import teams from '../data/teams.json';

export default function TeamPage() {
  const { team } = useParams();
  const t = teams.find((x) => x.id === team);
  if (!t) return <Navigate to="/ipl/table" replace />;

  const remaining = Math.max(0, TOTAL_MATCHES - t.played);

  return (
    <>
      <Head
        title={`${t.name} (${t.short}) — IPL Playoff Qualification Scenarios`}
        description={`How many wins ${t.name} need to qualify for the IPL playoffs. Current: ${t.points} pts, NRR ${formatNRR(t.nrr)}, ${remaining} matches left.`}
      />
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap' }}>
        <Box sx={{ width: 12, height: 32, bgcolor: t.color, borderRadius: 0.5 }} />
        <Typography variant="h1">{t.name}</Typography>
        <Chip label={t.short} />
      </Stack>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
          <Stat label="Played" value={t.played} />
          <Stat label="Wins" value={t.wins} />
          <Stat label="Losses" value={t.losses} />
          <Stat label="Points" value={t.points} />
          <Stat label="NRR" value={formatNRR(t.nrr)} />
          <Stat label="Remaining" value={remaining} />
        </Stack>
      </Paper>
      <QualificationCalculator
        heading={`${t.short} qualification scenarios`}
        initial={{ points: t.points, remaining, nrr: t.nrr }}
      />
      <Stack direction="row" spacing={1} sx={{ mt: 3 }} flexWrap="wrap" useFlexGap>
        <Button component={RouterLink} to="/ipl/table" variant="outlined">
          Back to Points Table
        </Button>
        <Button component={RouterLink} to="/ipl/nrr" variant="outlined">
          NRR Calculator
        </Button>
        <Button component={RouterLink} to="/ipl/calculators" variant="outlined">
          Generic Qualify Calc
        </Button>
      </Stack>
    </>
  );
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
