package com.smartcart.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String category;

    private String brand;

    @Column(length = 1000)
    private String description;

    @Column(length = 2000)
    private String imageUrl;

    private Double price;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<ProductSpec> specs;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Review> reviews;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ReturnRecord> returnRecords;

    @Transient
    public List<String> getImageUrls() {
        if (imageUrl == null || imageUrl.isBlank()) return List.of();
        return Arrays.asList(imageUrl.split(","));
    }

    @Transient
    public String getPrimaryImageUrl() {
        List<String> urls = getImageUrls();
        return urls.isEmpty() ? "" : urls.get(0).trim();
    }

    @Transient
    public int getReturnCount() {
        return returnRecords != null ? returnRecords.size() : 0;
    }

    @Transient
    public Map<String, Integer> getReturnReasonSummary() {
        if (returnRecords == null || returnRecords.isEmpty()) return Map.of();
        Map<String, Integer> summary = new HashMap<>();
        for (ReturnRecord r : returnRecords) {
            summary.merge(r.getReturnReason(), 1, Integer::sum);
        }
        return summary;
    }
}
