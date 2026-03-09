package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }

    // Method to find products by category name
    public List<Product> getProductsByCategoryName(String categoryName) {
        return productRepository.findByCategory_Name(categoryName);
    }

    // Method to find products within a specific price range
    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }

    // Advanced query to search products by keyword
    public List<Product> searchProductsByKeyword(String keyword) {
        return productRepository.findByNameContaining(keyword);
    }

    // Method to find products cheaper than a given price
    public List<Product> getProductsCheaperThan(BigDecimal price) {
        return productRepository.findByPriceLessThan(price);
    }

    // Method to get products ordered by price ascending
    public List<Product> getProductsOrderedByPriceAsc() {
        return productRepository.findByOrderByPriceAsc();
    }

    // Method to get products ordered by price descending
    public List<Product> getProductsOrderedByPriceDesc() {
        return productRepository.findByOrderByPriceDesc();
    }

    // Count products in a specific category
    public Long countProductsInCategory(Long categoryId) {
        return productRepository.countByCategoryId(categoryId);
    }

    // Get products by category ID
    public List<Product> getProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategory_Id(categoryId);
    }
}


