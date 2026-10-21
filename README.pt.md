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

**Crie contas em massa no ITKK (itkk.lol) com chaves de API geradas automaticamente — inferência compatível com OpenAI + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Nível gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-5-of-them) · [🧪 Usar a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por que isto existe

O itkk.lol é um painel New API `v1.0.0-rc.40` (nome do sistema **ITKK**) com **cadastro por código de e-mail**, Turnstile **desativado**, registro por senha aberto e um **crédito de cadastro de cota 100000** (quota_per_unit 500000 → ¥0,20 na taxa de exibição). Uma conta = uma chave; esta ferramenta grava uma chave em `keys.txt` somente depois que o próprio relay do painel respondeu 200 com conteúdo.

## 🎁 Nível gratuito — quanto você recebe

**Toda nova conta ganha cota de cadastro** — sem cartão, sem captcha.

| O quê | Valor |
| --- | --- |
| Cota de cadastro | **100000** (`quota_per_unit` 500000, exibição ¥0,20) |
| Cartão exigido | **Não** |
| Check-in diário | não habilitado neste painel (`checkin_enabled:false`) |
| Cadastro | código por e-mail (gmail sem pontos passa) |
| A unidade que escala | **uma conta = uma chave** → `--count N` significa "N contas gratuitas" |

> 💡 O nível gratuito é definido pelo ITKK (itkk.lol) — 国模 API 中转 e pode mudar. Confira os números atuais em [itkk.lol](https://itkk.lol) — e deixe o próprio gate da ferramenta decidir:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — todos os 5

O catálogo é **vinculado a grupo**: uma conta nova cai em `default`, que não tem canais para *nada* — um token criado sem grupo responde `503 No available channel for model X under group default (distributor)`. O `/api/pricing` publica `group_ratio` + `enable_groups` por modelo, e a criação vincula o token a um desses grupos antes de testar. Ids ativos medidos em 2026-10-19: `deepseek-v4.1-flash` (grupo `China-Ai-flash`, 0,1×), `glm-5.3-flash` (`China-Ai-flash`), `glm-5.3` (`China-Ai-福利`, 0,05×), `deepseek-v4-pro` (`China-Ai-福利`), `kimi-k3` (`China-Ai-福利`).

## 🧪 Como usar a API

A URL base é **`https://itkk.lol/v1`** — compatível com OpenAI.

```bash
curl https://itkk.lol/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

O id do modelo precisa pertencer ao grupo ao qual o token está vinculado.

## 🛠 Início rápido

```bash
node providers/itkk.lol/mint.js --count 100 --conc 6 --model deepseek-v4.1-flash
```

Toda chamada HTTP sai por uma saída de `proxy-lab/out/*live*.txt` (ou proxy `socks5://127.0.0.1:40000`); uma requisição direta é recusada por construção.

### 🖱️ O lançador

## ✅ Verificado funcionando — toda chave é testada

| Verificação | Resultado |
| --- | --- |
| `GET /api/status` | **200** — `register_enabled=true`, `email_verification=true`, `turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **200** — o e-mail chega como `ITKK <mail@itkk.lol>`, assunto `ITKK邮箱验证邮件`, código de 6 caracteres hex |
| `POST /api/user/register` | **200** — a conta entra no grupo `default` com cota 100000 |
| `POST /api/user/login` | **200** — `access_token` JWT (+ cookie `session`) |
| `GET /api/user/self` | **200** — `quota`, `group` |
| `POST /api/token/` com `group:""` | **200**, mas a chave nunca roteia: `503 No available channel … under group default` |
| `POST /api/token/` com um grupo do catálogo | **200** — o grupo vinculado é o que torna o canal alcançável |
| `POST /api/token/<id>/key` | **200** — chave em texto puro |
| `POST /v1/chat/completions` antes de a chave ser gravada | **200** com conteúdo real exigido |

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: ITKK (itkk.lol) — 国模 API 中转 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://itkk.lol/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada | Notas |
| --- | --- | --- |
| código | `GET /api/verification?email=` | gmail sem pontos funciona; caixas Emailnator recicladas podem já conter uma conta (`邮箱地址已被占用`) |
| cadastro | `POST /api/user/register` | registro por senha aberto, Turnstile desativado |
| login | `POST /api/user/login` | JWT na resposta desta fork |
| catálogo | `GET /api/pricing` | `group_ratio`, `usable_group`, `enable_groups` por modelo |
| token | `POST /api/token/` `{group, model_limits}` | sem um grupo a chave responde 503 |
| chave | `POST /api/token/<id>/key` | texto puro |
| verificação | `POST /v1/chat/completions` | 200 ao vivo exigido antes de `keys.txt` |

## ⚙️ Opções da CLI

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| Flag | Padrão | Significado |
| --- | --- | --- |
| `--count` | 5 | contas a tentar |
| `--conc` | 4 | contas em paralelo |
| `--model` | `deepseek-v4.1-flash` | modelo que o gate prefere |
| `--pool <file>` | lista embutida | arquivo extra de saídas |

## 🛰️ Atrás de um proxy

As saídas vêm de `proxy-lab/out/exits-emergency-panel-live.txt`, `proxies-emergency*.txt`, `chrome-safe-exits.txt`, `captcha-exits-live.txt` mais o proxy local; cada conta mantém uma saída para todas as suas chamadas ao painel, e o trilho de e-mail alterna pelo pool (proxy primeiro). Nenhuma requisição direta é possível: `req()` lança erro quando não há saída.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | uma chave com chat-200 por linha |
| `keys-unfunded.txt` | chaves cuja conta não conseguiu alcançar um grupo ativo |
| `accounts.json` | usuário / senha / e-mail / cota / grupo / tentativas por conta |
| `out/mint-<date>.log` | log bruto da execução |

## 🔌 Conectar ao 9Router

O [9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI. Um comando transforma `keys.txt` em um nó de provedor com combos funcionais:

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Os modelos passam então a ser servidos como `itkk/<model id>`, com balanceamento de carga entre todas as chaves.

## 🔑 O que uma chave oferece

| | |
| --- | --- |
| 🏢 Provedor | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 O que o provedor oferece | uma conta por chave — cadastro por código de e-mail, token vinculado a um grupo ativo, toda chave com chat-200 |
| 🔑 O que uma chave oferece | uma chave de API limitada à sua própria conta: os 5 ids de modelo no endpoint abaixo, nos limites do seu plano. A cota fica na **conta**, e é exatamente por isso que esta ferramenta cria uma conta por chave |
| 🌐 Formato da API | compatível com OpenAI: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 Seus dados | apenas o itkk.lol e o backend de caixa de entrada que você configurar são contatados; as chaves ficam na sua máquina |

## 🐞 Problemas

Se o painel mudar o formato do cadastro, os grupos ou o crédito, a ferramenta para naquela etapa e registra a resposta literal do painel em `accounts.json`.

## 📄 Licença

MIT © 2026 — consulte [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 colaboradores do itkk-bulk-apikey

</div>