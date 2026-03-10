package com.ecommerce.controller;

import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.ProductImage;
import com.ecommerce.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Base64;
import java.util.stream.Collectors;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.ecommerce.exception.ErrorResponse;

import com.ecommerce.dto.ProductDTO;
import com.ecommerce.dto.ProductImageDTO;
import com.ecommerce.dto.CategoryDTO;

@RestController
@RequestMapping("/images")
@CrossOrigin(origins = "*")
public class ProductImageController {
    
    @Autowired
    private ProductImageService productImageService;
    
    @Autowired
    private ObjectMapper objectMapper;

    /**
     * GET all images across all products
     * GET /api/images/all
     */
    @GetMapping("/all")
    public ResponseEntity<List<ProductImageDTO>> getAllImages() {
        List<ProductImage> images = productImageService.getAllImages();
        List<ProductImageDTO> dtos = images.stream()
            .map(img -> {
                Product p = img.getProduct();
                Category cat = p.getCategory();
                CategoryDTO categoryDTO = new CategoryDTO(cat.getId(), cat.getName());
                ProductDTO productDTO = new ProductDTO(p.getId(), p.getName(), p.getPrice(), categoryDTO);
                return new ProductImageDTO(productDTO, img.getImageUrl());
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok().body(dtos);
    }

    /**
     * GET image by composite ID (Base64 encoded)
     * GET /api/images/by-id/{compositeId}
     * compositeId example: "eyJwcm9kdWN0LmlkIjoiMSIsImltYWdlVXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL2ltZy5wbmcifQ=="
     */
    @GetMapping("/by-id/{compositeId}")
    public ResponseEntity<?> getImageByCompositeId(@PathVariable String compositeId) {
        try {
            // Decode Base64
            byte[] decodedBytes = Base64.getDecoder().decode(compositeId);
            String decodedJson = new String(decodedBytes, StandardCharsets.UTF_8);
            System.out.println("getImageByCompositeId : decodedJson: " + decodedJson);
            
            Map<String, Object> keyValues = objectMapper.readValue(decodedJson, Map.class);
            
            Long productId = ((Number) keyValues.get("product.id")).longValue();
            String imageUrl = (String) keyValues.get("imageUrl");
            
            ProductImage image = productImageService.getImageByProductIdAndUrl(productId, imageUrl);
            
            if (image == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Convert to DTO (same as /all endpoint)
            Product p = image.getProduct();
            Category cat = p.getCategory();
            CategoryDTO categoryDTO = new CategoryDTO(cat.getId(), cat.getName());
            ProductDTO productDTO = new ProductDTO(p.getId(), p.getName(), p.getPrice(), categoryDTO);
            ProductImageDTO dto = new ProductImageDTO(productDTO, image.getImageUrl());
            
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid composite ID: " + e.getMessage());
        }
    }

    /**
     * DELETE image by composite ID (Base64 encoded)
     * DELETE /api/images/by-id/{compositeId}
     * compositeId example: "eyJwcm9kdWN0LmlkIjoiMSIsImltYWdlVXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL2ltZy5wbmcifQ=="
     */
    @DeleteMapping("/by-id/{compositeId}")
    public ResponseEntity<?> deleteImageByCompositeId(@PathVariable String compositeId) { 
        try {
            // Decode Base64
            byte[] decodedBytes = Base64.getDecoder().decode(compositeId);
            String decodedJson = new String(decodedBytes, StandardCharsets.UTF_8);
            System.out.println("deleteImageByCompositeId : decodedJson: " + decodedJson);

            Map<String, Object> keyValues = objectMapper.readValue(decodedJson, Map.class);
            
            Long productId = ((Number) keyValues.get("product.id")).longValue();
            String imageUrl = (String) keyValues.get("imageUrl");
            
            productImageService.deleteImage(productId, imageUrl);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid composite ID: " + e.getMessage());
        }
    }

    /**
     * PUT update image by composite ID (Base64 encoded)
     * PUT /api/images/by-id/{compositeId}
     * Body: { "imageurl": "https://new.com/image.jpg" }
     */
    @PutMapping("/by-id/{compositeId}")
    public ResponseEntity<?> updateImageByCompositeId(
            @PathVariable String compositeId,
            @RequestBody Map<String, Object> request) {  // Changed from Map<String, String>
        try {
            // Decode Base64
            byte[] decodedBytes = Base64.getDecoder().decode(compositeId);
            String decodedJson = new String(decodedBytes, StandardCharsets.UTF_8);
            System.out.println("updateImageByCompositeId : decodedJson: " + decodedJson);

            Map<String, Object> keyValues = objectMapper.readValue(decodedJson, Map.class);
            
            Long productId = ((Number) keyValues.get("product.id")).longValue();
            String oldUrl = (String) keyValues.get("imageUrl");
            
            // Extract newUrl from the nested product object in request
            Long newProductId = null;
            String newUrl = null;
            
            Object productObj = request.get("product");
            if (productObj instanceof Map) {
                newProductId = ((Number) ((Map<String, Object>) productObj).get("id")).longValue();
            }
            
            newUrl = (String) request.get("imageUrl");
            
            if (newUrl == null || newUrl.isBlank()) {
                return ResponseEntity.badRequest().body("New image URL is required");
            }
            
            ProductImage image = productImageService.updateImageUrl(productId, oldUrl, newUrl);
            
            // Convert to DTO
            return ResponseEntity.ok(mapToDTO(image));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid composite ID: " + e.getMessage());
        }
    }

    /**
     * POST add a single image to a product
     * POST /api/images
     * Body: { "product": { "id": 1 }, "imageurl": "https://example.com/image.jpg" }
     */
    @PostMapping
    public ResponseEntity<ProductImage> createProductImage(
            @RequestBody Map<String, Object> request) {
        // Extract nested productId from product object
        Map<String, Object> product = (Map<String, Object>) request.get("product");
        Long productId = ((Number) product.get("id")).longValue();
        
        // Extract imageUrl
        String imageUrl = (String) request.get("imageUrl");
        
        if (productId == null || imageUrl == null || imageUrl.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        ProductImage image = productImageService.addImage(productId, imageUrl);
        return ResponseEntity.status(HttpStatus.CREATED).body(image);
    }

    /**
     * GET all images for a product
     * GET /api/images/products/{productId}
     */
    @GetMapping("/products/{productId}")
    public ResponseEntity<List<ProductImage>> getImages(@PathVariable Long productId) {
        List<ProductImage> images = productImageService.getImagesByProductId(productId);
        return ResponseEntity.ok(images);
    }
    
    /**
     * POST add a single image to a product
     * POST /api/images/products/{productId}
     * Body: { "imageUrl": "https://example.com/image.jpg" }
     */
    @PostMapping("/products/{productId}")
    public ResponseEntity<ProductImage> addImage(
            @PathVariable Long productId,
            @RequestBody Map<String, String> request) {
        
        String imageUrl = request.get("imageUrl");
        
        if (imageUrl == null || imageUrl.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        
        ProductImage image = productImageService.addImage(productId, imageUrl);
        return ResponseEntity.status(HttpStatus.CREATED).body(image);
    }
    
    /**
     * POST add multiple images to a product
     * POST /api/images/products/{productId}/bulk
     * Body: { "imageUrls": ["url1", "url2", "url3"] }
     */
    @PostMapping("/products/{productId}/bulk")
    public ResponseEntity<List<ProductImage>> addImages(
            @PathVariable Long productId,
            @RequestBody Map<String, List<String>> request) {
        
        List<String> imageUrls = request.get("imageUrls");
        
        if (imageUrls == null || imageUrls.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        List<ProductImage> images = productImageService.addImages(productId, imageUrls);
        return ResponseEntity.status(HttpStatus.CREATED).body(images);
    }
    
    /**
     * DELETE a specific image
     * DELETE /api/images/products/{productId}?imageUrl=https://example.com/image.jpg
     */
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long productId,
            @RequestParam String imageUrl) {
        
        productImageService.deleteImage(productId, imageUrl);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * DELETE all images for a product
     * DELETE /api/images/products/{productId}/all
     */
    @DeleteMapping("/products/{productId}/all")
    public ResponseEntity<Void> deleteAllImages(@PathVariable Long productId) {
        productImageService.deleteAllImagesByProductId(productId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * PUT update an image URL
     * PUT /api/images/products/{productId}
     * Body: { "oldUrl": "https://old.com/image.jpg", "newUrl": "https://new.com/image.jpg" }
     */
    @PutMapping("/products/{productId}")
    public ResponseEntity<ProductImage> updateImageUrl(
            @PathVariable Long productId,
            @RequestBody Map<String, String> request) {
        
        String oldUrl = request.get("oldUrl");
        String newUrl = request.get("newUrl");
        
        if (oldUrl == null || newUrl == null || oldUrl.isBlank() || newUrl.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        
        ProductImage image = productImageService.updateImageUrl(productId, oldUrl, newUrl);
        return ResponseEntity.ok(image);
    }

    private ProductImageDTO mapToDTO(ProductImage image) {
        Product p = image.getProduct();
        Category cat = p.getCategory();
        CategoryDTO categoryDTO = new CategoryDTO(cat.getId(), cat.getName());
        ProductDTO productDTO = new ProductDTO(p.getId(), p.getName(), p.getPrice(), categoryDTO);
        return new ProductImageDTO(productDTO, image.getImageUrl());
    }
}
