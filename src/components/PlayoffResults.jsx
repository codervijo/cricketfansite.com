import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { playoffMatches, loserOf, champion, formatDate } from '../utils/season.js';

// Playoff bracket, entirely from the season data file. Fields the file doesn't
// have yet (margins, some dates/venues) render as an em dash rather than a
// guess. Renders nothing at all if the season has no verified playoff matches.
export default function PlayoffResults({ tournament: t, season: s }) {
  const matches = playoffMatches(s);
  if (matches.length === 0) return null;

  const name = (id) => t.teams.find((team) => team.id === id)?.name ?? id;
  const short = (id) => t.teams.find((team) => team.id === id)?.short ?? id;
  const champ = champion(t, s);
  const anyDetail = matches.some((m) => m.date || m.venue);

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small" aria-label={`${t.short} ${s.year} playoff results`}>
          <TableHead>
            <TableRow>
              <TableCell>Match</TableCell>
              <TableCell>Teams</TableCell>
              <TableCell>Winner</TableCell>
              <TableCell>Margin</TableCell>
              {anyDetail && <TableCell>Date &amp; venue</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((m) => {
              const date = formatDate(m.date);
              return (
                <TableRow key={m.id} hover>
                  <TableCell>{m.label}</TableCell>
                  <TableCell>
                    {short(m.teams[0])} v {short(m.teams[1])}
                  </TableCell>
                  <TableCell>
                    <strong>{name(m.winner)}</strong>
                  </TableCell>
                  <TableCell>{m.margin || '—'}</TableCell>
                  {anyDetail && (
                    <TableCell>
                      {[date, m.venue].filter(Boolean).join(' · ') || '—'}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {champ && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <EmojiEventsIcon color="secondary" />
          <Typography variant="h3" sx={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Champions: {champ.name}
          </Typography>
        </Box>
      )}

      {matches.some((m) => !m.margin) && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Winning margins are being confirmed against the official scorecards.
        </Typography>
      )}
    </Box>
  );
}
