package com.smartcart.repository;

import com.smartcart.model.entity.ProductSpec;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductSpecRepository extends JpaRepository<ProductSpec, Long> {
    List<ProductSpec> findByProductId(Long productId);
}
