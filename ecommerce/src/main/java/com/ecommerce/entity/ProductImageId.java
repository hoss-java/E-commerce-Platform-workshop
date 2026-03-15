package com.ecommerce.entity;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Objects;

import com.ecommerce.entity.Product;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageId implements Serializable {
    
    private Product product;
    private String imageUrl;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductImageId that = (ProductImageId) o;
        return Objects.equals(product, that.product) &&
               Objects.equals(imageUrl, that.imageUrl);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(product, imageUrl);
    }
}
