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

**Massenhaftes Erstellen von ITKK-Konten (itkk.lol) mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz + 9Router-Konnektor.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-5-of-them) · [🧪 Die API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 Funktionsweise](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

itkk.lol ist ein New-API-`v1.0.0-rc.40`-Panel (Systemname **ITKK**) mit **E-Mail-Code-Registrierung** bis 2026-10-19 und **codefreier Registrierung** seit 2026-10-21 (`email_verification=false`), Turnstile **aus**, Passwortregistrierung offen und einem **Registrierungsguthaben von 100000** (quota_per_unit 500000 → ¥0,20 zum Anzeigekurs). Ein Konto = ein Schlüssel; dieses Tool schreibt einen Schlüssel erst dann in `keys.txt`, wenn das Relay des Panels selbst mit 200 und Inhalt geantwortet hat.

## 🎁 Kostenlose Stufe — wie viel du bekommst

**Jedes neue Konto erhält Registrierungsguthaben** — keine Karte, kein Captcha.

| Was | Wert |
| --- | --- |
| Registrierungsguthaben | **100000** (`quota_per_unit` 500000, Anzeige ¥0,20) |
| Karte erforderlich | **Nein** |
| Täglicher Check-in | auf diesem Panel nicht aktiviert (`checkin_enabled:false`) |
| Registrierung | **kein E-Mail-Code seit 2026-10-21** (`email_verification=false`); solange die Sperre aktiv war, war ein Code aus der Gmail-Familie erforderlich |
| Die Einheit, die skaliert | **ein Konto = ein Schlüssel** → `--count N` bedeutet „N kostenlose Konten" |

> 💡 Die kostenlose Stufe wird von ITKK (itkk.lol) — 国模 API 中转 — festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [itkk.lol](https://itkk.lol) — und lass das Gate des Tools selbst entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 5 davon

Der Katalog ist **gruppengebunden**: Ein frisches Konto landet in `default`, das Kanäle für *nichts* hat — ein Token, das ohne Gruppe erstellt wurde, antwortet `503 No available channel for model X under group default (distributor)`. `/api/pricing` veröffentlicht `group_ratio` + pro Modell `enable_groups`, und die Prägung bindet das Token vor dem Test an eine dieser Gruppen. Live-IDs gemessen am 2026-10-19: `deepseek-v4.1-flash` (Gruppe `China-Ai-flash`, 0,1×), `glm-5.3-flash` (`China-Ai-flash`), `glm-5.3` (`China-Ai-福利`, 0,05×), `deepseek-v4-pro` (`China-Ai-福利`), `kimi-k3` (`China-Ai-福利`).

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
node src/cli.js --count 100 --conc 6 --model deepseek-v4.1-flash
```

Jeder HTTP-Aufruf verlässt das System über einen Exit aus `proxy-lab/out/*live*.txt` (oder WARP `socks5://127.0.0.1:40000`); eine direkte Anfrage wird konstruktionsbedingt abgelehnt.

### 🖱️ Der Launcher

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

| Prüfung | Ergebnis |
| --- | --- |
| `GET /api/status` | **200** — heute `register_enabled=true`, **`email_verification=false`** (war `true` am 2026-10-19), `turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **200, solange das Panel einen Code verlangt** — Mail kommt als `ITKK <mail@<panel>>`, Betreff `ITKK邮箱验证邮件`, 6-Hex-Code; nach 2026-10-21 nicht mehr nötig |
| `POST /api/user/register` | **200** — Konto landet in Gruppe `default` mit Guthaben 100000; bei ausgeschalteter Code-Sperre akzeptiert der Body `verification_code:""` |
| `POST /api/user/login` | **200** — `access_token` JWT (+ `session`-Cookie) |
| `GET /api/user/self` | **200** — `quota`, `group` |
| `POST /api/token/` mit `group:""` | **200**, aber der Schlüssel routet nie: `503 No available channel … under group default` |
| `POST /api/token/` mit einer Kataloggruppe | **200** — die gebundene Gruppe ist es, die den Kanal erreichbar macht |
| `POST /api/token/<id>/key` | **200** — Klartextschlüssel |
| `POST /v1/chat/completions`, bevor ein Schlüssel geschrieben wird | **200** mit echtem Inhalt erforderlich; das Panel antwortet auch mit HTTP 200 und trägt dabei einen Upstream-Fehler, und dieser degradierte Body wird abgelehnt |
| E-Mail-Domain-Richtlinie | **nur Gmail-Familie, solange ein Code verlangt wird** — `hotmail/outlook`- und `mail.tm`-Domains antworten `200 {"code":"EMAIL_ADDRESS_REJECTED"…}` |
| Endausbeute 2026-10-19 | **chat-200-Schlüssel** aus 175 Versuchen, dann eine Mail-Zustellmauer (Gmail wies die Nachrichten des Panels an die Postfächer zurück, die das Panel akzeptiert) — `out/mail-wall-evidence.json` |
| Erneute Verifizierung 2026-10-21 | Code-Sperre weg → frisches Konto `itkke8cfb8` (Guthaben 100000) + Schlüssel in Gruppe `China-Ai-次卡`, der mit `t-deepseek-v4-pro` `200 "pong"` antwortet; jeder Schlüssel in `keys.txt` antwortete mit 200 und echtem Inhalt; mutierter Schlüssel → `401 Invalid token` |

> **Qualitätsgates.** Jeder Schlüssel hier hat ein Live-`chat-200` bestanden, bevor er in `keys.txt` geschrieben wurde
> (tote Schlüssel werden nie ausgeliefert). Router-Kombinationen folgen derselben Regel auf Modellebene: Ein Eintrag wird
> **nur hinzugefügt, wenn das Modell `chat-200` antwortet und Tools aufrufen kann** — ein Modell ohne Tool-Unterstützung,
> ein toter Schlüssel oder ein toter Anbieter wird verworfen statt hinzugefügt. Führe den Verifizierungsschritt jederzeit erneut aus;
> Fehler werden gemeldet, niemals verborgen.

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
| Code | `GET /api/verification?email=` | **übersprungen, solange `email_verification=false`** (2026-10-21): Die Prägung liest die Sperre und registriert mit leerem Code. Solange sie aktiv war: punktloses Gmail funktioniert; recycelte Emailnator-Postfächer können ein Konto enthalten (`邮箱地址已被占用`) |
| Registrierung | `POST /api/user/register` | Passwortregistrierung offen, Turnstile aus; `verification_code` ist leer, wenn die Sperre aus ist |
| Anmeldung | `POST /api/user/login` | JWT in der Antwort dieses Forks |
| Katalog | `GET /api/pricing` | `group_ratio`, `usable_group`, pro Modell `enable_groups` |
| Token | `POST /api/token/` `{group, model_limits}` | ohne Gruppe antwortet der Schlüssel mit 503 |
| Schlüssel | `POST /api/token/<id>/key` | Klartext |
| Prüfung | `POST /v1/chat/completions` | Live-200 erforderlich vor `keys.txt` |

## ⚙️ CLI-Optionen

```bash
node src/cli.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| Flag | Standard | Bedeutung |
| --- | --- | --- |
| `--count` | 5 | Anzahl der zu versuchenden Konten |
| `--conc` | 4 | parallele Konten |
| `--model` | `deepseek-v4.1-flash` | Modell, das das Gate bevorzugt |
| `--pool <file>` | integrierte Liste | zusätzliche Exit-Datei |

## 🛰️ Hinter einem Proxy

**Optional — bei Skalierung empfohlen (Limits pro IP, Sperren).** Das Tool funktioniert auch ohne Proxy.

- **Mit einem Pool:** Übergib `--pool <file>` (oder setze `ITKK_PROXIES`), und jede Anfrage geht über einen Exit aus dieser Liste — ein Konto behält einen Exit für alle seine Panel-Aufrufe, und die Mail-Schiene rotiert durch den Pool.
- **Ohne einen Pool:** Die CLI gibt `running WITHOUT a proxy (direct)` aus und verbindet direkt — Registrierung, Code-Lesen, der Token-/Gruppen-Durchlauf und das Chat-Gate laufen alle gleich ab.

Der eigene Vorrat des Labs: `proxy-lab/out/exits-emergency-panel-live.txt`, `proxies-emergency*.txt`, `chrome-safe-exits.txt`, `captcha-exits-live.txt` plus lokales WARP; dort behält jedes Konto einen Exit für alle seine Panel-Aufrufe, und die Mail-Schiene rotiert durch den Pool (WARP zuerst).

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein chat-200-Schlüssel pro Zeile |
| `keys-unfunded.txt` | Schlüssel, deren Konto keine Live-Gruppe erreichen konnte |
| `accounts.json` | Benutzername / Passwort / E-Mail / Guthaben / Gruppe / Versuche pro Konto |
| `out/mint-<date>.log` | rohes Ausführungsprotokoll |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router. Ein Befehl verwandelt `keys.txt` in einen Provider-Node mit funktionierenden Kombinationen:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Modelle werden dann als `itkk/<model id>` bereitgestellt, lastverteilt über jeden Schlüssel.

## 🔌 Mit OmniRoute verbinden

[OmniRoute](https://omniroute.online) ist ein selbst gehosteter, OpenAI-kompatibler Router. Ein Befehl verwandelt `keys.txt` in einen Provider-Node mit funktionierenden Kombinationen:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

Modelle werden dann als `itkk/<model id>` bereitgestellt, lastverteilt über jeden Schlüssel.

## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 Was der Anbieter gibt | ein Konto pro Schlüssel — Registrierung ohne Code seit 2026-10-21, Token an eine Live-Gruppe gebunden, jeder Schlüssel chat-200 |
| 🔑 Was ein Schlüssel dir bringt | einen API-Schlüssel, der auf sein eigenes Konto beschränkt ist: die 5 Modell-IDs am unten stehenden Endpunkt, im Rahmen deines Tarifs. Das Guthaben liegt auf dem **Konto**, weshalb dieses Tool genau ein Konto pro Schlüssel erstellt |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 Deine Daten | nur itkk.lol und das von dir konfigurierte Inbox-Backend werden kontaktiert; Schlüssel bleiben auf deinem Rechner |

## 🐞 Probleme

Wenn das Panel seine Registrierungsform, Gruppen oder sein Guthaben ändert, stoppt das Tool an diesem Schritt und zeichnet die wörtliche Antwort des Panels in `accounts.json` auf.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey contributors

</div>