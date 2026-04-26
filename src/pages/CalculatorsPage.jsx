import { Link as RouterLink } from 'react-router-dom';
import { Typography, Stack, Button, Box, Link } from '@mui/material';
import Head from '../components/Head.jsx';
import QualificationCalculator from '../components/QualificationCalculator.jsx';

export default function CalculatorsPage() {
  return (
    <>
      <Head
        title="IPL Playoff Qualification Calculator"
        description="Enter current points, matches remaining, and target threshold to see how many wins your IPL team needs to qualify for the playoffs."
      />
      <Typography variant="h1" gutterBottom>
        Playoff Qualification Calculator
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Generic version — for a specific team, see the{' '}
        <Link component={RouterLink} to="/ipl/table" underline="hover">
          points table
        </Link>{' '}
        and click a team.
      </Typography>
      <Box sx={{ mb: 3 }}>
        <QualificationCalculator />
      </Box>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button component={RouterLink} to="/ipl/table" variant="outlined">
          View Points Table
        </Button>
        <Button component={RouterLink} to="/ipl/nrr" variant="outlined">
          NRR Calculator
        </Button>
      </Stack>
    </>
  );
}
