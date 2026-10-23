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

**Créez en masse des comptes ITKK (itkk.lol) avec des clés API générées automatiquement — inférence compatible OpenAI + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-5-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Pourquoi ce projet existe

itkk.lol est un panneau New API `v1.0.0-rc.40` (nom du système **ITKK**) avec **inscription par code e-mail** jusqu'au 2026-10-19 et **inscription sans code** depuis le 2026-10-21 (`email_verification=false`), Turnstile **désactivé**, inscription par mot de passe ouverte et un **crédit d'inscription de 100000 quotas** (quota_per_unit 500000 → ¥0.20 au taux affiché). Un compte = une clé ; cet outil n'écrit une clé dans `keys.txt` qu'après que le relais du panneau lui-même a répondu 200 avec du contenu.

## 🎁 Offre gratuite — ce que vous obtenez

**Chaque nouveau compte reçoit un quota d'inscription** — sans carte, sans captcha.

| Quoi | Valeur |
| --- | --- |
| Quota d'inscription | **100000** (`quota_per_unit` 500000, affichage ¥0.20) |
| Carte requise | **Non** |
| Check-in quotidien | non activé sur ce panneau (`checkin_enabled:false`) |
| Inscription | **pas de code e-mail depuis le 2026-10-21** (`email_verification=false`) ; tant que la barrière était active, un code de la famille gmail était requis |
| L'unité qui compte | **un compte = une clé** → `--count N` signifie « N comptes gratuits » |

> 💡 L'offre gratuite est définie par ITKK (itkk.lol) — 国模 API 中转 et peut changer. Consultez les chiffres en direct sur [itkk.lol](https://itkk.lol) — et laissez la barrière de l'outil décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — les 5 au complet

Le catalogue est **lié à un groupe** : un nouveau compte atterrit dans `default`, qui n'a de canaux pour *rien* — un jeton créé sans groupe répond `503 No available channel for model X under group default (distributor)`. `/api/pricing` publie `group_ratio` + `enable_groups` par modèle, et la création lie le jeton à l'un de ces groupes avant le test. Identifiants en direct mesurés le 2026-10-19 : `deepseek-v4.1-flash` (groupe `China-Ai-flash`, 0.1×), `glm-5.3-flash` (`China-Ai-flash`), `glm-5.3` (`China-Ai-福利`, 0.05×), `deepseek-v4-pro` (`China-Ai-福利`), `kimi-k3` (`China-Ai-福利`).

## 🧪 Comment utiliser l'API

L'URL de base est **`https://itkk.lol/v1`** — compatible OpenAI.

