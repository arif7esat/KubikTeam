package com.smartcart.service;

import com.smartcart.model.dto.DataAnalysisResult;
import com.smartcart.model.dto.GeminiRequest;
import com.smartcart.model.dto.ProductContext;
import com.smartcart.model.entity.Product;
import com.smartcart.model.entity.ProductSpec;
import com.smartcart.model.entity.ReturnRecord;
import com.smartcart.model.entity.Review;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.net.URL;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class PromptBuilderService {

    private static final Logger log = LoggerFactory.getLogger(PromptBuilderService.class);

    private static final List<String> ALLOWED_IMAGE_DOMAINS = List.of(
        "images.unsplash.com",
        "unsplash.com"
    );

    public GeminiRequest build(ProductContext context, DataAnalysisResult analysis, String userMessage, List<String> history) {
        Product product = context.getProduct();

        StringBuilder prompt = new StringBuilder();
        prompt.append("Sen bir e-ticaret akıllı ürün asistanısın. Görevin kullanıcının sorusunu verilen ürün verisi üzerinden dürüstçe ve net yanıtlamak.\n\n");
        prompt.append("KRİTİK KURAL: matchScore zaten backend tarafından hesaplandı: ").append(analysis.getSpecScore()).append(". Sen matchScore ÜRETME.\n");
        prompt.append("Senin görevin: reply, visualInsights, followUpQuestions ve varsa ek warnings üretmek.\n\n");
        prompt.append("=== ÜRÜN BİLGİLERİ ===\n");
        prompt.append("Ad: ").append(product.getName()).append(" | Kategori: ").append(product.getCategory())
                .append(" | Marka: ").append(product.getBrand()).append("\n");
        prompt.append("Fiyat: ").append(product.getPrice()).append(" TL\n");
        prompt.append("Açıklama: ").append(product.getDescription()).append("\n\n");

        prompt.append("=== TEKNİK ÖZELLİKLER ===\n");
        List<ProductSpec> specs = context.getSpecs();
        if (specs != null && !specs.isEmpty()) {
            for (ProductSpec spec : specs) {
                prompt.append(spec.getSpecKey()).append(": ").append(spec.getSpecValue()).append("\n");
            }
        } else {
            prompt.append("Teknik özellik bulunamadı.\n");
        }
        prompt.append("\n");

        prompt.append("=== KULLANICI YORUMLARI ===\n");
        List<Review> reviews = context.getReviews();
        if (reviews != null && !reviews.isEmpty()) {
            for (Review review : reviews) {
                prompt.append(review.getUsername()).append(" (").append(review.getRating())
                        .append("/5): ").append(review.getComment()).append("\n");
            }
        } else {
            prompt.append("Henüz yorum yapılmamış.\n");
        }
        prompt.append("\n");

        if (context.getReturnRecords() != null && !context.getReturnRecords().isEmpty()) {
            prompt.append("=== İADE VERİLERİ ===\n");
            prompt.append("Toplam iade: ").append(context.getReturnCount()).append("\n");
            Map<String, Integer> reasons = context.getReturnReasonSummary();
            if (reasons != null && !reasons.isEmpty()) {
                prompt.append("İade sebepleri: ");
                reasons.forEach((k, v) -> prompt.append(k).append("(").append(v).append(") "));
                prompt.append("\n");
            }
            int count = 0;
            for (ReturnRecord r : context.getReturnRecords()) {
                if (count >= 5) break;
                prompt.append("- İade sebebi: ").append(r.getReturnReason())
                      .append(" | Yorum: ").append(r.getReturnComment()).append("\n");
                count++;
            }
            prompt.append("\n");
        }

        if (context.getReviewImageCount() > 0) {
            prompt.append("=== KULLANICI FOTOĞRAFLARI ===\n");
            prompt.append(context.getReviewImageCount()).append(" kullanıcı fotoğraflı yorum paylaşmış.\n");
            prompt.append("Bu fotoğraflar ürünün gerçek görünümüne dair ek kanıt sağlar.\n");
            prompt.append("Stüdyo çekimi ile kullanıcı fotoğrafları arasındaki farkları belirt.\n\n");
        }

        prompt.append("=== BACKEND ANALİZ SONUÇLARI ===\n");
        prompt.append("Uyum Skoru: ").append(analysis.getSpecScore()).append("\n");
        prompt.append("Uyarılar: ").append(analysis.getWarnings()).append("\n");
        prompt.append("Kullanılan Kaynaklar: ").append(analysis.getUsedSources()).append("\n\n");

        prompt.append("=== KATEGORİ REHBERİ ===\n");
        prompt.append(getCategoryGuide(product.getCategory()));
        prompt.append("\n\n");

        if (history != null && !history.isEmpty()) {
            prompt.append("=== KONUŞMA GEÇMİŞİ ===\n");
            for (String h : history) {
                prompt.append(h).append("\n");
            }
            prompt.append("\n");
        }

        prompt.append("=== KULLANICI SORUSU ===\n");
        prompt.append(userMessage).append("\n\n");

        prompt.append("=== YANITINI SADECE JSON OLARAK VER ===\n");
        prompt.append("{\n");
        prompt.append("  \"reply\": \"Türkçe, net, max 3 cümle, kullanıcıya doğrudan hitap\",\n");
        prompt.append("  \"visualInsights\": \"Görsel analiz özeti, 1-2 cümle. Stüdyo çekim yanıltıcılığı varsa belirt\",\n");
        prompt.append("  \"warnings\": [\"Ek uyarı varsa yaz, yoksa boş bırak\"],\n");
        prompt.append("  \"followUpQuestions\": [\"Takip sorusu 1\", \"Takip sorusu 2\"]\n");
        prompt.append("}\n");

        String base64 = null;
        String mimeType = null;
        if (isAllowedImageUrl(product.getPrimaryImageUrl())) {
            try {
                URL url = new URL(product.getPrimaryImageUrl());
                byte[] bytes = url.openStream().readAllBytes();
                base64 = Base64.getEncoder().encodeToString(bytes);
                mimeType = "image/jpeg";
            } catch (Exception e) {
                base64 = null;
                mimeType = null;
            }
        } else {
            log.warn("Image URL not in allowlist, skipping visual analysis: {}", product.getPrimaryImageUrl());
        }

        return new GeminiRequest(prompt.toString(), base64, mimeType);
    }

    private boolean isAllowedImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return false;
        try {
            java.net.URL url = new java.net.URL(imageUrl);
            String host = url.getHost().toLowerCase();
            return ALLOWED_IMAGE_DOMAINS.stream().anyMatch(host::contains);
        } catch (Exception e) {
            return false;
        }
    }

    private String getCategoryGuide(String category) {
        if (category == null) return "";
        return switch (category) {
            case "GIYIM" -> "Boy-kilo-beden uyumu analiz et. Stüdyo ışığının renk yanıltmasını belirt. Beden tablosunu referans al.";
            case "MOBILYA" -> "Oda boyutu uyumunu analiz et. Geniş açı lens etkisiyle ürünün gerçekte daha küçük olabileceğini belirt.";
            case "ELEKTRONIK" -> "Cihaz uyumluluğunu ve teknik özellikleri karşılaştır. Günlük kullanım senaryosunu değerlendir.";
            case "OUTDOOR" -> "Mevsim ve hava koşulu uyumunu analiz et. Su geçirmezlik, ağırlık ve dayanıklılık değerlendir.";
            default -> "";
        };
    }
}
