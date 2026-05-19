# Trendyol Veri Entegrasyonu Planı

## Amaç
Trendyol'dan gerçek ürün görselleri, müşteri yorumları ve kullanıcı fotoğraflarını çekip SmartCart AI sistemine entegre etmek.

---

## Ürün Linkleri → Product ID'ler

| # | Trendyol URL | Product ID |
|---|-------------|------------|
| 1 | koton/pamuklu-jean-p-1019048304 | **1019048304** |
| 2 | koton/indigo-jeans-p-872446278 | **872446278** |
| 3 | ikea/ahsap-bambu-p-839499989 | **839499989** |
| 4 | kelebek/gelin-battaniye-p-148065462 | **148065462** |
| 5 | apple/pencil-usb-c-p-779208863 | **779208863** |
| 6 | samsung/supurge-p-32662332 | **32662332** |
| 7 | the-north-face/thermoball-bot-p-448153537 | **448153537** |
| 8 | salomon/kislik-outdoor-p-992682510 | **992682510** |

---

## Adım 1 — Trendyol API Endpoint'leri

Trendyol'un public API'leri var (tarayıcı DevTools → Network sekmesinden bulunur):

**Ürün detay:**
```
https://public-mdc.trendyol.com/discovery-web-productgw-service/api/productDetail/{contentId}
```
→ Ürün adı, marka, fiyat, **ürün görselleri (images dizisi)** döner.

**Yorumlar:**
```
https://public-mdc.trendyol.com/discovery-web-socialgw-service/api/review/{contentId}?page=0&size=50
```
→ Kullanıcı adı, rating, yorum metni, **review görselleri (mediaFiles dizisi)** döner.

> `contentId` URL'deki `p-XXXXX` kısmındaki sayıdır.

---

## Adım 2 — Veri Toplama: Manuel Yöntem (Önerilen)

Her ürün için:
1. Trendyol sayfasını aç
2. **F12 → DevTools → Network** sekmesi
3. Sayfayı yenile
4. "productDetail" ve "review" isteklerini bul
5. Response JSON'ı kopyala
6. `trendyol_data/urun_1.json` ve `trendyol_data/reviews_1.json` olarak kaydet

8 ürün × 2 istek = **16 JSON dosyası**, toplam ~30 dakika.

---

## Adım 3 — Her Üründen Alınacak Veriler

**Ürün Görselleri:** İlk 4 görsel URL → `Product.imageUrl` (virgülle ayrılmış)

**Yorumlar (max 30 per ürün):**
- `userFullName` → username
- `rate` → rating (1-5)
- `comment` → yorum metni
- `mediaFiles[].url` → kullanıcı fotoğrafı (ReviewImage)

---

## Adım 4 — Sisteme Entegrasyon

1. `data.sql` → Ürün bilgilerini güncelle (isim, fiyat, açıklama, imageUrl)
2. `data.sql` → Gerçek yorumları INSERT et
3. `data.sql` → Yorum görsellerini INSERT et (ReviewImage)
4. Frontend `page.tsx` → Hardcoded ürün verilerini güncelle
5. SeedDataGenerator → Gerçek yorumların üstüne ek üretim

---

## Zaman Tahmini: ~3 saat toplam

| İş | Süre |
|----|------|
| DevTools ile veri topla | 30 dk |
| JSON → SQL dönüşümü | 1 saat |
| data.sql + frontend güncelle | 1 saat |
| Test | 30 dk |

---

## Karar Gerekli

1. Ürünleri Trendyol'dakilerle DEĞİŞTİR mi, aynı modeli mi ara?
2. Veri toplandıktan sonra OpenCode promptunu yazayım mı?
