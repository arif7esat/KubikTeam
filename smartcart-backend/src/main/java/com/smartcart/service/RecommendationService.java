package com.smartcart.service;

import com.smartcart.model.dto.RecommendationResult;
import com.smartcart.model.entity.Product;
import com.smartcart.model.entity.Review;
import com.smartcart.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final ProductRepository productRepository;

    public RecommendationService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public RecommendationResult recommend(List<Long> viewedIds, String category, int limit) {
        if (limit <= 0) limit = 8;

        List<Product> allProducts = productRepository.findAll();
        Set<Long> viewedSet = viewedIds != null ? new HashSet<>(viewedIds) : Set.of();

        List<Product> candidates = allProducts.stream()
                .filter(p -> !viewedSet.contains(p.getId()))
                .collect(Collectors.toList());

        Double avgViewedPrice = null;
        if (!viewedSet.isEmpty() && viewedIds != null) {
            avgViewedPrice = allProducts.stream()
                    .filter(p -> viewedSet.contains(p.getId()))
                    .mapToDouble(p -> p.getPrice() != null ? p.getPrice() : 0)
                    .average()
                    .orElse(0);
        }

        List<ProductScore> scored = new ArrayList<>();
        for (Product product : candidates) {
            int score = 0;

            if (viewedIds != null && !viewedIds.isEmpty()) {
                Product firstViewed = allProducts.stream()
                        .filter(p -> p.getId().equals(viewedIds.get(0)))
                        .findFirst().orElse(null);
                if (firstViewed != null && firstViewed.getCategory() != null
                        && firstViewed.getCategory().equals(product.getCategory())) {
                    score += 30;
                }

                if (avgViewedPrice != null && avgViewedPrice > 0 && product.getPrice() != null) {
                    double diff = Math.abs(product.getPrice() - avgViewedPrice) / avgViewedPrice;
                    if (diff <= 0.30) score += 20;
                }
            }

            List<Review> reviews = product.getReviews();
            if (reviews != null && !reviews.isEmpty()) {
                double avgRating = reviews.stream().mapToInt(Review::getRating).average().orElse(0);
                if (avgRating >= 4.5) score += 25;
                else if (avgRating >= 4.0) score += 15;

                if (reviews.size() >= 50) score += 10;

                long negCount = reviews.stream()
                        .filter(r -> r.getHelpfulTags() != null && !r.getHelpfulTags().isBlank())
                        .count();
                double negRatio = (double) negCount / reviews.size();
                if (negRatio > 0.20) score -= 15;
            }

            if (category != null && !category.isBlank()
                    && product.getCategory() != null
                    && product.getCategory().equalsIgnoreCase(category)) {
                score += 10;
            }

            scored.add(new ProductScore(product, score));
        }

        scored.sort((a, b) -> Integer.compare(b.score, a.score));
        List<Product> topProducts = scored.stream()
                .limit(limit)
                .map(ps -> ps.product)
                .collect(Collectors.toList());

        List<RecommendationResult.ProductReason> reasons = new ArrayList<>();
        for (Product product : topProducts) {
            String why = generateWhy(product, category, viewedSet, allProducts);
            reasons.add(new RecommendationResult.ProductReason(product.getId(), why));
        }

        return new RecommendationResult(topProducts, reasons);
    }

    private String generateWhy(Product product, String category, Set<Long> viewedSet, List<Product> allProducts) {
        List<Review> reviews = product.getReviews();
        int reviewCount = reviews != null ? reviews.size() : 0;
        double avgRating = reviews != null && !reviews.isEmpty()
                ? reviews.stream().mapToInt(Review::getRating).average().orElse(0) : 0;

        if (avgRating >= 4.5) {
            return "Yüksek kullanıcı memnuniyeti ve " + reviewCount + " değerlendirme.";
        }

        if (category != null && !category.isBlank() && product.getCategory() != null
                && product.getCategory().equalsIgnoreCase(category)) {
            return "İncelediğiniz ürünlerle aynı kategoride.";
        }

        if (!viewedSet.isEmpty()) {
            Product firstViewed = allProducts.stream()
                    .filter(p -> p.getId().equals(viewedSet.iterator().next()))
                    .findFirst().orElse(null);
            if (firstViewed != null && firstViewed.getCategory() != null
                    && firstViewed.getCategory().equals(product.getCategory())) {
                return "İncelediğiniz ürünlerle aynı kategoride.";
            }
        }

        return "Popüler ve beğenilen bir ürün.";
    }

    private static class ProductScore {
        Product product;
        int score;
        ProductScore(Product p, int s) { product = p; score = s; }
    }
}
