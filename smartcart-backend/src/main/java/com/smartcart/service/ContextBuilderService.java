package com.smartcart.service;

import com.smartcart.exception.ProductNotFoundException;
import com.smartcart.model.dto.ProductContext;
import com.smartcart.model.entity.Product;
import com.smartcart.model.entity.ProductSpec;
import com.smartcart.model.entity.ReturnRecord;
import com.smartcart.model.entity.Review;
import com.smartcart.model.entity.ReviewImage;
import com.smartcart.repository.ProductRepository;
import com.smartcart.repository.ReturnRecordRepository;
import com.smartcart.repository.ReviewImageRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContextBuilderService {

    private final ProductRepository productRepository;
    private final ReturnRecordRepository returnRecordRepository;
    private final ReviewImageRepository reviewImageRepository;

    public ContextBuilderService(ProductRepository productRepository,
                                  ReturnRecordRepository returnRecordRepository,
                                  ReviewImageRepository reviewImageRepository) {
        this.productRepository = productRepository;
        this.returnRecordRepository = returnRecordRepository;
        this.reviewImageRepository = reviewImageRepository;
    }

    public ProductContext build(Long productId, String message) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        List<ProductSpec> specs = product.getSpecs() != null ? product.getSpecs() : List.of();
        List<Review> reviews = product.getReviews() != null ? product.getReviews() : List.of();

        if (reviews.size() > 5) {
            reviews = reviews.subList(0, 5);
        }

        List<Product> similar = productRepository.findByCategoryAndIdNot(product.getCategory(), productId);
        if (similar.size() > 3) {
            similar = similar.subList(0, 3);
        }

        List<ReturnRecord> returns = returnRecordRepository.findByProductId(productId);
        List<ReviewImage> reviewImages = reviewImageRepository.findByReviewProductId(productId);

        ProductContext context = new ProductContext();
        context.setProduct(product);
        context.setSpecs(specs);
        context.setReviews(reviews);
        context.setSimilarProducts(similar);
        context.setReturnRecords(returns);
        context.setReturnCount(returns.size());
        context.setReturnReasonSummary(product.getReturnReasonSummary());
        context.setReviewImages(reviewImages);
        context.setReviewImageCount(reviewImages.size());

        return context;
    }
}
