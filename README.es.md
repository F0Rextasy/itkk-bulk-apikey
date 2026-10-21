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

**Crea cuentas de ITKK (itkk.lol) en masa con claves API autogeneradas — inferencia compatible con OpenAI + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-5-of-them) · [🧪 Usar la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

itkk.lol es un panel de New API `v1.0.0-rc.40` (nombre del sistema **ITKK**) con **registro mediante código por correo electrónico**, Turnstile **desactivado**, registro con contraseña abierto y un **crédito de registro de 100000 de cuota** (quota_per_unit 500000 → ¥0.20 a la tasa mostrada). Una cuenta = una clave; esta herramienta escribe una clave en `keys.txt` solo después de que el propio relay del panel respondiera 200 con contenido.

## 🎁 Nivel gratuito — cuánto obtienes

**Cada cuenta nueva recibe cuota de registro** — sin tarjeta, sin captcha.

| Qué | Valor |
| --- | --- |
| Cuota de registro | **100000** (`quota_per_unit` 500000, visualización ¥0.20) |
| Tarjeta requerida | **No** |
| Registro diario | no habilitado en este panel (`checkin_enabled:false`) |
| Registro | código por correo electrónico (los gmail sin puntos pasan) |
| La unidad que escala | **una cuenta = una clave** → `--count N` es "N cuentas gratuitas" |

> 💡 El nivel gratuito lo define ITKK (itkk.lol) — 国模 API 中转 y puede cambiar. Consulta las cifras en vivo en [itkk.lol](https://itkk.lol) — y deja que la propia puerta de validación de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — los 5

El catálogo está **ligado a grupos**: una cuenta nueva cae en `default`, que no tiene canales para *nada* — un token creado sin grupo responde `503 No available channel for model X under group default (distributor)`. `/api/pricing` publica `group_ratio` + `enable_groups` por modelo, y el mint vincula el token a uno de esos grupos antes de probar. IDs en vivo medidos el 2026-10-19: `deepseek-v4.1-flash` (grupo `China-Ai-flash`, 0.1×), `glm-5.3-flash` (`China-Ai-flash`), `glm-5.3` (`China-Ai-福利`, 0.05×), `deepseek-v4-pro` (`China-Ai-福利`), `kimi-k3` (`China-Ai-福利`).

## 🧪 Cómo usar la API

La URL base es **`https://itkk.lol/v1`** — compatible con OpenAI.

```bash
curl https://itkk.lol/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

El id del modelo debe pertenecer al grupo al que está vinculado el token.

## 🛠 Inicio rápido

```bash
node providers/itkk.lol/mint.js --count 100 --conc 6 --model deepseek-v4.1-flash
```

Cada llamada HTTP sale a través de una salida de `proxy-lab/out/*live*.txt` (o proxy `socks5://127.0.0.1:40000`); una petición directa se rechaza por diseño.

### 🖱️ El lanzador

## ✅ Verificado y funcionando — cada clave se prueba

| Comprobación | Resultado |
| --- | --- |
| `GET /api/status` | **200** — `register_enabled=true`, `email_verification=true`, `turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **200** — el correo llega como `ITKK <mail@itkk.lol>`, asunto `ITKK邮箱验证邮件`, código de 6 hex |
| `POST /api/user/register` | **200** — la cuenta cae en el grupo `default` con cuota 100000 |
| `POST /api/user/login` | **200** — `access_token` JWT (+ cookie `session`) |
| `GET /api/user/self` | **200** — `quota`, `group` |
| `POST /api/token/` con `group:""` | **200**, pero la clave nunca enruta: `503 No available channel … under group default` |
| `POST /api/token/` con un grupo del catálogo | **200** — el grupo vinculado es lo que hace accesible el canal |
| `POST /api/token/<id>/key` | **200** — clave en texto plano |
| `POST /v1/chat/completions` antes de que se escriba una clave | **200** con contenido real requerido |

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: ITKK (itkk.lol) — 国模 API 中转 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://itkk.lol/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| código | `GET /api/verification?email=` | los gmail sin puntos funcionan; los buzones reciclados de Emailnator pueden tener una cuenta (`邮箱地址已被占用`) |
| registro | `POST /api/user/register` | registro con contraseña abierto, Turnstile desactivado |
| inicio de sesión | `POST /api/user/login` | JWT en la respuesta de este fork |
| catálogo | `GET /api/pricing` | `group_ratio`, `usable_group`, `enable_groups` por modelo |
| token | `POST /api/token/` `{group, model_limits}` | sin un grupo la clave responde 503 |
| clave | `POST /api/token/<id>/key` | texto plano |
| comprobación | `POST /v1/chat/completions` | se requiere 200 en vivo antes de `keys.txt` |

## ⚙️ Opciones de CLI

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| Opción | Predeterminado | Significado |
| --- | --- | --- |
| `--count` | 5 | cuentas a intentar |
| `--conc` | 4 | cuentas en paralelo |
| `--model` | `deepseek-v4.1-flash` | modelo que prefiere la puerta de validación |
| `--pool <file>` | lista integrada | archivo de salidas adicional |

## 🛰️ Detrás de un proxy

Las salidas provienen de `proxy-lab/out/exits-emergency-panel-live.txt`, `proxies-emergency*.txt`, `chrome-safe-exits.txt`, `captcha-exits-live.txt` además de proxy local; cada cuenta mantiene una salida para todas sus llamadas al panel y el carril de correo rota por el pool (proxy primero). No es posible una petición directa: `req()` lanza una excepción cuando no hay salida.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave con chat-200 por línea |
| `keys-unfunded.txt` | claves cuya cuenta no pudo alcanzar un grupo en vivo |
| `accounts.json` | usuario / contraseña / correo / cuota / grupo / intentos por cuenta |
| `out/mint-<date>.log` | registro de ejecución en bruto |

## 🔌 Conectar con 9Router

[9Router](https://9router.com) es un router autoalojado compatible con OpenAI. Un comando convierte `keys.txt` en un nodo de proveedor con combos funcionales:

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Los modelos se sirven entonces como `itkk/<model id>`, con balanceo de carga entre todas las claves.

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 Qué ofrece el proveedor | una cuenta por clave — registro con código por correo electrónico, token vinculado a un grupo en vivo, cada clave con chat-200 |
| 🔑 Qué te da una clave | una clave API limitada a su propia cuenta: los 5 ids de modelo en el endpoint de abajo, con los límites de tu plan. La cuota vive en la **cuenta**, que es exactamente por lo que esta herramienta crea una cuenta por clave |
| 🌐 Forma de la API | compatible con OpenAI: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 Tus datos | solo se contacta con itkk.lol y el backend de bandeja de entrada que configures; las claves permanecen en tu máquina |

## 🐞 Problemas

Si el panel cambia la forma de su registro, los grupos o el crédito, la herramienta se detiene en ese paso y registra la respuesta literal del panel en `accounts.json`.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 colaboradores de itkk-bulk-apikey

</div>