import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const links = [
  { to: '/ipl', label: 'IPL' },
  { to: '/ipl/table', label: 'Points Table' },
  { to: '/ipl/calculators', label: 'Qualify Calc' },
  { to: '/ipl/nrr', label: 'NRR Calc' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <AppBar position="sticky" color="primary" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            color: 'inherit',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          CricketFanSite
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {links.map((l) => (
            <Button key={l.to} component={RouterLink} to={l.to} color="inherit">
              {l.label}
            </Button>
          ))}
        </Box>

        <IconButton
          color="inherit"
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          onClick={() => setOpen(true)}
          aria-label="open menu"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 240 }} role="presentation" onClick={() => setOpen(false)}>
          <List>
            {links.map((l) => (
              <ListItem key={l.to} disablePadding>
                <ListItemButton component={RouterLink} to={l.to}>
                  <ListItemText primary={l.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
