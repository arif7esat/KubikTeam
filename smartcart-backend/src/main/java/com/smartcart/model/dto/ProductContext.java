package com.smartcart.model.dto;

import com.smartcart.model.entity.Product;
import com.smartcart.model.entity.ProductSpec;
import com.smartcart.model.entity.ReturnRecord;
import com.smartcart.model.entity.Review;
import com.smartcart.model.entity.ReviewImage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductContext {

    private Product product;
    private List<ProductSpec> specs;
    private List<Review> reviews;
    private List<Product> similarProducts;
    private List<ReturnRecord> returnRecords;
    private int returnCount;
    private Map<String, Integer> returnReasonSummary;
    private List<ReviewImage> reviewImages;
    private int reviewImageCount;
}
