#!/usr/bin/env node
'use strict';
/**
 * CN-panel bulk mint (New API forks, no turnstile; the e-mail code is read only when
 * the panel asks for it — `email_verification=false` skips the mailbox wait).
 *
 *   node providers/_community/mint-cnbulk.js --name itkk.lol --base https://itkk.lol \
 *        --tag itkk --count 100 --conc 6 [--model deepseek-v4.1-flash] [--checkin]
 *   node src/cli.js --help       # the published entry: name/base/tag are pinned
 *
 * Why this engine exists next to mint-newapi.js / mint-newapi-pinned.js:
 *   1. it runs accounts **concurrently** (per-account exit, one exit held for the
 *      whole account) because the wave target (2×100 keys) is unreachable at the
 *      ~50 s/account serial pace;
 *   2. it reads the code from Emailnator's shared gmail pool and only accepts a
 *      mail that arrived after `sendCode` (a recycled box carries the previous
 *      tenant's mail — measured 2026-10-15/18: that produces exactly
 *      "Verification code is incorrect or has expired");
 *   3. a key reaches `keys.txt` only after the panel's own relay answers
 *      `POST /v1/chat/completions` with 200 + non-empty content (chat-200 gate).
 *
 * Requests go through your proxy list when one is provided (--pool <file> or
 * ITKK_PROXIES). Without a pool the tool connects directly.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..', '..');
const { parseProxy, createAgent } = require('./proxy.js');
const emailnator = require('./emailnator.js');
const { TempTf } = require('./temptf.js');

// ---------------------------------------------------------------- cli

const argv = process.argv.slice(2);
const one = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
};
const many = (name) => {
  const out = [];
  for (let i = 0; i < argv.length; i++) if (argv[i] === `--${name}` && argv[i + 1]) out.push(argv[i + 1]);
  return out;
};
const has = (name) => argv.includes(`--${name}`);

const NAME = one('name');
const BASE = (one('base') || '').replace(/\/$/, '');
const HOST = BASE ? new URL(BASE).host : '';
const TAG = one('tag', (NAME || 'cn').replace(/[^a-z0-9]/gi, '').slice(0, 10));
const COUNT = parseInt(one('count', '5'), 10);
const CONC = Math.max(1, Math.min(12, parseInt(one('conc', '4'), 10)));
const MODEL = one('model', 'deepseek-v4.1-flash');
// Mailbox backend. `emailnator` = shared recycled gmails (fast, but a box can be
// blocked or already spent at the panel's SMTP); `temptf` = private plus-aliases
// on real Microsoft mailboxes (`river-bulk-apikey/src/temptf.js`), which is what
// this lane switches to when the panel stops delivering to gmail.
const MAIL_MODE = one('mail', 'emailnator');
const FALLBACK_MODELS = one('fallback-models', 'deepseek-v4.1-flash,deepseek-chat,glm-5.3,gpt-5.6-luna,kimi-k3')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const CHECKIN = has('checkin');
const CODE_WAIT_MS = parseInt(one('code-wait', '180000'), 10);
const POLL_MS = parseInt(one('poll-ms', '4000'), 10);
const REPORT = path.join(ROOT, 'proxy-lab', 'out', one('report', 'cn4-mint-a-20261019.md'));
const BUDGET_MS = parseInt(one('budget', '2400'), 10) * 1000;

if (has('help') || has('h')) {
  console.log(`itkk-bulk-apikey — mint ITKK (itkk.lol) accounts, one key each, verified by a live chat call.

  node src/cli.js --count 100 --conc 6 --model deepseek-v4.1-flash
  node src/cli.js --help

  --count N        accounts to attempt                              [5]
  --conc N         parallel accounts (max 12)                       [4]
  --model <id>     model the gate prefers          [deepseek-v4.1-flash]
  --pool <file>    exit list, one per line, optional (env ITKK_PROXIES)
  --checkin        call the panel's daily check-in per account
  --budget SEC     hard stop for the whole run                   [2400]
  --mail <mode>    mailbox backend: emailnator | temptf     [emailnator]

Requests go through your proxy list when one is provided (--pool <file> or
ITKK_PROXIES). Without a pool the tool connects directly.`);
  process.exit(0);
}
if (!NAME || !BASE) {
  console.error('usage: --name <provider-dir> --base <https://host> [--count N] [--conc N] [--model id]  (--help)');
  process.exit(2);
}

const DIR = path.join(ROOT, 'providers', NAME);
fs.mkdirSync(path.join(DIR, 'out'), { recursive: true });
const KEYS = path.join(DIR, 'keys.txt');
const ACCOUNTS = path.join(DIR, 'accounts.json');
const LOG = path.join(DIR, 'out', `mint-${new Date().toISOString().slice(0, 10)}.log`);

const nowIso = () => new Date().toISOString();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const randHex = (n) => crypto.randomBytes(Math.ceil(n / 2)).toString('hex').slice(0, n);
const maskExit = (l) => (l ? String(l).replace(/\/\/[^@/]+@/, '//***@') : 'direct');

let logStream = null;
function log(msg) {
  const line = `[${nowIso().slice(11, 19)}] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(LOG, line + '\n');
  } catch (e) {}
}
function report(msg) {
  try {
    fs.appendFileSync(REPORT, `${msg}\n`);
  } catch (e) {}
}

// ---------------------------------------------------------------- exits

/** Pool files are written by several screeners: `302 http://ip:port  # exit=…`,
 *  `http://user:pass@ip:port  # …`. Only the URL token is a proxy. */
