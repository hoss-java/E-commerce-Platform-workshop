package com.ecommerce.repository;

import com.ecommerce.entity.ProductImage;
import com.ecommerce.entity.ProductImageId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, ProductImageId> {
    
    /**
     * Find all images for a specific product
     */
    List<ProductImage> findByProductId(Long productId);

    /**
     * Find by composite key
     */
    Optional<ProductImage> findByProductIdAndImageUrl(Long productId, String imageUrl);

    /**
     * Delete by composite key
     */    
    void deleteByProductIdAndImageUrl(Long productId, String imageUrl);    

    /**
     * Delete all images for a specific product
     */
    void deleteByProductId(Long productId);
}
