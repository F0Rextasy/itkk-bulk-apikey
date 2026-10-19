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

**ITKK (itkk.lol) のアカウントを、API キーを自動生成しながら一括作成 — OpenAI 互換の推論 + 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-5-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題報告](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ なぜこれがあるのか

itkk.lol は New API `v1.0.0-rc.40` のパネル（システム名 **ITKK**）で、**メールコードによるサインアップ**、Turnstile は**オフ**、パスワード登録は開放、そして**100000 クォータの登録クレジット**（quota_per_unit 500000 → 表示レートで ¥0.20）があります。1 アカウント = 1 キー。このツールは、パネル自身のリレーがコンテンツ付きで 200 を返した後にのみ、キーを `keys.txt` に書き込みます。

## 🎁 無料枠 — どれだけ得られるか

**新しいアカウントにはすべて登録クォータが付きます** — カード不要、キャプチャ不要。

| 項目 | 値 |
| --- | --- |
| 登録クォータ | **100000**（`quota_per_unit` 500000、表示 ¥0.20） |
| カード要否 | **不要** |
| デイリーチェックイン | このパネルでは無効（`checkin_enabled:false`） |
| 登録方法 | メールコード（ドットなし Gmail も可） |
| スケールの単位 | **1 アカウント = 1 キー** → `--count N` は「無料アカウント N 個」 |

> 💡 無料枠は ITKK (itkk.lol) — 中国国産モデル API 中継 — が設定しており、変更される可能性があります。最新の数値は [itkk.lol](https://itkk.lol) で確認してください。そして最終判断はツール自身のゲートに任せましょう:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — 全部で 5 つ

カタログは**グループに紐付いています**: 新規アカウントは `default` に入り、そこには*どのモデル*のチャネルもありません — グループを指定せずに作成したトークンは `503 No available channel for model X under group default (distributor)` を返します。`/api/pricing` は `group_ratio` とモデルごとの `enable_groups` を公開しており、mint はテスト前にトークンをそれらのグループの 1 つに紐付けます。2026-10-19 時点で実測したライブ ID: `deepseek-v4.1-flash`（グループ `China-Ai-flash`、0.1×）、`glm-5.3-flash`（`China-Ai-flash`）、`glm-5.3`（`China-Ai-福利`、0.05×）、`deepseek-v4-pro`（`China-Ai-福利`）、`kimi-k3`（`China-Ai-福利`）。

## 🧪 API の使い方

ベース URL は **`https://itkk.lol/v1`** — OpenAI 互換です。

```bash
curl https://itkk.lol/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

モデル ID は、トークンが紐付いているグループに属している必要があります。

## 🛠 クイックスタート

```bash
node providers/itkk.lol/mint.js --count 100 --conc 6 --model deepseek-v4.1-flash
```

すべての HTTP 呼び出しは `proxy-lab/out/*live*.txt` の出口（または WARP `socks5://127.0.0.1:40000`）を経由して出ていきます。直接リクエストは仕組み上拒否されます。

### 🖱️ ランチャー

## ✅ 動作検証済み — すべてのキーがテストされます

| チェック | 結果 |
| --- | --- |
| `GET /api/status` | **200** — `register_enabled=true`、`email_verification=true`、`turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **200** — メールは `ITKK <mail@itkk.lol>` から、件名 `ITKK邮箱验证邮件`、6 桁の 16 進コードで届く |
| `POST /api/user/register` | **200** — アカウントはクォータ 100000 でグループ `default` に入る |
| `POST /api/user/login` | **200** — `access_token` JWT（+ `session` Cookie） |
| `GET /api/user/self` | **200** — `quota`、`group` |
| `POST /api/token/` で `group:""` | **200**、しかしキーは決してルーティングされない: `503 No available channel … under group default` |
| `POST /api/token/` でカタログ上のグループを指定 | **200** — 紐付けたグループがチャネルに到達できるようにする |
| `POST /api/token/<id>/key` | **200** — 平文のキー |
| キーが書き込まれる前の `POST /v1/chat/completions` | 実際のコンテンツを伴う **200** が必須 |

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: ITKK (itkk.lol) — 国模 API 中转 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://itkk.lol/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| code | `GET /api/verification?email=` | ドットなし Gmail も可;リサイクルされた Emailnator のボックスは既にアカウントを保持している場合がある（`邮箱地址已被占用`） |
| signup | `POST /api/user/register` | パスワード登録は開放、Turnstile はオフ |
| sign-in | `POST /api/user/login` | このフォークの応答では JWT |
| catalogue | `GET /api/pricing` | `group_ratio`、`usable_group`、モデルごとの `enable_groups` |
| token | `POST /api/token/` `{group, model_limits}` | グループなしではキーは 503 を返す |
| key | `POST /api/token/<id>/key` | 平文 |
| check | `POST /v1/chat/completions` | `keys.txt` の前にライブな 200 が必須 |

## ⚙️ CLI オプション

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| フラグ | 既定値 | 意味 |
| --- | --- | --- |
| `--count` | 5 | 試行するアカウント数 |
| `--conc` | 4 | 並列アカウント数 |
| `--model` | `deepseek-v4.1-flash` | ゲートが優先するモデル |
| `--pool <file>` | 組み込みリスト | 追加の出口ファイル |

## 🛰️ プロキシの背後で

出口は `proxy-lab/out/exits-emergency-panel-live.txt`、`proxies-emergency*.txt`、`chrome-safe-exits.txt`、`captcha-exits-live.txt` に加えてローカル WARP から取得されます。各アカウントはそのすべてのパネル呼び出しに対して 1 つの出口を保持し、メール経路はプールをローテーションします（WARP が最優先）。直接リクエストは不可能です:出口がない場合 `req()` は例外を投げます。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | chat-200 を返したキーを 1 行に 1 つ |
| `keys-unfunded.txt` | アカウントがライブなグループに到達できなかったキー |
| `accounts.json` | アカウントごとのユーザー名 / パスワード / メール / クォータ / グループ / 試行回数 |
| `out/mint-<date>.log` | 生の実行ログ |

## 🔌 9Router への接続

[9Router](https://9router.com) はセルフホスト可能な OpenAI 互換ルーターです。1 つのコマンドで `keys.txt` を、動作するコンボを備えたプロバイダーノードに変換できます:

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

モデルはその後 `itkk/<model id>` として提供され、すべてのキーに負荷分散されます。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **ITKK (itkk.lol) — 中国国産モデル API 中継** — [itkk.lol](https://itkk.lol) |
| 🎁 プロバイダーが提供するもの | キー 1 つにつき 1 アカウント — メールコード登録、ライブなグループに紐付いたトークン、すべてのキーが chat-200 |
| 🔑 1 つのキーで得られるもの | 自身のアカウントにスコープされた 1 つの API キー:下記エンドポイント上の 5 つのモデル ID を、ご利用プランの上限まで。クォータは**アカウント**に紐付くため、このツールがキー 1 つにつきアカウントを 1 つ作成するのはまさにそのためです |
| 🌐 API の形式 | OpenAI 互換: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 あなたのデータ | 通信先は itkk.lol と、あなたが設定した受信箱バックエンドのみ;キーはあなたのマシンに留まります |

## 🐞 問題報告

パネルがサインアップの形、グループ、クレジットを変更した場合、ツールはそのステップで停止し、パネルの回答をそのまま `accounts.json` に記録します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照してください。

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey contributors

</div>