package com.smartcart.model.dto;

import com.smartcart.model.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResult {

    private List<Product> products;
    private List<ProductReason> reasons;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductReason {
        private Long productId;
        private String why;
    }
}
