# SmartCart AI v4.5 — Nihai Implementasyon Planı

**Durum:** ONAY BEKLİYOR  
**Deadline:** 19 Mayıs 2026, 23:59  
**Backend:** Sıfırdan oluşturulacak → `/Users/arif/Desktop/btk/smartcart-backend/`  
**Frontend:** Mevcut → `/Users/arif/Desktop/btk/e-commerce-prototype-2/`

---

## Sabit Kurallar (DEĞİŞMEZ)

```
Pipeline:  ContextBuilder → DataAnalysisService → matchScore → PromptBuilder → Gemini → validation → ChatResponse
Scoring:   matchScore backend hesaplar, Gemini skor ÜRETMEZ
Contract:  reply, matchScore, visualInsights, warnings[], followUpQuestions[], dataSources[]
Üretim:    Her modül ayrı, tek prompt yasak, her adımda compile
```

---

## Backend Dosya Yapısı (Hedef)

```
smartcart-backend/
├── pom.xml
├── src/main/java/com/smartcart/
│   ├── SmartCartApplication.java
│   ├── controller/
│   │   ├── ProductController.java
│   │   └── ChatController.java
│   ├── service/
│   │   ├── AgentOrchestrator.java
│   │   ├── ContextBuilderService.java
│   │   ├── DataAnalysisService.java
│   │   ├── PromptBuilderService.java
│   │   └── GeminiService.java
│   ├── model/
│   │   ├── entity/
│   │   │   ├── Product.java
│   │   │   ├── ProductSpec.java
│   │   │   └── Review.java
│   │   └── dto/
│   │       ├── ChatRequest.java
│   │       ├── ChatResponse.java
│   │       ├── ProductContext.java
│   │       ├── DataAnalysisResult.java
│   │       └── GeminiRequest.java
│   ├── repository/
│   │   ├── ProductRepository.java
│   │   ├── ProductSpecRepository.java
│   │   └── ReviewRepository.java
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   └── ProductNotFoundException.java
│   └── config/
│       └── CorsConfig.java
└── src/main/resources/
    ├── application.properties
    └── data.sql
```

---

## Faz 0 — Proje İskeleti

### Modül 0.1: Spring Initializr ile proje oluştur

```bash
# Spring Initializr CLI ile
curl https://start.spring.io/starter.zip \
  -d type=maven-project \
  -d language=java \
  -d bootVersion=3.2.5 \
  -d baseDir=smartcart-backend \
  -d groupId=com.smartcart \
  -d artifactId=smartcart-backend \
  -d name=SmartCart \
  -d packageName=com.smartcart \
  -d javaVersion=21 \
  -d dependencies=web,data-jpa,h2,validation,lombok \
  -o smartcart-backend.zip

unzip smartcart-backend.zip -d /Users/arif/Desktop/btk/
```

### Modül 0.2: `application.properties`
```properties
spring.application.name=smartcart
server.port=8080

# H2
spring.datasource.url=jdbc:h2:mem:smartcartdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.sql.init.mode=always
spring.h2.console.enabled=true

# Gemini
gemini.api.key=${GEMINI_API_KEY:test-key}
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
gemini.timeout.seconds=30
```

**✅ Checkpoint:** `mvn clean compile` başarılı

---

## Faz 1 — Veri Katmanı

### Modül 1.1: Entity'ler

**Product.java**
```
@Entity, @Data, @NoArgsConstructor, @AllArgsConstructor
Fields: id (Long, auto), name, category (String), brand, description, imageUrl, price (Double)
Relations: @OneToMany → specs (EAGER), @OneToMany → reviews (EAGER)
```

**ProductSpec.java**
```
@Entity, @Data
Fields: id, product (@ManyToOne, @JsonIgnore), specKey, specValue
```

**Review.java**
```
@Entity, @Data
Fields: id, product (@ManyToOne, @JsonIgnore), username, rating (Integer), comment, helpfulTags
```

### Modül 1.2: Repository'ler

