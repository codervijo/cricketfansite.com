import { useMemo, useState } from 'react';
import { Card, CardContent, TextField, Stack, Typography, Alert, Box } from '@mui/material';
import { runRate, formatRate, oversToDecimal } from '../utils/nrr.js';

export default function RunRateCalculator() {
  const [runs, setRuns] = useState('');
  const [overs, setOvers] = useState('');

  const rate = useMemo(() => {
    if (!runs || !overs) return null;
    return runRate({ runs: Number(runs), overs });
  }, [runs, overs]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Run rate = runs ÷ overs faced. Enter overs in cricket notation
          (e.g. <code>18.3</code> = 18 overs, 3 balls).
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Runs scored"
            type="number"
            value={runs}
            onChange={(e) => setRuns(e.target.value)}
            fullWidth
          />
          <TextField
            label="Overs faced"
            type="number"
            value={overs}
            onChange={(e) => setOvers(e.target.value)}
            fullWidth
            inputProps={{ step: 0.1 }}
          />
        </Stack>
        <Box sx={{ mt: 3 }}>
          {rate == null ? (
            <Alert severity="info">Enter runs and overs to compute the run rate.</Alert>
          ) : (
            <Alert severity="success">
              Run rate: <strong>{formatRate(rate)}</strong> runs per over
              {overs && ` (${oversToDecimal(overs).toFixed(2)} overs)`}
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
