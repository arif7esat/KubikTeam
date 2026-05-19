package com.smartcart.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcart.model.entity.*;
import com.smartcart.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.io.File;
import java.util.*;

@Component
public class TrendyolDataLoader {

    @Value("${trendyol.data.path:/Users/arif/Desktop/btk/trendyol_verileri}")
    private String trendyolDataPath;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewImageRepository reviewImageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductSpecRepository productSpecRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    @PostConstruct
    public void loadData() {
        if (productRepository.count() > 0) return;

        File dataDir = new File(trendyolDataPath);
        if (!dataDir.exists()) {
            System.err.println("Trendyol veri dizini bulunamadı: " + trendyolDataPath);
            return;
        }

        Map<String, String> categoryMap = new HashMap<>();
        categoryMap.put("koton", "GIYIM");
        categoryMap.put("burke", "GIYIM");
        categoryMap.put("ikea", "MOBILYA");
        categoryMap.put("kelebek", "MOBILYA");
        categoryMap.put("apple", "ELEKTRONIK");
        categoryMap.put("samsung", "ELEKTRONIK");
        categoryMap.put("the-north-face", "OUTDOOR");
        categoryMap.put("salomon", "OUTDOOR");

        Map<String, String> brandMap = new HashMap<>();
        brandMap.put("koton", "Koton");
        brandMap.put("burke", "Bürke");
        brandMap.put("ikea", "IKEA");
        brandMap.put("kelebek", "Kelebek");
        brandMap.put("apple", "Apple");
        brandMap.put("samsung", "Samsung");
        brandMap.put("the-north-face", "The North Face");
        brandMap.put("salomon", "Salomon");

        File[] productDirs = dataDir.listFiles(File::isDirectory);
        if (productDirs == null) return;

        Set<String> createdEmails = new HashSet<>();
        List<User> allUsers = new ArrayList<>();

        int productId = 0;
        for (File productDir : productDirs) {
            productId++;
            String dirName = productDir.getName();
            String brandKey = dirName.split("_")[0];

            File productInfoFile = new File(productDir, "product_info.json");
            if (!productInfoFile.exists()) continue;

            try {
                JsonNode productInfo = mapper.readTree(productInfoFile);
                String name = productInfo.get("name").asText();
                String brand = brandMap.getOrDefault(brandKey, brandKey);
                String category = categoryMap.getOrDefault(brandKey, "GIYIM");

                List<String> imageUrls = new ArrayList<>();
                JsonNode images = productInfo.get("productImages");
                if (images != null && images.isArray()) {
                    for (JsonNode img : images) {
                        String url = img.get("originalUrl").asText();
                        if (url.contains(".svg") || url.contains("basket") ||
                            url.contains("chevron") || url.contains("mastercard") ||
                            url.contains("americanexpress") || url.contains("visa") ||
                            url.contains("troy") || url.contains("app-store") ||
                            url.contains("appgallery") || url.contains("minimize") ||
                            url.contains("search_") || url.contains("sfint/prod/fp/") ||
                            url.contains("placeholder") || url.contains("product-placeholder")) {
                            continue;
                        }
                        imageUrls.add(url.trim());
                        if (imageUrls.size() >= 6) break;
                    }
                }
                String imageUrlStr = String.join(",", imageUrls);

                Product product = new Product();
                product.setName(name);
                product.setBrand(brand);
                product.setCategory(category);
                product.setDescription(name + " - " + brand + " markasının kaliteli ürünü.");
                product.setImageUrl(imageUrlStr);
                product.setPrice(0.0);
                if (productInfo.has("price") && !productInfo.get("price").isNull()) {
                    product.setPrice(productInfo.get("price").asDouble());
                }
                if (productInfo.has("description") && !productInfo.get("description").isNull()) {
                    product.setDescription(productInfo.get("description").asText());
                }
                product = productRepository.save(product);

                // Specs: JSON'dan oku veya ürün adından çıkar
                List<ProductSpec> specs = new ArrayList<>();
                if (productInfo.has("specs") && productInfo.get("specs").isArray()) {
                    for (JsonNode specNode : productInfo.get("specs")) {
                        ProductSpec spec = new ProductSpec();
                        spec.setProduct(product);
                        spec.setSpecKey(specNode.has("key") ? specNode.get("key").asText() : specNode.get("specKey").asText());
                        spec.setSpecValue(specNode.has("value") ? specNode.get("value").asText() : specNode.get("specValue").asText());
                        specs.add(spec);
                    }
                } else {
                    specs.addAll(extractSpecsFromName(name, product));
                }
                if (!specs.isEmpty()) {
                    productSpecRepository.saveAll(specs);
                }

                File reviewsFile = new File(productDir, "reviews.json");
                if (reviewsFile.exists()) {
                    JsonNode reviewsData = mapper.readTree(reviewsFile);
                    JsonNode reviews = reviewsData.get("reviews");

                    if (reviews != null && reviews.isArray()) {
                        Set<Long> seenReviewIds = new HashSet<>();
                        int reviewCount = 0;
                        Random rnd = new Random();

                        for (JsonNode review : reviews) {
                            long reviewId = review.has("reviewId") ? review.get("reviewId").asLong() : rnd.nextLong();
                            if (seenReviewIds.contains(reviewId)) continue;
                            seenReviewIds.add(reviewId);

                            String userName = review.has("userName") ? review.get("userName").asText() : "Anonim";
                            int rating = review.has("rating") ? review.get("rating").asInt() : 5;
                            if (rating < 1) rating = 1;
                            if (rating > 5) rating = 5;
                            String comment = review.has("comment") ? review.get("comment").asText() : "";
                            if (comment.isBlank()) continue;

                            String email = userName.replaceAll("[^a-zA-Z0-9]", "").toLowerCase() + reviewId + "@trendyol.com";
                            if (createdEmails.contains(email)) {
                                email = "u" + reviewCount + productId + "@trendyol.com";
                            }
                            final String finalEmail = email;
                            User user;
                            if (!createdEmails.contains(finalEmail)) {
                                user = new User(null, userName, finalEmail);
                                user = userRepository.save(user);
                                allUsers.add(user);
                                createdEmails.add(finalEmail);
                            } else {
                                user = allUsers.stream().filter(u -> u.getEmail().equals(finalEmail)).findFirst().orElse(allUsers.get(0));
                            }

                            String helpfulTags = generateHelpfulTags(comment, rating);

                            Review rev = new Review();
                            rev.setUser(user);
                            rev.setProduct(product);
                            rev.setRating(rating);
                            rev.setComment(comment);
                            rev.setHelpfulTags(helpfulTags);
                            rev = reviewRepository.save(rev);

                            JsonNode imgs = review.get("images");
                            if (imgs != null && imgs.isArray()) {
                                for (JsonNode img : imgs) {
                                    if (img.has("originalUrl")) {
                                        ReviewImage ri = new ReviewImage();
                                        ri.setReview(rev);
                                        ri.setImageUrl(img.get("originalUrl").asText());
                                        ri.setCaption("Kullanıcı fotoğrafı");
                                        reviewImageRepository.save(ri);
                                    }
                                }
                            }

                            reviewCount++;
                        }
                        System.out.println("  ✅ " + product.getName() + " → " + reviewCount + " yorum yüklendi");
                    }
                }

            } catch (Exception e) {
                System.err.println("❌ Hata (" + dirName + "): " + e.getMessage());
            }
        }
        System.out.println("🎉 Trendyol verileri yüklendi! Toplam: " + productRepository.count() + " ürün");
    }

