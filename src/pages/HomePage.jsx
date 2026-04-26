import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material';
import Head from '../components/Head.jsx';

const tiles = [
  { to: '/ipl/table', title: 'IPL Points Table', desc: 'Live-style standings, top 4 highlighted.' },
  { to: '/ipl/calculators', title: 'Qualification Calculator', desc: 'Wins required to make the playoffs.' },
  { to: '/ipl/nrr', title: 'NRR Calculator', desc: 'Compute net run rate from scorecard inputs.' },
  { to: '/ipl', title: 'IPL Hub', desc: 'All IPL tools in one place.' },
];

export default function HomePage() {
  return (
    <>
      <Head
        title="CricketFanSite — IPL Points Table, NRR & Qualification Calculator"
        description="Free IPL tools: points table, playoff qualification calculator, and net run rate calculator. Fast, mobile-friendly, no signup."
      />
      <Typography variant="h1" gutterBottom>
        Cricket tools, fast.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Tools-first IPL companion: the points table, a playoff qualification
        calculator, and a net-run-rate calculator. Mobile-friendly. No accounts,
        no fluff.
      </Typography>
      <Grid container spacing={2}>
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
