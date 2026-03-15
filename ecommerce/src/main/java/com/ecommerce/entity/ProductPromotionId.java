package com.ecommerce.entity;

import java.io.Serializable;
import java.util.Objects;

public class ProductPromotionId implements Serializable {
    
    private Long product;
    private Long promotion;

    // Constructors
    public ProductPromotionId() {}

    public ProductPromotionId(Long product, Long promotion) {
        this.product = product;
        this.promotion = promotion;
    }

    // Getters and Setters
    public Long getProduct() {
        return product;
    }

    public void setProduct(Long product) {
        this.product = product;
    }

    public Long getPromotion() {
        return promotion;
    }

    public void setPromotion(Long promotion) {
        this.promotion = promotion;
    }

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductPromotionId that = (ProductPromotionId) o;
        return Objects.equals(product, that.product) &&
                Objects.equals(promotion, that.promotion);
    }

    @Override
    public int hashCode() {
        return Objects.hash(product, promotion);
    }
}
