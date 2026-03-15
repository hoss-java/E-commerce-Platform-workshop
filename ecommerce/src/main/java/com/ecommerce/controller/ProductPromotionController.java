package com.ecommerce.controller;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.Category;
import com.ecommerce.entity.Promotion;
import com.ecommerce.entity.ProductPromotion;
import com.ecommerce.dto.ProductPromotionDTO;
import com.ecommerce.dto.CategoryDTO;
import com.ecommerce.dto.ProductDTO;
import com.ecommerce.dto.PromotionDTO;
import com.ecommerce.service.ProductPromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.Base64;
import java.util.stream.Collectors;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/product-promotions")
@CrossOrigin(origins = "*")
public class ProductPromotionController {
    
    @Autowired
    private ProductPromotionService productPromotionService;

    @Autowired
    private ObjectMapper objectMapper; 

    /**
     * GET all product promotions
     */
    @GetMapping("/all")
    public ResponseEntity<List<ProductPromotionDTO>> getAllProductPromotions() {
        List<ProductPromotionDTO> dtos = productPromotionService.getAllProductPromotions();
        return ResponseEntity.ok().body(dtos);
    }

    /**
     * GET product promotion by composite ID (Base64 encoded)
     */
    @GetMapping("/by-id/{compositeId}")
    public ResponseEntity<?> getProductPromotionByCompositeId(@PathVariable String compositeId) {
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(compositeId);
            String decodedJson = new String(decodedBytes, StandardCharsets.UTF_8);
            System.out.println("getProductPromotionByCompositeId : decodedJson: " + decodedJson);
            
            Map<String, Object> keyValues = objectMapper.readValue(decodedJson, Map.class);
            
            Long productId = ((Number) keyValues.get("product.id")).longValue();
            Long promotionId = ((Number) keyValues.get("promotion.id")).longValue();
            
            Optional<ProductPromotionDTO> productPromotion = productPromotionService.getProductPromotion(productId, promotionId);
            
            if (productPromotion.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(productPromotion.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid composite ID: " + e.getMessage());
        }
    }

    /**
     * DELETE product promotion by composite ID (Base64 encoded)
     */
    @DeleteMapping("/by-id/{compositeId}")
    public ResponseEntity<?> deleteProductPromotionByCompositeId(@PathVariable String compositeId) { 
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(compositeId);
            String decodedJson = new String(decodedBytes, StandardCharsets.UTF_8);
            System.out.println("deleteProductPromotionByCompositeId : decodedJson: " + decodedJson);

            Map<String, Object> keyValues = objectMapper.readValue(decodedJson, Map.class);
            
            Long productId = ((Number) keyValues.get("product.id")).longValue();
            Long promotionId = ((Number) keyValues.get("promotion.id")).longValue();
            
            if (productPromotionService.removePromotionFromProduct(productId, promotionId)) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid composite ID: " + e.getMessage());
        }
    }

    /**
     * PUT update product promotion by composite ID (Base64 encoded)
     */
    @PutMapping("/by-id/{compositeId}")
    public ResponseEntity<?> updateProductPromotionByCompositeId(
            @PathVariable String compositeId,
            @RequestBody Map<String, Object> request) {
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(compositeId);
            String decodedJson = new String(decodedBytes, StandardCharsets.UTF_8);
            System.out.println("updateProductPromotionByCompositeId : decodedJson: " + decodedJson);

            Map<String, Object> keyValues = objectMapper.readValue(decodedJson, Map.class);
            
            Long oldProductId = ((Number) keyValues.get("product.id")).longValue();
            Long oldPromotionId = ((Number) keyValues.get("promotion.id")).longValue();
            
            Long newProductId = null;
            Long newPromotionId = null;
            
            Object productObj = request.get("product");
            if (productObj instanceof Map) {
                newProductId = ((Number) ((Map<String, Object>) productObj).get("id")).longValue();
            }
            
            Object promotionObj = request.get("promotion");
            if (promotionObj instanceof Map) {
                newPromotionId = ((Number) ((Map<String, Object>) promotionObj).get("id")).longValue();
            }
            
            if (newProductId == null || newPromotionId == null) {
                return ResponseEntity.badRequest().body("Product ID and Promotion ID are required");
            }
            
            productPromotionService.removePromotionFromProduct(oldProductId, oldPromotionId);
            ProductPromotionDTO productPromotion = productPromotionService.assignPromotionToProduct(newProductId, newPromotionId);
            
            if (productPromotion != null) {
                return ResponseEntity.ok(productPromotion);
            }
            return ResponseEntity.badRequest().body("Failed to update product promotion");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid composite ID: " + e.getMessage());
        }
    }

    /**
     * POST assign promotion to product
     */
    @PostMapping
    public ResponseEntity<?> assignPromotionToProduct(
            @RequestBody Map<String, Object> request) {
        
        try {
            // Handle both formats: direct number or nested object
            Long productId = extractId(request.get("product"));
            Long promotionId = extractId(request.get("promotion"));
            
            if (productId == null || promotionId == null) {
                return ResponseEntity.badRequest().body("Product ID and Promotion ID are required");
            }

            ProductPromotionDTO productPromotion = productPromotionService.assignPromotionToProduct(productId, promotionId);
            if (productPromotion != null) {
                return new ResponseEntity<>(productPromotion, HttpStatus.CREATED);
            }
            return ResponseEntity.badRequest().body("Failed to assign promotion to product");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    private Long extractId(Object obj) {
        if (obj instanceof Number) {
            return ((Number) obj).longValue();
        }
        if (obj instanceof Map) {
            return ((Number) ((Map<String, Object>) obj).get("id")).longValue();
        }
        return null;
    }

    /**
     * GET all promotions for a product
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductPromotionDTO>> getPromotionsByProductId(@PathVariable Long productId) {
        List<ProductPromotionDTO> dtos = productPromotionService.getPromotionsByProductId(productId);
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    /**
     * GET all products for a promotion
     */
    @GetMapping("/promotion/{promotionId}")
    public ResponseEntity<List<ProductPromotionDTO>> getProductsByPromotionId(@PathVariable Long promotionId) {
        List<ProductPromotionDTO> dtos = productPromotionService.getProductsByPromotionId(promotionId);
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }
}
