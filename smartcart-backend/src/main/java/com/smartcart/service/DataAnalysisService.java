package com.smartcart.service;

import com.smartcart.model.dto.DataAnalysisResult;
import com.smartcart.model.dto.ProductContext;
import com.smartcart.model.entity.Product;
import com.smartcart.model.entity.ProductSpec;
import com.smartcart.model.entity.ReturnRecord;
import com.smartcart.model.entity.Review;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DataAnalysisService {

    private static final List<String> SPEC_KEYWORDS = List.of(
        "boy", "beden", "boyut", "ölçü", "ağırlık", "numara", "cm", "kg", "inç",
        "uyumlu", "uyum", "sığ", "büyük", "küçük", "dar", "geniş", "uzun", "kısa"
    );

    private static final List<String> NEGATIVE_TAGS = List.of(
        "beden_buyuk", "beden_dar", "beden_kucuk", "renk_farkli", "kalite_kotu", "dikis_hatali"
    );

    public DataAnalysisResult analyze(ProductContext context, String userMessage) {
        DataAnalysisResult result = new DataAnalysisResult();

        result.setSpecScore(calculateSpecScore(context.getSpecs(), userMessage));
        result.setReviewScore(calculateReviewScore(context.getReviews()));
        result.setVisualScore(calculateVisualScore(context.getProduct()));
        result.setVariantScore(calculateVariantScore(context));
        result.setSimilarityScore(calculateSimilarityScore(context.getSimilarProducts()));
        result.setUserFitScore(calculateUserFitScore(context.getSpecs(), userMessage));
        result.setTrustScore(calculateTrustScore(context.getReviews()));

        List<String> warnings = new ArrayList<>();
        List<String> insights = new ArrayList<>();
        List<String> usedSources = new ArrayList<>();

        List<ReturnRecord> returns = context.getReturnRecords();
        if (returns != null && !returns.isEmpty()) {
            int returnCount = returns.size();
            int reviewCount = context.getReviews() != null ? Math.max(context.getReviews().size(), 1) : 1;
            double returnRate = (double) returnCount / Math.max(reviewCount, 1);

            if (returnRate > 0.15) {
                result.setSpecScore(Math.max(0, result.getSpecScore() - 10));
                result.setTrustScore(Math.max(0, result.getTrustScore() - 15));
            }

            Map<String, Integer> reasons = context.getReturnReasonSummary();
            if (reasons != null) {
                if (reasons.getOrDefault("BEDEN_UYUMSUZ", 0) >= 2) {
                    warnings.add("Birden fazla kullanıcı beden uyumsuzluğu sebebiyle iade etmiş.");
                }
                if (reasons.getOrDefault("RENK_FARKLI", 0) >= 2) {
                    warnings.add("Birden fazla kullanıcı renk farkı sebebiyle iade etmiş.");
                }
                if (reasons.getOrDefault("KALITE_DUSUK", 0) >= 1) {
                    warnings.add("Kalite düşüklüğü sebebiyle iade kaydı mevcut.");
                }
            }

            insights.add("Bu ürünün iade oranı: %" + Math.round(returnRate * 100));
            usedSources.add("İade verileri (" + returns.size() + " kayıt)");
        }

        if (context.getReviewImageCount() > 0) {
            insights.add(context.getReviewImageCount() + " kullanıcı fotoğraflı yorum paylaşmış.");
            usedSources.add("Kullanıcı fotoğrafları (" + context.getReviewImageCount() + " görsel)");
        }

        warnings.addAll(buildWarnings(context.getReviews()));
        insights.addAll(buildInsights(context.getReviews()));
        usedSources.addAll(buildUsedSources(context));

        result.setWarnings(warnings);
        result.setInsights(insights);
        result.setUsedSources(usedSources);

        return result;
    }

    public int calculateMatchScore(DataAnalysisResult result) {
        float score = result.getSpecScore() * 0.25f
                + result.getReviewScore() * 0.20f
                + result.getVisualScore() * 0.15f
                + result.getSimilarityScore() * 0.15f
                + result.getUserFitScore() * 0.10f
                + result.getVariantScore() * 0.10f
                + result.getTrustScore() * 0.05f;
        return Math.clamp(Math.round(score), 0, 100);
    }

    private int calculateSpecScore(List<ProductSpec> specs, String userMessage) {
        if (specs == null || specs.isEmpty()) {
            return 30;
        }
        String lowerMessage = userMessage.toLowerCase();
        int matchCount = 0;
        for (String keyword : SPEC_KEYWORDS) {
            for (ProductSpec spec : specs) {
                String key = spec.getSpecKey() != null ? spec.getSpecKey().toLowerCase() : "";
                String value = spec.getSpecValue() != null ? spec.getSpecValue().toLowerCase() : "";
                if (key.contains(keyword) || value.contains(keyword) || lowerMessage.contains(keyword)) {
                    matchCount++;
                    break;
                }
            }
        }
        int score = 50 + matchCount * 10;
        return Math.clamp(score, 0, 100);
    }

    private int calculateReviewScore(List<Review> reviews) {
        if (reviews == null || reviews.isEmpty()) {
            return 40;
        }
        double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0);
        int baseScore = (int) ((avgRating / 5.0) * 100);

        int negativeCount = 0;
        for (Review review : reviews) {
            if (review.getHelpfulTags() != null) {
                for (String negativeTag : NEGATIVE_TAGS) {
                    if (review.getHelpfulTags().toLowerCase().contains(negativeTag)) {
                        negativeCount++;
                    }
                }
            }
        }
        baseScore -= negativeCount * 5;
        return Math.clamp(baseScore, 0, 100);
    }

    private int calculateVisualScore(Product product) {
        if (product.getImageUrl() != null && !product.getImageUrl().isEmpty()) {
            return 70;
        }
        return 30;
    }

    private int calculateVariantScore(ProductContext context) {
        List<Product> similarProducts = context.getSimilarProducts();
        if (similarProducts == null || similarProducts.isEmpty()) {
            return 50;
        }

        double thisAvgRating = getAvgRating(context.getProduct().getReviews());
        double similarAvgRating = similarProducts.stream()
                .filter(p -> p.getReviews() != null)
                .flatMap(p -> p.getReviews().stream())
                .mapToInt(Review::getRating)
                .average()
                .orElse(0);

        if (thisAvgRating > similarAvgRating) return 75;
        else if (thisAvgRating == similarAvgRating) return 65;
        else return 55;
    }

    private int calculateSimilarityScore(List<Product> similarProducts) {
        if (similarProducts == null || similarProducts.isEmpty()) return 45;
        if (similarProducts.size() >= 2) return 75;
        return 60;
    }

    private int calculateUserFitScore(List<ProductSpec> specs, String userMessage) {
        if (specs == null || specs.isEmpty()) {
            return 40;
        }

        Pattern pattern = Pattern.compile("\\d+");
        Matcher userMatcher = pattern.matcher(userMessage);
        List<Integer> userNumbers = new ArrayList<>();
        while (userMatcher.find()) {
            try {
                userNumbers.add(Integer.parseInt(userMatcher.group()));
            } catch (NumberFormatException ignored) {}
        }

        List<Integer> specNumbers = new ArrayList<>();
        for (ProductSpec spec : specs) {
            if (spec.getSpecValue() != null) {
                Matcher specMatcher = pattern.matcher(spec.getSpecValue());
                while (specMatcher.find()) {
                    try {
                        specNumbers.add(Integer.parseInt(specMatcher.group()));
                    } catch (NumberFormatException ignored) {}
                }
            }
        }

        if (!userNumbers.isEmpty() && !specNumbers.isEmpty()) {
            for (int userNum : userNumbers) {
                for (int specNum : specNumbers) {
                    if (Math.abs(userNum - specNum) <= specNum * 0.20) {
                        return 80;
                    }
                }
            }
        }

        return specs.size() >= 3 ? 60 : 40;
    }

    private int calculateTrustScore(List<Review> reviews) {
        if (reviews == null || reviews.isEmpty()) return 30;

        int size = reviews.size();
        int baseScore;
        if (size >= 4) baseScore = 85;
        else if (size >= 2) baseScore = 70;
        else baseScore = 50;

        double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0);

        if (avgRating >= 4.5) baseScore += 5;
        if (avgRating < 3.0) baseScore -= 10;

        return Math.clamp(baseScore, 0, 100);
    }

    private List<String> buildWarnings(List<Review> reviews) {
        List<String> warnings = new ArrayList<>();
        if (reviews == null || reviews.isEmpty()) {
            warnings.add("Yorum sayısı az, değerlendirme sınırlı olabilir");
            return warnings;
        }

        Set<String> negativeTagsFound = new LinkedHashSet<>();
        for (Review review : reviews) {
            if (review.getHelpfulTags() != null) {
                for (String tag : review.getHelpfulTags().toLowerCase().split(",")) {
                    String trimmed = tag.trim();
                    if (NEGATIVE_TAGS.contains(trimmed)) {
                        negativeTagsFound.add(trimmed.replace("_", " "));
                    }
                }
            }
        }
        for (String tag : negativeTagsFound) {
            warnings.add("Bazı kullanıcılar " + tag + " belirtiyor");
        }

        if (reviews.size() < 3) {
            warnings.add("Yorum sayısı az, değerlendirme sınırlı olabilir");
        }

        double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0);
        if (avgRating < 3.5) {
            warnings.add("Ürün puanı ortalamanın altında");
        }

        return warnings;
    }

    private List<String> buildInsights(List<Review> reviews) {
        List<String> insights = new ArrayList<>();
        if (reviews == null || reviews.isEmpty()) return insights;

        long positiveCount = reviews.stream().filter(r -> r.getRating() >= 4).count();
        int positivePct = (int) ((positiveCount * 100.0) / reviews.size());
        insights.add("Yorumların %" + positivePct + "i olumlu (4-5 yıldız)");

        if (reviews.size() >= 5) {
            insights.add("Yeterli yorum verisi mevcut");
        }

        double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0);
        if (avgRating >= 4.5) {
            insights.add("Bu kategoride yüksek puanlı ürün");
        }

        return insights;
    }

    private List<String> buildUsedSources(ProductContext context) {
        List<String> sources = new ArrayList<>();

        if (context.getSpecs() != null && !context.getSpecs().isEmpty()) {
            sources.add("Ürün teknik özellikleri");
        }

        int reviewCount = context.getReviews() != null ? context.getReviews().size() : 0;
        if (reviewCount > 0) {
            sources.add(reviewCount + " kullanıcı yorumu");
        }

        if (context.getProduct().getImageUrl() != null && !context.getProduct().getImageUrl().isEmpty()) {
            sources.add("Görsel analiz");
        }

        int similarCount = context.getSimilarProducts() != null ? context.getSimilarProducts().size() : 0;
        if (similarCount > 0) {
            sources.add(similarCount + " benzer ürün karşılaştırması");
        }

        sources.add("Ürün puanlama verisi");

        return sources;
    }

    private double getAvgRating(List<Review> reviews) {
        if (reviews == null || reviews.isEmpty()) return 0;
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0);
    }
}
