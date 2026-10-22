<div align="center">

```
██╗████████╗██╗  ██╗██╗  ██╗
██║╚══██╔══╝██║ ██╔╝██║ ██╔╝
██║   ██║   █████╔╝ █████╔╝
██║   ██║   ██╔═██╗ ██╔═██╗
██║   ██║   ██║  ██╗██║  ██╗
╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
```

# itkk-bulk-apikey

**Bulk-create ITKK (itkk.lol) accounts with auto-generated API keys — OpenAI-compatible inference + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-5-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

itkk.lol is a New API `v1.0.0-rc.40` panel (system name **ITKK**) with **e-mail-code sign-up** until 2026-10-19 and **code-free sign-up** since 2026-10-21 (`email_verification=false`), Turnstile **off**, password registration open and a **100000-quota sign-up credit** (quota_per_unit 500000 → ¥0.20 at display rate). One account = one key; this tool writes a key to `keys.txt` only after the panel's own relay answered 200 with content.

## 🎁 Free tier — how much you get

**Every new account gets sign-up quota** — no card, no captcha.

| What | Value |
| --- | --- |
| Sign-up quota | **100000** (`quota_per_unit` 500000, display ¥0.20) |
| Card required | **No** |
| Daily check-in | not enabled on this panel (`checkin_enabled:false`) |
| Sign-up | **no e-mail code since 2026-10-21** (`email_verification=false`); while the gate was on, a code from the gmail family was required |
| The unit that scales | **one account = one key** → `--count N` is "N free accounts" |

