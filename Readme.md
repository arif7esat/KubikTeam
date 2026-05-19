<div align="center">

# 🛒 SmartCart AI

### Yapay Zeka Destekli Akıllı E-Ticaret Asistanı

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

> **BTK Akademi Hackathon 2026** — KubikTeam

*Online alışverişte tüketicinin en büyük sorunu: "Bu ürün gerçekten göründüğü kadar iyi mi?"
SmartCart AI, bu soruyu yapay zeka ile yanıtlıyor.*

---

</div>

## 🎯 Problem

E-ticaret platformlarında tüketiciler her gün binlerce ürün arasında kayboluyor. Yanıltıcı ürün açıklamaları, manipüle edilmiş yorumlar ve fiyat oyunları, bilinçli alışveriş yapmayı neredeyse imkânsız kılıyor. Kullanıcılar karar vermek için onlarca sekme açıyor, yüzlerce yorumu okuyor ve yine de doğru ürünü aldıklarından emin olamıyorlar.

## 💡 Çözüm

**SmartCart AI**, kullanıcıya her ürün için yapay zeka destekli kişisel bir alışveriş danışmanı sunar. Gerçek kullanıcı yorumlarını analiz eder, ürün özelliklerini doğrular, fiyat geçmişini değerlendirir ve tüm bunları anlaşılır bir **Reality Score** puanıyla özetler.

---

## ✨ Temel Özellikler

### 🤖 AI Sohbet Asistanı (Maison Assistant)
- Ürün bazlı gerçek zamanlı yapay zeka sohbeti
- Kullanıcı soru sorar, AI ürün verilerini analiz ederek yanıt verir
- Sohbet geçmişi `localStorage` ile kalıcı — ürünler arası geçişte kaybolmaz
- Apple Dock tarzı sidebar ile sohbet edilen ürünler arasında geçiş
- Drag & drop ile birden fazla ürünü karşılaştırma alanına sürükleme

### 📊 Reality Score
- AI'ın ürünün gerçek kalitesini puanlaması (0–100)
- Kullanıcı yorumları, satıcı güvenilirliği ve ürün tutarlılığından hesaplanır
- Sadece kullanıcı istediğinde gösterilir, her mesajda spam yapılmaz

### 🖼️ Premium Ürün Galerisi
- Crossfade animasyonlu resim geçişleri
- 3'erli grid küçük resim düzeni (ana resim genişliğiyle orantılı)
- Hover'da görünen navigasyon okları ve dot indicator
- Kullanıcı yorumlarındaki resimleri büyütme özelliği

### 🔍 Akıllı Ürün Karşılaştırma
- Chat alanına birden fazla ürünü sürükle-bırak ile karşılaştır
- CMD/CTRL + click ile çoklu ürün seçimi
- Karşılaştırma dashboard'u ile yan yana analiz

### 📱 Responsive Tasarım
- Masaüstü ve mobil uyumlu responsive arayüz
- Premium Maison-style UI: glassmorphism, micro-animasyonlar, yumuşak geçişler
- Framer Motion ile fizik tabanlı animasyonlar

---

## 🏗️ Mimari

```
┌─────────────────────────────────────────────────────┐
│                     Frontend                         │
│              Next.js 16 + TypeScript                 │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Ürün     │  │ Maison   │  │ Product           │  │
│  │ Galerisi │  │ Chat UI  │  │ Sidebar (Dock)    │  │
│  └──────────┘  └────┬─────┘  └───────────────────┘  │
│                     │                                │
└─────────────────────┼────────────────────────────────┘
                      │ REST API
┌─────────────────────┼────────────────────────────────┐
│                     ▼          Backend               │
│              Spring Boot 3.x + Java                  │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Product  │  │ Chat     │  │ Recommendation    │  │
│  │ Service  │  │ Service  │  │ Engine            │  │
│  └──────────┘  └────┬─────┘  └───────────────────┘  │
│                     │                                │
│              ┌──────▼──────┐                         │
│              │  AI / LLM   │                         │
│              │  Integration│                         │
│              └─────────────┘                         │
└──────────────────────────────────────────────────────┘
```

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| **Frontend** | Next.js | 16.2.6 |
| **UI Framework** | React | 19 |
| **Styling** | Tailwind CSS | 4.2 |
| **Animasyon** | Framer Motion | 12.x |
| **UI Components** | Radix UI | Latest |
| **Type Safety** | TypeScript | 5.7 |
| **Backend** | Spring Boot | 3.x |
| **Veritabanı** | PostgreSQL / MySQL | - |
| **AI** | LLM API Integration | - |
| **Veri Kaynağı** | Trendyol (Scraper) | Puppeteer |

