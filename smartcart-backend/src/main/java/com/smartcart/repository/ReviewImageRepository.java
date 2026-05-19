package com.smartcart.repository;

import com.smartcart.model.entity.ReviewImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewImageRepository extends JpaRepository<ReviewImage, Long> {
    List<ReviewImage> findByReviewId(Long reviewId);
    List<ReviewImage> findByReviewProductId(Long productId);
}
