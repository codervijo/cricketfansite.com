import { Link as RouterLink } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import Head from '../components/Head.jsx';

export default function NotFoundPage() {
  return (
    <>
      <Head
        title="Page not found · CricketFanSite"
        description="The page you were looking for doesn't exist."
      />
      <Typography variant="h1" gutterBottom>
        404 — Not found
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        That page doesn't exist.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Go home
      </Button>
    </>
  );
}
