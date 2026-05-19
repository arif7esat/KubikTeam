package com.smartcart.repository;

import com.smartcart.model.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdOrderByIdDesc(Long productId);
}
