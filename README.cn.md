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

**批量创建 ITKK (itkk.lol) 账户并自动生成 API 密钥 — 兼容 OpenAI 的推理 + 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-5-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么会有这个项目

itkk.lol 是一个 New API `v1.0.0-rc.40` 面板（系统名称 **ITKK**），在 2026-10-19 之前采用**邮箱验证码注册**，自 2026-10-21 起支持**免验证码注册**（`email_verification=false`），Turnstile **已关闭**，密码注册开放，并提供 **100000 配额注册赠送**（quota_per_unit 500000 → 按显示汇率约 ¥0.20）。一个账户 = 一个密钥；本工具只有在面板自身的转发服务返回 200 且带有内容后，才会将密钥写入 `keys.txt`。

## 🎁 免费额度 — 你能获得多少

**每个新账户都会获得注册配额** — 无需银行卡，无需验证码。

| 项目 | 值 |
| --- | --- |
| 注册配额 | **100000**（`quota_per_unit` 500000，显示约 ¥0.20） |
| 是否需要银行卡 | **否** |
| 每日签到 | 此面板未启用（`checkin_enabled:false`） |
| 注册 | **自 2026-10-21 起无需邮箱验证码**（`email_verification=false`）；在验证码开启期间，需要来自 gmail 系列的验证码 |
| 可扩展的单位 | **一个账户 = 一个密钥** → `--count N` 即“N 个免费账户” |

