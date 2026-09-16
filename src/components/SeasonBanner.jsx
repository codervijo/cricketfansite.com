import { Alert, Container } from '@mui/material';
import { activeTournament, activeSeason } from '../config/tournaments.js';
import { isComplete, isUpcoming, seasonLabel, nextSeasonLabel } from '../utils/season.js';

// Site-wide season-state notice. Renders nothing while a season is live.
// Deliberately carries no dates — only the season labels, which come from
// src/config/season.json.
export default function SeasonBanner() {
  const t = activeTournament;
  const s = activeSeason;

  let message = null;
  if (isComplete(s)) {
    message = `${seasonLabel(t, s)} is complete — ${nextSeasonLabel(t, s)} tools return before the season.`;
  } else if (isUpcoming(s)) {
    message = `${seasonLabel(t, s)} hasn't started yet — the calculators below work year-round.`;
  }
  if (!message) return null;

  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      <Alert severity="info" variant="outlined">
        {message}
      </Alert>
    </Container>
  );
}