const POOL_FILES = [
  path.join(ROOT, 'proxy-lab', 'out', 'exits-emergency-panel-live.txt'),
  path.join(ROOT, 'proxy-lab', 'out', 'proxies-emergency.live.txt'),
  path.join(ROOT, 'proxy-lab', 'out', 'proxies-emergency.txt'),
  path.join(ROOT, 'proxy-lab', 'out', 'chrome-safe-exits.txt'),
  path.join(ROOT, 'proxy-lab', 'out', 'captcha-exits-live.txt'),
  ...many('pool').map((p) => (path.isAbsolute(p) ? p : path.join(ROOT, p))),
  // The launcher hands the list it asked for over as `ITKK_PROXIES` (an absent
  // file is not an error: the run then goes direct).
  ...(process.env.ITKK_PROXIES ? [path.resolve(ROOT, process.env.ITKK_PROXIES)] : []),
];

const URL_RE = /(?:https?|socks5h?):\/\/(?:[^@\s/#]+@)?[A-Za-z0-9.\-]+:\d{2,5}/g;
function loadExits() {
  const seen = new Set();
  const out = [];
  const files = [...POOL_FILES, 'warp'];
  for (const f of files) {
    if (f === 'warp') {
      // Operator rail: local proxy endpoint, always present, never our own address.
      // It must go through parseProxy like every other line — a hand-built object
      // has no `host`/`port`, and `createAgent` then answers
      // "The \"options\" or \"port\" or \"path\" argument must be specified",
      // which killed the first two attempts of the itkk run (2026-10-19).
      const wp = parseProxy('socks5://127.0.0.1:40000');
      if (wp) {
        wp.warp = true;
        wp.line = 'socks5://127.0.0.1:40000';
        wp.connectTimeoutMs = 9000;
        wp.timeoutMs = 35000;
        out.push(wp);
      }
      continue;
    }
    let text;
    try {
      text = fs.readFileSync(f, 'utf8');
    } catch (e) {
      continue;
    }
    for (const hit of text.match(URL_RE) || []) {
      const p = parseProxy(hit);
      if (!p) continue;
      const id = `${p.host}:${p.port}`;
      if (seen.has(id)) continue;
      seen.add(id);
      p.line = hit;
      p.connectTimeoutMs = 9000;
      p.timeoutMs = 35000;
      out.push(p);
    }
  }
  // Emergency-screened files come first, but their lines die within minutes; the
  // whole list is shuffled once so concurrent workers do not all start on line 1.
  out.sort(() => Math.random() - 0.5);
  return out;
}

// Rotating cursor shared by every worker: each account gets its own exit.
let cursor = 0;
function nextExit(exits) {
  for (let i = 0; i < exits.length; i++) {
    const p = exits[cursor++ % exits.length];
    if (p) return p;
  }
  return null; // the `null` direct sentinel, or a list with no usable exit
}

/** No usable exit in the list = DIRECT mode: the single `null` sentinel. */
const isDirect = (exits) => !exits.some(Boolean);

// `proxy` is the exit a call runs on — or `null` for DIRECT mode (no pool
// loaded), when the request leaves on this machine's own line. With an exit,
// one agent per attempt keeps a single upstream address for the whole request.
function req(proxy, url, { method = 'GET', headers = {}, body = null, timeoutMs = 40000, retries = 1 } = {}) {
  const run = () =>
    new Promise((resolve, reject) => {
      const lib = url.startsWith('https:') ? require('https') : require('http');
      const u = new URL(url);
      const payload = body == null ? null : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));
      const h = { 'accept-language': 'en-US,en;q=0.9', ...headers };
      if (payload && !Object.keys(h).some((k) => k.toLowerCase() === 'content-type')) h['Content-Type'] = 'application/json';
      if (payload) h['Content-Length'] = payload.length;
      // DIRECT mode (`proxy === null`): no tunnel agent on the options at all.
      const opts = { method, host: u.hostname, port: u.port || (u.protocol === 'https:' ? 443 : 80), path: u.pathname + u.search, headers: h };
      if (proxy) opts.agent = createAgent({ ...proxy, connectTimeoutMs: proxy.connectTimeoutMs || 9000, timeoutMs });
      const r = lib.request(opts, (res) => {
        let text = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (text += c));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(text);
          } catch (e) {}
          resolve({ status: res.statusCode, headers: res.headers, text, json });
        });
      });
      r.setTimeout(timeoutMs, () => r.destroy(new Error('timeout ' + url)));
      r.on('error', reject);
      if (payload) r.write(payload);
      r.end();
    });
  return (async () => {
    let last = null;
    for (let i = 0; i <= retries; i++) {
      try {
        return await run();
      } catch (e) {
        last = e;
        if (i < retries) await sleep(1500);
      }
    }
    throw last;
  })();
}

