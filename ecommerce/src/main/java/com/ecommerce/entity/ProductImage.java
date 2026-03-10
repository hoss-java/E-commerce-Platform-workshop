package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.ecommerce.dto.ProductImageId;

@Entity
@Table(name = "product_images")
@IdClass(ProductImageId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImage {
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Id
    @Column(name = "image_url", nullable = false)
    private String imageUrl;
}
