package com.smartcart.repository;

import com.smartcart.model.entity.ReturnRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReturnRecordRepository extends JpaRepository<ReturnRecord, Long> {
    List<ReturnRecord> findByProductId(Long productId);
    long countByProductId(Long productId);
}
