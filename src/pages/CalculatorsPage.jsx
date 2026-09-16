import { Link as RouterLink } from 'react-router-dom';
import { Typography, Stack, Button, Box, Link } from '@mui/material';
import Head from '../components/Head.jsx';
import QualificationCalculator from '../components/QualificationCalculator.jsx';
import { activeTournament as t, activeSeason as s } from '../config/tournaments.js';
import { isComplete, seasonLabel } from '../utils/season.js';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Playoff Qualification Calculator',
  url: 'https://cricketfansite.com/ipl/calculators',
  applicationCategory: 'SportsApplication',
  operatingSystem: 'Any (web browser)',
  browserRequirements: 'Requires JavaScript',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function CalculatorsPage() {
  const done = isComplete(s);

  return (
    <>
      <Head
        title={`${t.short} Playoff Qualification Calculator`}
        description={`Enter points, matches remaining and a target threshold to see how many wins a team needs to reach the playoffs. Works for any ${t.format.pointsPerWin}-points-a-win league. Free, no signup.`}
        jsonLd={jsonLd}
      />
      <Typography variant="h1" gutterBottom>
        Playoff Qualification Calculator
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {done ? (
          <>
            Works year-round for any league that awards {t.format.pointsPerWin} points
            a win. Defaults match the {t.short} league stage ({t.format.matchesPerTeam}{' '}
            matches, top {t.format.playoffSpots} advance); change them for any other
            competition. For the {seasonLabel(t, s)} outcome, see the{' '}
            <Link component={RouterLink} to={`${t.basePath}/table`} underline="hover">
              final points table
            </Link>
            .
          </>
        ) : (
          <>
            Generic version — for a specific team, see the{' '}
            <Link component={RouterLink} to={`${t.basePath}/table`} underline="hover">
              points table
            </Link>{' '}
            and click a team.
          </>
        )}
      </Typography>
      <Box sx={{ mb: 3 }}>
        <QualificationCalculator format={t.format} />
      </Box>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button component={RouterLink} to={`${t.basePath}/table`} variant="outlined">
          {done ? 'View Final Table' : 'View Points Table'}
        </Button>
        <Button component={RouterLink} to={`${t.basePath}/nrr`} variant="outlined">
          NRR Calculator
        </Button>
      </Stack>
    </>
  );
}
