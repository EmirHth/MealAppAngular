# MealAppAngular

![Dashboard](screenshots/Ekran%20g%C3%B6r%C3%BCnt%C3%BCs%C3%BC%202025-07-12%20093929.png)

## 🎯 Adım 1: Teknik Gereksinimler

### Proje Kurulumu & Yapı
- **Angular v16.2.0** ile oluşturulmuştur.
- **TailwindCSS** ile modern ve hızlı stil altyapısı.
- Feature modules ve lazy loading ile modüler yapı.

### Veri Sunumu
- REST API ile veri çekme (ör: TheMealDB API).
- Kart ve tablo düzeninde veri gösterimi.
- "Ara", "Filtrele" (isim, kategori), "Sayfalama" işlevleri.

### State Yönetimi
- RxJS ile servis katmanında Observable akışlar.

### UI & UX
- Mobil, tablet ve masaüstü uyumlu (responsive design).
- Tutarlı component yapısı.

### HTTP & Hata Yönetimi
- HTTP isteklerinde `HttpClient` kullanımı.
- Hata durumlarında kullanıcıya anlaşılır mesajlar.

### Performans & Optimizasyon
- Lazy loading, ChangeDetection optimizasyonları.

---

## 🚀 Adım 2: Uygulama Özellikleri

### A. Dashboard & Analytics View

- **Dashboard:**
  - Toplam yemek, kategori, bölge ve favori sayısı kartları
  - Son eklenen yemekler
  - Responsive grid
  - Loading skeletons

![Dashboard](screenshots/Ekran%20g%C3%B6r%C3%BCnt%C3%BCs%C3%BC%202025-07-12%20094009.png)

- **Meals/Popüler Yemekler:**
  - Yemek arama, filtreleme, kategori ve bölgeye göre listeleme
  - Popüler yemekler ve detay kartları

![Meals](screenshots/Ekran%20g%C3%B6r%C3%BCnt%C3%BCs%C3%BC%202025-07-12%20094009.png)

- **Analytics:**
  - Bölgeye ve kategoriye göre yemek sayısı grafikleri
  - Pie chart, bar chart, line chart
  - Grafik türü seçimi ve dinamik başlıklar
  - Renkli, interaktif grafikler

![Analytics](screenshots/Ekran%20g%C3%B6r%C3%BCnt%C3%BCs%C3%BC%202025-07-12%20094134.png)

### B. Data Visualization

- **ng2-charts** ile bar, pie ve line chart
- Hover efektleri ve dinamik renkler
- Grafik türü dropdown'u

### C. Advanced Form Management

- **Multi-step Form Wizard:**
  - Adım adım rapor oluşturma
  - Dinamik form alanları
  - Form validation ve custom validatorlar
  - Form state persistence (refresh sonrası kaybolmaz)

![Report Wizard](screenshots/Ekran%20g%C3%B6r%C3%BCnt%C3%BCs%C3%BC%202025-07-12%20094151.png)

### D. Report Generator

- Seçilen verilerle otomatik rapor oluşturma
- PDF, DOC, JSON formatlarında export
- Türkçe/İngilizce dil desteği
- Rapor geçmişi ve detaylı modal

![Report History](screenshots/Ekran%20g%C3%B6r%C3%BCnt%C3%BCs%C3%BC%202025-07-12%20094206.png)

### E. Favorites & Notes

- Favori yemekleri kaydetme, not ekleme/düzenleme
- Modern ve temiz favoriler sayfası

![Favorites](screenshots/Ekran%20g%C3%B6r%C3%BCnt%C3%BCs%C3%BC%202025-07-12%20094206.png)

### F. About (Hakkımızda)

- Geliştirici bilgisi ve proje hakkında detaylı açıklama
- Kullanılan teknolojiler ve iletişim bilgileri

![About](screenshots/Ekran%20g%C3%B6r%C3%BCnt%C3%BCs%C3%BC%202025-07-12%20094217.png)

---

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm start
# veya
ng serve
```

Uygulama varsayılan olarak `http://localhost:4200` adresinde çalışır.

---

## 🧩 Özellikler
- **Yemek Arama:** İsimle arama, kategori ve bölgeye göre filtreleme
- **Yemek Detayları:** Malzemeler, tarif, kategori, bölge ve görsel
- **Dashboard:** Toplam yemek, kategori ve bölge istatistikleri
- **Loading Skeletons:** Yüklenirken animasyonlu placeholderlar
- **Hata Yönetimi:** Kullanıcı dostu hata mesajları
- **Responsive Tasarım:** Mobil, tablet ve masaüstü uyumlu
- **Modern UI:** TailwindCSS ile şık ve sade arayüz
- **Raporlama:** PDF/DOC/JSON export, APA formatı, geçmiş ve detaylı modal
- **Favoriler & Notlar:** Favori yönetimi ve not ekleme

---

## 🌐 API
- [TheMealDB](https://www.themealdb.com/api.php)

## 👤 Katkı & Lisans
Pull request ve katkılara açıktır. MIT Lisansı.

---

> Geliştirici: Emir Th 