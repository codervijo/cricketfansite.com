import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Button,
  Stack,
  Box,
} from '@mui/material';
import Head from '../components/Head.jsx';
import PointsTable from '../components/PointsTable.jsx';
import ResultsPending from '../components/ResultsPending.jsx';
import FormatSummary from '../components/FormatSummary.jsx';
import { activeTournament as t, activeSeason as s } from '../config/tournaments.js';
import { isComplete, hasResults, standingsRows, seasonLabel, nextSeasonLabel } from '../utils/season.js';

const tiles = [
  { to: '/ipl/calculators', title: 'Qualification Calculator', desc: 'Wins required to make the playoffs.' },
  { to: '/ipl/nrr', title: 'NRR Calculator', desc: 'Compute net run rate from scorecard inputs.' },
  { to: '/ipl', title: 'IPL Hub', desc: 'All IPL tools in one place.' },
];

const SUBHEAD = { fontSize: '1.35rem', fontWeight: 600, mb: 0.5 };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CricketFanSite',
  url: 'https://cricketfansite.com',
  description:
    'Free cricket tools: points tables, a playoff qualification calculator and a net run rate calculator.',
};

export default function HomePage() {
  const done = isComplete(s);
  const rows = standingsRows(t, s);
  const label = seasonLabel(t, s);

  return (
    <>
      <Head
        title={
          done
            ? `CricketFanSite — ${label} Final Table, NRR & Qualification Calculator`
            : `CricketFanSite — ${t.short} Points Table, NRR & Qualification Calculator`
        }
        description={
          done && hasResults(s)
            ? `${label} final points table plus free playoff qualification and net run rate calculators. Fast, mobile-friendly, no signup.`
            : `Free playoff qualification and net run rate calculators for ${t.short} and any T20 league. Fast, mobile-friendly, no signup.`
        }
        jsonLd={jsonLd}
      />
      <Typography variant="h1" gutterBottom>
        Cricket tools, fast.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Tools-first {t.short} companion: the league table, a playoff qualification
        calculator, and a net-run-rate calculator. Mobile-friendly. No accounts, no fluff.
      </Typography>

      {/* Standings — real content on the page, not just a link out */}
      <Typography variant="h2" sx={SUBHEAD}>
        {done ? `${label} final points table` : `${t.short} points table`}
      </Typography>
      <Box sx={{ mb: 1.5 }}>
        {done ? (
          <FormatSummary tournament={t} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Top {t.format.playoffSpots} advance to the playoffs. Tap a team for its
            qualification scenarios.
          </Typography>
        )}
      </Box>
      {hasResults(s) ? (
        <PointsTable
          rows={rows}
          basePath={t.basePath}
          playoffSpots={t.format.playoffSpots}
          qualifiedKey={done ? 'madePlayoffs' : null}
          ariaLabel={`${label} points table`}
        />
      ) : (
        <ResultsPending label={label} complete={done} />
      )}
      <Box sx={{ mt: 1.5, mb: 5 }}>
        <Button component={RouterLink} to={`${t.basePath}/table`} size="small">
          {done ? 'Full final table' : 'Full points table'} &amp; NRR →
        </Button>
      </Box>

      {/* Team grid — per-team links so every /ipl/qualify/<team> stays reachable */}
      <Typography variant="h2" sx={SUBHEAD}>
        {done ? `${label} team pages` : 'Can your team still qualify?'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {done
          ? `How each side's ${label} season finished. Qualification scenarios return for ${nextSeasonLabel(t, s)}.`
          : 'Per-team playoff scenarios — what each side needs from its remaining games.'}
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 5 }}>
        {t.teams.map((team) => (
          <Button
            key={team.id}
            component={RouterLink}
            to={`${t.basePath}/qualify/${team.id}`}
            variant="outlined"
            size="small"
            title={done ? `${team.name} — ${label}` : `Can ${team.name} qualify?`}
            sx={{ borderLeft: `4px solid ${team.color}` }}
          >
            {team.short}
          </Button>
        ))}
      </Stack>

      {/* Tools */}
      <Typography variant="h2" sx={SUBHEAD}>
        More tools
      </Typography>
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        {tiles.map((tile) => (
          <Grid item xs={12} sm={6} key={tile.to}>
            <Card variant="outlined">
              <CardActionArea component={RouterLink} to={tile.to}>
                <CardContent>
                  <Typography variant="h6">{tile.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tile.desc}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
