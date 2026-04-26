import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Stack,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { qualifyStatus, SAFE_POINTS, TOTAL_MATCHES } from '../utils/qualification.js';
import { formatNRR } from '../utils/nrr.js';

const statusSeverity = {
  qualified: 'success',
  'in-contention': 'info',
  'must-win-all': 'warning',
  eliminated: 'error',
};

export default function QualificationCalculator({ initial, heading = 'Playoff Qualification Calculator' }) {
  const [points, setPoints] = useState(initial?.points ?? 0);
  const [remaining, setRemaining] = useState(initial?.remaining ?? TOTAL_MATCHES);
  const [nrr, setNrr] = useState(initial?.nrr ?? 0);
  const [target, setTarget] = useState(SAFE_POINTS);

  const result = useMemo(
    () =>
      qualifyStatus({
        points: Number(points) || 0,
        remaining: Number(remaining) || 0,
        target: Number(target) || SAFE_POINTS,
      }),
    [points, remaining, target],
  );

  return (
    <Card variant="outlined">
      <CardContent>
        {heading && (
          <Typography variant="h2" gutterBottom>
            {heading}
          </Typography>
        )}
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ mb: 2 }}
        >
          <TextField
            label="Current points"
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            fullWidth
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Matches remaining"
            type="number"
            value={remaining}
            onChange={(e) => setRemaining(e.target.value)}
            fullWidth
            inputProps={{ min: 0, max: TOTAL_MATCHES }}
          />
          <TextField
            label="Current NRR (optional)"
            type="number"
            value={nrr}
            onChange={(e) => setNrr(e.target.value)}
            fullWidth
            inputProps={{ step: 0.001 }}
          />
          <TextField
            label="Target points"
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            fullWidth
            inputProps={{ min: 1 }}
          />
        </Stack>
        <Alert severity={statusSeverity[result.status]} sx={{ mb: 2 }}>
          {result.message}
        </Alert>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Stat
            label="Wins required"
            value={Number.isFinite(result.need) ? result.need : '—'}
          />
          <Stat label="Max possible points" value={result.max} />
          <Stat label="Current NRR" value={formatNRR(Number(nrr))} />
        </Box>
      </CardContent>
    </Card>
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