    private List<ProductSpec> extractSpecsFromName(String productName, Product product) {
        List<ProductSpec> specs = new ArrayList<>();
        String lower = productName.toLowerCase();
        if (lower.contains("pamuk")) addSpec(specs, product, "kumas", "Pamuklu");
        if (lower.contains("keten")) addSpec(specs, product, "kumas", "Keten");
        if (lower.contains("likralı") || lower.contains("likrali")) addSpec(specs, product, "kumas", "Likralı Kumaş");
        if (lower.contains("elastan")) addSpec(specs, product, "kumas", "Elastan Karışımlı");
        if (lower.contains("polyester")) addSpec(specs, product, "kumas", "Polyester");
        if (lower.contains("kot") || lower.contains("denim") || lower.contains("jean")) addSpec(specs, product, "kumas", "Denim");
        if (lower.contains("gore-tex") || lower.contains("goretex")) addSpec(specs, product, "kumas", "Gore-Tex");
        if (lower.contains("skinny")) addSpec(specs, product, "kalip", "Skinny Fit");
        if (lower.contains("slim")) addSpec(specs, product, "kalip", "Slim Fit");
        if (lower.contains("oversize")) addSpec(specs, product, "kalip", "Oversize");
        if (lower.contains("normal bel")) addSpec(specs, product, "bel", "Normal Bel");
        if (lower.contains("bilek boy")) addSpec(specs, product, "boy", "Bilek Boy");
        if (lower.contains("bambu")) addSpec(specs, product, "malzeme", "Bambu");
        if (lower.contains("ahşap") || lower.contains("ahsap")) addSpec(specs, product, "malzeme", "Ahşap");
        if (lower.contains("su geçirmez") || lower.contains("geçirmez")) addSpec(specs, product, "ozellik", "Su Geçirmez");
        if (lower.contains("su ve soğuğa")) addSpec(specs, product, "dayaniklilik", "Su ve Soğuğa Dayanıklı");
        if (lower.contains("thermoball")) addSpec(specs, product, "yalitim", "Thermoball");
        if (lower.contains("toz torbasız")) addSpec(specs, product, "teknoloji", "Toz Torbasız");
        java.util.regex.Matcher cmMatcher = java.util.regex.Pattern.compile("(\\d+[.,]?\\d*)\\s*cm", java.util.regex.Pattern.CASE_INSENSITIVE).matcher(lower);
        if (cmMatcher.find()) addSpec(specs, product, "olcu", cmMatcher.group(1).replace(",", ".") + " cm");
        java.util.regex.Matcher wMatcher = java.util.regex.Pattern.compile("(\\d+)\\s*w", java.util.regex.Pattern.CASE_INSENSITIVE).matcher(lower);
        if (wMatcher.find()) addSpec(specs, product, "guc", wMatcher.group(1) + "W");
        addSpec(specs, product, "kategori", product.getCategory());
        addSpec(specs, product, "marka", product.getBrand());
        return specs;
    }