---

## 📁 Proje Yapısı

```
e-commerce-prototype-2/
├── app/
│   ├── page.tsx              # Ana sayfa + ürün detay + layout
│   ├── globals.css           # Global stiller ve animasyonlar
│   └── layout.tsx            # Root layout
├── components/
│   ├── maison-chat.tsx       # AI chat orkestratörü (ana bileşen)
│   ├── chat-header.tsx       # Chat başlık (ürün adı + satıcı)
│   ├── chat-input.tsx        # Mesaj girişi (textarea + drag-drop)
│   ├── chat-message.tsx      # Mesaj baloncukları (AI + kullanıcı)
│   ├── product-sidebar.tsx   # Apple Dock tarzı ürün navigasyonu
│   ├── reality-score-card.tsx# Reality Score görselleştirme
│   ├── comparison-dashboard.tsx # Ürün karşılaştırma paneli
│   ├── suggestion-chips.tsx  # Öneri butonları
│   ├── pending-products.tsx  # Karşılaştırma için bekleyen ürünler
│   └── ui/                   # Radix tabanlı temel UI bileşenleri
├── lib/
│   └── utils.ts              # Yardımcı fonksiyonlar
├── public/                   # Statik dosyalar
└── styles/                   # Ek stil dosyaları
```

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya pnpm
- Java 17+ (backend için)

### Frontend

```bash
# Repoyu klonla
git clone https://github.com/arif7esat/KubikTeam.git
cd KubikTeam

# Bağımlılıkları yükle
npm install

# Environment değişkenlerini ayarla
cp .env.example .env.local
# .env.local dosyasında NEXT_PUBLIC_API_URL değerini ayarla

# Geliştirme sunucusunu başlat
npm run dev
```

### Backend

```bash
# Backend dizinine git
cd backend

# Maven ile çalıştır
./mvnw spring-boot:run
```

### Environment Variables

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `NEXT_PUBLIC_API_URL` | Backend API adresi | `http://localhost:8080` |

---

## 📸 Ekran Görüntüleri

| Ana Sayfa | Ürün Detay + AI Chat |
|-----------|---------------------|
| Premium grid layout ile ürün kartları | Maison-style AI sohbet asistanı |

| Reality Score | Ürün Karşılaştırma |
|---------------|-------------------|
| AI tabanlı güvenilirlik puanlama | Drag & drop ile yan yana analiz |

---

## 🔑 API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/products` | Tüm ürünleri listele |
| `GET` | `/api/products/{id}` | Ürün detayı (yorumlar dahil) |
| `POST` | `/api/chat` | AI sohbet mesajı gönder |
| `GET` | `/api/recommendations` | Görüntüleme geçmişine göre öneriler |

### Chat API Request/Response

```json
// POST /api/chat
{
  "productId": 1,
  "message": "Bu ürünün kumaş kalitesi nasıl?",
  "history": []
}

// Response
{
  "reply": "Ürünün kumaş bileşimi %99 pamuk, %1 elastan...",
  "matchScore": 87,
  "followUpQuestions": ["Beden kalıbı nasıl?", "Renk seçenekleri neler?"],
  "warnings": [],
  "dataSources": ["user_reviews", "product_specs"]
}
```

---

## 👥 Takım — KubikTeam

| Üye | Rol |
|-----|-----|
| **Arif** | Full-Stack Geliştirici & Proje Yöneticisi |
| **Aleyna** | Geliştirici |

---

## 📄 Lisans

Bu proje BTK Akademi Hackathon 2026 kapsamında geliştirilmiştir.

---

<div align="center">

**KubikTeam** ile ❤️ yapıldı

*"Akıllı alışveriş, yapay zeka ile başlar."*

</div>

