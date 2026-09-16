import { Outlet } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import SeasonBanner from '../components/SeasonBanner.jsx';

export default function MainLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <SeasonBanner />
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, flex: 1 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
}
