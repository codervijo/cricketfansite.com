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

// Tournament-agnostic standings table. `rows` are already ordered by the
// caller; `playoffSpots` drives the qualified-rank highlight, and
// `qualifiedKey` lets a finished season highlight who actually advanced
// instead of inferring it from rank.
export default function PointsTable({
  rows,
  basePath,
  playoffSpots = 0,
  qualifiedKey = null,
  ariaLabel = 'Points table',
}) {
  const qualified = (row, idx) =>
    qualifiedKey ? row[qualifiedKey] === true : playoffSpots > 0 && idx < playoffSpots;

  // Only shown when the competition actually had abandoned matches — otherwise
  // W + L = P and the column is noise.
  const showNoResults = rows.some((r) => Number(r.noResults) > 0);

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label={ariaLabel}>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Team</TableCell>
            <TableCell align="right">P</TableCell>
            <TableCell align="right">W</TableCell>
            <TableCell align="right">L</TableCell>
            {showNoResults && <TableCell align="right">NR</TableCell>}
            <TableCell align="right">Pts</TableCell>
            <TableCell align="right">NRR</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((t, idx) => (
            <TableRow key={t.id} hover>
              <TableCell>
                <Chip
                  size="small"
                  label={t.position ?? idx + 1}
                  color={qualified(t, idx) ? 'success' : 'default'}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 24, bgcolor: t.color, borderRadius: 0.5 }} />
                  <Link
                    component={RouterLink}
                    to={`${basePath}/qualify/${t.id}`}
                    underline="hover"
                  >
                    {t.name}
                  </Link>
                </Box>
              </TableCell>
              <TableCell align="right">{t.played}</TableCell>
              <TableCell align="right">{t.wins}</TableCell>
              <TableCell align="right">{t.losses}</TableCell>
              {showNoResults && <TableCell align="right">{t.noResults ?? 0}</TableCell>}
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
