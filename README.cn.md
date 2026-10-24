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
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-5-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么会有这个项目

itkk.lol 是一个 New API `v1.0.0-rc.40` 面板（系统名称 **ITKK**），在 2026-10-19 之前采用**邮箱验证码注册**，自 2026-10-21 起改为**免验证码注册**（`email_verification=false`），Turnstile **关闭**，密码注册开放，并提供 **100000 配额的新用户注册赠送额度**（quota_per_unit 500000 → 按显示汇率约 ¥0.20）。一个账户 = 一个密钥；本工具只有在面板自身的转发服务返回 200 且带有内容后，才会将密钥写入 `keys.txt`。

## 🎁 免费额度 — 你能获得多少

**每个新账户都会获得注册赠送额度** — 无需银行卡，无需验证码。

| 项目 | 值 |
| --- | --- |
| 注册赠送额度 | **100000**（`quota_per_unit` 500000，显示约 ¥0.20） |
| 是否需要银行卡 | **否** |
| 每日签到 | 此面板未启用（`checkin_enabled:false`） |
| 注册 | **自 2026-10-21 起无需邮箱验证码**（`email_verification=false`）；在验证码门槛开启期间，需要来自 gmail 系列的验证码 |
| 扩展的单位 | **一个账户 = 一个密钥** → `--count N` 即“N 个免费账户” |

