package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.ecommerce.dto.ProductDTO;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageDTO {
    private ProductDTO product;
    private String imageUrl;
}

/*
// The version without Lombok
public class ProductImageDTO {
    private ProductDTO product;
    private String imageUrl;
    
    // Constructor
    public ProductImageDTO() {}
    
    public ProductImageDTO(ProductDTO product, String imageUrl) {
        this.product = product;
        this.imageUrl = imageUrl;
    }
    
    // Getters
    public ProductDTO getProduct() {
        return product;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    // Setters
    public void setProduct(ProductDTO product) {
        this.product = product;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    // toString
    @Override
    public String toString() {
        return "ProductImageDTO{" +
                "product=" + product +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
    
    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductImageDTO that = (ProductImageDTO) o;
        return Objects.equals(product, that.product) &&
               Objects.equals(imageUrl, that.imageUrl);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(product, imageUrl);
    }
}
*/