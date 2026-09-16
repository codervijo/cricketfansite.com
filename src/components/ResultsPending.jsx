import { Alert, AlertTitle } from '@mui/material';

// Shown wherever a season's numbers would go but the season data file has not
// been filled and verified yet. A labelled gap, never a guess.
export default function ResultsPending({ label, complete = false }) {
  return (
    <Alert severity="warning" variant="outlined">
      <AlertTitle>
        {label} {complete ? 'final table' : 'table'} not published here yet
      </AlertTitle>
      {complete
        ? 'The final standings are being checked against the official source and will appear once confirmed.'
        : 'The standings will appear here once the season data is in place.'}{' '}
      The calculators work year-round in the meantime.
    </Alert>
  );
}