```java
ProductRepository extends JpaRepository<Product, Long>
  - List<Product> findByCategory(String category)
  - List<Product> findByCategoryAndIdNot(String category, Long id)

ReviewRepository extends JpaRepository<Review, Long>
  - List<Review> findByProductIdOrderByIdDesc(Long productId)
```

### Modül 1.3: DTO'lar

**ChatRequest.java**
```java
@NotNull Long productId
@NotBlank @Size(max = 500) String message
List<String> history  // nullable, boş olabilir
```

**ChatResponse.java**
```java
String reply
Integer matchScore          // 0-100, backend hesaplar
String visualInsights
List<String> warnings       // boş olabilir ama null olmaz
List<String> followUpQuestions
List<String> dataSources    // v5 cherry-pick

static ChatResponse fallback(String msg)  // hata durumunda
```

**DataAnalysisResult.java**
```java
int specScore, reviewScore, visualScore, variantScore
int similarityScore, userFitScore, trustScore
List<String> warnings
List<String> insights
List<String> usedSources
```

**ProductContext.java**
```java
Product product
List<ProductSpec> specs
List<Review> reviews
List<Product> similarProducts
```

**GeminiRequest.java**
```java
String textPrompt
String imageBase64      // nullable
String imageMimeType    // nullable
```

### Modül 1.4: `data.sql`

