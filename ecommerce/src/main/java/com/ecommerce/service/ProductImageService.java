package com.ecommerce.service;

import com.ecommerce.entity.ProductImage;
import com.ecommerce.dto.ProductImageId;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductImageRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class ProductImageService {
    
    @Autowired
    private ProductImageRepository productImageRepository;
    
    @Autowired
    private ProductRepository productRepository;

    public List<ProductImage> getAllImages() {
        return productImageRepository.findAll();
    }

    /**
     * Get image by product ID and image URL
     */
    public ProductImage getImageByProductIdAndUrl(Long productId, String imageUrl) {
        return productImageRepository.findByProductIdAndImageUrl(productId, imageUrl)
            .orElse(null);
    }

    /**
     * Delete image by product ID and image URL
     */
    public void deleteImageByProductIdAndUrl(Long productId, String imageUrl) {
        productImageRepository.deleteByProductIdAndImageUrl(productId, imageUrl);
    }
    
    /**
     * Get all images for a specific product
     */
    public List<ProductImage> getImagesByProductId(Long productId) {
        return productImageRepository.findByProductId(productId);
    }
    
    /**
     * Add a new image to a product
     */
    public ProductImage addImage(Long productId, String imageUrl) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        
        ProductImage productImage = new ProductImage();
        productImage.setProduct(product);
        productImage.setImageUrl(imageUrl);
        
        return productImageRepository.save(productImage);
    }
    
    /**
     * Add multiple images to a product
     */
    public List<ProductImage> addImages(Long productId, List<String> imageUrls) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        
        List<ProductImage> images = imageUrls.stream()
            .map(url -> {
                ProductImage image = new ProductImage();
                image.setProduct(product);
                image.setImageUrl(url);
                return image;
            })
            .toList();
        
        return productImageRepository.saveAll(images);
    }
    
    /**
     * Delete a specific image by product ID and image URL
     */
    public void deleteImage(Long productId, String imageUrl) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));
        ProductImageId id = new ProductImageId(product, imageUrl);
        productImageRepository.deleteById(id);
    }

    
    /**
     * Delete all images for a product
     */
    public void deleteAllImagesByProductId(Long productId) {
        productImageRepository.deleteByProductId(productId);
    }
    
    /**
     * Update an image URL (delete old, add new)
     */
    public ProductImage updateImageUrl(Long productId, String oldUrl, String newUrl) {
        // Fetch the product first
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));
        
        // Delete old image using composite key with Product object
        ProductImageId oldId = new ProductImageId(product, oldUrl);
        productImageRepository.deleteById(oldId);
        
        // Add new image
        return addImage(productId, newUrl);
    }
}