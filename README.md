# 🧭 Mahallende Gez

**Ankara'da insanların yaşadıkları mahallelerin fotoğraflarını yükleyip, bu fotoğraflardan
3 boyutlu görüntüler oluşturarak eski anılarını canlandırdığı web uygulaması.**

Fotoğrafı yükle → kare 3B görüntüye dönüşür → fareyle gezin veya telefonu eğ →
seni o sokağa, o güne götüren **ana** geri döner.

## ✨ Özellikler

- 📷 **Anı yükleme** — fotoğraf + başlık + ilçe/mahalle + dönem + hikâye
- 🧊 **3B görüntü efekti** — fare/dokunmatik eğim + derinlik parlaksı; mobilde jiroskop desteği
- 🔍 **Arama & filtre** — başlık, mahalle, yıl ve metinde arama; ilçe filtreleri
- 🔐 **Kullanıcı hesapları** — Supabase Auth (e-posta + şifre)
- ☁️ **Fotoğraf depolama** — Supabase Storage (otomatik yeniden boyutlandırma, JPG sıkıştırma)
- 🗂️ **Demo modu** — Supabase bağlanmadan da tam çalışır: anılar ve girişler tarayıcıda (localStorage) saklanır; 6 hazır örnek anı gömülüdür
- 📱 **Responsive** — telefondan masaüstüne uyumlu

## 🚀 Hızlı Başlangıç (Demo Modu)

Kurulum gerektirmez:

```bash
git clone https://github.com/tenisturnuvalari/mahallendegez.git
cd mahallendegez
python -m http.server 8000   # veya: npx serve .
# tarayıcıda http://localhost:8000
```

Bu modda her şey çalışır, ancak anılar **sadece kendi tarayıcında** saklanır.

## ☁️ Kalıcı Yayın için Supabase Kurulumu

1. [supabase.com](https://supabase.com) → ücretsiz proje oluştur
2. **SQL Editor → New query** → `supabase/schema.sql` içeriğini yapıştır ve çalıştır
   (tablolar, güvenlik kuralları ve `memories` fotoğraf kovası oluşturulur)
3. **Project Settings → API** bölümünden iki değeri al:
   - `Project URL`
   - `anon public` anahtarı
4. `js/config.js` dosyasına yapıştır:

```js
const SUPABASE_URL = "https://xxxx.supabase.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOi...";
```

5. Sayfayı yenile — üstteki "demo modu" uyarısı kaybolur, anılar buluta yazılır.

> Not: Supabase'de **Auth → Providers → Email** ayarından "Confirm email" kapatılabilir;
> açık kalırsa kayıt sonrası e-posta onayı gerekir.

## 📁 Proje Yapısı

```
mahallendegez/
├── index.html          # Galeri ana sayfa
├── photo.html          # Anı detayı — 3B görüntü
├── upload.html         # Fotoğraf yükleme
├── auth.html           # Giriş / kayıt
├── css/
│   └── styles.css      # Nostaljik tema + 3B stiller
├── js/
│   ├── config.js       # Supabase anahtarları (sen doldur)
│   ├── scenes.js       # Demo sahne üretici (eski fotoğraf SVG'leri)
│   ├── store.js        # Veri katmanı (Supabase | yerel demo)
│   ├── tilt.js         # 3B eğim efekti (fare + jiroskop)
│   ├── ui.js           # Ortak arayüz yardımcıları
│   ├── gallery.js      # Galeri mantığı
│   ├── photo.js        # Detsayfası mantığı
│   ├── upload.js       # Yükleme formu
│   └── auth.js         # Giriş/kayıt formu
├── supabase/
│   └── schema.sql      # Veritabanı + depolama şeması
├── README.md
├── LICENSE             # MIT
└── .gitignore
```

## 🛠️ Teknoloji

- Saf HTML / CSS / JavaScript (build adımı yok)
- [Supabase](https://supabase.com) — kimlik doğrulama, veritabanı, dosya depolama
- CSS 3D transforms + Pointer Events + Device Orientation API

## 🗺️ Yol Haritası

- [ ] **Gerçek 3B rekonstrüksiyon** — fotoğraftan 3B model üreten yapay zekâ servisi
      (3D Gaussian Splatting / NeRF tabanlı API) ile efektin yerine geçmesi
- [ ] Harita görünümü (Leaflet) — anıları konumlarına yerleştirme
- [ ] Anı düzenleme ve silme
- [ ] Beğeni / yorum
- [ ] Karanlık tema
- [ ] PWA (çevrimdışı)

## 🤔 Neden "3B efekt" ile başladık?

Fotoğraftan gerçek 3B model üretimi (fotogrametri / NeRF) sunucu taraflı ağır bir iştir ve
üçüncü parti bir yapay zekâ servisi gerektirir. Bu sürümde tarayıcıda çalışan **derinlik +
eğim efekti** kullanılır; arayüz ve veri katmanı, gerçek 3B servisi sonradan bağlandığında
değişmeden entegre olacak şekilde tasarlandı.

## 📄 Lisans

[MIT](LICENSE)
