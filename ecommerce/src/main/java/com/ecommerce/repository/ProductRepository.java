package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Required Queries
    List<Product> findByCategory_Name(String categoryName);

    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    // Optional / Advanced Queries
    List<Product> findByNameContaining(String keyword);
    
    List<Product> findByPriceLessThan(BigDecimal price);

    List<Product> findByOrderByPriceAsc();
    
    List<Product> findByOrderByPriceDesc();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId")
    Long countByCategoryId(@Param("categoryId") Long categoryId);

    List<Product> findByCategory_Id(Long categoryId);
}