// ---------------------------------------------------------------- text

const UAS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36',
];
const uaFor = (n) => UAS[n % UAS.length];

function flatten(html) {
  return String(html || '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/\s+/g, ' ');
}

function extractCode(text) {
  const flat = flatten(text);
  // Measured 2026-10-19 (aimoniker.top, 98/98 registrations refused with
  // "Verification code is incorrect or has expired"): the previous English
  // pattern `(?:verification|verify|code|otp)…` matched the *word* "code" in
  // "Moniker email verification code: 123456" and submitted the literal string
  // "code" as the verification code. Explicit separators and stop-word
  // rejection first, generic word pattern last.
  const cands = [];
  const push = (c) => {
    if (c && !/^(code|verification|verify|otp|your|the|is)$/i.test(c)) cands.push(c);
  };
  push((/(?:验证码|校验码|验证代码)[^A-Za-z0-9]{0,6}([A-Za-z0-9]{4,10})/.exec(flat) || [])[1]);
  push((/(?:verification\s+)?code\s*(?:is|为|是)?\s*[:：=]?\s*([A-Za-z0-9]{4,10})/i.exec(flat) || [])[1]);
  push((/\b([a-f0-9]{6})\b/i.exec(flat) || [])[1]);
  push((/\b(\d{6})\b/.exec(flat) || [])[1]);
  push((/\b([A-Za-z0-9]{4,10})\b(?=[^]{0,40}(?:expire|minutes|有效|分钟))/i.exec(flat) || [])[1]);
  return cands.find(Boolean) || null;
}

const CONTEXT_RE = /验证码|verification code|verify your|code is|验证|代码|otp/i;

// ---------------------------------------------------------------- account state

let state = { minted: 0, tried: 0, accounts: 0, statuses: {} };
let accounts = [];
function loadAccounts() {
  try {
    const a = JSON.parse(fs.readFileSync(ACCOUNTS, 'utf8'));
    if (Array.isArray(a)) accounts = a;
  } catch (e) {
    accounts = [];
  }
}
function saveRec(rec) {
  accounts = accounts.filter((r) => !(r.username === rec.username && r.host === rec.host));
  accounts.push(rec);
  try {
    fs.writeFileSync(ACCOUNTS, JSON.stringify(accounts, null, 1));
  } catch (e) {
    log(`accounts write failed: ${e.message}`);
  }
}
function saveKey(key, rec) {
  const exists = fs.existsSync(KEYS) && fs.readFileSync(KEYS, 'utf8').includes(key);
  if (!exists) fs.appendFileSync(KEYS, key + '\n');
  state.minted++;
  log(`SAVED ${key.slice(0, 14)}…  (${state.minted} live)`);
  report(`- ${new Date().toISOString().slice(11, 16)} · ${NAME} · key #${state.minted} \`${key.slice(0, 10)}…\` (${rec.email}, quota=${rec.quota ?? '?'})`);
}

// progress line every 2 min so no lane goes silent (operator: 10 min max).
const t0 = Date.now();
setInterval(() => {
  const mins = Math.round((Date.now() - t0) / 60000);
  report(
    `- ${new Date().toISOString().slice(11, 16)} · ${NAME} · t+${mins}dk · deneme=${state.tried} kayıt=${state.accounts} live=${state.minted} · ${JSON.stringify(state.statuses)}`
  );
}, 120000).unref();

// ---------------------------------------------------------------- one account

async function panelCall(exit, pathname, { method = 'GET', body = null, headers = {}, timeoutMs = 30000, tries = 2 } = {}) {
  const origin = BASE;
  const h = {
    accept: 'application/json, text/plain, */*',
    origin,
    referer: origin + '/register',
    'x-requested-with': 'XMLHttpRequest',
    'user-agent': uaFor(state.tried),
    ...headers,
  };
  let lastErr = null;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await req(exit, BASE + pathname, { method, body, headers: h, timeoutMs });
      if (r.status === 429) {
        await sleep(8000); // operator cadence: 429 → 8 s backoff
        continue;
      }
      return r;
    } catch (e) {
      lastErr = e;
      await sleep(1200);
    }
  }
  throw lastErr || new Error('panelCall failed');
}

