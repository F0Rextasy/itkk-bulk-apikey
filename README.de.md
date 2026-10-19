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

**ITKK-Konten (itkk.lol) im Bulk-Verfahren mit automatisch generierten API-Schlüsseln anlegen — OpenAI-kompatible Inferenz + 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-5-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>



---

## ✨ Warum es dieses Projekt gibt

itkk.lol ist ein New API `v1.0.0-rc.40`-Panel (Systemname **ITKK**) mit **E-Mail-Code-Registrierung**, Turnstile **aus**, offener Passwortregistrierung und einem **Registrierungsguthaben von 100000 Quota** (quota_per_unit 500000 → ¥0.20 zum Anzeigekurs). Ein Konto = ein Schlüssel; dieses Tool schreibt einen Schlüssel erst dann in `keys.txt`, wenn das Relay des Panels selbst mit 200 und Inhalt geantwortet hat.

## 🎁 Kostenloser Tarif — wie viel du erhältst

**Jedes neue Konto erhält Registrierungsquota** — keine Karte, kein Captcha.

| Was | Wert |
| --- | --- |
| Registrierungsquota | **100000** (`quota_per_unit` 500000, Anzeige ¥0.20) |
| Karte erforderlich | **Nein** |
| Täglicher Check-in | auf diesem Panel nicht aktiviert (`checkin_enabled:false`) |
| Registrierung | E-Mail-Code (punktlose Gmail-Adressen funktionieren) |
| Die skalierende Einheit | **ein Konto = ein Schlüssel** → `--count N` bedeutet „N kostenlose Konten“ |

> 💡 Der kostenlose Tarif wird von ITKK (itkk.lol) — 国模 API 中转 — festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [itkk.lol](https://itkk.lol) — und lass das eigene Gate des Tools entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 5 davon

Der Katalog ist **gruppengebunden**: Ein frisches Konto landet in `default`, das Kanäle für *nichts* hat — ein ohne Gruppe erstelltes Token antwortet mit `503 No available channel for model X under group default (distributor)`. `/api/pricing` veröffentlicht `group_ratio` + `enable_groups` pro Modell, und der Mint-Vorgang bindet das Token vor dem Testen an eine dieser Gruppen. Live-IDs, gemessen am 2026-10-19: `deepseek-v4.1-flash` (Gruppe `China-Ai-flash`, 0.1×), `glm-5.3-flash` (`China-Ai-flash`), `glm-5.3` (`China-Ai-福利`, 0.05×), `deepseek-v4-pro` (`China-Ai-福利`), `kimi-k3` (`China-Ai-福利`).

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
node providers/itkk.lol/mint.js --count 100 --conc 6 --model deepseek-v4.1-flash
```

Jeder HTTP-Aufruf geht über einen Exit aus `proxy-lab/out/*live*.txt` (oder WARP `socks5://127.0.0.1:40000`); eine direkte Anfrage wird konstruktionsbedingt abgelehnt.

### 🖱️ Der Launcher



## ✅ Verifiziert funktionsfähig — jeder Schlüssel wird getestet

| Prüfung | Ergebnis |
| --- | --- |
| `GET /api/status` | **200** — `register_enabled=true`, `email_verification=true`, `turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **200** — E-Mail kommt als `ITKK <mail@itkk.lol>` an, Betreff `ITKK邮箱验证邮件`, 6-stelliger Hex-Code |
| `POST /api/user/register` | **200** — Konto landet in Gruppe `default` mit Quota 100000 |
| `POST /api/user/login` | **200** — `access_token` JWT (+ `session` cookie) |
| `GET /api/user/self` | **200** — `quota`, `group` |
| `POST /api/token/` mit `group:""` | **200**, aber der Schlüssel routet nie: `503 No available channel … under group default` |
| `POST /api/token/` mit einer Katalog-Gruppe | **200** — die gebundene Gruppe ist es, die den Kanal erreichbar macht |
| `POST /api/token/<id>/key` | **200** — Klartext-Schlüssel |
| `POST /v1/chat/completions` bevor ein Schlüssel geschrieben wird | **200** mit erforderlichem echten Inhalt |

## 🧭 So funktioniert es

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
| Code | `GET /api/verification?email=` | punktlose Gmail-Adressen funktionieren; recycelte Emailnator-Postfächer können bereits ein Konto enthalten (`邮箱地址已被占用`) |
| Registrierung | `POST /api/user/register` | Passwortregistrierung offen, Turnstile aus |
| Anmeldung | `POST /api/user/login` | JWT in der Antwort dieses Forks |
| Katalog | `GET /api/pricing` | `group_ratio`, `usable_group`, `enable_groups` pro Modell |
| Token | `POST /api/token/` `{group, model_limits}` | ohne Gruppe antwortet der Schlüssel mit 503 |
| Schlüssel | `POST /api/token/<id>/key` | Klartext |
| Prüfung | `POST /v1/chat/completions` | Live-200 erforderlich, bevor `keys.txt` geschrieben wird |

## ⚙️ CLI-Optionen

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| Flag | Standard | Bedeutung |
| --- | --- | --- |
| `--count` | 5 | Konten, die versucht werden |
| `--conc` | 4 | parallele Konten |
| `--model` | `deepseek-v4.1-flash` | Modell, das das Gate bevorzugt |
| `--pool <file>` | integrierte Liste | zusätzliche Exit-Datei |

## 🛰️ Hinter einem Proxy

Exits stammen aus `proxy-lab/out/exits-emergency-panel-live.txt`, `proxies-emergency*.txt`, `chrome-safe-exits.txt`, `captcha-exits-live.txt` plus lokalem WARP; jedes Konto hält einen Exit für alle seine Panel-Aufrufe, und die Mail-Schiene rotiert durch den Pool (WARP zuerst). Eine direkte Anfrage ist nicht möglich: `req()` wirft einen Fehler, wenn kein Exit vorhanden ist.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein Chat-200-Schlüssel pro Zeile |
| `keys-unfunded.txt` | Schlüssel, deren Konto keine Live-Gruppe erreichen konnte |
| `accounts.json` | Benutzername / Passwort / E-Mail / Quota / Gruppe / Versuche pro Konto |
| `out/mint-<date>.log` | Rohprotokoll des Laufs |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router. Ein Befehl verwandelt `keys.txt` in einen Provider-Node mit funktionierenden Kombos:

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Modelle werden dann als `itkk/<model id>` bereitgestellt und über alle Schlüssel hinweg lastverteilt.

## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 Was der Anbieter liefert | ein Konto pro Schlüssel — E-Mail-Code-Registrierung, Token an eine Live-Gruppe gebunden, jeder Schlüssel Chat-200 |
| 🔑 Was ein Schlüssel dir bringt | ein API-Schlüssel, der auf sein eigenes Konto beschränkt ist: die 5 Modell-IDs am untenstehenden Endpoint, im Rahmen der Limits deines Tarifs. Die Quota liegt beim **Konto**, weshalb dieses Tool genau ein Konto pro Schlüssel erstellt |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 Deine Daten | Es werden nur itkk.lol und das von dir konfigurierte Inbox-Backend kontaktiert; Schlüssel bleiben auf deinem Rechner |

## 🐞 Probleme

Wenn das Panel die Form seiner Registrierung, seine Gruppen oder sein Guthaben ändert, stoppt das Tool an diesem Schritt und zeichnet die wörtliche Antwort des Panels in `accounts.json` auf.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey-Mitwirkende

</div>