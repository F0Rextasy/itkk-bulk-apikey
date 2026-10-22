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

**Массовое создание аккаунтов ITKK (itkk.lol) с автоматически сгенерированными API-ключами — вывод, совместимый с OpenAI, + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-5-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

itkk.lol — это панель New API `v1.0.0-rc.40` (системное имя **ITKK**) с **регистрацией по e-mail-коду** до 2026-10-19 и **регистрацией без кода** с 2026-10-21 (`email_verification=false`), Turnstile **выключен**, регистрация по паролю открыта и **100000 квоты при регистрации** (quota_per_unit 500000 → ¥0.20 по отображаемому курсу). Один аккаунт = один ключ; этот инструмент записывает ключ в `keys.txt` только после того, как собственный релей панели ответил 200 с содержимым.

## 🎁 Бесплатный тариф — сколько вы получаете

**Каждый новый аккаунт получает квоту при регистрации** — без карты, без капчи.

| Что | Значение |
| --- | --- |
| Квота при регистрации | **100000** (`quota_per_unit` 500000, отображение ¥0.20) |
| Требуется карта | **Нет** |
| Ежедневная отметка | не включена на этой панели (`checkin_enabled:false`) |
| Регистрация | **без e-mail-кода с 2026-10-21** (`email_verification=false`); пока шлюз был включён, требовался код из семейства gmail |
| Единица масштабирования | **один аккаунт = один ключ** → `--count N` означает «N бесплатных аккаунтов» |