async function sendCode(exit, email) {
  const variants = [
    { method: 'GET', pathname: `/api/verification?email=${encodeURIComponent(email)}`, body: null },
    { method: 'POST', pathname: '/api/verification', body: { email } },
    { method: 'POST', pathname: '/api/user/register/verify', body: { email } },
  ];
  const seen = [];
  for (const v of variants) {
    let r;
    try {
      r = await panelCall(exit, v.pathname, { method: v.method, body: v.body, tries: 2, timeoutMs: 30000 });
    } catch (e) {
      seen.push(`${v.method} ${v.pathname.split('?')[0]}: ${e.message}`);
      continue;
    }
    const msg = (r.json && (r.json.message || (r.json.error && r.json.error.message))) || String(r.text).slice(0, 160);
    seen.push(`${v.method} ${v.pathname.split('?')[0]}: ${r.status} ${msg}`);
    if (r.json && r.json.success === true) return { ok: true, r, seen };
    if (r.status < 400 && /sent|已发送|发送成功/i.test(String(msg))) return { ok: true, r, seen };
    // "already in use" is the same verdict as 邮箱地址已被占用; missing it threw away
    // a whole account instead of taking the next mailbox (measured 2026-10-19,
    // ~1 in 10 Emailnator addresses).
    if (/占用|occupied|exists|已被|already in use|already registered/i.test(String(msg))) return { occupied: true, r, seen };
  }
  return { ok: false, seen, r: null };
}

/**
 * Emailnator lives behind Cloudflare and the mailbox is *not* bound to the
 * panel's exit: a free exit that carries the panel fine regularly dies on
 * `timeout waiting for secureConnect` to `www.emailnator.com` (measured on the
 * first itkk.lol smoke run). Mail calls therefore rotate through the pool on a
 * transport failure and remember the last two exits that worked, so a 100-key
 * run stops paying for a fresh probe every poll.
 */
const MAIL_EXITS = [];
async function mailTry(fn, { tries = 6 } = {}) {
  let last = null;
  for (let i = 0; i < tries; i++) {
    // A pick may be `null`: that is the direct sentinel (no pool loaded), and
    // the mail call then leaves on this machine's own line too (see `req`).
    const p = MAIL_EXITS.length && i < 2 ? MAIL_EXITS[i % MAIL_EXITS.length] : nextExit(EXITS_GLOBAL);
    try {
      const out = await fn(p);
      if (!MAIL_EXITS.includes(p)) {
        MAIL_EXITS.unshift(p);
        if (MAIL_EXITS.length > 3) MAIL_EXITS.pop();
      }
      return out;
    } catch (e) {
      last = e;
      const msg = String(e.message || '');
      // `429 Too many requests` from Emailnator is per-IP, so the fix is another
      // exit, not a pause: measured 2026-10-19 on the itkk run, 69 of 166 attempt
      // failures were this answer and every one of them killed a whole account
      // because the error was rethrown instead of rotated.
      if (!/timeout|secureConnect|ECONN|EPIPE|socket|TLS|aborted|reset|destroyed|handshake|proxy|429|too many|rate limit/i.test(msg)) throw e;
      await sleep(400 + Math.random() * 600);
    }
  }
  throw last || new Error('no mail exit');
}

let EXITS_GLOBAL = []; // set once by the driver; `mailTry` rotates inside it

// Set by the driver from `/api/status`: with `email_verification=false` the register
// body takes an empty code, so a mailbox is only an address holder and waiting for a
// code burns 180 s per account (measured 2026-10-21 on itkk.lol).
let MAIL_FREE = false;

/**
 * Fresh mailbox the panel accepts.
 *
 * `emailnator` boxes are recycled, so a box can already hold an account here
 * (`邮箱地址已被占用`) and can carry the previous tenant's code — hence the
 * occupancy check and the pre-send snapshot of message ids.
 *
 * `temptf` hands out a private plus-alias on a real Microsoft mailbox, so there
 * is no previous tenant and no shared-box race at all; it is the rail this lane
 * falls back to when the panel stops delivering to gmail addresses.
 */
