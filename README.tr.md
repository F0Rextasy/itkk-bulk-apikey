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

**ITKK (itkk.lol) hesaplarını otomatik oluşturulan API anahtarlarıyla toplu oluşturun — OpenAI uyumlu çıkarım + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-5%20served-412991?style=for-the-badge)](https://itkk.lol)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-5-of-them) · [🧪 API'yi kullanma](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Bu neden var

itkk.lol, **e-posta koduyla kayıt** 2026-10-19'a kadar ve **kodsuz kayıt** 2026-10-21'den itibaren (`email_verification=false`) sunan bir New API `v1.0.0-rc.40` panelidir (sistem adı **ITKK**), Turnstile **kapalı**, parola kaydı açık ve **100000 kotalık kayıt kredisi** (quota_per_unit 500000 → görüntüleme oranında ¥0.20). Bir hesap = bir anahtar; bu araç, panelin kendi aktarma servisi içerikle birlikte 200 yanıtı verdikten sonra `keys.txt` dosyasına bir anahtar yazar.

## 🎁 Ücretsiz katman — ne kadar alırsınız

**Her yeni hesap kayıt kredisi alır** — kart yok, captcha yok.

| Ne | Değer |
| --- | --- |
| Kayıt kredisi | **100000** (`quota_per_unit` 500000, görüntüleme ¥0.20) |
| Kart gerekli mi | **Hayır** |
| Günlük giriş | bu panelde etkin değil (`checkin_enabled:false`) |
| Kayıt | **2026-10-21'den itibaren e-posta kodu yok** (`email_verification=false`); kapı açıkken gmail ailesinden bir kod gerekiyordu |
| Ölçeklenen birim | **bir hesap = bir anahtar** → `--count N` "N ücretsiz hesap" demektir |

> 💡 Ücretsiz katman ITKK (itkk.lol) — 国模 API 中转 tarafından belirlenir ve değişebilir. Güncel sayıları [itkk.lol](https://itkk.lol) adresinden kontrol edin — ve kararı aracın kendi kapısına bırakın:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modeller — 5 tanesinin tamamı

Katalog **gruba bağlıdır**: yeni bir hesap `default` grubuna düşer ve bu grupta *hiçbir şey* için kanal yoktur — grup olmadan oluşturulan bir token `503 No available channel for model X under group default (distributor)` yanıtı verir. `/api/pricing`, `group_ratio` + model başına `enable_groups` yayınlar ve mint, token'ı test etmeden önce bu gruplardan birine bağlar. 2026-10-19'da ölçülen canlı kimlikler: `deepseek-v4.1-flash` (grup `China-Ai-flash`, 0.1×), `glm-5.3-flash` (`China-Ai-flash`), `glm-5.3` (`China-Ai-福利`, 0.05×), `deepseek-v4-pro` (`China-Ai-福利`), `kimi-k3` (`China-Ai-福利`).

## 🧪 API'yi kullanma

Temel URL **`https://itkk.lol/v1`** — OpenAI uyumlu.

```bash
curl https://itkk.lol/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Model kimliği, token'ın bağlı olduğu gruba ait olmalıdır.

## 🛠 Hızlı başlangıç

```bash
node providers/itkk.lol/mint.js --count 100 --conc 6 --model deepseek-v4.1-flash
```

Her HTTP çağrısı `proxy-lab/out/*live*.txt` içinden bir çıkıştan (veya WARP `socks5://127.0.0.1:40000`) geçer; doğrudan bir istek tasarım gereği reddedilir.

### 🖱️ Başlatıcı

## ✅ Doğrulandı — her anahtar test edilir

| Kontrol | Sonuç |
| --- | --- |
| `GET /api/status` | **200** — bugün `register_enabled=true`, **`email_verification=false`** (2026-10-19'da `true` idi), `turnstile_check=false` |
| `GET /api/verification?email=<gmail>` | **Panel kod istediğinde 200** — posta `ITKK <mail@<panel>>` olarak gelir, konu `ITKK邮箱验证邮件`, 6-hex kod; 2026-10-21'den sonra gerekli değil |
| `POST /api/user/register` | **200** — hesap `default` grubuna 100000 kota ile düşer; kod kapısı kapalıyken gövde `verification_code:""` kabul eder |
| `POST /api/user/login` | **200** — `access_token` JWT (+ `session` çerezi) |
| `GET /api/user/self` | **200** — `quota`, `group` |
| `group:""` ile `POST /api/token/` | **200**, ancak anahtar asla yönlendirmez: `503 No available channel … under group default` |
| Bir katalog grubuyla `POST /api/token/` | **200** — kanalı erişilebilir kılan şey bağlı gruptur |
| `POST /api/token/<id>/key` | **200** — düz metin anahtar |
| Bir anahtar yazılmadan önce `POST /v1/chat/completions` | Gerçek içerikle **200** gerekir; panel ayrıca üst kaynak hatası taşıyan HTTP 200 yanıtı da verir ve bu bozuk gövde reddedilir |
| e-posta alan adı politikası | **Yalnızca kod istendiğinde gmail ailesi** — `hotmail/outlook` ve `mail.tm` alan adları `200 {"code":"EMAIL_ADDRESS_REJECTED"…}` yanıtı verir |
| 2026-10-19 nihai verim | 175 denemeden **chat-200 anahtarları**, ardından bir posta teslim duvarı (Gmail, panelin mesajlarını panelin kabul ettiği posta kutularına geri döndürdü) — `out/mail-wall-evidence.json` |
| 2026-10-21 yeniden doğrulama | kod kapısı kalktı → yeni hesap `itkke8cfb8` (kota 100000) + `China-Ai-次卡` grubunda `t-deepseek-v4-pro` ile `200 "pong"` yanıtı veren anahtar; `keys.txt` içindeki her anahtar gerçek içerikle 200 yanıtı verdi; değiştirilmiş anahtar → `401 Invalid token` |

> **Kalite kapıları.** Buradaki her anahtar `keys.txt` dosyasına yazılmadan önce canlı bir `chat-200` geçti
> (ölü anahtarlar asla gönderilmez). Yönlendirici kombinasyonları model düzeyinde aynı kuralı izler: bir giriş
> **yalnızca model `chat-200` yanıtı veriyorsa ve araçları çağırabiliyorsa** eklenir — araç desteği olmayan bir model,
> ölü bir anahtar veya ölü bir sağlayıcı eklenmek yerine çıkarılır. Doğrulama adımını istediğiniz zaman yeniden çalıştırın;
> hatalar bildirilir, asla gizlenmez.

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
| kod | `GET /api/verification?email=` | **`email_verification=false` iken atlanır** (2026-10-21): mint kapıyı okur ve boş kodla kaydolur. Kapı açıkken: noktasız gmail çalışır; geri dönüştürülmüş Emailnator kutuları bir hesap barındırabilir (`邮箱地址已被占用`) |
| kayıt | `POST /api/user/register` | parola kaydı açık, Turnstile kapalı; kapı kapalıyken `verification_code` boştur |
| oturum açma | `POST /api/user/login` | bu çatalın yanıtında JWT |
| katalog | `GET /api/pricing` | `group_ratio`, `usable_group`, model başına `enable_groups` |
| token | `POST /api/token/` `{group, model_limits}` | grup olmadan anahtar 503 yanıtı verir |
| anahtar | `POST /api/token/<id>/key` | düz metin |
| kontrol | `POST /v1/chat/completions` | `keys.txt` öncesinde canlı 200 gerekir |

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

## 🛰️ Proxy arkasında

**İsteğe bağlı — ölçekte önerilir (IP başına sınırlar, yasaklar).** Araç proxy olmadan da çalışır.

- **Havuzla:** `--pool <file>` geçin (veya `ITKK_PROXIES` ayarlayın) ve her istek o listeden bir çıkıştan geçer — bir hesap tüm panel çağrıları için tek bir çıkış tutar ve posta hattı havuzda döner.
- **Havuz olmadan:** CLI `running WITHOUT a proxy (direct)` yazdırır ve doğrudan bağlanır — kayıt, kod okuma, token/grup yürüyüşü ve sohbet kapısı hepsi aynı şekilde çalışır.

Laboratuvarın kendi kaynağı: `proxy-lab/out/exits-emergency-panel-live.txt`, `proxies-emergency*.txt`, `chrome-safe-exits.txt`, `captcha-exits-live.txt` artı yerel WARP; orada her hesap tüm panel çağrıları için tek bir çıkış tutar ve posta hattı havuzda döner (önce WARP).

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | satır başına bir chat-200 anahtarı |
| `keys-unfunded.txt` | hesabı canlı bir gruba ulaşamayan anahtarlar |
| `accounts.json` | hesap başına kullanıcı adı / parola / e-posta / kota / grup / denemeler |
| `out/mint-<date>.log` | ham çalıştırma günlüğü |

## 🔌 9Router'a bağlanma

[9Router](https://9router.com) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir. Tek bir komut `keys.txt` dosyasını çalışan kombinasyonlara sahip bir sağlayıcı düğümüne dönüştürür:

```bash
node proxy-lab/9router-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Modeller daha sonra `itkk/<model id>` olarak sunulur ve her anahtar arasında yük dengelenir.

## 🔌 OmniRoute'a bağlanma

[OmniRoute](https://omniroute.online) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir. Tek bir komut `keys.txt` dosyasını çalışan kombinasyonlara sahip bir sağlayıcı düğümüne dönüştürür:

```bash
node proxy-lab/omniroute-bulk-keys.js --name "ITKK" --prefix itkk \
  --base-url https://itkk.lol/v1 --keys providers/itkk.lol/keys.txt
```

Modeller daha sonra `itkk/<model id>` olarak sunulur ve her anahtar arasında yük dengelenir.

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **ITKK (itkk.lol) — 国模 API 中转** — [itkk.lol](https://itkk.lol) |
| 🎁 Sağlayıcının verdikleri | anahtar başına bir hesap — 2026-10-21'den itibaren kodsuz kayıt, canlı bir gruba bağlı token, her anahtar chat-200 |
| 🔑 Bir anahtar size ne kazandırır | kendi hesabına kapsanmış bir API anahtarı: aşağıdaki uç noktadaki 5 model kimliği, planınızın sınırlarında. Kota **hesapta** yaşar, bu aracın anahtar başına bir hesap oluşturmasının nedeni tam da budur |
| 🌐 API şekli | OpenAI uyumlu: `POST https://itkk.lol/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca itkk.lol ve yapılandırdığınız gelen kutusu arka ucuna bağlanılır; anahtarlar makinenizde kalır |

## 🐞 Sorunlar

Panel kayıt şeklini, gruplarını veya kredisini değiştirirse, araç o adımda durur ve panelin birebir yanıtını `accounts.json` dosyasına kaydeder.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 itkk-bulk-apikey katkıda bulunanlar

</div>