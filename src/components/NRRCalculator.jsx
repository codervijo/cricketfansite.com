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
import { calculateNRR, formatNRR } from '../utils/nrr.js';

export default function NRRCalculator() {
  const [runsFor, setRunsFor] = useState('');
  const [oversFor, setOversFor] = useState('');
  const [runsAgainst, setRunsAgainst] = useState('');
  const [oversAgainst, setOversAgainst] = useState('');

  const nrr = useMemo(() => {
    if (!runsFor || !oversFor || !runsAgainst || !oversAgainst) return null;
    return calculateNRR({
      runsFor: Number(runsFor),
      oversFor,
      runsAgainst: Number(runsAgainst),
      oversAgainst,
    });
  }, [runsFor, oversFor, runsAgainst, oversAgainst]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h2" gutterBottom>
          Net Run Rate Calculator
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          NRR = (runs scored / overs faced) − (runs conceded / overs bowled).
          Enter overs in cricket notation (e.g. <code>19.5</code> = 19 overs, 5 balls).
        </Typography>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Runs scored (for)"
              type="number"
              value={runsFor}
              onChange={(e) => setRunsFor(e.target.value)}
              fullWidth
            />
            <TextField
              label="Overs faced (for)"
              type="number"
              value={oversFor}
              onChange={(e) => setOversFor(e.target.value)}
              fullWidth
              inputProps={{ step: 0.1 }}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Runs conceded (against)"
              type="number"
              value={runsAgainst}
              onChange={(e) => setRunsAgainst(e.target.value)}
              fullWidth
            />
            <TextField
              label="Overs bowled (against)"
              type="number"
              value={oversAgainst}
              onChange={(e) => setOversAgainst(e.target.value)}
              fullWidth
              inputProps={{ step: 0.1 }}
            />
          </Stack>
        </Stack>
        <Box sx={{ mt: 3 }}>
          {nrr == null ? (
            <Alert severity="info">Enter all four values to compute NRR.</Alert>
          ) : (
            <Alert severity={nrr >= 0 ? 'success' : 'warning'}>
              Net Run Rate: <strong>{formatNRR(nrr)}</strong>
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