```bash
curl https://itkk.lol/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

L'identifiant du modèle doit appartenir au groupe auquel le jeton est lié.

## 🛠 Démarrage rapide

```bash
node providers/itkk.lol/mint.js --count 100 --conc 6 --model deepseek-v4.1-flash
```

Chaque appel HTTP sort par une sortie de `proxy-lab/out/*live*.txt` (ou WARP `socks5://127.0.0.1:40000`) ; une requête directe est refusée par construction.

### 🖱️ Le lanceur

## ✅ Vérifié fonctionnel — chaque clé est testée

| Vérification | Résultat |
| --- | --- |
| `GET /api/status` | **200** — aujourd'hui `register_enabled=true`, **`email_verification=false`** (était `true` le 2026-10-19), `turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **200 tant que le panneau demande un code** — le courrier arrive sous la forme `ITKK <mail@<panel>>`, objet `ITKK邮箱验证邮件`, code de 6 caractères hexadécimaux ; plus nécessaire après le 2026-10-21 |
| `POST /api/user/register` | **200** — le compte atterrit dans le groupe `default` avec un quota de 100000 ; quand la barrière de code est désactivée, le corps accepte `verification_code:""` |
| `POST /api/user/login` | **200** — `access_token` JWT (+ cookie `session`) |
| `GET /api/user/self` | **200** — `quota`, `group` |
| `POST /api/token/` avec `group:""` | **200**, mais la clé ne route jamais : `503 No available channel … under group default` |
| `POST /api/token/` avec un groupe du catalogue | **200** — c'est le groupe lié qui rend le canal accessible |
| `POST /api/token/<id>/key` | **200** — clé en clair |
| `POST /v1/chat/completions` avant qu'une clé ne soit écrite | **200** avec du contenu réel requis ; le panneau répond aussi HTTP 200 en portant une erreur amont, et ce corps dégradé est rejeté |
| politique de domaine e-mail | **famille gmail uniquement tant qu'un code est demandé** — les domaines `hotmail/outlook` et `mail.tm` répondent `200 {"code":"EMAIL_ADDRESS_REJECTED"…}` |
| rendement final 2026-10-19 | **clés chat-200** à partir de 175 tentatives, puis un mur de livraison de courrier (Gmail a renvoyé les messages du panneau vers les boîtes que le panneau accepte) — `out/mail-wall-evidence.json` |
| re-vérification 2026-10-21 | barrière de code disparue → nouveau compte `itkke8cfb8` (quota 100000) + clé sur le groupe `China-Ai-次卡` répondant `200 "pong"` avec `t-deepseek-v4-pro` ; chaque clé de `keys.txt` a répondu 200 avec du contenu réel ; clé mutée → `401 Invalid token` |

> **Barrières de qualité.** Chaque clé ici a passé un `chat-200` en direct avant d'être écrite dans `keys.txt`
> (les clés mortes ne sont jamais livrées). Les combos du routeur suivent la même règle au niveau du modèle : une entrée n'est
> ajoutée **que si le modèle répond `chat-200` et peut appeler des outils** — un modèle sans support des outils,
> une clé morte ou un fournisseur mort est écarté au lieu d'être ajouté. Relancez l'étape de vérification à tout moment ;
> les échecs sont signalés, jamais cachés.

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: ITKK (itkk.lol) — 国模 API 中转 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://itkk.lol/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Notes |
| --- | --- | --- |
| code | `GET /api/verification?email=` | **ignoré tant que `email_verification=false`** (2026-10-21) : la création lit la barrière et s'inscrit avec un code vide. Tant qu'elle était active : gmail sans point fonctionne ; les boîtes Emailnator recyclées peuvent déjà contenir un compte (`邮箱地址已被占用`) |
| inscription | `POST /api/user/register` | inscription par mot de passe ouverte, Turnstile désactivé ; `verification_code` est vide quand la barrière est désactivée |
| connexion | `POST /api/user/login` | JWT dans la réponse de ce fork |
| catalogue | `GET /api/pricing` | `group_ratio`, `usable_group`, `enable_groups` par modèle |
| jeton | `POST /api/token/` `{group, model_limits}` | sans groupe, la clé répond 503 |
| clé | `POST /api/token/<id>/key` | en clair |
| vérification | `POST /v1/chat/completions` | 200 en direct requis avant `keys.txt` |

## ⚙️ Options CLI

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| Option | Défaut | Signification |
| --- | --- | --- |
| `--count` | 5 | comptes à tenter |
| `--conc` | 4 | comptes en parallèle |
| `--model` | `deepseek-v4.1-flash` | modèle que la barrière préfère |
| `--pool <file>` | liste intégrée | fichier de sorties supplémentaire |

## 🛰️ Derrière un proxy

**Facultatif — recommandé à grande échelle (limites par IP, bannissements).** L'outil fonctionne aussi sans proxy.

- **Avec un pool :** passez `--pool <file>` (ou définissez `ITKK_PROXIES`) et chaque requête passe par une sortie de cette liste — un compte conserve une sortie pour tous ses appels au panneau, et le rail de courrier tourne à travers le pool.
- **Sans pool :** le CLI affiche `running WITHOUT a proxy (direct)` et se connecte directement — inscription, lecture du code, parcours jeton/groupe et barrière de chat s'exécutent tous de la même manière.

L'approvisionnement du labo : `proxy-lab/out/exits-emergency-panel-live.txt`, `proxies-emergency*.txt`, `chrome-safe-exits.txt`, `captcha-exits-live.txt` plus WARP local ; là, chaque compte conserve une sortie pour tous ses appels au panneau et le rail de courrier tourne à travers le pool (WARP en premier).

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé chat-200 par ligne |
| `keys-unfunded.txt` | clés dont le compte n'a pas pu atteindre un groupe actif |
| `accounts.json` | nom d'utilisateur / mot de passe / e-mail / quota / groupe / tentatives par compte |
| `out/mint-<date>.log` | journal brut d'exécution |

## 🔌 Connexion à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé compatible OpenAI. Une commande transforme `keys.txt` en un nœud fournisseur avec des combos fonctionnels :

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Les modèles sont alors servis sous `itkk/<model id>`, avec équilibrage de charge sur toutes les clés.

## 🔌 Connexion à OmniRoute

[OmniRoute](https://omniroute.online) est un routeur auto-hébergé compatible OpenAI. Une commande transforme `keys.txt` en un nœud fournisseur avec des combos fonctionnels :

```bash
node proxy-lab/omniroute-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Les modèles sont alors servis sous `itkk/<model id>`, avec équilibrage de charge sur toutes les clés.

## 🔑 Ce qu'une clé vous donne

| | |
| --- | --- |
| 🏢 Fournisseur | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 Ce que le fournisseur donne | un compte par clé — inscription sans code depuis le 2026-10-21, jeton lié à un groupe actif, chaque clé chat-200 |
| 🔑 Ce qu'une clé vous donne | une clé API limitée à son propre compte : les 5 identifiants de modèles sur le point de terminaison ci-dessous, aux limites de votre offre. Le quota vit sur le **compte**, ce qui explique précisément pourquoi cet outil crée un compte par clé |
| 🌐 Forme de l'API | compatible OpenAI : `POST https://itkk.lol/v1/chat/completions` |
| 🔒 Vos données | seuls itkk.lol et le backend de boîte de réception que vous configurez sont contactés ; les clés restent sur votre machine |

## 🐞 Problèmes

Si le panneau modifie la forme de son inscription, ses groupes ou son crédit, l'outil s'arrête à cette étape et consigne la réponse textuelle du panneau dans `accounts.json`.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey contributors

</div>