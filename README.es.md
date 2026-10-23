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
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-5-of-them) · [🧪 Usar la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

itkk.lol es un panel New API `v1.0.0-rc.40` (nombre del sistema **ITKK**) con **registro por código de correo electrónico** hasta el 2026-10-19 y **registro sin código** desde el 2026-10-21 (`email_verification=false`), Turnstile **desactivado**, registro con contraseña abierto y un **crédito de registro de 100000 de cuota** (quota_per_unit 500000 → ¥0.20 a la tasa mostrada). Una cuenta = una clave; esta herramienta escribe una clave en `keys.txt` solo después de que el propio relay del panel respondiera 200 con contenido.

## 🎁 Nivel gratuito — cuánto obtienes

**Cada cuenta nueva recibe cuota de registro** — sin tarjeta, sin captcha.

| Qué | Valor |
| --- | --- |
| Cuota de registro | **100000** (`quota_per_unit` 500000, muestra ¥0.20) |
| Tarjeta requerida | **No** |
| Check-in diario | no habilitado en este panel (`checkin_enabled:false`) |
| Registro | **sin código de correo electrónico desde el 2026-10-21** (`email_verification=false`); mientras la barrera estuvo activa, se requería un código de la familia gmail |
| La unidad que escala | **una cuenta = una clave** → `--count N` es "N cuentas gratuitas" |

> 💡 El nivel gratuito lo define ITKK (itkk.lol) — 国模 API 中转 y puede cambiar. Consulta los números en vivo en [itkk.lol](https://itkk.lol) — y deja que la propia barrera de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — los 5

El catálogo está **vinculado a grupos**: una cuenta nueva cae en `default`, que no tiene canales para *nada* — un token creado sin un grupo responde `503 No available channel for model X under group default (distributor)`. `/api/pricing` publica `group_ratio` + `enable_groups` por modelo, y el mint vincula el token a uno de esos grupos antes de probar. Ids en vivo medidos el 2026-10-19: `deepseek-v4.1-flash` (grupo `China-Ai-flash`, 0.1×), `glm-5.3-flash` (`China-Ai-flash`), `glm-5.3` (`China-Ai-福利`, 0.05×), `deepseek-v4-pro` (`China-Ai-福利`), `kimi-k3` (`China-Ai-福利`).

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

Cada llamada HTTP sale a través de una salida de `proxy-lab/out/*live*.txt` (o WARP `socks5://127.0.0.1:40000`); una solicitud directa se rechaza por diseño.

### 🖱️ El lanzador

## ✅ Verificado y funcionando — cada clave se prueba

| Comprobación | Resultado |
| --- | --- |
| `GET /api/status` | **200** — hoy `register_enabled=true`, **`email_verification=false`** (era `true` el 2026-10-19), `turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **200 mientras el panel pide un código** — el correo llega como `ITKK <mail@<panel>>`, asunto `ITKK邮箱验证邮件`, código de 6 hex; no es necesario después del 2026-10-21 |
| `POST /api/user/register` | **200** — la cuenta cae en el grupo `default` con cuota 100000; con la barrera de código desactivada el cuerpo acepta `verification_code:""` |
| `POST /api/user/login` | **200** — `access_token` JWT (+ cookie `session`) |
| `GET /api/user/self` | **200** — `quota`, `group` |
| `POST /api/token/` con `group:""` | **200**, pero la clave nunca enruta: `503 No available channel … under group default` |
| `POST /api/token/` con un grupo del catálogo | **200** — el grupo vinculado es lo que hace alcanzable el canal |
| `POST /api/token/<id>/key` | **200** — clave en texto plano |
| `POST /v1/chat/completions` antes de escribir una clave | **200** con contenido real requerido; el panel también responde HTTP 200 con un error de upstream, y ese cuerpo degradado se rechaza |
| política de dominio de correo | **solo familia gmail mientras se solicita un código** — los dominios `hotmail/outlook` y `mail.tm` responden `200 {"code":"EMAIL_ADDRESS_REJECTED"…}` |
| rendimiento final 2026-10-19 | **claves con chat-200** de 175 intentos, luego un muro de entrega de correo (Gmail rebotó los mensajes del panel a los buzones que el panel acepta) — `out/mail-wall-evidence.json` |
| re-verificación 2026-10-21 | barrera de código eliminada → cuenta nueva `itkke8cfb8` (cuota 100000) + clave en el grupo `China-Ai-次卡` respondiendo `200 "pong"` con `t-deepseek-v4-pro`; cada clave en `keys.txt` respondió 200 con contenido real; clave mutada → `401 Invalid token` |

> **Barreras de calidad.** Cada clave aquí pasó un `chat-200` en vivo antes de escribirse en `keys.txt`
> (las claves muertas nunca se envían). Las combinaciones del router siguen la misma regla a nivel de modelo: una entrada se
> añade **solo si el modelo responde `chat-200` y puede llamar herramientas** — un modelo sin soporte de herramientas,
> una clave muerta o un proveedor muerto se descarta en lugar de añadirse. Vuelve a ejecutar el paso de verificación en cualquier momento;
> los fallos se reportan, nunca se ocultan.

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
| código | `GET /api/verification?email=` | **omitido mientras `email_verification=false`** (2026-10-21): el mint lee la barrera y se registra con un código vacío. Mientras estuvo activa: gmail sin puntos funciona; los buzones reciclados de Emailnator pueden tener una cuenta (`邮箱地址已被占用`) |
| registro | `POST /api/user/register` | registro con contraseña abierto, Turnstile desactivado; `verification_code` está vacío cuando la barrera está desactivada |
| inicio de sesión | `POST /api/user/login` | JWT en la respuesta de este fork |
| catálogo | `GET /api/pricing` | `group_ratio`, `usable_group`, `enable_groups` por modelo |
| token | `POST /api/token/` `{group, model_limits}` | sin un grupo la clave responde 503 |
| clave | `POST /api/token/<id>/key` | texto plano |
| comprobación | `POST /v1/chat/completions` | se requiere 200 en vivo antes de `keys.txt` |

## ⚙️ Opciones de CLI

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| Flag | Predeterminado | Significado |
| --- | --- | --- |
| `--count` | 5 | cuentas a intentar |
| `--conc` | 4 | cuentas en paralelo |
| `--model` | `deepseek-v4.1-flash` | modelo que prefiere la barrera |
| `--pool <file>` | lista integrada | archivo de salidas adicional |

## 🛰️ Detrás de un proxy

**Opcional — recomendado a escala (límites por IP, baneos).** La herramienta también funciona sin proxy.

- **Con un pool:** pasa `--pool <file>` (o define `ITKK_PROXIES`) y cada solicitud pasa por una salida de esa lista — una cuenta mantiene una salida para todas sus llamadas al panel, y el riel de correo rota a través del pool.
- **Sin un pool:** la CLI imprime `running WITHOUT a proxy (direct)` y se conecta directamente — el registro, la lectura de códigos, el recorrido de token/grupo y la barrera de chat funcionan igual.

El suministro propio del laboratorio: `proxy-lab/out/exits-emergency-panel-live.txt`, `proxies-emergency*.txt`, `chrome-safe-exits.txt`, `captcha-exits-live.txt` más WARP local; allí cada cuenta mantiene una salida para todas sus llamadas al panel y el riel de correo rota a través del pool (WARP primero).

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave con chat-200 por línea |
| `keys-unfunded.txt` | claves cuya cuenta no pudo alcanzar un grupo en vivo |
| `accounts.json` | usuario / contraseña / correo / cuota / grupo / intentos por cuenta |
| `out/mint-<date>.log` | registro en bruto de la ejecución |

## 🔌 Conectar con 9Router

[9Router](https://9router.com) es un router autoalojado compatible con OpenAI. Un comando convierte `keys.txt` en un nodo proveedor con combinaciones funcionales:

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Los modelos se sirven entonces como `itkk/<model id>`, con balanceo de carga entre todas las claves.

## 🔌 Conectar con OmniRoute

[OmniRoute](https://omniroute.online) es un router autoalojado compatible con OpenAI. Un comando convierte `keys.txt` en un nodo proveedor con combinaciones funcionales:

```bash
node proxy-lab/omniroute-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Los modelos se sirven entonces como `itkk/<model id>`, con balanceo de carga entre todas las claves.

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 Qué da el proveedor | una cuenta por clave — registro sin código desde el 2026-10-21, token vinculado a un grupo en vivo, cada clave con chat-200 |
| 🔑 Qué te da una clave | una clave API limitada a su propia cuenta: los 5 ids de modelo en el endpoint de abajo, a los límites de tu plan. La cuota vive en la **cuenta**, que es exactamente por lo que esta herramienta crea una cuenta por clave |
| 🌐 Forma de la API | compatible con OpenAI: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 Tus datos | solo se contacta con itkk.lol y el backend de buzón que configures; las claves permanecen en tu máquina |

## 🐞 Problemas

Si el panel cambia la forma de su registro, los grupos o el crédito, la herramienta se detiene en ese paso y registra la respuesta textual del panel en `accounts.json`.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey contributors

</div>