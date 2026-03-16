package com.ecommerce.repository;

import com.ecommerce.entity.ProductPromotion;
import com.ecommerce.entity.ProductPromotionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductPromotionRepository extends JpaRepository<ProductPromotion, ProductPromotionId> {
    List<ProductPromotion> findByProductId(Long productId);
    List<ProductPromotion> findByPromotionId(Long promotionId);
}
