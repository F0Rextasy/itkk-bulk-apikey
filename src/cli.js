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
 * Measured gates (2026-10-19, /api/status): register_enabled=true,
 * email_verification=true, turnstile_check=false, password_register=true,
 * checkin_enabled=false → e-mail-code sign-up, no captcha, HTTP-only.
 */
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
