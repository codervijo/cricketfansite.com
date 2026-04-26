import { Link as RouterLink } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Link,
  Box,
} from '@mui/material';
import { formatNRR } from '../utils/nrr.js';

function rankColor(idx) {
  return idx < 4 ? 'success' : 'default';
}

export default function PointsTable({ teams }) {
  const sorted = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.nrr - a.nrr;
  });

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="IPL points table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Team</TableCell>
            <TableCell align="right">P</TableCell>
            <TableCell align="right">W</TableCell>
            <TableCell align="right">L</TableCell>
            <TableCell align="right">Pts</TableCell>
            <TableCell align="right">NRR</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((t, idx) => (
            <TableRow key={t.id} hover>
              <TableCell>
                <Chip size="small" label={idx + 1} color={rankColor(idx)} />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 24, bgcolor: t.color, borderRadius: 0.5 }} />
                  <Link
                    component={RouterLink}
                    to={`/ipl/qualify/${t.id}`}
                    underline="hover"
                  >
                    {t.name}
                  </Link>
                </Box>
              </TableCell>
              <TableCell align="right">{t.played}</TableCell>
              <TableCell align="right">{t.wins}</TableCell>
              <TableCell align="right">{t.losses}</TableCell>
              <TableCell align="right">
                <strong>{t.points}</strong>
              </TableCell>
              <TableCell align="right">{formatNRR(t.nrr)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