Frontend'deki 8 ürünle birebir eşleşen veriler. Her ürün için:
- 1 Product kaydı (frontend'deki brand, title, price, rating, description, imageUrl)
- 3-5 ProductSpec kaydı (frontend'deki material + dimensions'tan türetilir)
- 3-4 Review kaydı (frontend'dekiyle aynı yorumlar + helpfulTags eklenir)

Ürün listesi:
1. Koton — Oversize Keten Gömlek (GIYIM)
2. Mavi — Slim Fit Jean Pantolon (GIYIM)
3. IKEA — MALM Çekmeceli Şifonyer (MOBILYA)
4. Kelebek — Modern TV Ünitesi (MOBILYA)
5. Apple — iPhone 15 Pro Max 256GB (ELEKTRONIK)
6. Samsung — 65" QLED 4K Smart TV (ELEKTRONIK)
7. The North Face — Thermoball Eco Mont (OUTDOOR)
8. Salomon — X Ultra 4 GTX Outdoor Ayakkabı (OUTDOOR)

**✅ Checkpoint:** `mvn clean compile` + H2 console'da tablolar var + `GET /api/products` test

---

## Faz 2 — Core Services

### Modül 2.1: `ContextBuilderService`
```
Input:  Long productId, String message
Output: ProductContext

1. productRepo.findById(productId) → yoksa ProductNotFoundException
2. specs (product.getSpecs veya repo) → boşsa empty list
3. reviews → max 5, sıralı
4. similarProducts → aynı kategori, bu ürün hariç, max 3
5. ProductContext oluştur ve döndür
```

### Modül 2.2: `DataAnalysisService` ⭐ CORE

```
Input:  ProductContext context, String userMessage
Output: DataAnalysisResult

DETERMINISTIK — LLM KULLANMAZ

1. specScore (0-100):
   - userMessage'daki anahtar kelimeler (boy, beden, boyut, uyumluluk, ağırlık...)
   - specs'te eşleşen key var mı?
   - Eşleşme oranı → skor

2. reviewScore (0-100):
   - Ortalama rating × 20
   - Negatif helpfulTags oranı → düşür
   - Yorum sayısı az (<3) → güven düşük

3. visualScore (0-100):
   - imageUrl var mı? (70 vs 30)
   - Varsayılan değer tabanlı

4. variantScore (0-100):
   - Benzer ürünlerin rating karşılaştırması
   - Varsayılan: 65

5. similarityScore (0-100):
   - Benzer ürün sayısı + rating kıyaslaması

6. userFitScore (0-100):
   - Mesajdaki sayısal veriler (160cm, 280cm, 3x4m...)
   - Specs'teki sayısal verilerle kıyaslama

7. trustScore (0-100):
   - Toplam yorum sayısı
   - Rating dağılımı

8. warnings[] → helpfulTags'den + düşük skorlardan
9. insights[] → istatistiksel özetler
10. usedSources[] → kullanılan kaynak isimleri

matchScore hesaplama:
= round(spec×0.25 + review×0.20 + visual×0.15 + similarity×0.15
        + userFit×0.10 + variant×0.10 + trust×0.05)
```

**✅ Checkpoint:** Unit test — dummy ProductContext ile DataAnalysisResult üretiliyor

### Modül 2.3: `PromptBuilderService`
```
Input:  ProductContext, DataAnalysisResult, String message, List<String> history
Output: GeminiRequest

1. Sistem promptu (Türkçe):
   - "Sen e-ticaret akıllı ürün asistanısın"
   - matchScore zaten hesaplandı bilgisi
   - "Senin görevin: reply, visualInsights, followUpQuestions, ek warnings üretmek"
   - "matchScore ÜRETME, sadece backend'in hesapladığı skoru referans al"
   
2. Ürün verileri enjekte et (ad, kategori, marka, specs, reviews)
3. DataAnalysis sonuçları enjekte et
4. Kategori rehberi (GIYIM/MOBILYA/ELEKTRONIK/OUTDOOR)
5. Konuşma geçmişi
6. Kullanıcı sorusu
7. JSON output formatı talimatı

8. imageUrl → Base64 encode (try-catch, başarısızsa null)
9. GeminiRequest döndür
```

### Modül 2.4: `GeminiService`
```
Input:  GeminiRequest
Output: Map<String, Object>

1. RestTemplate (connectTimeout=10s, readTimeout=30s)
2. Multimodal request body oluştur (text + image varsa)
3. generationConfig: temperature=0.3, maxOutputTokens=1024
4. POST → Gemini API
5. Response'tan text çıkar
6. ```json fence temizle
7. Jackson ile Map'e parse et
8. Parse hatası → fallback Map (default reply + boş listeler)

Hata yönetimi:
- ResourceAccessException (timeout) → fallback
- HttpClientErrorException → fallback
- JSON parse hatası → fallback
```

### Modül 2.5: `AgentOrchestrator`
```
Input:  ChatRequest
Output: ChatResponse

Pipeline:
1. contextBuilder.build(productId, message)         → ProductContext
2. dataAnalysis.analyze(context, message)            → DataAnalysisResult
3. matchScore = dataAnalysis.calculateScore(result)  → int
4. promptBuilder.build(context, result, msg, hist)   → GeminiRequest
5. geminiService.call(request)                       → Map<String, Object>
6. Merge + validate:
   - reply         ← geminiResponse["reply"] ?? fallback
   - matchScore    ← adım 3 (BACKEND, Gemini'den DEĞİL)
   - visualInsights← geminiResponse["visualInsights"] ?? ""
   - warnings      ← DataAnalysisResult.warnings + geminiResponse["warnings"]
   - followUps     ← geminiResponse["followUpQuestions"] ?? default list
   - dataSources   ← DataAnalysisResult.usedSources
7. ChatResponse döndür

Gemini hata durumunda:
- matchScore korunur (backend hesapladı)
- dataSources korunur (backend hesapladı)
- warnings korunur (backend hesapladı)
- reply = fallback mesaj
- Pipeline KIRILMAZ
```

**✅ Checkpoint:** POST /api/chat → tam pipeline çalışıyor, 4 kategoriden 1'er soru test

---

## Faz 3 — Controller + Config

### Modül 3.1: `ProductController`
```
GET  /api/products                    → List<Product> (compact — specs/reviews dahil)
GET  /api/products?category=GIYIM    → Filtreli liste
GET  /api/products/{id}              → Product + specs + reviews
GET  /api/products/999               → 404 + error mesajı
```

### Modül 3.2: `ChatController`
```
POST /api/chat
@RequestBody @Valid ChatRequest
→ orchestrator.process(request) → ChatResponse
```

### Modül 3.3: `CorsConfig`
```
Allowed Origins: http://localhost:3000, https://*.vercel.app
Allowed Methods: GET, POST, OPTIONS
Allowed Headers: *
```

### Modül 3.4: `GlobalExceptionHandler` + `ProductNotFoundException`
```
ProductNotFoundException           → 404 { "error": "Ürün bulunamadı" }
MethodArgumentNotValidException    → 400 { "error": "..." }
Exception                          → 500 { "error": "Bir hata oluştu" }
```

**✅ Checkpoint:** Tüm endpoint'ler çalışıyor, CORS doğru, hata durumları test edildi

---

## Faz 4 — Frontend Entegrasyonu

Mevcut frontend: `/Users/arif/Desktop/btk/e-commerce-prototype-2/`

### Modül 4.1: API client + environment

`page.tsx`'e eklenecekler:
- `NEXT_PUBLIC_API_URL` environment variable
- `fetch` veya `axios` ile POST /api/chat çağrısı
- Chat submit handler

### Modül 4.2: Chat state + mesaj gösterimi

Mevcut `ProductDetailPage` component'ine eklenecek:
- `messages[]` state (user + assistant mesajları)
- `isLoading` state → loading animasyonu
- `error` state → hata kutusu
- Mesaj baloncukları (user: sağ, assistant: sol)
- matchScore'u dinamik olarak `RealityScoreCircle`'a bağla

### Modül 4.3: Response field gösterimi

- `warnings[]` → turuncu uyarı kutuları
- `dataSources[]` → "Kullanılan Kaynaklar" listesi
- `followUpQuestions[]` → tıklanabilir butonlar (mevcut yapı genişletilir)
- `visualInsights` → özel bilgi kutusu

### Modül 4.4: Ürün görselleri (opsiyonel)

Placeholder → Unsplash/gerçek URL geçişi (imageUrl backend'den gelir)

**✅ Checkpoint:** Uçtan uca: ürün seç → soru sor → loading → AI yanıt → skor + kaynaklar görünür

---

## Deploy

### Backend → Railway
```
1. railway.app → Login with GitHub
2. New Project → Deploy from GitHub Repo → smartcart-backend
3. Variables → GEMINI_API_KEY = [key]
4. Deploy → 'Started SmartCartApplication' bekle
5. Generate Domain → URL kopyala
6. Test: GET https://[url].up.railway.app/api/products
```

### Frontend → Vercel
```
1. vercel.com → Import → e-commerce-prototype-2
2. Environment: NEXT_PUBLIC_API_URL = https://[railway-url]
3. Deploy → test
```

### CORS Güncellemesi
```
Backend CorsConfig'e Vercel URL ekle → Railway redeploy
```

---

## Teslim Kontrol Listesi

- [ ] GitHub: Her iki repo public
- [ ] GitHub: Commit tarihleri 8-19 Mayıs
- [ ] GitHub: API key repoda YOK
- [ ] GitHub: README.md mevcut
- [ ] Backend: Railway'de aktif
- [ ] Backend: GET /api/products çalışıyor
- [ ] Backend: POST /api/chat çalışıyor
- [ ] Frontend: Vercel'de aktif
- [ ] Frontend: 4 kategori görünüyor
- [ ] Frontend: Chat çalışıyor, yanıt geliyor
- [ ] Video: YouTube (max 60 saniye)
- [ ] Form: 21:00'den önce gönderildi

---

## Zaman Planı

| Zaman | Faz | İş |
|-------|-----|-----|
| **17 Mayıs 23:00 → 02:00** | Faz 0+1 | Proje iskeleti + Entity + Repo + DTO + data.sql |
| **18 Mayıs 09:00 → 14:00** | Faz 2 | ContextBuilder + DataAnalysis + PromptBuilder + Gemini + Orchestrator |
| **18 Mayıs 14:00 → 20:00** | Faz 3 | Controller + Config + Deploy (Railway + Vercel) |
| **18 Mayıs 20:00 → 24:00** | Faz 4 | Frontend API entegrasyonu + Chat UI |
| **19 Mayıs 09:00 → 21:00** | Teslim | Test + Video + README + Form |