> 💡 免费额度由 ITKK (itkk.lol) — 国模 API 中转 设定，可能会变化。请在 [itkk.lol](https://itkk.lol) 查看实时数据 — 并让工具自身的关卡来决定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 — 全部 5 个

模型目录是**按分组绑定的**：新账户默认落在 `default` 分组，而该分组*没有任何*渠道 — 未绑定分组创建的令牌会返回 `503 No available channel for model X under group default (distributor)`。`/api/pricing` 会公布 `group_ratio` 以及每个模型的 `enable_groups`，铸造流程会在测试前将令牌绑定到其中一个分组。2026-10-19 实测的实时 id：`deepseek-v4.1-flash`（分组 `China-Ai-flash`，0.1×）、`glm-5.3-flash`（`China-Ai-flash`）、`glm-5.3`（`China-Ai-福利`，0.05×）、`deepseek-v4-pro`（`China-Ai-福利`）、`kimi-k3`（`China-Ai-福利`）。

## 🧪 如何使用 API

基础 URL 为 **`https://itkk.lol/v1`** — 兼容 OpenAI。

```bash
curl https://itkk.lol/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

模型 id 必须属于令牌所绑定的分组。

## 🛠 快速开始

```bash
node src/cli.js --count 100 --conc 6 --model deepseek-v4.1-flash
```

每个 HTTP 调用都通过 `proxy-lab/out/*live*.txt` 中的出口（或 WARP `socks5://127.0.0.1:40000`）发出；直接请求在构造上就会被拒绝。

### 🖱️ 启动器

## ✅ 已验证可用 — 每个密钥都经过测试

| 检查项 | 结果 |
| --- | --- |
| `GET /api/status` | **200** — 今天 `register_enabled=true`，**`email_verification=false`**（2026-10-19 时为 `true`），`turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **在面板要求验证码时返回 200** — 邮件以 `ITKK <mail@<panel>>` 形式到达，主题为 `ITKK邮箱验证邮件`，6 位十六进制验证码；2026-10-21 之后不再需要 |
| `POST /api/user/register` | **200** — 账户落入 `default` 分组，配额 100000；验证码门槛关闭时请求体接受 `verification_code:""` |
| `POST /api/user/login` | **200** — `access_token` JWT（+ `session` cookie） |
| `GET /api/user/self` | **200** — `quota`、`group` |
| `POST /api/token/` 带 `group:""` | **200**，但密钥从不路由：`503 No available channel … under group default` |
| `POST /api/token/` 带目录中的分组 | **200** — 绑定的分组才是渠道可达的原因 |
| `POST /api/token/<id>/key` | **200** — 明文密钥 |
| 在密钥写入前 `POST /v1/chat/completions` | 要求 **200** 且带有真实内容；面板也会返回携带上游错误的 HTTP 200，这种降级响应会被拒绝 |
| 邮箱域名策略 | **仅在请求验证码时仅限 gmail 系列** — `hotmail/outlook` 和 `mail.tm` 域名返回 `200 {"code":"EMAIL_ADDRESS_REJECTED"…}` |
| 2026-10-19 最终产出 | 从 175 次尝试中获得的 **chat-200 密钥**，随后遇到邮件投递墙（Gmail 将面板发往面板所接受邮箱的邮件退回）— `out/mail-wall-evidence.json` |
| 2026-10-21 重新验证 | 验证码门槛消失 → 新账户 `itkke8cfb8`（配额 100000）+ 绑定分组 `China-Ai-次卡` 的密钥，使用 `t-deepseek-v4-pro` 返回 `200 "pong"`；`keys.txt` 中的每个密钥都返回 200 且带有真实内容；篡改后的密钥 → `401 Invalid token` |

> **质量关卡。** 这里的每个密钥在写入 `keys.txt` 之前都通过了实时 `chat-200`
> （绝不发布失效密钥）。路由器组合在模型层面遵循同样的规则：只有当模型返回 `chat-200`
> **且能调用工具**时，才会添加条目 — 不支持工具、密钥失效或提供商失效的模型会被丢弃而非添加。
> 可随时重新运行验证步骤；失败会被报告，绝不隐藏。

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
| 验证码 | `GET /api/verification?email=` | **在 `email_verification=false` 时跳过**（2026-10-21）：铸造流程读取门槛并用空验证码注册。门槛开启时：无点 gmail 可用；被回收的 Emailnator 邮箱可能已持有账户（`邮箱地址已被占用`） |
| 注册 | `POST /api/user/register` | 密码注册开放，Turnstile 关闭；门槛关闭时 `verification_code` 为空 |
| 登录 | `POST /api/user/login` | 此分支的响应中带有 JWT |
| 目录 | `GET /api/pricing` | `group_ratio`、`usable_group`、每个模型的 `enable_groups` |
| 令牌 | `POST /api/token/` `{group, model_limits}` | 不带分组时密钥返回 503 |
| 密钥 | `POST /api/token/<id>/key` | 明文 |
| 检查 | `POST /v1/chat/completions` | 写入 `keys.txt` 前要求实时 200 |

## ⚙️ CLI 选项

```bash
node src/cli.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| 标志 | 默认值 | 含义 |
| --- | --- | --- |
| `--count` | 5 | 尝试创建的账户数 |
| `--conc` | 4 | 并行账户数 |
| `--model` | `deepseek-v4.1-flash` | 关卡优先使用的模型 |
| `--pool <file>` | 内置列表 | 额外的出口文件 |

## 🛰️ 在代理之后

**可选 — 大规模使用时推荐（按 IP 限制、封禁）。** 本工具在没有代理时也能工作。

- **有代理池时：** 传入 `--pool <file>`（或设置 `ITKK_PROXIES`），每个请求都通过该列表中的出口 — 一个账户的所有面板调用都使用同一个出口，邮件通道则在代理池中轮换。
- **没有代理池时：** CLI 会打印 `running WITHOUT a proxy (direct)` 并直接连接 — 注册、读取验证码、令牌/分组遍历以及聊天关卡都以相同方式运行。

实验室自有的代理供给：`proxy-lab/out/exits-emergency-panel-live.txt`、`proxies-emergency*.txt`、`chrome-safe-exits.txt`、`captcha-exits-live.txt` 以及本地 WARP；在那里每个账户的所有面板调用都使用同一个出口，邮件通道则在代理池中轮换（优先 WARP）。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个 chat-200 密钥 |
| `keys-unfunded.txt` | 账户无法到达可用分组的密钥 |
| `accounts.json` | 每个账户的用户名 / 密码 / 邮箱 / 配额 / 分组 / 尝试次数 |
| `out/mint-<date>.log` | 原始运行日志 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器。一条命令即可将 `keys.txt` 转换为带有可用组合的提供商节点：

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

随后模型将以 `itkk/<model id>` 形式提供，并在所有密钥之间负载均衡。

## 🔌 连接到 OmniRoute

[OmniRoute](https://omniroute.online) 是一个自托管、兼容 OpenAI 的路由器。一条命令即可将 `keys.txt` 转换为带有可用组合的提供商节点：

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

随后模型将以 `itkk/<model id>` 形式提供，并在所有密钥之间负载均衡。

## 🔑 一个密钥能给你什么

| | |
| --- | --- |
| 🏢 提供商 | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 提供商提供什么 | 每个密钥一个账户 — 自 2026-10-21 起免验证码注册，令牌绑定到可用分组，每个密钥均 chat-200 |
| 🔑 一个密钥能给你什么 | 一个作用域为其自身账户的 API 密钥：下方端点上的 5 个模型 id，受你套餐的限制。配额存在于**账户**上，这正是本工具为每个密钥创建一个账户的原因 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://itkk.lol/v1/chat/completions` |
| 🔒 你的数据 | 仅联系 itkk.lol 和你配置的收件箱后端；密钥保留在你的机器上 |

## 🐞 问题

如果面板更改其注册形态、分组或额度，工具会在该步骤停止，并将面板的逐字响应记录在 `accounts.json` 中。

## 📄 许可证

MIT © 2026 — 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey contributors

</div>