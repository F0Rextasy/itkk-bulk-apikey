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

**ITKK (itkk.lol) アカウントを自動生成された API キーとともに一括作成 — OpenAI 互換の推論 + 9Router コネクタ。**

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

itkk.lol は New API `v1.0.0-rc.40` パネル（システム名 **ITKK**）で、2026-10-19 までは**メールコードによるサインアップ**、2026-10-21 以降は**コード不要のサインアップ**（`email_verification=false`）、Turnstile は**オフ**、パスワード登録は開放、そして**100000 クォータのサインアップクレジット**（quota_per_unit 500000 → 表示レートで ¥0.20）を提供しています。1 アカウント = 1 キー。このツールは、パネル自身のリレーがコンテンツ付きで 200 を返した後にのみ、キーを `keys.txt` に書き込みます。

## 🎁 無料枠 — どれだけ得られるか

**すべての新規アカウントにサインアップクォータが付与されます** — カード不要、キャプチャ不要。

| 項目 | 値 |
| --- | --- |
| サインアップクォータ | **100000**（`quota_per_unit` 500000、表示 ¥0.20） |
| カード要求 | **なし** |
| デイリーチェックイン | このパネルでは無効（`checkin_enabled:false`） |
| サインアップ | **2026-10-21 以降はメールコード不要**（`email_verification=false`）。ゲートが有効だった間は gmail 系のコードが必要でした |
| スケールする単位 | **1 アカウント = 1 キー** → `--count N` は「N 個の無料アカウント」 |

