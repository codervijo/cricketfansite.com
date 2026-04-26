import { Link as RouterLink } from 'react-router-dom';
import { Typography, Stack, Button } from '@mui/material';
import Head from '../components/Head.jsx';
import PointsTable from '../components/PointsTable.jsx';
import teams from '../data/teams.json';

export default function PointsTablePage() {
  return (
    <>
      <Head
        title="IPL Points Table — Latest Standings"
        description="IPL standings: matches, wins, losses, points, and net run rate. Top 4 qualify for the playoffs."
      />
      <Typography variant="h1" gutterBottom>
        IPL Points Table
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Top four teams advance. Click a team for its qualification scenarios.
      </Typography>
      <PointsTable teams={teams} />
      <Stack
        direction="row"
        spacing={1}
        sx={{ mt: 3 }}
        flexWrap="wrap"
        useFlexGap
      >
        <Button component={RouterLink} to="/ipl/calculators" variant="outlined">
          Open Qualify Calc
        </Button>
        <Button component={RouterLink} to="/ipl/nrr" variant="outlined">
          Open NRR Calc
        </Button>
      </Stack>
    </>
  );
}
