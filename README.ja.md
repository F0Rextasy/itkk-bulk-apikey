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

**ITKK (itkk.lol) アカウントを自動生成された API キーとともに一括作成 — OpenAI 互換推論 + 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-5-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## ✨ これが存在する理由

itkk.lol は New API `v1.0.0-rc.40` パネル（システム名 **ITKK**）で、**メールコードによるサインアップ**、Turnstile **オフ**、パスワード登録が開放されており、**100000 クォータのサインアップクレジット**（quota_per_unit 500000 → 表示レートで ¥0.20）があります。1 アカウント = 1 キー。このツールは、パネル自身のリレーがコンテンツ付きで 200 を返した後にのみ、キーを `keys.txt` に書き込みます。

## 🎁 無料枠 — どれだけ得られるか

**すべての新規アカウントにサインアップクォータが付与されます** — カード不要、キャプチャ不要。

| 項目 | 値 |
| --- | --- |
| サインアップクォータ | **100000**（`quota_per_unit` 500000、表示 ¥0.20） |
| カード必須 | **いいえ** |
| デイリーチェックイン | このパネルでは無効（`checkin_enabled:false`） |
| サインアップ | メールコード（ドットなし gmail も可） |
| スケールする単位 | **1 アカウント = 1 キー** → `--count N` は「N 個の無料アカウント」 |

> 💡 無料枠は ITKK (itkk.lol) — 国模 API 中转 によって設定されており、変更される可能性があります。最新の数値は [itkk.lol](https://itkk.lol) で確認してください — そしてツール自身のゲートに判断させてください:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — 全 5 種類

カタログは**グループに紐づいています**: 新規アカウントは `default` に入り、そこには*どのモデル*のチャネルもありません — グループなしで作成されたトークンは `503 No available channel for model X under group default (distributor)` を返します。`/api/pricing` は `group_ratio` とモデルごとの `enable_groups` を公開しており、mint はテスト前にトークンをそれらのグループのいずれかにバインドします。2026-10-19 に計測されたライブ ID: `deepseek-v4.1-flash`（グループ `China-Ai-flash`、0.1×）、`glm-5.3-flash`（`China-Ai-flash`）、`glm-5.3`（`China-Ai-福利`、0.05×）、`deepseek-v4-pro`（`China-Ai-福利`）、`kimi-k3`（`China-Ai-福利`）。

## 🧪 API の使い方

ベース URL は **`https://itkk.lol/v1`** — OpenAI 互換です。

```bash
curl https://itkk.lol/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

モデル ID は、トークンがバインドされているグループに属している必要があります。

## 🛠 クイックスタート

```bash
node providers/itkk.lol/mint.js --count 100 --conc 6 --model deepseek-v4.1-flash
```

すべての HTTP 呼び出しは `proxy-lab/out/*live*.txt` の出口（または WARP `socks5://127.0.0.1:40000`）を経由します。直接リクエストは構造上拒否されます。

### 🖱️ ランチャー



## ✅ 検証済み — すべてのキーがテストされています

| チェック | 結果 |
| --- | --- |
| `GET /api/status` | **200** — `register_enabled=true`、`email_verification=true`、`turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **200** — メールは `ITKK <mail@itkk.lol>` として届き、件名は `ITKK邮箱验证邮件`、6 桁の 16 進コード |
| `POST /api/user/register` | **200** — アカウントはグループ `default` にクォータ 100000 で登録される |
| `POST /api/user/login` | **200** — `access_token` JWT（+ `session` Cookie） |
| `GET /api/user/self` | **200** — `quota`、`group` |
| `POST /api/token/`（`group:""`） | **200**、しかしキーは決してルーティングされない: `503 No available channel … under group default` |
| `POST /api/token/`（カタログのグループ指定） | **200** — バインドされたグループがチャネルを到達可能にする |
| `POST /api/token/<id>/key` | **200** — 平文キー |
| キーが書き込まれる前の `POST /v1/chat/completions` | **200** で実際のコンテンツが必要 |

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
| コード | `GET /api/verification?email=` | ドットなし gmail も可。リサイクルされた Emailnator ボックスはアカウントを保持している場合がある（`邮箱地址已被占用`） |
| サインアップ | `POST /api/user/register` | パスワード登録が開放、Turnstile オフ |
| サインイン | `POST /api/user/login` | このフォークの応答に JWT |
| カタログ | `GET /api/pricing` | `group_ratio`、`usable_group`、モデルごとの `enable_groups` |
| トークン | `POST /api/token/` `{group, model_limits}` | グループなしではキーは 503 を返す |
| キー | `POST /api/token/<id>/key` | 平文 |
| チェック | `POST /v1/chat/completions` | `keys.txt` の前にライブ 200 が必要 |

## ⚙️ CLI オプション

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| フラグ | デフォルト | 意味 |
| --- | --- | --- |
| `--count` | 5 | 試行するアカウント数 |
| `--conc` | 4 | 並列アカウント数 |
| `--model` | `deepseek-v4.1-flash` | ゲートが優先するモデル |
| `--pool <file>` | 組み込みリスト | 追加の出口ファイル |

## 🛰️ プロキシの背後で

出口は `proxy-lab/out/exits-emergency-panel-live.txt`、`proxies-emergency*.txt`、`chrome-safe-exits.txt`、`captcha-exits-live.txt` およびローカル WARP から取得されます。各アカウントはすべてのパネル呼び出しに対して 1 つの出口を保持し、メールレールはプールをローテーションします（WARP が最初）。直接リクエストは不可能です: 出口がない場合 `req()` は例外を投げます。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 1 行につき 1 つの chat-200 キー |
| `keys-unfunded.txt` | アカウントがライブグループに到達できなかったキー |
| `accounts.json` | アカウントごとのユーザー名 / パスワード / メール / クォータ / グループ / 試行回数 |
| `out/mint-<date>.log` | 生の実行ログ |

## 🔌 9Router に接続

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです。1 つのコマンドで `keys.txt` を動作するコンボを持つプロバイダーノードに変換します:

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

モデルは `itkk/<model id>` として提供され、すべてのキーにわたって負荷分散されます。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 プロバイダーが提供するもの | キーごとに 1 アカウント — メールコードによるサインアップ、ライブグループにバインドされたトークン、すべてのキーが chat-200 |
| 🔑 1 つのキーで得られるもの | 自身のアカウントにスコープされた 1 つの API キー: 下記エンドポイントの 5 つのモデル ID を、プランの制限内で。クォータは**アカウント**に存在し、まさにそれがこのツールがキーごとに 1 アカウントを作成する理由です |
| 🌐 API の形 | OpenAI 互換: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 あなたのデータ | 接触するのは itkk.lol と、あなたが設定した inbox バックエンドのみ。キーはあなたのマシンに留まります |

## 🐞 問題

パネルがサインアップの形、グループ、クレジットを変更した場合、ツールはそのステップで停止し、パネルの応答をそのまま `accounts.json` に記録します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey contributors

</div>