async function newMailbox(exit, { tries = 6 } = {}) {
  for (let i = 0; i < tries; i++) {
    let box;
    let transport = null;
    let baseline = new Set();
    if (MAIL_MODE === 'temptf') {
      transport = new TempTf({ proxy: exit, providers: ['outlook', 'hotmail'], plus: true, log: () => {}, timeoutMs: 30000 });
      const { address } = await transport.createAccount();
      box = { plain: address, provider: 'temptf' };
    } else {
      box = await mailTry((e) => emailnator.newAddress(e), { tries: 4 });
      // Snapshot the box *before* the code is requested: any message already
      // sitting in a recycled box belongs to the previous tenant, and its code is
      // exactly what the panel refuses with "Verification code is incorrect or has
      // expired" (55 of 166 attempt failures on 2026-10-19).
      try {
        const msgs = await mailTry((e) => emailnator.listMessages(box.plain, e), { tries: 3 });
        for (const m of msgs) baseline.add(String(m.id));
      } catch (e) {
        /* an unreadable box is still worth trying */
      }
    }
    const sent = await sendCode(exit, box.plain);
    if (sent.ok) return { box, sent, baseline, transport };
    if (!sent.occupied) throw new Error(`sendCode refused: ${JSON.stringify(sent.seen).slice(0, 240)}`);
    log(`mailbox ${box.plain} already registered here → next`);
    await sleep(1500);
  }
  throw new Error('no usable mailbox');
}

/** Address for a panel that sends no code — the box is never read. */
async function codeFreeAddress() {
  const box = await mailTry((e) => emailnator.newAddress(e), { tries: 4 });
  return box.plain || box;
}

async function waitCode(exit, plain, startSec, { brandRe, skipIds = null, transport = null, timeoutMs = CODE_WAIT_MS } = {}) {
  const deadline = Date.now() + timeoutMs;
  const seen = new Set();
  let foreign = 0;
  while (Date.now() < deadline) {
    let msgs = [];
    try {
      msgs = transport
        ? (await transport.messages()).map((m) => ({ id: m.id, from: m.from, subject: m.subject, timestamp: 0, body: m.text }))
        : await mailTry((e) => emailnator.listMessages(plain, e), { tries: 4 });
    } catch (e) {
      await sleep(POLL_MS);
      continue;
    }
    for (const m of msgs) {
      const id = String(m.id);
      if (seen.has(id)) continue;
      seen.add(id);
      if (skipIds && skipIds.has(id)) continue; // previous tenant's mail
      const ts = Number(m.timestamp || 0);
      if (ts && ts < startSec - 120) continue; // arrival window, when a ts exists
      let text = m.body ? flatten(m.body) : '';
      if (!text) {
        let full = {};
        try {
          full = await mailTry((e) => emailnator.readMessage(id, e), { tries: 3 });
        } catch (e) {
          continue;
        }
        text = flatten(full.content || '');
      }
      if (!CONTEXT_RE.test(text)) continue;
      const code = extractCode(text);
      if (!code) continue;
      const from = String(m.from || '');
      const subject = String(m.subject || '');
      if (brandRe && !brandRe.test(`${from} ${subject} ${text.slice(0, 400)}`)) {
        // Panel mail does arrive from third-party addresses (measured on this
        // wave: ai.wxsup.cn mails from a qq.com address), so a foreign-looking
        // sender is only accepted once the panel's own brand never showed up.
        foreign++;
        if (foreign < 2) continue;
      }
      return { code, from, subject, text };
    }
    await sleep(POLL_MS);
  }
  throw new Error(`no code in ${timeoutMs}ms`);
}

// accounts.json is touched by every worker: one process, one mutex.
let writeChain = Promise.resolve();
function withLock(fn) {
  const p = writeChain.then(fn, fn);
  writeChain = p.catch(() => {});
  return p;
}

