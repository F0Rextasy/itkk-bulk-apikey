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

**ITKK-Konten (itkk.lol) im Bulk anlegen mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz + 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Free-Tier](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-5-of-them) · [🧪 API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 Funktionsweise](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es dieses Tool gibt

itkk.lol ist ein New-API-`v1.0.0-rc.40`-Panel (Systemname **ITKK**) mit **E-Mail-Code-Registrierung** bis 2026-10-19 und **codefreier Registrierung** seit 2026-10-21 (`email_verification=false`), Turnstile **aus**, Passwortregistrierung offen und einem **Registrierungsguthaben von 100000 Quota** (quota_per_unit 500000 → ¥0,20 zum Anzeigekurs). Ein Konto = ein Schlüssel; dieses Tool schreibt einen Schlüssel erst dann in `keys.txt`, wenn das Relay des Panels selbst mit 200 und Inhalt geantwortet hat.

## 🎁 Free-Tier — wie viel du bekommst

**Jedes neue Konto erhält Registrierungsguthaben** — keine Karte, kein Captcha.

| Was | Wert |
| --- | --- |
| Registrierungsguthaben | **100000** (`quota_per_unit` 500000, Anzeige ¥0,20) |
| Karte erforderlich | **Nein** |
| Täglicher Check-in | auf diesem Panel nicht aktiviert (`checkin_enabled:false`) |
| Registrierung | **kein E-Mail-Code seit 2026-10-21** (`email_verification=false`); solange die Sperre aktiv war, war ein Code aus der Gmail-Familie erforderlich |
| Die Einheit, die skaliert | **ein Konto = ein Schlüssel** → `--count N` bedeutet „N kostenlose Konten" |

> 💡 Der Free-Tier wird von ITKK (itkk.lol) — 国模 API 中转 festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [itkk.lol](https://itkk.lol) — und lass das Gate des Tools selbst entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 5

Der Katalog ist **gruppengebunden**: ein frisches Konto landet in `default`, wo es Kanäle für *nichts* gibt — ein Token, das ohne Gruppe erstellt wird, antwortet `503 No available channel for model X under group default (distributor)`. `/api/pricing` veröffentlicht `group_ratio` + pro Modell `enable_groups`, und das Mint bindet das Token vor dem Testen an eine dieser Gruppen. Live-IDs gemessen am 2026-10-19: `deepseek-v4.1-flash` (Gruppe `China-Ai-flash`, 0,1×), `glm-5.3-flash` (`China-Ai-flash`), `glm-5.3` (`China-Ai-福利`, 0,05×), `deepseek-v4-pro` (`China-Ai-福利`), `kimi-k3` (`China-Ai-福利`).

## 🧪 So verwendest du die API

Die Basis-URL ist **`https://itkk.lol/v1`** — OpenAI-kompatibel.

```bash
curl https://itkk.lol/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Die Modell-ID muss zu der Gruppe gehören, an die das Token gebunden ist.

## 🛠 Schnellstart

```bash

# 1) your proxy list, one per line (http://… or socks5://…) — optional, see below
printf 'http://127.0.0.1:8080\n' > proxies.txt   # optional — without it the tool runs direct

# 2) go
node src/cli.js --count 100 --conc 6 --model deepseek-v4.1-flash --pool proxies.txt
```

Anfragen laufen über deine Proxy-Liste, wenn eine angegeben ist (`--pool` / `ITKK_PROXIES`); ohne Pool verbindet sich das Tool direkt. Ein Schlüssel erreicht `keys.txt` in beiden Modi — aber weiterhin erst nach einem Live-Chat-200.

### 🖱️ Der Launcher

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

| Prüfung | Ergebnis |
| --- | --- |
| `GET /api/status` | **200** — heute `register_enabled=true`, **`email_verification=false`** (war `true` am 2026-10-19), `turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **200, solange das Panel einen Code verlangt** — Mail kommt als `ITKK <mail@<panel-mail>>`, Betreff `ITKK邮箱验证邮件`, 6-Hex-Code; nach dem 2026-10-21 nicht mehr nötig |
| `POST /api/user/register` | **200** — Konto landet in Gruppe `default` mit Quota 100000; bei ausgeschalteter Code-Sperre akzeptiert der Body `verification_code:""` |
| `POST /api/user/login` | **200** — `access_token` JWT (+ `session`-Cookie) |
| `GET /api/user/self` | **200** — `quota`, `group` |
| `POST /api/token/` mit `group:""` | **200**, aber der Schlüssel routet nie: `503 No available channel … under group default` |
| `POST /api/token/` mit einer Katalog-Gruppe | **200** — die gebundene Gruppe ist es, die den Kanal erreichbar macht |
| `POST /api/token/<id>/key` | **200** — Klartext-Schlüssel |
| `POST /v1/chat/completions`, bevor ein Schlüssel geschrieben wird | **200** mit echtem Inhalt erforderlich; ein HTTP 200, das einen Upstream-Fehler trägt, wird nicht akzeptiert |
| Re-Verifizierung 2026-10-21 | Code-Sperre weg → frisches Konto (Quota 100000) + Schlüssel in Gruppe `China-Ai-次卡`, der mit `t-deepseek-v4-pro` `200 "pong"` antwortet; **51 von 53 Schlüsseln** in `keys.txt` antworteten mit 200 und echtem Inhalt; ein mutierter Schlüssel → `401 Invalid token` |

## 🧭 Funktionsweise

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: ITKK (itkk.lol) — 国模 API 中转 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://itkk.lol/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Code | `GET /api/verification?email=` | **übersprungen, solange `email_verification=false`** (2026-10-21). Solange aktiv: punktlose Gmail funktioniert; recycelte Emailnator-Boxen können ein Konto enthalten (`邮箱地址已被占用`) |
| Registrierung | `POST /api/user/register` | Passwortregistrierung offen, Turnstile aus |
| Anmeldung | `POST /api/user/login` | JWT in der Antwort dieses Forks |
| Katalog | `GET /api/pricing` | `group_ratio`, `usable_group`, pro Modell `enable_groups` |
| Token | `POST /api/token/` `{group, model_limits}` | ohne Gruppe antwortet der Schlüssel mit 503 |
| Schlüssel | `POST /api/token/<id>/key` | Klartext |
| Prüfung | `POST /v1/chat/completions` | Live-200 erforderlich vor `keys.txt` |

## ⚙️ CLI-Optionen

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| Flag | Standard | Bedeutung |
| --- | --- | --- |
| `--count` | 5 | Anzahl der zu versuchenden Konten |
| `--conc` | 4 | parallele Konten |
| `--model` | `deepseek-v4.1-flash` | Modell, das das Gate bevorzugt |
| `--pool <file>` | integrierte Liste | optionale Exit-Datei (`ITKK_PROXIES`-Env funktioniert ebenfalls) |

## 🛰️ Hinter einem Proxy

**Optional — bei Skalierung empfohlen (Limits pro IP, Bans).** Das Tool funktioniert auch ohne Proxy.

- **Mit einem Pool:** übergib `--pool <file>` (oder setze `ITKK_PROXIES`), und jede Anfrage läuft über einen Exit aus dieser Liste — ein Konto behält einen Exit für alle seine Panel-Aufrufe, und die Mail-Schiene rotiert durch den Pool.
- **Ohne Pool:** die CLI gibt `running WITHOUT a proxy (direct)` aus und verbindet direkt — Registrierung, Code-Lesen, der Token-/Gruppen-Durchlauf und das Chat-Gate laufen alle gleich ab.

Der eigene Vorrat des Labs: `proxy-lab/out/exits-emergency-panel-live.txt`, `proxies-emergency*.txt`, `chrome-safe-exits.txt`, `captcha-exits-live.txt` plus lokaler Proxy; dort behält jedes Konto einen Exit für alle seine Panel-Aufrufe, und die Mail-Schiene rotiert durch den Pool (Proxy zuerst).

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein Chat-200-Schlüssel pro Zeile |
| `keys-unfunded.txt` | Schlüssel, deren Konto keine Live-Gruppe erreichen konnte |
| `accounts.json` | Benutzername / Passwort / E-Mail / Quota / Gruppe / Versuche pro Konto |
| `out/mint-<date>.log` | rohes Ausführungsprotokoll |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router. Ein Befehl verwandelt `keys.txt` in einen Provider-Node mit funktionierenden Kombos:

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Modelle werden dann als `itkk/<model id>` bereitgestellt, lastverteilt über jeden Schlüssel.

## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 Was der Anbieter gibt | ein Konto pro Schlüssel — Registrierung ohne Code seit 2026-10-21, Token an eine Live-Gruppe gebunden, jeder Schlüssel Chat-200 |
| 🔑 Was ein Schlüssel dir bringt | einen API-Schlüssel, der auf sein eigenes Konto beschränkt ist: die 5 Modell-IDs am unten stehenden Endpunkt, im Rahmen der Limits deines Tarifs. Die Quota liegt beim **Konto**, und genau deshalb legt dieses Tool ein Konto pro Schlüssel an |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 Deine Daten | nur itkk.lol und das von dir konfigurierte Inbox-Backend werden kontaktiert; Schlüssel bleiben auf deinem Rechner |

## 🐞 Issues

Wenn das Panel seine Registrierungsform, Gruppen oder das Guthaben ändert, stoppt das Tool an diesem Schritt und protokolliert die wörtliche Antwort des Panels in `accounts.json`.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey contributors

</div>