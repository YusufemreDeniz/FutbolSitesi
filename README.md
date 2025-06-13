# ⚽ FutbolSitesi

Bu depo, FutbolSitesi projesinin hem web hem de mobil uygulama kodlarını içerir.

---

## 🌐 Web (ASP.NET MVC)

FutbolSitesi, futbol tutkunlarına yönelik olarak ASP.NET MVC yapısıyla geliştirilmiş dinamik bir web uygulamasıdır. İngiltere Premier Ligi başta olmak üzere çeşitli liglerin güncel puan durumları ve bilgileri RapidAPI üzerinden çekilerek kullanıcıya sunulmaktadır.

### 🚀 Özellikler
- ASP.NET MVC mimarisi kullanılarak geliştirilmiştir.
- Responsive ve kullanıcı dostu bir tasarım.
- RapidAPI üzerinden Premier Lig puan durumu verilerini dinamik çekme.
- Modüler yapısıyla diğer büyük ligler (La Liga, Serie A, Bundesliga, Ligue 1) kolayca entegre edilebilir.
- Admin paneli ile içerik yönetimi için altyapı hazırlanmıştır.

### 🛠️ Kullanılan Teknolojiler
- ASP.NET MVC 5
- C#
- HTML5 & CSS3
- JavaScript
- RapidAPI (Futbol API)
- Visual Studio 2022

### 📦 Kurulum
1. Bu repoyu klonlayın: `git clone https://github.com/YusufemreDeniz/FutbolSitesi.git`
2. Projenin web kısmını Visual Studio 2022 ile açın.
3. Gerekli NuGet paketlerini yükleyin.
4. RapidAPI'den bir API key alın ve ilgili konfigürasyon dosyalarına ekleyin.
5. Projeyi çalıştırın ve futbol keyfini yaşayın!

---

## 📱 Mobile (React Native & Expo)

FutbolSitesi projesinin mobil uygulama kısmıdır. React Native & Expo ile geliştirilmiştir. Kullanıcılar Premier Lig ve diğer liglere ait takımların kadrolarını, oyuncu detaylarını ve takım bilgilerini mobil cihazlarında kolayca görüntüleyebilir.

### 🚀 Özellikler
- Takım kadrosu ve oyuncu detay ekranları
- RapidAPI ile canlı futbol verileri
- Modern ve kullanıcı dostu arayüz
- Takım ve oyuncu profili sekmeleri

### 🛠️ Kullanılan Teknolojiler
- React Native (Expo)
- TypeScript
- RapidAPI (Futbol API)
- React Navigation

### 📦 Kurulum

```bash
cd Mobile/FutbolSitesiMobile
npm install
npx expo start
```
- Uygulamayı Expo Go ile telefonunda veya bir emülatörde çalıştırabilirsin.
- API anahtarını ilgili dosyalara eklemeyi unutma!

