import { Box, Container, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', py: 3, mt: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} CricketFanSite ·{' '}
          <Link component={RouterLink} to="/ipl/table" underline="hover">
            Table
          </Link>{' '}
          ·{' '}
          <Link component={RouterLink} to="/ipl/calculators" underline="hover">
            Qualify
          </Link>{' '}
          ·{' '}
          <Link component={RouterLink} to="/ipl/nrr" underline="hover">
            NRR
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}
