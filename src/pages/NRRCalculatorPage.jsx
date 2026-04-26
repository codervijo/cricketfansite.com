import { Link as RouterLink } from 'react-router-dom';
import { Typography, Stack, Button, Box } from '@mui/material';
import Head from '../components/Head.jsx';
import NRRCalculator from '../components/NRRCalculator.jsx';

export default function NRRCalculatorPage() {
  return (
    <>
      <Head
        title="Net Run Rate Calculator — IPL & T20"
        description="Calculate net run rate from runs scored, overs faced, runs conceded, and overs bowled. Cricket-style overs (e.g. 19.5) handled correctly."
      />
      <Typography variant="h1" gutterBottom>
        NRR Calculator
      </Typography>
      <Box sx={{ mb: 3 }}>
        <NRRCalculator />
      </Box>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button component={RouterLink} to="/ipl/table" variant="outlined">
          Points Table
        </Button>
        <Button component={RouterLink} to="/ipl/calculators" variant="outlined">
          Qualify Calculator
        </Button>
      </Stack>
    </>
  );
}
