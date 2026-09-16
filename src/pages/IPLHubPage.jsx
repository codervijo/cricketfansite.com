import { Link as RouterLink } from 'react-router-dom';
import { Typography, Stack, Button } from '@mui/material';
import Head from '../components/Head.jsx';
import { activeTournament as t, activeSeason as s } from '../config/tournaments.js';
import { isComplete, hasResults, seasonLabel, nextSeasonLabel } from '../utils/season.js';

export default function IPLHubPage() {
  const done = isComplete(s);
  const label = seasonLabel(t, s);

  return (
    <>
      <Head
        title={`${t.short} Hub — Tables, Calculators & Team Pages`}
        description={
          done && hasResults(s)
            ? `${label} final table, per-team season pages, and free playoff qualification and net run rate calculators that work year-round.`
            : done
              ? `Per-team ${label} season pages plus free playoff qualification and net run rate calculators that work year-round.`
              : `Everything ${t.short}: points table, playoff calculator, net run rate tool, and per-team qualification pages.`
        }
      />
      <Typography variant="h1" gutterBottom>
        {t.short} Hub
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {done
          ? `${label} is done — the calculators below still work for any league. Qualification scenarios return for ${nextSeasonLabel(t, s)}.`
          : 'Jump straight to a tool, or pick a team to see their qualification math.'}
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        sx={{ mb: 3 }}
      >
        <Button variant="contained" component={RouterLink} to={`${t.basePath}/table`}>
          {done ? 'Final Table' : 'Points Table'}
        </Button>
        <Button variant="contained" component={RouterLink} to={`${t.basePath}/calculators`}>
          Qualify Calc
        </Button>
        <Button variant="contained" component={RouterLink} to={`${t.basePath}/nrr`}>
          NRR Calc
        </Button>
      </Stack>
      <Typography variant="h2" gutterBottom>
        Team pages
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {t.teams.map((team) => (
          <Button
            key={team.id}
            variant="outlined"
            component={RouterLink}
            to={`${t.basePath}/qualify/${team.id}`}
          >
            {team.short}
          </Button>
        ))}
      </Stack>
    </>
  );
}
