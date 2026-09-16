import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Stack, Button, Box, Tabs, Tab, Paper, Divider } from '@mui/material';
import Head from '../components/Head.jsx';
import NRRCalculator from '../components/NRRCalculator.jsx';
import RunRateCalculator from '../components/RunRateCalculator.jsx';
import RequiredRunRateCalculator from '../components/RequiredRunRateCalculator.jsx';
import { activeTournament as t } from '../config/tournaments.js';

const MODES = [
  { key: 'nrr', label: 'Net Run Rate' },
  { key: 'rr', label: 'Run Rate' },
  { key: 'rrr', label: 'Required Run Rate' },
];

// Single source for the FAQ: rendered on the page AND serialised into the
// FAQPage JSON-LD below, so the structured data can never claim a question the
// page doesn't answer.
const FAQ = [
  {
    q: 'How is net run rate calculated?',
    a: 'Net run rate is the run rate a team scores at minus the run rate it concedes: (runs scored ÷ overs faced) − (runs conceded ÷ overs bowled). For a league table it uses the totals across every match played, not the average of each match’s NRR.',
  },
  {
    q: 'How do all-out innings count toward overs?',
    a: 'If a team is bowled out before using its full quota, the full quota is used in the calculation, not the overs actually faced. A side dismissed for 120 in 17.2 overs of a 20-over match counts as 120 runs from 20 overs. The same applies to the bowling side’s figures when it dismisses the opposition early.',
  },
  {
    q: 'Why is 19.5 overs not 19.5 in the maths?',
    a: 'Overs are written in a base-six notation: the digit after the point is balls, not tenths. 19.5 overs means 19 overs and 5 balls, which is 19.833 overs for arithmetic. The calculators on this page convert it for you.',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Net Run Rate Calculator',
    url: 'https://cricketfansite.com/ipl/nrr',
    applicationCategory: 'SportsApplication',
    operatingSystem: 'Any (web browser)',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  },
];

export default function NRRCalculatorPage() {
  const [mode, setMode] = useState(0);

  return (
    <>
      <Head
        title="Net Run Rate Calculator (NRR) — Run Rate & Required Run Rate"
        description="Calculate net run rate, run rate and required run rate for any cricket match or league. Handles cricket overs notation (19.5 = 19 overs, 5 balls) and all-out innings. Free, no signup."
        jsonLd={jsonLd}
      />
      <Typography variant="h1" gutterBottom>
        Net Run Rate Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Three calculators in one: season or match net run rate, a plain run rate,
        and the rate a side needs in a chase. Works for any limited-overs
        competition — T20 leagues, ODIs, domestic one-day cups.
      </Typography>

      <Paper variant="outlined" sx={{ mb: 1 }}>
        <Tabs
          value={mode}
          onChange={(e, v) => setMode(v)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Calculator mode"
        >
          {MODES.map((m, i) => (
            <Tab
              key={m.key}
              label={m.label}
              id={`calc-tab-${i}`}
              aria-controls={`calc-panel-${i}`}
            />
          ))}
        </Tabs>
      </Paper>
      {MODES.map((m, i) => (
        <Box
          key={m.key}
          role="tabpanel"
          hidden={mode !== i}
          id={`calc-panel-${i}`}
          aria-labelledby={`calc-tab-${i}`}
          sx={{ mb: 4 }}
        >
          {mode === i && (
            <>
              {m.key === 'nrr' && <NRRCalculator heading={null} />}
              {m.key === 'rr' && <RunRateCalculator />}
              {m.key === 'rrr' && <RequiredRunRateCalculator />}
            </>
          )}
        </Box>
      ))}

      <Divider sx={{ my: 4 }} />

      <Typography variant="h2" gutterBottom>
        Run rate
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Run rate is runs divided by overs faced — how fast a side is scoring.
        It describes one innings; net run rate compares two.
      </Typography>
      <Example
        title="Worked example"
        lines={[
          'A side finishes on 168 for 6 from its 20 overs.',
          '168 ÷ 20 = 8.40 runs per over.',
        ]}
      />

      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        Required run rate
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Required run rate is the rate the chasing side still needs: runs
        outstanding divided by overs remaining. It moves after every ball, which
        is why it is usually quoted alongside the balls left.
      </Typography>
      <Example
        title="Worked example"
        lines={[
          'Chasing 181, a team is 90 for 2 after 10 overs.',
          '181 − 90 = 91 runs needed from the remaining 10 overs (60 balls).',
          '91 ÷ 10 = 9.10 required run rate.',
        ]}
      />

      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        Net run rate
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Net run rate is the separator when teams finish level on points. Across a
        season it takes every run scored and conceded, and every over faced and
        bowled, as two running totals.
      </Typography>
      <Example
        title="Worked example"
        lines={[
          'Over a season a team scores 1,800 runs from 200 overs — a run rate of 9.00.',
          'It concedes 1,700 runs from 200 overs — 8.50.',
          '9.00 − 8.50 = +0.500 net run rate.',
        ]}
      />

      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        FAQ
      </Typography>
      <Stack spacing={2.5} sx={{ mb: 4 }}>
        {FAQ.map((item) => (
          <Box key={item.q}>
            <Typography variant="h3" sx={{ fontSize: '1.05rem', fontWeight: 600, mb: 0.5 }}>
              {item.q}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {item.a}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button component={RouterLink} to={`${t.basePath}/table`} variant="outlined">
          Points Table
        </Button>
        <Button component={RouterLink} to={`${t.basePath}/calculators`} variant="outlined">
          Qualification Calculator
        </Button>
      </Stack>
    </>
  );
}

function Example({ title, lines }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {lines.map((line) => (
        <Typography key={line} variant="body2" sx={{ mt: 0.5 }}>
          {line}
        </Typography>
      ))}
    </Paper>
  );
}
