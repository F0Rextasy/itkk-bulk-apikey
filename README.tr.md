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

**Otomatik oluşturulan API anahtarlarıyla toplu ITKK (itkk.lol) hesabı açın — OpenAI uyumlu çıkarım + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-5-of-them) · [🧪 API'yi kullanma](#-how-to-use-the-api) · [✅ Doğrulanmış](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proksiler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>




---

## ✨ Bu neden var

itkk.lol, **e-posta kodu ile kayıt**, Turnstile **kapalı**, şifreyle kayıt açık ve **100000 kotalık kayıt kredisi** (quota_per_unit 500000 → görüntüleme kurunda ¥0.20) sunan bir New API `v1.0.0-rc.40` panelidir (sistem adı **ITKK**). Bir hesap = bir anahtar; bu araç `keys.txt` dosyasına yalnızca panelin kendi aktarma servisi 200 ve içerikle yanıt verdikten sonra anahtar yazar.

## 🎁 Ücretsiz katman — ne kadar alıyorsunuz

**Her yeni hesap kayıt kredisi alır** — kart yok, captcha yok.

| Ne | Değer |
| --- | --- |
| Kayıt kredisi | **100000** (`quota_per_unit` 500000, görüntüleme ¥0.20) |
| Kart gerekli mi | **Hayır** |
| Günlük giriş (check-in) | bu panelde etkin değil (`checkin_enabled:false`) |
| Kayıt | e-posta kodu (noktasız gmail geçer) |
| Ölçeklenen birim | **bir hesap = bir anahtar** → `--count N` demek "N ücretsiz hesap" demektir |

> 💡 Ücretsiz katman ITKK (itkk.lol) tarafından belirlenir — 国模 API 中转 ve değişebilir. Güncel sayıları [itkk.lol](https://itkk.lol) adresinden kontrol edin — ve kararı aracın kendi kapısına bırakın:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modeller — 5 tanesinin tamamı

Katalog **gruba bağlıdır**: yeni bir hesap, *hiçbir şey* için kanalı olmayan `default` grubuna düşer — grupsuz oluşturulan bir token `503 No available channel for model X under group default (distributor)` yanıtını verir. `/api/pricing`, `group_ratio` ile model başına `enable_groups` yayınlar ve üretim aracı, testten önce tokeni bu gruplardan birine bağlar. 2026-10-19 tarihinde ölçülen canlı kimlikler: `deepseek-v4.1-flash` (grup `China-Ai-flash`, 0.1×), `glm-5.3-flash` (`China-Ai-flash`), `glm-5.3` (`China-Ai-福利`, 0.05×), `deepseek-v4-pro` (`China-Ai-福利`), `kimi-k3` (`China-Ai-福利`).

## 🧪 API nasıl kullanılır

Temel URL **`https://itkk.lol/v1`** — OpenAI uyumlu.

```bash
curl https://itkk.lol/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Model kimliği, tokenin bağlı olduğu gruba ait olmalıdır.

## 🛠 Hızlı başlangıç

```bash
node providers/itkk.lol/mint.js --count 100 --conc 6 --model deepseek-v4.1-flash
```

Her HTTP çağrısı `proxy-lab/out/*live*.txt` içinden bir çıkıştan (veya WARP `socks5://127.0.0.1:40000` üzerinden) geçer; doğrudan istek tasarım gereği reddedilir.

### 🖱️ Başlatıcı



## ✅ Doğrulanmış çalışıyor — her anahtar test edilir

| Kontrol | Sonuç |
| --- | --- |
| `GET /api/status` | **200** — `register_enabled=true`, `email_verification=true`, `turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **200** — posta `ITKK <mail@itkk.lol>` olarak, konu `ITKK邮箱验证邮件`, 6 haneli hex kod ile gelir |
| `POST /api/user/register` | **200** — hesap `default` grubuna 100000 kota ile düşer |
| `POST /api/user/login` | **200** — `access_token` JWT (+ `session` çerezi) |
| `GET /api/user/self` | **200** — `quota`, `group` |
| `POST /api/token/` — `group:""` ile | **200**, ama anahtar hiçbir zaman yönlendirmez: `503 No available channel … under group default` |
| `POST /api/token/` — bir katalog grubuyla | **200** — kanalı erişilebilir kılan şey, bağlı olan gruptur |
| `POST /api/token/<id>/key` | **200** — düz metin anahtar |
| Bir anahtar yazılmadan önce `POST /v1/chat/completions` | **200** ve gerçek içerik gerekli |

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: ITKK (itkk.lol) — 国模 API 中转 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://itkk.lol/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| kod | `GET /api/verification?email=` | noktasız gmail çalışır; geri dönüştürülmüş Emailnator kutuları bir hesap barındırıyor olabilir (`邮箱地址已被占用`) |
| kayıt | `POST /api/user/register` | şifreyle kayıt açık, Turnstile kapalı |
| giriş | `POST /api/user/login` | bu çatalın (fork) yanıtında JWT |
| katalog | `GET /api/pricing` | `group_ratio`, `usable_group`, model başına `enable_groups` |
| token | `POST /api/token/` `{group, model_limits}` | grup olmadan anahtar 503 yanıtı verir |
| anahtar | `POST /api/token/<id>/key` | düz metin |
| kontrol | `POST /v1/chat/completions` | `keys.txt` öncesinde canlı 200 gerekli |

## ⚙️ CLI seçenekleri

```bash
node providers/itkk.lol/mint.js --count N [--conc N] [--model <id>] [--budget <sec>]
```

| Bayrak | Varsayılan | Anlamı |
| --- | --- | --- |
| `--count` | 5 | denenecek hesap sayısı |
| `--conc` | 4 | paralel hesap |
| `--model` | `deepseek-v4.1-flash` | kapının tercih ettiği model |
| `--pool <file>` | yerleşik liste | ek çıkış dosyası |

## 🛰️ Proksi arkasında

Çıkışlar `proxy-lab/out/exits-emergency-panel-live.txt`, `proxies-emergency*.txt`, `chrome-safe-exits.txt`, `captcha-exits-live.txt` dosyalarından ve yerel WARP'tan gelir; her hesap, tüm panel çağrıları boyunca tek bir çıkış tutar ve posta hattı havuz içinde dönerek ilerler (önce WARP). Doğrudan istek mümkün değildir: çıkış yoksa `req()` hata fırlatır.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | satır başına bir sohbet-200 anahtarı |
| `keys-unfunded.txt` | hesabı canlı bir gruba ulaşamayan anahtarlar |
| `accounts.json` | hesap başına kullanıcı adı / şifre / e-posta / kota / grup / deneme sayısı |
| `out/mint-<date>.log` | ham çalıştırma günlüğü |

## 🔌 9Router'a bağlanma

[9Router](https://9router.com), kendi sunucunuzda barındırılan, OpenAI uyumlu bir yönlendiricidir. Tek bir komut `keys.txt` dosyasını çalışan kombinasyonlara sahip bir sağlayıcı düğümüne dönüştürür:

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Modeller daha sonra `itkk/<model id>` olarak sunulur ve her anahtar arasında yük dengelenir.

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 Sağlayıcının verdikleri | anahtar başına bir hesap — e-posta kodu ile kayıt, canlı bir gruba bağlı token, her anahtar sohbet-200 |
| 🔑 Bir anahtarın size kazandırdığı | kendi hesabına sınırlandırılmış bir API anahtarı: aşağıdaki uç noktadaki 5 model kimliği, planınızın limitlerinde. Kota **hesapta** yaşar, bu aracın anahtar başına bir hesap oluşturmasının nedeni de tam olarak budur |
| 🌐 API biçimi | OpenAI uyumlu: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca itkk.lol ve yapılandırdığınız gelen kutusu arka ucuna bağlantı kurulur; anahtarlar makinenizde kalır |

## 🐞 Sorunlar

Panel, kayıt yapısını, grupları veya krediyi değiştirirse araç o adımda durur ve panelin verdiği yanıtı birebir `accounts.json` içine kaydeder.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey contributors

</div>