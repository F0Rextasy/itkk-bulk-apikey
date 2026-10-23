#!/usr/bin/env node
'use strict';
/**
 * itkk.lol (ITKK · 国模 API 中转) lane entry.
 *
 * The engine lives in `src/vendor/mint-cnbulk.js` (the lab keeps it at
 * `providers/_community/mint-cnbulk.js`, shared by the two CN panels of this
 * wave); this wrapper only pins the site's own coordinates so the lane can be
 * re-run with `node src/cli.js --count 100`.
 *
 * Requests go through your proxy list when one is provided (--pool <file> or
 * ITKK_PROXIES). Without a pool the tool connects directly.
 *
 * Measured gates (2026-10-21, /api/status): register_enabled=true,
 * email_verification=false (it was true on 2026-10-19 — the code gate is gone),
 * turnstile_check=false, password_register=true, checkin_enabled=false → HTTP-only
 * sign-up; the engine skips the mailbox wait while the code gate is off.
 */
const path = require('path');
const fs = require('fs');
/** Dead keys leave keys.txt and are parked here — repo root, like keys.txt. */
const KEYS_DEAD = process.env.ITKK_KEYS_DEAD || path.join(path.dirname(process.argv[1]), '..', 'keys-dead.txt');
/** key<TAB>reason<TAB>ISO date, one line per dead key; the engine calls this on a 401/403. */
global.__recordDeadKey = (key, reason) => {
  try { fs.appendFileSync(KEYS_DEAD, `${key}\t${String(reason).replace(/\s+/g, ' ').slice(0, 100)}\t${new Date().toISOString()}\n`); } catch (e) { /* diagnostics must never break the run */ }
};
const argv = process.argv.slice(2);
process.argv = [
  process.argv[0],
  __filename,
  '--name', 'itkk.lol',
  '--base', 'https://itkk.lol',
  '--tag', 'itkk',
  ...argv,
];
require('./vendor/mint-cnbulk.js');
