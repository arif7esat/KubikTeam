package com.smartcart.config;

import com.smartcart.model.entity.Product;
import com.smartcart.model.entity.ReturnRecord;
import com.smartcart.model.entity.Review;
import com.smartcart.model.entity.ReviewImage;
import com.smartcart.model.entity.User;
import com.smartcart.repository.ProductRepository;
import com.smartcart.repository.ReturnRecordRepository;
import com.smartcart.repository.ReviewImageRepository;
import com.smartcart.repository.ReviewRepository;
import com.smartcart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class SeedDataGenerator {

    @Value("${seed.user.count:400}")
    private int userCount;

    @Value("${seed.review.count:1600}")
    private int reviewCount;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReturnRecordRepository returnRecordRepository;

    @Autowired
    private ReviewImageRepository reviewImageRepository;

    private static final Map<Long, String[]> PRODUCT_POSITIVE = new HashMap<>();
    private static final Map<Long, String[]> PRODUCT_NEUTRAL = new HashMap<>();
    private static final Map<Long, String[]> PRODUCT_NEGATIVE = new HashMap<>();

    static {
        PRODUCT_POSITIVE.put(1L, new String[]{
            "Harika bir gömlek, keten kumaş gerçekten serin tutuyor.",
            "Oversize kalıp tam istediğim gibi, yazlık için mükemmel.",
            "Beyaz renk fotoğraftaki kadar temiz geldi, memnunum.",
            "Kumaş çok yumuşak, cilde dokunuşu iyi.",
            "M beden aldım 170 boyum için, tam düştü.",
            "Doğal keten kokusu bile hoş, organik hissettiriyor.",
            "Birden fazla renk aldım, hepsinden memnunum."
        });
        PRODUCT_POSITIVE.put(2L, new String[]{
            "Slim fit ama nefes aldırıyor, elastan hissettiriyor.",
            "32 numara tam beden oldu, ölçüler tutarlı.",
            "Yıkamada renk atmadı, kaliteli boya kullanılmış.",
            "Koyu mavi renk fotoğraftakiyle aynı, aldatmaca yok.",
            "Günlük kullanım için ideal, rahat bir jean."
        });
        PRODUCT_POSITIVE.put(3L, new String[]{
            "Montajı gerçekten kolay, 45 dakikada bitirdim.",
            "Çekmeceler pürüzsüz açılıp kapanıyor.",
            "Beyaz renk odaya ferahlık katıyor.",
            "IKEA kalitesi her zamanki gibi iyi.",
            "Ölçüler tam istediğim gibiydi, yatak odasına sığdı."
        });
        PRODUCT_POSITIVE.put(4L, new String[]{
            "Salonuma çok yakıştı, modern çizgileri güzel.",
            "65 inch TV için genişliği tam yeterli.",
            "Kablo kanalları düzenli, kablolar görünmüyor.",
            "Antrasit renk gerçekten şık, fotoğrafa benziyor."
        });
        PRODUCT_POSITIVE.put(5L, new String[]{
            "Kamera kalitesi inanılmaz, gece çekimleri mükemmel.",
            "Titanyum çerçeve gerçekten premium hissettiriyor.",
            "Batarya 2 gün rahat yetiyor.",
            "A17 Pro çip hiçbir şeyde kasılmıyor.",
            "USB-C geçişi çok pratik oldu.",
            "Ekran parlaklığı güneşte bile okunabiliyor."
        });
        PRODUCT_POSITIVE.put(6L, new String[]{
            "QLED renk doygunluğu inanılmaz, Netflix'te muhteşem görünüyor.",
            "4K HDR içerikler canlı ve net, çok memnunum.",
            "65 inç ama çerçevesi ince, şık duruyor.",
            "Ses kalitesi de iyi, soundbar gerekmeyebilir."
        });
        PRODUCT_POSITIVE.put(7L, new String[]{
            "Uludağ'da -10 derecede içim ısıcaktı, harika mont.",
            "Hafifliği şaşırtıcı, sırt çantasına sığıyor.",
            "DWR kaplama yağmurda gerçekten işe yarıyor.",
            "Fermuarlar kaliteli, ilk günden sorunsuz.",
            "Kış boyunca günlük kullanmak için ideal."
        });
        PRODUCT_POSITIVE.put(8L, new String[]{
            "Gore-Tex gerçekten işe yarıyor, sızan yok.",
            "Kaçkar'da 3 gün trekking yaptım, ayak ağrımadı.",
            "Contagrip taban kayalıkta bile tutunuyor.",
            "Yarım numara büyük almanızı öneririm, ben tam aldım dar geldi.",
            "Su geçirmezlik mükemmel, dereyi geçtim bile ıslanmadı."
        });

        PRODUCT_NEUTRAL.put(1L, new String[]{"Kumaş biraz buruşuyor, ütü gerekiyor.", "Fiyatına göre iyi ama daha iyisi de olabilirdi."});
        PRODUCT_NEUTRAL.put(2L, new String[]{"İlk yıkamada biraz gerildi, ama oturdu.", "Bel kısmı biraz dar, esnek kumaş kurtarıyor."});
        PRODUCT_NEUTRAL.put(3L, new String[]{"Raylar biraz sert ama kullandıkça yumuşayacak.", "Montaj kılavuzu yeterli ama daha iyi olabilirdi."});
        PRODUCT_NEUTRAL.put(4L, new String[]{"Montaj biraz zaman aldı ama sonuç güzel.", "Renk biraz açık geldi, ama alışıldı."});
        PRODUCT_NEUTRAL.put(5L, new String[]{"Şarj adaptörü yok kutuda, ayrı almak gerekiyor.", "Fiyatı yüksek ama değiyor."});
        PRODUCT_NEUTRAL.put(6L, new String[]{"Tizen bazen yavaşlıyor, ama genel iyi.", "Uzaktan kumanda basit, akıllı özellikler sınırlı."});
        PRODUCT_NEUTRAL.put(7L, new String[]{"Fermuarı biraz sert, kullandıkça açılır umarım.", "Renk seçeneği az olsa da siyah güzel."});
        PRODUCT_NEUTRAL.put(8L, new String[]{"Kalıp dar, tam numara alırsanız sıkar.", "Ağır hissettiriyor ilk başta ama alışıldı."});

        PRODUCT_NEGATIVE.put(1L, new String[]{"Beyaz renk aldım ama sarımsı geldi.", "Dikişlerde küçük hatalar vardı."});
        PRODUCT_NEGATIVE.put(2L, new String[]{"İlk yıkamada renk attı, dikkat edin.", "Bel ölçüsü tutmadı, büyük geldi."});
        PRODUCT_NEGATIVE.put(3L, new String[]{"Çekmecelerden biri raydan çıktı.", "Fotoğraftan daha mat bir görünümü var."});
        PRODUCT_NEGATIVE.put(4L, new String[]{"Montaj vidaları yetersiz geldi, ekstra aldım.", "Beklediğimden daha kısa, TV sığmadı."});
        PRODUCT_NEGATIVE.put(5L, new String[]{"Bu fiyata adaptör vermemesi kabul edilemez.", "Isınıyor yoğun kullanımda."});
        PRODUCT_NEGATIVE.put(6L, new String[]{"Kutu nakliyede ezilmişti, ürün tamam ama.", "Beklenen yanıt süresi geç geldi."});
        PRODUCT_NEGATIVE.put(7L, new String[]{"Kollar biraz kısa, uzun kollu olanlar 1 beden büyük alın.", "İç astarı ince hissettirdi."});
        PRODUCT_NEGATIVE.put(8L, new String[]{"İlk gün topuk kısmı sürtüp yara yaptı.", "Fiyatı yüksek kalitesine göre."});
    }

    @EventListener(ApplicationReadyEvent.class)
    public void seed() {
        if (true) return; // TrendyolDataLoader kullanılıyor
        if (userRepository.count() > 0 && reviewRepository.count() > 50) return;

        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) return;

        String[] firstNames = {"Ali","Ayşe","Mehmet","Zeynep","Can","Elif","Burak","Selin",
            "Murat","Fatma","Emre","Deniz","Kerem","Ceren","Serkan","Pınar","Onur","Gamze",
            "Tolga","Sibel","Hakan","Berk","Cem","Ahmet","Mustafa","Merve","Yunus","Esra",
            "İbrahim","Gizem","Osman","Büşra","Yusuf","Neslihan","Furkan","Melis","Barış","Tuğçe"};
        String[] lastNames = {"Yılmaz","Kaya","Demir","Şahin","Çelik","Aydın","Arslan","Doğan",
            "Kılıç","Aslan","Koç","Kurt","Özkan","Şimşek","Polat","Yıldız","Güneş","Erdoğan",
            "Bulut","Acar","Çetin","Öztürk","Kaplan","Yıldırım","Güler","Aktaş","Bozkurt"};

        List<User> users;
        if (userRepository.count() > 0) {
            users = userRepository.findAll();
        } else {
            users = new ArrayList<>();
            Set<String> usedEmails = new HashSet<>();
            Random rnd = new Random(42);
            for (int i = 0; i < userCount; i++) {
                String first = firstNames[rnd.nextInt(firstNames.length)];
                String last = lastNames[rnd.nextInt(lastNames.length)];
                String email = (first.toLowerCase() + "." + last.toLowerCase() + i + "@example.com")
                    .replace("ş","s").replace("ğ","g").replace("ı","i")
                    .replace("ö","o").replace("ü","u").replace("ç","c")
                    .replace("İ","i").replace("Ş","s");
                if (usedEmails.contains(email)) email = "user" + i + "@example.com";
                usedEmails.add(email);
                users.add(new User(null, first + " " + last, email));
            }
            users = userRepository.saveAll(users);
        }

        String[] fallbackPositive = {"Harika bir ürün, çok memnun kaldım!","Beklentilerimin üzerinde geldi."};
        String[] fallbackNeutral = {"Fiyatına göre idare eder.","Ne çok iyi ne çok kötü."};
        String[] fallbackNegative = {"Beklediğim gibi çıkmadı.","İade ettim, tavsiye etmem."};
        String[] negativeTags = {"beden_buyuk","beden_dar","renk_farkli","kalite_kotu",
                                  "dikis_hatali","beden_kucuk","fermuar_sert","ray_zayif"};

        List<Review> reviews = new ArrayList<>();
        int reviewsPerProduct = reviewCount / products.size();
        Random rnd = new Random(123);

        for (Product product : products) {
            for (int i = 0; i < reviewsPerProduct; i++) {
                User user = users.get(rnd.nextInt(users.size()));
                int roll = rnd.nextInt(100);
                String comment;
                int rating;
                String helpfulTags = "";

                if (roll < 70) {
                    String[] pool = PRODUCT_POSITIVE.getOrDefault(product.getId(), fallbackPositive);
                    comment = pool[rnd.nextInt(pool.length)];
                    rating = rnd.nextInt(2) + 4;
                } else if (roll < 90) {
                    String[] pool = PRODUCT_NEUTRAL.getOrDefault(product.getId(), fallbackNeutral);
                    comment = pool[rnd.nextInt(pool.length)];
                    rating = 3;
                } else {
                    String[] pool = PRODUCT_NEGATIVE.getOrDefault(product.getId(), fallbackNegative);
                    comment = pool[rnd.nextInt(pool.length)];
                    rating = rnd.nextInt(2) + 1;
                    int tagCount = rnd.nextInt(3) + 1;
                    StringBuilder tags = new StringBuilder();
                    for (int t = 0; t < tagCount; t++) {
                        if (t > 0) tags.append(",");
                        tags.append(negativeTags[rnd.nextInt(negativeTags.length)]);
                    }
                    helpfulTags = tags.toString();
                }

                Review review = new Review();
                review.setUser(user);
                review.setProduct(product);
                review.setRating(rating);
                review.setComment(comment);
                review.setHelpfulTags(helpfulTags);
                reviews.add(review);
            }
        }
        reviewRepository.saveAll(reviews);

        // --- İADE VERİSİ SEED ---
        String[] returnReasons = {"BEDEN_UYUMSUZ","RENK_FARKLI","KALITE_DUSUK",
                                   "URUN_HASARLI","BEKLENTI_KARSILAMADI","DIGER"};

        Map<Long, String[]> returnComments = new HashMap<>();
        returnComments.put(1L, new String[]{
            "Rengi beyaz yerine sarımsı geldi, fotoğrafla uyuşmuyor.",
            "M beden aldım ama çok dar geldi, beden tablosu tutarsız.",
            "Keten kumaş bekliyordum ama karışım gibi hissettirdi."
        });
        returnComments.put(2L, new String[]{
            "Slim fit dediler ama skinny gibi dar geldi.",
            "Koyu mavi renk fotoğraftakinden çok açık çıktı.",
            "İlk yıkamada boyunda kısaldı, kalite sorunu."
        });
        returnComments.put(3L, new String[]{
            "Fotoğrafta parlak beyaz, gerçekte kırık beyaz geldi.",
            "Çekmece rayları 2 haftada bozuldu.",
            "80cm yazdı ama 77cm ölçtüm, ölçü tutarsız."
        });
        returnComments.put(4L, new String[]{
            "65 inç TV'nin ayakları üniteye sığmadı, genişlik yetersiz.",
            "Melamin kaplama ilk hafta çizildi."
        });
        returnComments.put(5L, new String[]{
            "Batarya ömrü söylenenin yarısı kadar.",
            "Kamera lens çevresi ilk haftada çizildi."
        });
        returnComments.put(6L, new String[]{
            "Fotoğraftaki kadar ince çerçeve değil, yanlardan kalın.",
            "Panel ışık sızıntısı var, karanlık sahnelerde belli oluyor."
        });
        returnComments.put(7L, new String[]{
            "Minus 5'te sıcak tutmuyor, abartılı reklam.",
            "Kol boyu kısa, L beden aldım ama S gibi geldi."
        });
        returnComments.put(8L, new String[]{
            "Gore-Tex deniyor ama yağmurda ayağım ıslandı.",
            "Taban 1 ayda aşındı, dayanıklılık düşük."
        });

        List<ReturnRecord> returnRecords = new ArrayList<>();
        for (Product product : products) {
            String[] comments = returnComments.getOrDefault(product.getId(), new String[]{"Beklentimi karşılamadı."});
            int returnCount = 3 + rnd.nextInt(6);
            for (int i = 0; i < returnCount; i++) {
                ReturnRecord record = new ReturnRecord();
                record.setProduct(product);
                record.setUser(users.get(rnd.nextInt(users.size())));
                record.setReturnReason(returnReasons[rnd.nextInt(returnReasons.length)]);
                record.setReturnComment(comments[rnd.nextInt(comments.length)]);
                record.setOriginalRating(rnd.nextInt(3) + 1);
                record.setReturnDate("2024-0" + (rnd.nextInt(9)+1) + "-" + String.format("%02d", rnd.nextInt(28)+1));
                returnRecords.add(record);
            }
        }
        returnRecordRepository.saveAll(returnRecords);

        // --- GÖRSELLİ YORUM SEED ---
        Map<Long, String[]> reviewImageUrls = new HashMap<>();
        reviewImageUrls.put(1L, new String[]{
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400",
            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400",
            "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=400"
        });
        reviewImageUrls.put(2L, new String[]{
            "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400",
            "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400"
        });
        reviewImageUrls.put(3L, new String[]{
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400"
        });
        reviewImageUrls.put(5L, new String[]{
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
            "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400"
        });
        reviewImageUrls.put(7L, new String[]{
            "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400",
            "https://images.unsplash.com/photo-1544923246-77307dd270cb?w=400"
        });
        reviewImageUrls.put(8L, new String[]{
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400"
        });

        String[] captions = {
            "Gerçek renk böyle görünüyor",
            "Kutudan çıkan ürün",
            "1 hafta kullanım sonrası",
            "Fotoğrafla karşılaştırma",
            "Gerçek boyutu görmek için"
        };

        List<ReviewImage> allReviewImages = new ArrayList<>();
        for (Product product : products) {
            String[] urls = reviewImageUrls.get(product.getId());
            if (urls == null) continue;
            List<Review> productReviews = reviewRepository.findByProductIdOrderByIdDesc(product.getId());
            int imageCount = Math.min(urls.length, productReviews.size());
            for (int i = 0; i < imageCount; i++) {
                ReviewImage ri = new ReviewImage();
                ri.setReview(productReviews.get(i));
                ri.setImageUrl(urls[i]);
                ri.setCaption(captions[rnd.nextInt(captions.length)]);
                allReviewImages.add(ri);
            }
        }
        reviewImageRepository.saveAll(allReviewImages);
    }
}