async function mintAccount(exits, idx) {
  const tag = `${TAG}${Date.now().toString(36).slice(-4)}${idx}`.slice(0, 18);
  const password = `Pw${randHex(6)}aB1`;
  const ua = uaFor(idx);
  // The exit is proven against /api/status before any account state exists.
  // Serial screening burned a 15 s timeout per dead free line (the first launch
  // died on exactly that), so candidates are raced in parallel and local proxy —
  // measured to reach this panel — is the guaranteed last candidate. DIRECT
  // mode (no pool loaded, the single `null` sentinel) skips the screening and
  // runs the account on this machine's own line.
  let exit = null;
  if (!isDirect(exits)) {
    const cands = [];
    for (let i = 0; i < 8; i++) {
      const c = nextExit(exits);
      if (c && !cands.includes(c)) cands.push(c);
    }
    const warp = exits.find((e) => e.warp);
    if (warp && !cands.includes(warp)) cands.push(warp);
    const screened = await Promise.all(
      cands.map(async (c) => {
        try {
          const st = await req(c, BASE + '/api/status', {
            headers: { accept: 'application/json', 'user-agent': ua, origin: BASE, referer: BASE + '/' },
            timeoutMs: 10000,
          });
          if (st.status === 200 && st.json && st.json.data) return c;
        } catch (e) {}
        return null;
      })
    );
    exit = screened.find((c) => c && !c.warp) || screened.find(Boolean) || null;
    if (!exit) throw new Error('no exit reached the panel');
  }

  const rec = { host: HOST, provider: NAME, tag, username: tag, password, ua, at: nowIso(), exit: maskExit(exit && exit.line), status: 'start' };
  state.tried++;
  log(`#${idx} start ${tag} exit=${maskExit(exit && exit.line)}`);

  const startSec = Math.floor(Date.now() / 1000);
  let email = null;
  let code = '';
  if (MAIL_FREE) {
    email = await codeFreeAddress();
    rec.email = email;
    rec.status = 'code-not-required';
    log(`#${idx} mailbox ${email} (no code — panel email_verification=false)`);
  } else {
    const { box, baseline } = await newMailbox(exit);
    email = box.plain;
    rec.email = email;
    log(`#${idx} mailbox ${email}`);
    rec.status = 'code-sent';

    const brandRe = new RegExp(`itkk|aimoniker|moniker|${HOST.split('.')[0]}`, 'i');
    const mail = await waitCode(exit, box.plain, startSec, { brandRe, skipIds: baseline });
    rec.code_from = mail.from;
    rec.code_subject = mail.subject;
    log(`#${idx} code ${mail.code} from ${mail.from} | ${mail.subject}`);
    rec.status = 'code-read';
    code = mail.code;
  }

  // A recycled Emailnator box can already hold an account here (`邮箱地址已被占用`) —
  // `newMailbox` caught that inside the code request, so the code-free path retries
  // the address itself.
  let reg;
  for (let attempt = 0; ; attempt++) {
    reg = await panelCall(exit, '/api/user/register', {
      method: 'POST',
      headers: { 'user-agent': ua },
      body: { username: tag, password, email, verification_code: code },
      timeoutMs: 40000,
    });
    log(`#${idx} register ${reg.status} ${String(reg.text).slice(0, 140)}`);
    if (reg.json && reg.json.success === true) break;
    if (MAIL_FREE && attempt < 2 && /已被占用|already registered|已被注册/i.test(String(reg.text || ''))) {
      email = await codeFreeAddress();
      rec.email = email;
      log(`#${idx} address taken → ${email}`);
      continue;
    }
    throw new Error(`register ${reg.status} ${String(reg.text).slice(0, 200)}`);
  }
  rec.status = 'registered';

  const login = await panelCall(exit, '/api/user/login', {
    method: 'POST',
    headers: { 'user-agent': ua },
    body: { username: tag, password },
  });
  const tok = login.json && login.json.data && login.json.data.access_token;
  const setCookies = (login.headers && login.headers['set-cookie']) || [];
  const session = setCookies.map((c) => String(c).split(';')[0]).find((c) => /^session=/.test(c));
  if (!tok && !session) throw new Error(`login ${login.status} ${String(login.text).slice(0, 200)}`);
  const sub = tok
    ? JSON.parse(Buffer.from(tok.split('.')[1], 'base64').toString('utf8')).sub
    : (login.json && login.json.data && (login.json.data.id || login.json.data.user_id)) || 0;
  const auth = tok ? { authorization: `Bearer ${tok}`, 'new-api-user': String(sub) } : { cookie: session, 'new-api-user': String(sub) };
  rec.id = Number(sub);
  rec.status = 'logged-in';
  rec.credential = tok ? 'jwt' : 'session';
  log(`#${idx} login ${login.status} ${rec.credential}=${!!(tok || session)} id=${sub}`);

  const self = await panelCall(exit, '/api/user/self', { headers: auth });
  rec.quota = self.json && self.json.data && self.json.data.quota;
  rec.group = self.json && self.json.data && self.json.data.group;
  log(`#${idx} self quota=${rec.quota} group=${rec.group}`);

  if (CHECKIN) {
    const ci = await panelCall(exit, '/api/user/checkin', { method: 'POST', body: {}, headers: auth });
    rec.checkin = { status: ci.status, body: String(ci.text).slice(0, 160) };
    log(`#${idx} checkin ${ci.status} ${String(ci.text).slice(0, 120)}`);
  }

  // ---- token + chat-200 gate.
  //
  // Measured 2026-10-19 on itkk.lol: a token created with `group:""` inherits the
  // account's own group `default`, which carries channels for *nothing* — every
  // model answers `503 No available channel for model X under group default
  // (distributor)`. `/api/pricing` states which group carries which model
  // (`enable_groups`) and what each group costs (`group_ratio`), so the token is
  // bound to a live group and the gate walks the cheapest (group, model) pairs
  // until the panel's own relay answers 200 with content.
  const plan = await groupPlan(exit, ua);
  const attempts = [];
  let key = null;
  let gate = null;
  for (const cand of plan) {
    const created = await panelCall(exit, '/api/token/', {
      method: 'POST',
      headers: auth,
      body: {
        name: `${TAG}-${idx}-${cand.group.slice(0, 6)}`.slice(0, 26),
        remain_quota: 0,
        expired_time: -1,
        unlimited_quota: true,
        // No model restriction: the token keeps its *group* — which is what makes
        // the channel reachable — but may call any id that group serves, so one
        // key covers the whole group catalogue instead of only the single id the
        // gate happened to verify.
        model_limits_enabled: false,
        model_limits: '',
        allow_ips: '',
        group: cand.group,
      },
    });
    if (!created.json || created.json.success !== true) {
      attempts.push({ group: cand.group, token_status: created.status, error: String(created.text).slice(0, 140) });
      continue;
    }
    const list = await panelCall(exit, '/api/token/?p=0&size=100', { headers: auth });
    const items = (list.json && list.json.data && list.json.data.items) || [];
    const item = items[0];
    if (!item) throw new Error('token list empty after create');
    const reveal = await panelCall(exit, `/api/token/${item.id}/key`, { method: 'POST', headers: auth });
    const k = reveal.json && reveal.json.data && reveal.json.data.key;
    if (!k) throw new Error(`reveal ${reveal.status} ${String(reveal.text).slice(0, 140)}`);
    let chat;
    try {
      chat = await req(exit, BASE + '/v1/chat/completions', {
        method: 'POST',
        timeoutMs: 150000,
        headers: { authorization: `Bearer ${k}`, 'content-type': 'application/json', 'user-agent': ua },
        body: { model: cand.model, messages: [{ role: 'user', content: 'Reply OK' }], max_tokens: 64, stream: false },
        retries: 1,
      });
    } catch (e) {
      attempts.push({ group: cand.group, model: cand.model, status: 0, error: e.message });
      continue;
    }
    const msg = chat.json && chat.json.choices && chat.json.choices[0] && chat.json.choices[0].message;
    const txt = msg && String(msg.content || '').trim();
    gate = { group: cand.group, model: cand.model, status: chat.status, content: txt || '', error: txt ? null : String(chat.text).slice(0, 200) };
    attempts.push(gate);
    log(`#${idx} chat ${cand.group}/${cand.model} -> ${chat.status} ${txt ? JSON.stringify(txt.slice(0, 30)) : String(chat.text).slice(0, 110)}`);
    if (chat.status === 200 && txt) {
      key = k;
      rec.key = key;
      rec.token_id = item.id;
      break;
    }
    // A routing miss on this group says nothing about the next; anything else
    // (balance, delisted model) is answered the same way in every group.
    if (!/无可用渠道|No available channel|distributor/i.test(String(chat.text || ''))) break;
  }
  rec.attempts = attempts;
  if (key && gate) {
    rec.status = 'chat-200';
    rec.model = gate.model;
    rec.token_group = gate.group;
    rec.content = gate.content.slice(0, 40);
    await withLock(() => {
      saveRec(rec);
      saveKey(key, rec);
    });
    state.accounts++;
    return rec;
  }
  rec.status = 'chat-failed';
  rec.gate = attempts[attempts.length - 1] || null;
  await withLock(() => saveRec(rec));
  state.accounts++;
  log(`#${idx} ✖ no live pair (${attempts.length} tried)`);
  return rec;
}

