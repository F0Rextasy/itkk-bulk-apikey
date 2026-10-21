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

**자동 생성된 API 키로 ITKK (itkk.lol) 계정을 대량 생성 — OpenAI 호환 추론 + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-5-of-them) · [🧪 API 사용법](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 이 도구가 존재하는 이유

itkk.lol은 New API `v1.0.0-rc.40` 패널(시스템 이름 **ITKK**)로, 2026-10-19까지는 **이메일 코드 가입**을, 2026-10-21부터는 **코드 없는 가입**(`email_verification=false`)을 지원하며, Turnstile은 **꺼져 있고**, 비밀번호 등록이 열려 있으며 **100000 할당량의 가입 크레딧**(quota_per_unit 500000 → 표시 환율 기준 ¥0.20)을 제공합니다. 계정 하나 = 키 하나이며, 이 도구는 패널 자체의 릴레이가 콘텐츠와 함께 200을 응답한 뒤에만 키를 `keys.txt`에 기록합니다.

## 🎁 무료 티어 — 얼마나 받을 수 있나

**모든 신규 계정은 가입 할당량을 받습니다** — 카드도, 캡차도 필요 없습니다.

| 항목 | 값 |
| --- | --- |
| 가입 할당량 | **100000** (`quota_per_unit` 500000, 표시 ¥0.20) |
| 카드 필요 여부 | **아니오** |
| 일일 출석 체크 | 이 패널에서는 활성화되지 않음 (`checkin_enabled:false`) |
| 가입 | **2026-10-21부터 이메일 코드 없음** (`email_verification=false`); 게이트가 켜져 있던 동안에는 gmail 계열의 코드가 필요했습니다 |
| 확장되는 단위 | **계정 하나 = 키 하나** → `--count N`은 "무료 계정 N개"를 의미 |

> 💡 무료 티어는 ITKK (itkk.lol) — 国模 API 中转가 설정하며 변경될 수 있습니다. 실시간 수치는 [itkk.lol](https://itkk.lol)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — 전부 5개

카탈로그는 **그룹에 묶여 있습니다**: 새 계정은 `default`에 배치되는데, 여기에는 *어떤* 모델의 채널도 없습니다 — 그룹 없이 생성된 토큰은 `503 No available channel for model X under group default (distributor)`를 응답합니다. `/api/pricing`은 `group_ratio`와 모델별 `enable_groups`를 게시하며, 발급기는 테스트 전에 토큰을 그 그룹 중 하나에 바인딩합니다. 2026-10-19에 측정된 실제 id: `deepseek-v4.1-flash` (그룹 `China-Ai-flash`, 0.1×), `glm-5.3-flash` (`China-Ai-flash`), `glm-5.3` (`China-Ai-福利`, 0.05×), `deepseek-v4-pro` (`China-Ai-福利`), `kimi-k3` (`China-Ai-福利`).

## 🧪 API 사용법

베이스 URL은 **`https://itkk.lol/v1`** — OpenAI 호환입니다.

```bash
curl https://itkk.lol/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

모델 id는 토큰이 바인딩된 그룹에 속해야 합니다.

## 🛠 빠른 시작

```bash
# 1) your proxy list, one per line (http://… or socks5://…) — optional, see below
printf 'http://127.0.0.1:8080\n' > proxies.txt   # optional — without it the tool runs direct

# 2) go
node src/cli.js --count 100 --conc 6 --model deepseek-v4.1-flash --pool proxies.txt
```

프록시 목록이 제공되면(`--pool` / `ITKK_PROXIES`) 요청은 그 목록을 통해 나갑니다; 풀이 없으면 도구는 직접 연결합니다. 어느 모드에서든 키는 `keys.txt`에 도달합니다 — 물론 실제 채팅 200 이후에만요.

### 🖱️ 런처

## ✅ 검증됨 — 모든 키가 테스트됩니다

| 확인 | 결과 |
| --- | --- |
| `GET /api/status` | **200** — 오늘 `register_enabled=true`, **`email_verification=false`** (2026-10-19에는 `true`였음), `turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **패널이 코드를 요구하는 동안 200** — 메일은 `ITKK <mail@<panel-mail>>`로 도착, 제목 `ITKK邮箱验证邮件`, 6자리 16진수 코드; 2026-10-21 이후에는 불필요 |
| `POST /api/user/register` | **200** — 계정은 할당량 100000으로 그룹 `default`에 배치됨; 코드 게이트가 꺼져 있으면 본문은 `verification_code:""`를 받음 |
| `POST /api/user/login` | **200** — `access_token` JWT (+ `session` 쿠키) |
| `GET /api/user/self` | **200** — `quota`, `group` |
| `group:""`로 `POST /api/token/` | **200**, 그러나 키는 절대 라우팅되지 않음: `503 No available channel … under group default` |
| 카탈로그 그룹으로 `POST /api/token/` | **200** — 바인딩된 그룹이 채널에 도달할 수 있게 함 |
| `POST /api/token/<id>/key` | **200** — 평문 키 |
| 키가 기록되기 전 `POST /v1/chat/completions` | 실제 콘텐츠와 함께 **200**이 요구됨; 업스트림 오류를 담은 HTTP 200은 허용되지 않음 |
| 2026-10-21 재검증 | 코드 게이트 사라짐 → 새 계정 (할당량 100000) + 그룹 `China-Ai-次卡`의 키가 `t-deepseek-v4-pro`로 `200 "pong"` 응답; `keys.txt`의 **53개 키 중 51개**가 실제 콘텐츠와 함께 200 응답; 변조된 키 → `401 Invalid token` |

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
| 코드 | `GET /api/verification?email=` | **`email_verification=false`인 동안 건너뜀** (2026-10-21). 켜져 있던 동안: 점 없는 gmail이 작동함; 재활용된 Emailnator 박스는 계정을 보유할 수 있음 (`邮箱地址已被占用`) |
| 가입 | `POST /api/user/register` | 비밀번호 등록 열림, Turnstile 꺼짐 |
| 로그인 | `POST /api/user/login` | 이 포크의 응답에 JWT 포함 |
| 카탈로그 | `GET /api/pricing` | `group_ratio`, `usable_group`, 모델별 `enable_groups` |
| 토큰 | `POST /api/token/` `{group, model_limits}` | 그룹 없이는 키가 503 응답 |
| 키 | `POST /api/token/<id>/key` | 평문 |
| 확인 | `POST /v1/chat/completions` | `keys.txt` 이전에 실제 200이 요구됨 |

## ⚙️ CLI 옵션

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| 플래그 | 기본값 | 의미 |
| --- | --- | --- |
| `--count` | 5 | 시도할 계정 수 |
| `--conc` | 4 | 병렬 계정 수 |
| `--model` | `deepseek-v4.1-flash` | 게이트가 선호하는 모델 |
| `--pool <file>` | 내장 목록 | 선택적 출구 파일 (`ITKK_PROXIES` 환경 변수도 작동) |

## 🛰️ 프록시 뒤에서

**선택 사항 — 대규모에서는 권장됨 (IP별 제한, 차단).** 이 도구는 프록시 없이도 작동합니다.

- **풀이 있는 경우:** `--pool <file>`을 전달하거나 (또는 `ITKK_PROXIES`를 설정) 모든 요청이 그 목록의 출구를 통해 나갑니다 — 계정 하나는 모든 패널 호출에 대해 출구 하나를 유지하고, 메일 레일은 풀을 순환합니다.
- **풀이 없는 경우:** CLI는 `running WITHOUT a proxy (direct)`를 출력하고 직접 연결합니다 — 가입, 코드 읽기, 토큰/그룹 탐색, 채팅 게이트가 모두 동일하게 실행됩니다.

랩 자체의 공급: `proxy-lab/out/exits-emergency-panel-live.txt`, `proxies-emergency*.txt`, `chrome-safe-exits.txt`, `captcha-exits-live.txt` 그리고 로컬 프록시; 여기서 각 계정은 모든 패널 호출에 대해 출구 하나를 유지하고 메일 레일은 풀을 순환합니다 (프록시 우선).

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 채팅 200을 받은 키 한 줄에 하나 |
| `keys-unfunded.txt` | 계정이 실제 그룹에 도달하지 못한 키 |
| `accounts.json` | 계정별 사용자 이름 / 비밀번호 / 이메일 / 할당량 / 그룹 / 시도 횟수 |
| `out/mint-<date>.log` | 원시 실행 로그 |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅, OpenAI 호환 라우터입니다. 명령 하나로 `keys.txt`를 작동하는 콤보가 있는 프로바이더 노드로 바꿉니다:

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

그러면 모델은 `itkk/<model id>`로 제공되며, 모든 키에 걸쳐 로드 밸런싱됩니다.

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 제공자가 주는 것 | 키당 계정 하나 — 2026-10-21부터 코드 없는 가입, 실제 그룹에 바인딩된 토큰, 모든 키가 채팅 200 |
| 🔑 키 하나로 얻는 것 | 자체 계정에 범위가 지정된 API 키 하나: 아래 엔드포인트의 5개 모델 id, 요금제 한도 내에서. 할당량은 **계정**에 있으므로, 이 도구가 키당 계정 하나를 생성하는 것입니다 |
| 🌐 API 형태 | OpenAI 호환: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 데이터 | itkk.lol과 설정한 inbox 백엔드만 접촉됩니다; 키는 사용자 컴퓨터에 남습니다 |

## 🐞 이슈

패널이 가입 형태, 그룹 또는 크레딧을 변경하면, 도구는 해당 단계에서 멈추고 패널의 응답을 그대로 `accounts.json`에 기록합니다.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey contributors

</div>