> 💡 無料枠は ITKK (itkk.lol) — 国模 API 中转 によって設定されており、変更される可能性があります。最新の数値は [itkk.lol](https://itkk.lol) で確認してください — そしてツール自身のゲートに判断させましょう:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — 全 5 種類

カタログは**グループに紐づいています**: 新規アカウントは `default` に入り、そこには*どの*モデルのチャネルもありません — グループなしで作成されたトークンは `503 No available channel for model X under group default (distributor)` を返します。`/api/pricing` は `group_ratio` とモデルごとの `enable_groups` を公開しており、mint はテスト前にトークンをそれらのグループのいずれかにバインドします。2026-10-19 に計測されたライブ ID: `deepseek-v4.1-flash`（グループ `China-Ai-flash`、0.1×）、`glm-5.3-flash`（`China-Ai-flash`）、`glm-5.3`（`China-Ai-福利`、0.05×）、`deepseek-v4-pro`（`China-Ai-福利`）、`kimi-k3`（`China-Ai-福利`）。

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
# 1) your proxy list, one per line (http://… or socks5://…) — optional, see below
printf 'http://127.0.0.1:8080\n' > proxies.txt   # optional — without it the tool runs direct

# 2) go
node src/cli.js --count 100 --conc 6 --model deepseek-v4.1-flash --pool proxies.txt
```

プロキシリストが提供された場合（`--pool` / `ITKK_PROXIES`）、リクエストはそれを経由します。プールがなければツールは直接接続します。どちらのモードでもキーは `keys.txt` に到達します — ただしライブチャットが 200 を返した後にのみです。

### 🖱️ ランチャー

## ✅ 検証済み — すべてのキーがテストされています

| チェック | 結果 |
| --- | --- |
| `GET /api/status` | **200** — 本日は `register_enabled=true`、**`email_verification=false`**（2026-10-19 は `true` でした）、`turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **パネルがコードを要求する間は 200** — メールは `ITKK <mail@<panel-mail>>` として届き、件名は `ITKK邮箱验证邮件`、6 桁の 16 進コード。2026-10-21 以降は不要 |
| `POST /api/user/register` | **200** — アカウントはグループ `default` にクォータ 100000 で入ります。コードゲートがオフの場合、ボディは `verification_code:""` を受け付けます |
| `POST /api/user/login` | **200** — `access_token` JWT（+ `session` Cookie） |
| `GET /api/user/self` | **200** — `quota`、`group` |
| `POST /api/token/` with `group:""` | **200**、しかしキーは決してルーティングされません: `503 No available channel … under group default` |
| `POST /api/token/` with a catalogue group | **200** — バインドされたグループがチャネルを到達可能にします |
| `POST /api/token/<id>/key` | **200** — 平文キー |
| `POST /v1/chat/completions` before a key is written | **200** と実際のコンテンツが必要。上流エラーを伴う HTTP 200 は受け入れられません |
| re-verification 2026-10-21 | コードゲートが消滅 → 新規アカウント（クォータ 100000）+ グループ `China-Ai-次卡` のキーが `t-deepseek-v4-pro` で `200 "pong"` を返答。`keys.txt` 内の **53 キー中 51** が実際のコンテンツで 200 を返答。改変されたキー → `401 Invalid token` |

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
| code | `GET /api/verification?email=` | **`email_verification=false` の間はスキップ**（2026-10-21）。有効だった間: ドットなし gmail が機能。リサイクルされた Emailnator ボックスはアカウントを保持している可能性あり（`邮箱地址已被占用`） |
| signup | `POST /api/user/register` | パスワード登録開放、Turnstile オフ |
| sign-in | `POST /api/user/login` | このフォークの回答に JWT |
| catalogue | `GET /api/pricing` | `group_ratio`、`usable_group`、モデルごとの `enable_groups` |
| token | `POST /api/token/` `{group, model_limits}` | グループなしではキーは 503 を返す |
| key | `POST /api/token/<id>/key` | 平文 |
| check | `POST /v1/chat/completions` | `keys.txt` の前にライブ 200 が必要 |

## ⚙️ CLI オプション

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| フラグ | デフォルト | 意味 |
| --- | --- | --- |
| `--count` | 5 | 試行するアカウント数 |
| `--conc` | 4 | 並列アカウント数 |
| `--model` | `deepseek-v4.1-flash` | ゲートが優先するモデル |
| `--pool <file>` | 組み込みリスト | オプションの出口ファイル（`ITKK_PROXIES` 環境変数も可） |

## 🛰️ プロキシの背後で

**オプション — 大規模時には推奨（IP ごとの制限、BAN）。** ツールはプロキシなしでも動作します。

- **プールあり:** `--pool <file>` を渡す（または `ITKK_PROXIES` を設定する）と、すべてのリクエストがそのリストの出口を経由します — 1 アカウントはすべてのパネル呼び出しで 1 つの出口を保持し、メールレールはプールをローテーションします。
- **プールなし:** CLI は `running WITHOUT a proxy (direct)` を出力し、直接接続します — サインアップ、コード読み取り、トークン/グループの走査、チャットゲートはすべて同じように動作します。

ラボ自身の供給: `proxy-lab/out/exits-emergency-panel-live.txt`、`proxies-emergency*.txt`、`chrome-safe-exits.txt`、`captcha-exits-live.txt` に加えてローカルプロキシ。そこでは各アカウントがすべてのパネル呼び出しで 1 つの出口を保持し、メールレールはプールをローテーションします（プロキシ優先）。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | チャット 200 のキーを 1 行に 1 つ |
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
| 🎁 プロバイダーが提供するもの | キーごとに 1 アカウント — 2026-10-21 以降はコードなしでサインアップ、トークンはライブグループにバインド、すべてのキーがチャット 200 |
| 🔑 1 つのキーで得られるもの | 自身のアカウントにスコープされた 1 つの API キー: 以下のエンドポイントの 5 つのモデル ID を、あなたのプランの制限で。クォータは**アカウント**に存在し、まさにそれがこのツールがキーごとに 1 アカウントを作成する理由です |
| 🌐 API の形 | OpenAI 互換: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 あなたのデータ | 接触するのは itkk.lol と、あなたが設定した受信トレイバックエンドのみ。キーはあなたのマシンに留まります |

## 🐞 問題

パネルがサインアップの形、グループ、またはクレジットを変更した場合、ツールはそのステップで停止し、パネルの回答をそのまま `accounts.json` に記録します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey contributors

</div>