/**
 * Cheap (group, model) pairs from the panel's public catalogue, ordered by what
 * an account can afford: group_ratio × model_ratio. The wave's own model id
 * (--model) leads, then the lowest-ratio ids of the cheapest live groups.
 */
let PLAN_CACHE = null;
async function groupPlan(exit, ua) {
  if (PLAN_CACHE) return PLAN_CACHE;
  const r = await req(exit, BASE + '/api/pricing', {
    headers: { accept: 'application/json', 'user-agent': ua, origin: BASE, referer: BASE + '/pricing' },
    timeoutMs: 25000,
  });
  const j = r.json || {};
  const gr = j.group_ratio || {};
  const usable = j.usable_group || {};
  const pairs = [];
  for (const m of j.data || []) {
    for (const g of m.enable_groups || []) {
      if (gr[g] == null) continue;
      pairs.push({ group: g, model: m.model_name, groupRatio: gr[g], cost: gr[g] * ((m.model_ratio || 0) || 0.5) });
    }
  }
  const scored = pairs
    .filter((p) => p.groupRatio <= 0.5)
    .sort((a, b) => (b.model === MODEL ? 1 : 0) - (a.model === MODEL ? 1 : 0) || a.cost - b.cost);
  const byGroup = new Map();
  for (const p of scored) {
    if (!byGroup.has(p.group)) byGroup.set(p.group, []);
    byGroup.get(p.group).push(p);
  }
  const plan = [];
  for (const [group, l] of byGroup) {
    if (!usable[group]) continue;
    for (const p of l.slice(0, 2)) plan.push({ group, model: p.model, cost: p.cost });
    if (plan.length >= 12) break;
  }
  plan.length = Math.min(plan.length, 8); // bound the per-account gate walk
  PLAN_CACHE = plan;
  log(`plan: ${plan.map((p) => `${p.group}/${p.model}`).join(' · ')}`);
  return plan;
}

