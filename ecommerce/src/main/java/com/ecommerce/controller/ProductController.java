package com.ecommerce.controller;

import com.ecommerce.entity.Product;
import com.ecommerce.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/category/{categoryName}")
    public List<Product> getProductsByCategoryName(@PathVariable String categoryName) {
        return productService.getProductsByCategoryName(categoryName);
    }

    @GetMapping("/price-range")
    public List<Product> getProductsByPriceRange(@RequestParam BigDecimal minPrice, @RequestParam BigDecimal maxPrice) {
        return productService.getProductsByPriceRange(minPrice, maxPrice);
    }

    @GetMapping("/search")
    public List<Product> searchProductsByKeyword(@RequestParam String keyword) {
        return productService.searchProductsByKeyword(keyword);
    }

    @GetMapping("/cheaper-than")
    public List<Product> getProductsCheaperThan(@RequestParam BigDecimal price) {
        return productService.getProductsCheaperThan(price);
    }

    @GetMapping("/ordered-by-price/asc")
    public List<Product> getProductsOrderedByPriceAsc() {
        return productService.getProductsOrderedByPriceAsc();
    }

    @GetMapping("/ordered-by-price/desc")
    public List<Product> getProductsOrderedByPriceDesc() {
        return productService.getProductsOrderedByPriceDesc();
    }

    @GetMapping("/count/category/{categoryId}")
    public Long countProductsInCategory(@PathVariable Long categoryId) {
        return productService.countProductsInCategory(categoryId);
    }

    @GetMapping("/category-id/{categoryId}")
    public List<Product> getProductsByCategoryId(@PathVariable Long categoryId) {
        return productService.getProductsByCategoryId(categoryId);
    }
}

