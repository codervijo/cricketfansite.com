import { Link as RouterLink } from 'react-router-dom';
import { Typography, Stack, Button } from '@mui/material';
import Head from '../components/Head.jsx';
import teams from '../data/teams.json';

export default function IPLHubPage() {
  return (
    <>
      <Head
        title="IPL Hub — Tables, Calculators & Team Pages"
        description="Everything IPL: points table, playoff calculator, net run rate tool, and per-team qualification pages."
      />
      <Typography variant="h1" gutterBottom>
        IPL Hub
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Jump straight to a tool, or pick a team to see their qualification math.
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        sx={{ mb: 3 }}
      >
        <Button variant="contained" component={RouterLink} to="/ipl/table">
          Points Table
        </Button>
        <Button variant="contained" component={RouterLink} to="/ipl/calculators">
          Qualify Calc
        </Button>
        <Button variant="contained" component={RouterLink} to="/ipl/nrr">
          NRR Calc
        </Button>
      </Stack>
      <Typography variant="h2" gutterBottom>
        Team pages
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {teams.map((t) => (
          <Button
            key={t.id}
            variant="outlined"
            component={RouterLink}
            to={`/ipl/qualify/${t.id}`}
          >
            {t.short}
          </Button>
        ))}
      </Stack>
    </>
  );
}
