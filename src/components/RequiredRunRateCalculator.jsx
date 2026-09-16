import { useMemo, useState } from 'react';
import { Card, CardContent, TextField, Stack, Typography, Alert, Box } from '@mui/material';
import { requiredRunRate, ballsRemaining, formatRate } from '../utils/nrr.js';

export default function RequiredRunRateCalculator() {
  const [target, setTarget] = useState('');
  const [scored, setScored] = useState('');
  const [oversRemaining, setOversRemaining] = useState('');

  const result = useMemo(() => {
    if (!target || !oversRemaining) return null;
    const rate = requiredRunRate({
      target: Number(target),
      scored: Number(scored) || 0,
      oversRemaining,
    });
    if (rate == null) return null;
    return {
      rate,
      needed: Math.max(0, Number(target) - (Number(scored) || 0)),
      balls: ballsRemaining(oversRemaining),
    };
  }, [target, scored, oversRemaining]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Required run rate = runs still needed ÷ overs remaining. The target is
          the total the chasing side has to reach — one more than the score it is
          chasing.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Target"
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            fullWidth
          />
          <TextField
            label="Runs scored so far"
            type="number"
            value={scored}
            onChange={(e) => setScored(e.target.value)}
            fullWidth
          />
          <TextField
            label="Overs remaining"
            type="number"
            value={oversRemaining}
            onChange={(e) => setOversRemaining(e.target.value)}
            fullWidth
            inputProps={{ step: 0.1 }}
          />
        </Stack>
        <Box sx={{ mt: 3 }}>
          {result == null ? (
            <Alert severity="info">
              Enter a target and the overs remaining to compute the required rate.
            </Alert>
          ) : (
            <Alert severity={result.rate > 12 ? 'warning' : 'success'}>
              Required run rate: <strong>{formatRate(result.rate)}</strong> — {result.needed}{' '}
              runs off {result.balls} balls.
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
