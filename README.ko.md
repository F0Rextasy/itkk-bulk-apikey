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

**자동 생성 API 키로 ITKK(itkk.lol) 계정을 대량 생성 — OpenAI 호환 추론 + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-5-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 이 도구가 필요한 이유

itkk.lol은 New API `v1.0.0-rc.40` 패널(시스템 이름 **ITKK**)로, **이메일 코드 가입**, Turnstile **꺼짐**, 비밀번호 등록 가능, **100000 할당량 가입 크레딧**(quota_per_unit 500000 → 표시 환율 기준 ¥0.20)이 있습니다. 계정 하나 = 키 하나이며, 이 도구는 패널 자체의 릴레이가 콘텐츠와 함께 200을 응답한 뒤에만 키를 `keys.txt`에 기록합니다.

## 🎁 무료 티어 — 얼마나 받을 수 있나요

**모든 새 계정은 가입 할당량을 받습니다** — 카드도, 캡차도 없습니다.

| 항목 | 값 |
| --- | --- |
| 가입 할당량 | **100000** (`quota_per_unit` 500000, 표시 ¥0.20) |
| 카드 필요 | **아니요** |
| 일일 체크인 | 이 패널에서는 활성화되지 않음 (`checkin_enabled:false`) |
| 가입 | 이메일 코드(점 없는 Gmail 통과) |
| 확장 단위 | **계정 하나 = 키 하나** → `--count N`은 "무료 계정 N개" |

