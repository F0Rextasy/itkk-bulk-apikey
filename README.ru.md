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

**Массовое создание аккаунтов ITKK (itkk.lol) с автосгенерированными API-ключами — OpenAI-совместимый инференс + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-5-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Параметры](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

itkk.lol — это панель New API `v1.0.0-rc.40` (системное имя **ITKK**) с **регистрацией по коду из письма**, выключенным Turnstile, открытой регистрацией по паролю и **приветственным кредитом в 100000 квот** (quota_per_unit 500000 → ¥0.20 по отображаемому курсу). Один аккаунт = один ключ; этот инструмент записывает ключ в `keys.txt` только после того, как собственный релей панели ответил 200 с содержимым.

## 🎁 Бесплатный тариф — сколько вы получаете

**Каждый новый аккаунт получает приветственную квоту** — без карты, без капчи.

| Что | Значение |
| --- | --- |
| Приветственная квота | **100000** (`quota_per_unit` 500000, отображение ¥0.20) |
| Нужна карта | **Нет** |
| Ежедневная отметка | не включена в этой панели (`checkin_enabled:false`) |
| Регистрация | код из письма (gmail без точек проходит) |
| Единица масштабирования | **один аккаунт = один ключ** → `--count N` означает «N бесплатных аккаунтов» |

> 💡 Бесплатный тариф задаётся ITKK (itkk.lol) — 国模 API 中转 — и может меняться. Проверяйте актуальные значения на [itkk.lol](https://itkk.lol) — и пусть решает собственный гейт инструмента:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все 5

Каталог **привязан к группам**: новый аккаунт попадает в `default`, где каналов нет *ни для чего* — токен, созданный без группы, отвечает `503 No available channel for model X under group default (distributor)`. `/api/pricing` публикует `group_ratio` + `enable_groups` для каждой модели, а минтер привязывает токен к одной из этих групп перед тестированием. Актуальные id, измеренные 2026-10-19: `deepseek-v4.1-flash` (группа `China-Ai-flash`, 0.1×), `glm-5.3-flash` (`China-Ai-flash`), `glm-5.3` (`China-Ai-福利`, 0.05×), `deepseek-v4-pro` (`China-Ai-福利`), `kimi-k3` (`China-Ai-福利`).

## 🧪 Как использовать API

Базовый URL — **`https://itkk.lol/v1`** — совместим с OpenAI.

```bash
curl https://itkk.lol/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Идентификатор модели должен принадлежать группе, к которой привязан токен.

## 🛠 Быстрый старт

```bash
node providers/itkk.lol/mint.js --count 100 --conc 6 --model deepseek-v4.1-flash
```

Каждый HTTP-вызов уходит через экзит из `proxy-lab/out/*live*.txt` (или proxy `socks5://127.0.0.1:40000`); прямой запрос отклоняется по построению.

### 🖱️ Лаунчер

## ✅ Проверено в работе — каждый ключ протестирован

| Проверка | Результат |
| --- | --- |
| `GET /api/status` | **200** — `register_enabled=true`, `email_verification=true`, `turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **200** — письмо приходит от `ITKK <mail@itkk.lol>`, тема `ITKK邮箱验证邮件`, 6-значный hex-код |
| `POST /api/user/register` | **200** — аккаунт попадает в группу `default` с квотой 100000 |
| `POST /api/user/login` | **200** — `access_token` JWT (+ cookie `session`) |
| `GET /api/user/self` | **200** — `quota`, `group` |
| `POST /api/token/` с `group:""` | **200**, но ключ никогда не маршрутизируется: `503 No available channel … under group default` |
| `POST /api/token/` с группой из каталога | **200** — именно привязанная группа делает канал доступным |
| `POST /api/token/<id>/key` | **200** — ключ в открытом виде |
| `POST /v1/chat/completions` перед записью ключа | **200**, требуется реальное содержимое |

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: ITKK (itkk.lol) — 国模 API 中转 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://itkk.lol/v1/chat/completions → real content = the key is live
```

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| код | `GET /api/verification?email=` | gmail без точек работает; переиспользованные ящики Emailnator могут уже содержать аккаунт (`邮箱地址已被占用`) |
| регистрация | `POST /api/user/register` | регистрация по паролю открыта, Turnstile выключен |
| вход | `POST /api/user/login` | JWT в ответе этого форка |
| каталог | `GET /api/pricing` | `group_ratio`, `usable_group`, `enable_groups` для каждой модели |
| токен | `POST /api/token/` `{group, model_limits}` | без группы ключ отвечает 503 |
| ключ | `POST /api/token/<id>/key` | открытый текст |
| проверка | `POST /v1/chat/completions` | требуется живой 200 перед записью в `keys.txt` |

## ⚙️ Параметры CLI

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| Флаг | По умолчанию | Значение |
| --- | --- | --- |
| `--count` | 5 | аккаунтов для попытки |
| `--conc` | 4 | параллельных аккаунтов |
| `--model` | `deepseek-v4.1-flash` | модель, которую предпочитает гейт |
| `--pool <file>` | встроенный список | дополнительный файл экзитов |

## 🛰️ За прокси

Экзиты берутся из `proxy-lab/out/exits-emergency-panel-live.txt`, `proxies-emergency*.txt`, `chrome-safe-exits.txt`, `captcha-exits-live.txt` плюс локальный proxy; каждый аккаунт удерживает один экзит для всех своих вызовов панели, а почтовый канал ротируется по пулу (сначала proxy). Прямой запрос невозможен: `req()` выбрасывает исключение, если экзита нет.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один ключ с chat-200 на строку |
| `keys-unfunded.txt` | ключи, чей аккаунт не смог достичь живой группы |
| `accounts.json` | имя пользователя / пароль / email / квота / группа / попытки для каждого аккаунта |
| `out/mint-<date>.log` | сырой лог запуска |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это self-hosted-маршрутизатор, совместимый с OpenAI. Одна команда превращает `keys.txt` в узел провайдера с рабочими комбинациями:

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Затем модели подаются как `itkk/<model id>` с балансировкой нагрузки по всем ключам.

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 Что даёт провайдер | один аккаунт на ключ — регистрация по коду из письма, токен привязан к живой группе, каждый ключ с chat-200 |
| 🔑 Что даёт один ключ | один API-ключ, привязанный к собственному аккаунту: 5 id моделей на эндпоинте ниже, в пределах вашего тарифа. Квота хранится на **аккаунте**, поэтому этот инструмент создаёт один аккаунт на ключ |
| 🌐 Формат API | совместим с OpenAI: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 Ваши данные | запросы идут только к itkk.lol и настроенному вами бэкенду входящей почты; ключи остаются на вашей машине |

## 🐞 Проблемы

Если панель изменит форму регистрации, группы или кредит, инструмент остановится на этом шаге и запишет дословный ответ панели в `accounts.json`.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 участники itkk-bulk-apikey

</div>