// ---------------------------------------------------------------- driver

(async () => {
  // The pool is optional: no line from the user's own pool files (--pool /
  // ITKK_PROXIES — the lab dumps do not exist on a user's machine) means there
  // is nothing to rotate, and the run switches to DIRECT mode. `null` is the
  // direct sentinel every transport below accepts; local proxy is a lab rail,
  // not a user pool, so on its own it does not keep the mint in pool mode.
  let exits = loadExits();
  if (!exits.some((e) => !e.warp)) {
    log('no proxy list loaded — running WITHOUT a proxy (direct). Pass --pool <file> to rotate exits per account.');
    exits = [null];
  }
  EXITS_GLOBAL = exits;
  // proxy (Cloudflare's own egress) is the one exit measured to hold a TLS
  // session to www.emailnator.com reliably (200 / 52 KB, 2026-10-19); it leads
  // the mail rotation so the code reader never burns a poll on a dead tunnel.
  const warp = exits.find((e) => e && e.warp);
  if (warp) MAIL_EXITS.push(warp);
  loadAccounts();
  const already = new Set(accounts.filter((a) => a.status === 'chat-200').map((a) => a.email));
  log(`mint start host=${HOST} tag=${TAG} count=${COUNT} conc=${CONC} model=${MODEL} exits=${exits.filter(Boolean).length || 'direct'}`);
  report(`- ${new Date().toISOString().slice(11, 16)} · ${NAME} · başladı: count=${COUNT} conc=${CONC} exits=${exits.length} model=${MODEL}`);

  // Gate read through rotating exits: free lines die between the pool screen and
  // this call (`proxy CONNECT timeout` on exits[0] killed the first launch), so a
  // single-exit check is a false FATAL, not a panel verdict.
  let gates = null;
  for (let i = 0; i < 12 && !gates; i++) {
    const cand = exits[(i * 7 + 1) % exits.length];
    try {
      const st = await req(cand, BASE + '/api/status', { headers: { accept: 'application/json', origin: BASE, 'user-agent': uaFor(i) }, timeoutMs: 12000 });
      if (st.status === 200 && st.json && st.json.data) gates = st.json.data;
    } catch (e) {
      log(`  exit ${maskExit(cand && cand.line)} failed the gate read: ${e.message}`);
    }
  }
  if (!gates) throw new Error(isDirect(exits) ? 'the panel did not answer on the direct route (no proxy list loaded)' : 'no exit reached the panel for the gate read');
  log(`gates register=${gates.register_enabled} email=${gates.email_verification} turnstile=${gates.turnstile_check} pwd=${gates.password_register_enabled} checkin=${gates.checkin_enabled}`);
  MAIL_FREE = gates.email_verification === false;
  if (MAIL_FREE) log('e-mail gate off (email_verification=false) → register carries no code');
  if (gates.turnstile_check === true) throw new Error('turnstile_check=true — needs the browser mint');

  let next = 1;
  const worker = async () => {
    for (;;) {
      if (Date.now() - t0 > BUDGET_MS) return;
      const idx = next++;
      if (idx > COUNT) return;
      try {
        const rec = await mintAccount(exits, idx);
        if (rec.status === 'chat-200' && already.has(rec.email)) log(`#${idx} (email already minted before)`);
      } catch (e) {
        report(`- ${new Date().toISOString().slice(11, 16)} · ${NAME} · #${idx} hata: ${String(e.message).slice(0, 140)}`);
        await withLock(() =>
          saveRec({ host: HOST, provider: NAME, tag: `${TAG}${idx}`, at: nowIso(), status: 'error', error: String(e.message).slice(0, 300) })
        );
        state.accounts++;
      }
      await sleep(2000 + Math.random() * 2000); // operator cadence: 2-4 s between accounts
    }
  };
  await Promise.all(Array.from({ length: CONC }, worker));

  const total = accounts.filter((a) => a.host === HOST && a.status === 'chat-200').length;
  log(`done ${NAME}: ${state.minted} new key(s) this run, ${total} minted total, tried=${state.tried}`);
  report(`- ${new Date().toISOString().slice(11, 16)} · ${NAME} · BİTTİ: +${state.minted} yeni, toplam ${total} chat-200 (deneme=${state.tried})`);
  console.log(`RESULT ${JSON.stringify({ provider: NAME, new_keys: state.minted, total_keys: total, tried: state.tried, statuses: state.statuses })}`);
})().catch((e) => {
  log(`FATAL ${e.message}`);
  report(`- ${new Date().toISOString().slice(11, 16)} · ${NAME} · FATAL ${String(e.message).slice(0, 200)}`);
  process.exit(1);
});