    private void addSpec(List<ProductSpec> specs, Product product, String key, String value) {
        ProductSpec spec = new ProductSpec();
        spec.setProduct(product);
        spec.setSpecKey(key);
        spec.setSpecValue(value);
        specs.add(spec);
    }

    private String generateHelpfulTags(String comment, int rating) {
        List<String> tags = new ArrayList<>();
        String lower = comment.toLowerCase();

        if (lower.contains("beden") || lower.contains("dar") || lower.contains("küçük")) tags.add("beden_sorunu");
        if (lower.contains("renk") || lower.contains("fark")) tags.add("renk_farkli");
        if (lower.contains("kalite") && rating <= 3) tags.add("kalite_kotu");
        if (lower.contains("kalite") && rating >= 4) tags.add("kalite_iyi");
        if (lower.contains("kargo") || lower.contains("hızlı")) tags.add("kargo_hizli");
        if (lower.contains("yırtık") || lower.contains("hasarlı") || lower.contains("bozuk")) tags.add("urun_hasarli");
        if (lower.contains("orijinal")) tags.add("orijinal");
        if (lower.contains("memnun") || lower.contains("güzel") || lower.contains("harika")) tags.add("memnun");
        if (lower.contains("iade") || lower.contains("iade ettim")) tags.add("iade");

        return String.join(",", tags);
    }
}