> 💡 免费额度由 ITKK (itkk.lol) — 国模 API 中转 设定，可能会变化。请在 [itkk.lol](https://itkk.lol) 查看实时数据 — 并让工具自身的验证关卡来判断：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 — 全部 5 个

模型目录是**按分组绑定的**：新账户会落入 `default` 分组，而该分组*没有任何*渠道 — 未指定分组创建的令牌会返回 `503 No available channel for model X under group default (distributor)`。`/api/pricing` 会公布 `group_ratio` 以及每个模型的 `enable_groups`，而铸造流程会在测试前将令牌绑定到其中一个分组。2026-10-19 实测的实时 id：`deepseek-v4.1-flash`（分组 `China-Ai-flash`，0.1×）、`glm-5.3-flash`（`China-Ai-flash`）、`glm-5.3`（`China-Ai-福利`，0.05×）、`deepseek-v4-pro`（`China-Ai-福利`）、`kimi-k3`（`China-Ai-福利`）。

## 🧪 如何使用 API

基础 URL 为 **`https://itkk.lol/v1`** — 兼容 OpenAI。

```bash
curl https://itkk.lol/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

模型 id 必须属于该令牌所绑定的分组。

## 🛠 快速开始

```bash
# 1) your proxy list, one per line (http://… or socks5://…) — optional, see below
printf 'http://127.0.0.1:8080\n' > proxies.txt   # optional — without it the tool runs direct

# 2) go
node src/cli.js --count 100 --conc 6 --model deepseek-v4.1-flash --pool proxies.txt
```

当提供了代理列表时（`--pool` / `ITKK_PROXIES`），请求会通过你的代理列表；没有代理池时，工具会直接连接。无论哪种模式，密钥都会进入 `keys.txt` — 但仍然只有在实时聊天返回 200 之后才会写入。

### 🖱️ 启动器

## ✅ 已验证可用 — 每个密钥都经过测试

| 检查 | 结果 |
| --- | --- |
| `GET /api/status` | **200** — 今天 `register_enabled=true`，**`email_verification=false`**（2026-10-19 时为 `true`），`turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **在面板要求验证码时返回 200** — 邮件以 `ITKK <mail@<panel-mail>>` 形式到达，主题为 `ITKK邮箱验证邮件`，6 位十六进制验证码；2026-10-21 之后不再需要 |
| `POST /api/user/register` | **200** — 账户落入 `default` 分组，配额为 100000；验证码关卡关闭后，请求体接受 `verification_code:""` |
| `POST /api/user/login` | **200** — `access_token` JWT（+ `session` cookie） |
| `GET /api/user/self` | **200** — `quota`、`group` |
| `POST /api/token/` 带 `group:""` | **200**，但密钥永远无法路由：`503 No available channel … under group default` |
| `POST /api/token/` 带目录中的分组 | **200** — 绑定的分组才是渠道可达的关键 |
| `POST /api/token/<id>/key` | **200** — 明文密钥 |
| 在写入密钥前 `POST /v1/chat/completions` | 需要 **200** 且带有真实内容；携带上游错误的 HTTP 200 不被接受 |
| 2026-10-21 重新验证 | 验证码关卡已移除 → 新账户（配额 100000）+ 密钥绑定到分组 `China-Ai-次卡`，使用 `t-deepseek-v4-pro` 返回 `200 "pong"`；`keys.txt` 中 **53 个密钥中的 51 个**返回 200 且带有真实内容；篡改后的密钥 → `401 Invalid token` |

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: ITKK (itkk.lol) — 国模 API 中转 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://itkk.lol/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 备注 |
| --- | --- | --- |
| 验证码 | `GET /api/verification?email=` | **在 `email_verification=false` 时跳过**（2026-10-21）。在开启期间：无点 gmail 可用；被回收的 Emailnator 邮箱可能已持有账户（`邮箱地址已被占用`） |
| 注册 | `POST /api/user/register` | 密码注册开放，Turnstile 关闭 |
| 登录 | `POST /api/user/login` | 此分支的响应中包含 JWT |
| 目录 | `GET /api/pricing` | `group_ratio`、`usable_group`、每个模型的 `enable_groups` |
| 令牌 | `POST /api/token/` `{group, model_limits}` | 不带分组时密钥返回 503 |
| 密钥 | `POST /api/token/<id>/key` | 明文 |
| 检查 | `POST /v1/chat/completions` | 写入 `keys.txt` 前需要实时 200 |

## ⚙️ CLI 选项

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| 标志 | 默认值 | 含义 |
| --- | --- | --- |
| `--count` | 5 | 尝试创建的账户数 |
| `--conc` | 4 | 并行账户数 |
| `--model` | `deepseek-v4.1-flash` | 验证关卡优先使用的模型 |
| `--pool <file>` | 内置列表 | 可选的出口文件（`ITKK_PROXIES` 环境变量也可用） |

## 🛰️ 在代理之后

**可选 — 大规模使用时推荐（每 IP 限制、封禁）。** 本工具在没有代理时也能工作。

- **有代理池时：** 传入 `--pool <file>`（或设置 `ITKK_PROXIES`），每个请求都会通过该列表中的一个出口 — 一个账户在其所有面板调用中保持一个出口，而邮件通道会在代理池中轮换。
- **没有代理池时：** CLI 会打印 `running WITHOUT a proxy (direct)` 并直接连接 — 注册、读取验证码、令牌/分组遍历以及聊天验证关卡都以相同方式运行。

实验室自有的供应：`proxy-lab/out/exits-emergency-panel-live.txt`、`proxies-emergency*.txt`、`chrome-safe-exits.txt`、`captcha-exits-live.txt` 以及本地代理；在那里，每个账户在其所有面板调用中保持一个出口，而邮件通道会在代理池中轮换（优先使用代理）。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个聊天返回 200 的密钥 |
| `keys-unfunded.txt` | 其账户无法到达可用分组的密钥 |
| `accounts.json` | 每个账户的用户名 / 密码 / 邮箱 / 配额 / 分组 / 尝试次数 |
| `out/mint-<date>.log` | 原始运行日志 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器。一条命令即可将 `keys.txt` 转换为带有可用组合的 provider-node：

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

随后模型会以 `itkk/<model id>` 的形式提供服务，并在所有密钥之间进行负载均衡。

## 🔑 一个密钥能给你带来什么

| | |
| --- | --- |
| 🏢 提供商 | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 提供商提供什么 | 每个密钥一个账户 — 自 2026-10-21 起无需验证码注册，令牌绑定到可用分组，每个密钥聊天返回 200 |
| 🔑 一个密钥能给你带来什么 | 一个 API 密钥，作用域为其自身账户：下方端点上的 5 个模型 id，受你的套餐限制。配额存在于**账户**上，这正是本工具为每个密钥创建一个账户的原因 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://itkk.lol/v1/chat/completions` |
| 🔒 你的数据 | 仅会联系 itkk.lol 和你配置的收件箱后端；密钥保留在你的机器上 |

## 🐞 问题

如果面板更改其注册形态、分组或额度，工具会在该步骤停止，并将面板的逐字答复记录到 `accounts.json` 中。

## 📄 许可证

MIT © 2026 — 参见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey contributors

</div>