> 💡 무료 티어는 ITKK(itkk.lol) — 중국 모델 API 중계 — 에서 설정하며 변경될 수 있습니다. 실시간 수치는 [itkk.lol](https://itkk.lol)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — 총 5개

카탈로그는 **그룹에 묶여 있습니다**: 새 계정은 `default`에 배치되는데, 이 그룹에는 *아무* 모델의 채널도 없습니다 — 그룹 없이 생성된 토큰은 `503 No available channel for model X under group default (distributor)`를 응답합니다. `/api/pricing`은 `group_ratio`와 모델별 `enable_groups`를 게시하며, 발급기는 테스트 전에 토큰을 해당 그룹 중 하나에 바인딩합니다. 2026-10-19에 측정한 실제 id: `deepseek-v4.1-flash` (그룹 `China-Ai-flash`, 0.1×), `glm-5.3-flash` (`China-Ai-flash`), `glm-5.3` (`China-Ai-福利`, 0.05×), `deepseek-v4-pro` (`China-Ai-福利`), `kimi-k3` (`China-Ai-福利`).

## 🧪 API 사용 방법

베이스 URL은 **`https://itkk.lol/v1`**입니다 — OpenAI 호환.

```bash
curl https://itkk.lol/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

모델 id는 토큰이 바인딩된 그룹에 속해야 합니다.

## 🛠 빠른 시작

```bash
node providers/itkk.lol/mint.js --count 100 --conc 6 --model deepseek-v4.1-flash
```

모든 HTTP 호출은 `proxy-lab/out/*live*.txt`의 출구(또는 WARP `socks5://127.0.0.1:40000`)를 통해 나갑니다. 직접 요청은 구조적으로 거부됩니다.

### 🖱️ 런처

## ✅ 작동 검증 완료 — 모든 키가 테스트됩니다

| 확인 | 결과 |
| --- | --- |
| `GET /api/status` | **200** — `register_enabled=true`, `email_verification=true`, `turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **200** — 메일은 `ITKK <mail@itkk.lol>`로 도착, 제목 `ITKK邮箱验证邮件`, 6자리 16진수 코드 |
| `POST /api/user/register` | **200** — 계정이 할당량 100000으로 그룹 `default`에 배치됨 |
| `POST /api/user/login` | **200** — `access_token` JWT (+ `session` 쿠키) |
| `GET /api/user/self` | **200** — `quota`, `group` |
| `POST /api/token/` with `group:""` | **200**, 그러나 키는 절대 라우팅되지 않음: `503 No available channel … under group default` |
| `POST /api/token/` with a catalogue group | **200** — 채널에 도달 가능하게 만드는 것은 바인딩된 그룹입니다 |
| `POST /api/token/<id>/key` | **200** — 평문 키 |
| `POST /v1/chat/completions` before a key is written | **200**, 실제 콘텐츠 필요 |

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: ITKK (itkk.lol) — 国模 API 中转 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://itkk.lol/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 코드 | `GET /api/verification?email=` | 점 없는 Gmail 작동; 재활용된 Emailnator 메일함에는 계정이 이미 있을 수 있음 (`邮箱地址已被占用`) |
| 가입 | `POST /api/user/register` | 비밀번호 등록 가능, Turnstile 꺼짐 |
| 로그인 | `POST /api/user/login` | 이 포크의 응답에는 JWT 포함 |
| 카탈로그 | `GET /api/pricing` | `group_ratio`, `usable_group`, 모델별 `enable_groups` |
| 토큰 | `POST /api/token/` `{group, model_limits}` | 그룹이 없으면 키가 503을 응답 |
| 키 | `POST /api/token/<id>/key` | 평문 |
| 확인 | `POST /v1/chat/completions` | `keys.txt` 전에 라이브 200 필요 |

## ⚙️ CLI 옵션

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| 플래그 | 기본값 | 의미 |
| --- | --- | --- |
| `--count` | 5 | 시도할 계정 수 |
| `--conc` | 4 | 병렬 계정 수 |
| `--model` | `deepseek-v4.1-flash` | 게이트가 선호하는 모델 |
| `--pool <file>` | 내장 목록 | 추가 출구 파일 |

## 🛰️ 프록시 뒤에서

출구는 `proxy-lab/out/exits-emergency-panel-live.txt`, `proxies-emergency*.txt`, `chrome-safe-exits.txt`, `captcha-exits-live.txt` 및 로컬 WARP에서 가져옵니다. 각 계정은 모든 패널 호출에 대해 출구 하나를 유지하며, 메일 레일은 풀을 순환합니다(WARP 우선). 직접 요청은 불가능합니다: 출구가 없으면 `req()`가 예외를 던집니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 한 줄에 채팅 200 키 하나 |
| `keys-unfunded.txt` | 계정이 라이브 그룹에 도달하지 못한 키 |
| `accounts.json` | 계정별 사용자 이름 / 비밀번호 / 이메일 / 할당량 / 그룹 / 시도 횟수 |
| `out/mint-<date>.log` | 원시 실행 로그 |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 셀프 호스팅되는 OpenAI 호환 라우터입니다. 명령 하나로 `keys.txt`를 작동하는 콤보가 있는 provider-node로 바꿉니다:

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

그런 다음 모델은 `itkk/<model id>`로 제공되며, 모든 키에 걸쳐 로드 밸런싱됩니다.

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **ITKK (itkk.lol) — 중국 모델 API 중계** — [itkk.lol](https://itkk.lol) |
| 🎁 제공자가 주는 것 | 키당 계정 하나 — 이메일 코드 가입, 라이브 그룹에 바인딩된 토큰, 모든 키 chat-200 |
| 🔑 키 하나로 얻는 것 | 자체 계정에 범위가 지정된 API 키 하나: 아래 엔드포인트의 5개 모델 id, 요금제 한도 내에서. 할당량은 **계정**에 있으므로, 이 도구가 키당 계정 하나를 생성하는 것입니다 |
| 🌐 API 형태 | OpenAI 호환: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 데이터 | itkk.lol과 구성한 받은편지함 백엔드에만 접속하며, 키는 사용자 컴퓨터에 남습니다 |

## 🐞 이슈

패널이 가입 형태, 그룹 또는 크레딧을 변경하면 도구는 해당 단계에서 중지하고 패널의 응답을 그대로 `accounts.json`에 기록합니다.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey 기여자

</div>