> 💡 The free tier is set by ITKK (itkk.lol) — 国模 API 中转 and can change. Check the live numbers at [itkk.lol](https://itkk.lol) — and let the tool's own gate decide:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Models — all 5 of them

The catalogue is **group-bound**: a fresh account lands in `default`, which has channels for *nothing* — a token created without a group answers `503 No available channel for model X under group default (distributor)`. `/api/pricing` publishes `group_ratio` + per-model `enable_groups`, and the mint binds the token to one of those groups before testing. Live ids measured 2026-10-19: `deepseek-v4.1-flash` (group `China-Ai-flash`, 0.1×), `glm-5.3-flash` (`China-Ai-flash`), `glm-5.3` (`China-Ai-福利`, 0.05×), `deepseek-v4-pro` (`China-Ai-福利`), `kimi-k3` (`China-Ai-福利`).

## 🧪 How to use the API

The base URL is **`https://itkk.lol/v1`** — OpenAI-compatible.

```bash
curl https://itkk.lol/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

The model id must belong to the group the token is bound to.

## 🛠 Quick start

```bash
# 1) your proxy list, one per line (http://… or socks5://…) — optional, see below
printf 'http://127.0.0.1:8080\n' > proxies.txt   # optional — without it the tool runs direct

# 2) go
node src/cli.js --count 100 --conc 6 --model deepseek-v4.1-flash --pool proxies.txt
```

Requests go through your proxy list when one is provided (`--pool` / `ITKK_PROXIES`); without a pool the tool connects directly. A key reaches `keys.txt` in either mode — still only after a live chat 200.

### 🖱️ The launcher

## ✅ Verified working — every key is tested

> **Quality gates.** Every key here passed a live `chat-200` before it was written to `keys.txt`
> (dead keys are never shipped). Router combos follow the same rule at the model level: an entry is
> added **only if the model answers `chat-200` and can call tools** — a model without tool support,
> a dead key or a dead provider is dropped instead of added. Works with **9Router and OmniRoute**.

| Check | Result |
| --- | --- |
| `GET /api/status` | **200** — today `register_enabled=true`, **`email_verification=false`** (was `true` on 2026-10-19), `turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **200 while the panel asks for a code** — mail arrives as `ITKK <mail@<panel-mail>>`, subject `ITKK邮箱验证邮件`, 6-hex code; not needed after 2026-10-21 |
| `POST /api/user/register` | **200** — account lands in group `default` with quota 100000; with the code gate off the body takes `verification_code:""` |
| `POST /api/user/login` | **200** — `access_token` JWT (+ `session` cookie) |
| `GET /api/user/self` | **200** — `quota`, `group` |
| `POST /api/token/` with `group:""` | **200**, but the key never routes: `503 No available channel … under group default` |
| `POST /api/token/` with a catalogue group | **200** — the bound group is what makes the channel reachable |
| `POST /api/token/<id>/key` | **200** — plaintext key |
| `POST /v1/chat/completions` before a key is written | **200** with real content required; an HTTP 200 carrying an upstream error is not accepted |
| re-verification 2026-10-21 | code gate gone → fresh account (quota 100000) + key on group `China-Ai-次卡` answering `200 "pong"` with `t-deepseek-v4-pro`; **verified** in `keys.txt` answered 200 with real content; a mutated key → `401 Invalid token` |

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: ITKK (itkk.lol) — 国模 API 中转 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://itkk.lol/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| code | `GET /api/verification?email=` | **skipped while `email_verification=false`** (2026-10-21). While it was on: dotless gmail works; recycled Emailnator boxes may hold an account (`邮箱地址已被占用`) |
| signup | `POST /api/user/register` | password registration open, Turnstile off |
| sign-in | `POST /api/user/login` | JWT in this fork's answer |
| catalogue | `GET /api/pricing` | `group_ratio`, `usable_group`, per-model `enable_groups` |
| token | `POST /api/token/` `{group, model_limits}` | without a group the key answers 503 |
| key | `POST /api/token/<id>/key` | plaintext |
| check | `POST /v1/chat/completions` | live 200 required before `keys.txt` |

## ⚙️ CLI options

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| Flag | Default | Meaning |
| --- | --- | --- |
| `--count` | 5 | accounts to attempt |
| `--conc` | 4 | parallel accounts |
| `--model` | `deepseek-v4.1-flash` | model the gate prefers |
| `--pool <file>` | built-in list | optional exit file (`ITKK_PROXIES` env works too) |

## 🛰️ Behind a proxy

**Optional — recommended at scale (per-IP limits, bans).** The tool works without a proxy too.

- **With a pool:** pass `--pool <file>` (or set `ITKK_PROXIES`) and every request goes through an exit from that list — one account holds one exit for all of its panel calls, and the mail rail rotates through the pool.
- **Without a pool:** the CLI prints `running WITHOUT a proxy (direct)` and connects directly — sign-up, code reading, the token/group walk and the chat gate all run the same way.

The lab's own supply: `proxy-lab/out/exits-emergency-panel-live.txt`, `proxies-emergency*.txt`, `chrome-safe-exits.txt`, `captcha-exits-live.txt` plus local proxy; there each account holds one exit for all of its panel calls and the mail rail rotates through the pool (proxy first).

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one chat-200 key per line |
| `keys-unfunded.txt` | keys whose account could not reach a live group |
| `accounts.json` | username / password / email / quota / group / attempts per account |
| `out/mint-<date>.log` | raw run log |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router. One command turns `keys.txt` into a provider-node with working combos:

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Models are then served as `itkk/<model id>`, load-balanced across every key.

## 🔌 Connect to OmniRoute

[OmniRoute](https://omniroute.online) is a self-hosted, OpenAI-compatible router. One command turns `keys.txt` into a provider-node with working combos:

```bash
node proxy-lab/omniroute-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Models are then served as `itkk/<model id>`, load-balanced across every key.
## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 What the provider gives | one account per key — sign-up without a code since 2026-10-21, token bound to a live group, every key chat-200 |
| 🔑 What one key gets you | one API key scoped to its own account: the 5 model ids on the endpoint below, at your plan's limits. The quota lives on the **account**, which is exactly why this tool creates one account per key |
| 🌐 API shape | OpenAI-compatible: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 Your data | only itkk.lol and the inbox backend you configure are contacted; keys stay on your machine |

## 🐞 Issues

If the panel changes its signup shape, groups or credit, the tool stops at that step and records the panel's verbatim answer in `accounts.json`.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey contributors

</div>