> 💡 Бесплатный тариф устанавливается ITKK (itkk.lol) — 国模 API 中转 и может меняться. Проверяйте актуальные цифры на [itkk.lol](https://itkk.lol) — и пусть решение принимает собственный шлюз инструмента:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все 5

Каталог **привязан к группе**: новый аккаунт попадает в `default`, где нет каналов *ни для чего* — токен, созданный без группы, отвечает `503 No available channel for model X under group default (distributor)`. `/api/pricing` публикует `group_ratio` + `enable_groups` для каждой модели, и при создании токен привязывается к одной из этих групп перед тестированием. Актуальные id, измеренные 2026-10-19: `deepseek-v4.1-flash` (группа `China-Ai-flash`, 0.1×), `glm-5.3-flash` (`China-Ai-flash`), `glm-5.3` (`China-Ai-福利`, 0.05×), `deepseek-v4-pro` (`China-Ai-福利`), `kimi-k3` (`China-Ai-福利`).

## 🧪 Как использовать API

Базовый URL — **`https://itkk.lol/v1`** — совместим с OpenAI.

```bash
curl https://itkk.lol/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Id модели должен принадлежать группе, к которой привязан токен.

## 🛠 Быстрый старт

```bash

# 1) your proxy list, one per line (http://… or socks5://…) — optional, see below
printf 'http://127.0.0.1:8080\n' > proxies.txt   # optional — without it the tool runs direct

# 2) go
node src/cli.js --count 100 --conc 6 --model deepseek-v4.1-flash --pool proxies.txt
```

Запросы идут через ваш список прокси, если он предоставлен (`--pool` / `ITKK_PROXIES`); без пула инструмент подключается напрямую. Ключ попадает в `keys.txt` в любом режиме — но по-прежнему только после живого chat 200.

### 🖱️ Лаунчер

## ✅ Проверено в работе — каждый ключ тестируется

| Проверка | Результат |
| --- | --- |
| `GET /api/status` | **200** — сегодня `register_enabled=true`, **`email_verification=false`** (было `true` 2026-10-19), `turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **200, пока панель запрашивает код** — письмо приходит как `ITKK <mail@<panel-mail>>`, тема `ITKK邮箱验证邮件`, 6-символьный hex-код; не требуется после 2026-10-21 |
| `POST /api/user/register` | **200** — аккаунт попадает в группу `default` с квотой 100000; при выключенном шлюзе кода тело принимает `verification_code:""` |
| `POST /api/user/login` | **200** — `access_token` JWT (+ cookie `session`) |
| `GET /api/user/self` | **200** — `quota`, `group` |
| `POST /api/token/` с `group:""` | **200**, но ключ никогда не маршрутизируется: `503 No available channel … under group default` |
| `POST /api/token/` с группой из каталога | **200** — именно привязанная группа делает канал доступным |
| `POST /api/token/<id>/key` | **200** — ключ в открытом виде |
| `POST /v1/chat/completions` до записи ключа | **200** с обязательным реальным содержимым; HTTP 200 с ошибкой вышестоящего сервиса не принимается |
| повторная проверка 2026-10-21 | шлюз кода исчез → свежий аккаунт (квота 100000) + ключ в группе `China-Ai-次卡`, отвечающий `200 "pong"` с `t-deepseek-v4-pro`; **51 из 53 ключей** в `keys.txt` ответили 200 с реальным содержимым; изменённый ключ → `401 Invalid token` |

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
| код | `GET /api/verification?email=` | **пропускается, пока `email_verification=false`** (2026-10-21). Пока он был включён: gmail без точек работает; переработанные ящики Emailnator могут содержать аккаунт (`邮箱地址已被占用`) |
| регистрация | `POST /api/user/register` | регистрация по паролю открыта, Turnstile выключен |
| вход | `POST /api/user/login` | JWT в ответе этого форка |
| каталог | `GET /api/pricing` | `group_ratio`, `usable_group`, `enable_groups` для каждой модели |
| токен | `POST /api/token/` `{group, model_limits}` | без группы ключ отвечает 503 |
| ключ | `POST /api/token/<id>/key` | открытый текст |
| проверка | `POST /v1/chat/completions` | требуется живой 200 до записи в `keys.txt` |

## ⚙️ Опции CLI

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| Флаг | По умолчанию | Значение |
| --- | --- | --- |
| `--count` | 5 | количество аккаунтов для попытки |
| `--conc` | 4 | параллельных аккаунтов |
| `--model` | `deepseek-v4.1-flash` | модель, которую предпочитает шлюз |
| `--pool <file>` | встроенный список | необязательный файл выходов (переменная окружения `ITKK_PROXIES` тоже работает) |

## 🛰️ За прокси

**Необязательно — рекомендуется при масштабировании (лимиты на IP, блокировки).** Инструмент работает и без прокси.

- **С пулом:** передайте `--pool <file>` (или задайте `ITKK_PROXIES`), и каждый запрос идёт через выход из этого списка — один аккаунт удерживает один выход для всех своих вызовов панели, а почтовый канал ротируется через пул.
- **Без пула:** CLI выводит `running WITHOUT a proxy (direct)` и подключается напрямую — регистрация, чтение кода, обход токена/группы и шлюз чата работают одинаково.

Собственный запас лаборатории: `proxy-lab/out/exits-emergency-panel-live.txt`, `proxies-emergency*.txt`, `chrome-safe-exits.txt`, `captcha-exits-live.txt` плюс локальный прокси; там каждый аккаунт удерживает один выход для всех своих вызовов панели, а почтовый канал ротируется через пул (сначала прокси).

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один ключ с chat-200 на строку |
| `keys-unfunded.txt` | ключи, чей аккаунт не смог достичь живой группы |
| `accounts.json` | имя пользователя / пароль / email / квота / группа / попытки для каждого аккаунта |
| `out/mint-<date>.log` | сырой лог запуска |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый маршрутизатор, совместимый с OpenAI. Одна команда превращает `keys.txt` в узел-провайдер с рабочими комбинациями:

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Затем модели подаются как `itkk/<model id>` с балансировкой нагрузки по всем ключам.

## 🔌 Подключение к OmniRoute

[OmniRoute](https://omniroute.online) — это самостоятельно размещаемый маршрутизатор, совместимый с OpenAI. Одна команда превращает `keys.txt` в узел-провайдер с рабочими комбинациями:

```bash
node proxy-lab/omniroute-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Затем модели подаются как `itkk/<model id>` с балансировкой нагрузки по всем ключам.
## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 Что даёт провайдер | один аккаунт на ключ — регистрация без кода с 2026-10-21, токен привязан к живой группе, каждый ключ chat-200 |
| 🔑 Что даёт один ключ | один API-ключ, привязанный к своему аккаунту: 5 id моделей на указанной ниже конечной точке, в пределах лимитов вашего тарифа. Квота хранится на **аккаунте**, и именно поэтому этот инструмент создаёт один аккаунт на ключ |
| 🌐 Форма API | Совместим с OpenAI: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 Ваши данные | связь только с itkk.lol и настроенным вами почтовым бэкендом; ключи остаются на вашей машине |

## 🐞 Проблемы

Если панель изменит форму регистрации, группы или кредит, инструмент останавливается на этом шаге и записывает дословный ответ панели в `accounts.json`.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey contributors

</div>