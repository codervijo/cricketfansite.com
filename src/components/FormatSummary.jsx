import { Typography } from '@mui/material';

// Evergreen, structural description of a tournament's league stage, generated
// from its format config. True regardless of season state or results.
export default function FormatSummary({ tournament }) {
  const f = tournament.format;
  return (
    <Typography variant="body2" color="text.secondary">
      How the {tournament.short} league table works: {f.matchesPerTeam} league
      matches per team, {f.pointsPerWin} points for a win,{' '}
      {f.pointsPerNoResult} for a no-result, and the top {f.playoffSpots} advance
      to the playoffs. Teams level on points are separated by net run rate.
    </Typography>
  );
}
