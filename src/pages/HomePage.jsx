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
import teams from '../data/teams.json';

const tiles = [
  { to: '/ipl/calculators', title: 'Qualification Calculator', desc: 'Wins required to make the playoffs.' },
  { to: '/ipl/nrr', title: 'NRR Calculator', desc: 'Compute net run rate from scorecard inputs.' },
  { to: '/ipl', title: 'IPL Hub', desc: 'All IPL tools in one place.' },
];

const SUBHEAD = { fontSize: '1.35rem', fontWeight: 600, mb: 0.5 };

export default function HomePage() {
  const byStanding = [...teams].sort((a, b) =>
    b.points !== a.points ? b.points - a.points : b.nrr - a.nrr
  );

  return (
    <>
      <Head
        title="CricketFanSite — IPL Points Table, NRR & Qualification Calculator"
        description="Live IPL points table plus a playoff qualification calculator and net run rate calculator. Fast, mobile-friendly, no signup."
      />
      <Typography variant="h1" gutterBottom>
        Cricket tools, fast.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Tools-first IPL companion: the current points table, a playoff qualification
        calculator, and a net-run-rate calculator. Mobile-friendly. No accounts, no fluff.
      </Typography>

      {/* Standings — real content on the page, not just a link out */}
      <Typography variant="h2" sx={SUBHEAD}>
        IPL points table
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Top four advance to the playoffs. Tap a team for its qualification scenarios.
      </Typography>
      <PointsTable teams={teams} />
      <Box sx={{ mt: 1.5, mb: 5 }}>
        <Button component={RouterLink} to="/ipl/table" size="small">
          Full points table &amp; NRR →
        </Button>
      </Box>

      {/* Qualify grid — per-team links so every /ipl/qualify/<team> is reachable */}
      <Typography variant="h2" sx={SUBHEAD}>
        Can your team still qualify?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Per-team playoff scenarios — what each side needs from its remaining games.
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 5 }}>
        {byStanding.map((t) => (
          <Button
            key={t.id}
            component={RouterLink}
            to={`/ipl/qualify/${t.id}`}
            variant="outlined"
            size="small"
            title={`Can ${t.name} qualify?`}
            sx={{ borderLeft: `4px solid ${t.color}` }}
          >
            {t.short}
          </Button>
        ))}
      </Stack>

      {/* Tools */}
      <Typography variant="h2" sx={SUBHEAD}>
        More tools
      </Typography>
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        {tiles.map((t) => (
          <Grid item xs={12} sm={6} key={t.to}>
            <Card variant="outlined">
              <CardActionArea component={RouterLink} to={t.to}>
                <CardContent>
                  <Typography variant="h6">{t.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t.desc}
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
