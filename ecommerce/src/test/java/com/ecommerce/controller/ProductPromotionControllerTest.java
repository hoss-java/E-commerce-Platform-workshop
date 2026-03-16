package com.ecommerce.controller;

import com.ecommerce.dto.ProductPromotionDTO;
import com.ecommerce.service.ProductPromotionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ProductPromotionControllerTest {

    @InjectMocks
    private ProductPromotionController productPromotionController;

    @Mock
    private ProductPromotionService productPromotionService;
    
    @Mock
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllProductPromotions() {
        List<ProductPromotionDTO> promotions = new ArrayList<>();
        when(productPromotionService.getAllProductPromotions()).thenReturn(promotions);

        ResponseEntity<List<ProductPromotionDTO>> response = productPromotionController.getAllProductPromotions();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(promotions, response.getBody());
    }

    @Test
    public void testGetProductPromotionByCompositeIdFound() throws Exception {
        String compositeId = Base64.getEncoder().encodeToString("{\"product.id\":1,\"promotion.id\":2}".getBytes());
        ProductPromotionDTO productPromotionDTO = new ProductPromotionDTO();
        
        when(objectMapper.readValue(any(String.class), any(Class.class))).thenReturn(Map.of("product.id", 1, "promotion.id", 2));
        when(productPromotionService.getProductPromotion(1L, 2L)).thenReturn(Optional.of(productPromotionDTO));

        ResponseEntity<?> response = productPromotionController.getProductPromotionByCompositeId(compositeId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(productPromotionDTO, response.getBody());
    }

    @Test
    public void testGetProductPromotionByCompositeIdNotFound() throws Exception {
        String compositeId = Base64.getEncoder().encodeToString("{\"product.id\":1,\"promotion.id\":2}".getBytes());

        when(objectMapper.readValue(any(String.class), any(Class.class))).thenReturn(Map.of("product.id", 1, "promotion.id", 2));
        when(productPromotionService.getProductPromotion(1L, 2L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = productPromotionController.getProductPromotionByCompositeId(compositeId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testDeleteProductPromotionByCompositeIdSuccess() throws Exception {
        String compositeId = Base64.getEncoder().encodeToString("{\"product.id\":1,\"promotion.id\":2}".getBytes());

        when(objectMapper.readValue(any(String.class), any(Class.class))).thenReturn(Map.of("product.id", 1, "promotion.id", 2));
        when(productPromotionService.removePromotionFromProduct(1L, 2L)).thenReturn(true);

        ResponseEntity<?> response = productPromotionController.deleteProductPromotionByCompositeId(compositeId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    public void testDeleteProductPromotionByCompositeIdNotFound() throws Exception {
        String compositeId = Base64.getEncoder().encodeToString("{\"product.id\":1,\"promotion.id\":2}".getBytes());

        when(objectMapper.readValue(any(String.class), any(Class.class))).thenReturn(Map.of("product.id", 1, "promotion.id", 2));
        when(productPromotionService.removePromotionFromProduct(1L, 2L)).thenReturn(false);

        ResponseEntity<?> response = productPromotionController.deleteProductPromotionByCompositeId(compositeId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testUpdateProductPromotionByCompositeIdSuccess() throws Exception {
        String compositeId = Base64.getEncoder().encodeToString("{\"product.id\":1,\"promotion.id\":2}".getBytes());
        
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("product", Map.of("id", 3));
        requestData.put("promotion", Map.of("id", 4));
        
        ProductPromotionDTO productPromotionDTO = new ProductPromotionDTO();
        when(objectMapper.readValue(any(String.class), any(Class.class))).thenReturn(Map.of("product.id", 1, "promotion.id", 2));
        when(productPromotionService.assignPromotionToProduct(3L, 4L)).thenReturn(productPromotionDTO);
        
        ResponseEntity<?> response = productPromotionController.updateProductPromotionByCompositeId(compositeId, requestData);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(productPromotionDTO, response.getBody());
    }

    @Test
    public void testUpdateProductPromotionByCompositeIdBadRequest() throws Exception {
        String compositeId = Base64.getEncoder().encodeToString("{\"product.id\":1,\"promotion.id\":2}".getBytes());

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("product", null);  // Simulating missing product details
        requestData.put("promotion", null); // Simulating missing promotion details
        
        // Simulate valid decoding of the compositeId
        when(objectMapper.readValue(any(String.class), any(Class.class)))
            .thenReturn(Map.of("product.id", 1, "promotion.id", 2));

        ResponseEntity<?> response = productPromotionController.updateProductPromotionByCompositeId(compositeId, requestData);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Product ID and Promotion ID are required", response.getBody());
    }

    @Test
    public void testAssignPromotionToProductSuccess() {
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("product", Map.of("id", 1));
        requestData.put("promotion", Map.of("id", 2));
        
        ProductPromotionDTO productPromotionDTO = new ProductPromotionDTO();
        when(productPromotionService.assignPromotionToProduct(1L, 2L)).thenReturn(productPromotionDTO);

        ResponseEntity<?> response = productPromotionController.assignPromotionToProduct(requestData);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(productPromotionDTO, response.getBody());
    }

    @Test
    public void testAssignPromotionToProductBadRequest() {
        Map<String, Object> requestData = new HashMap<>();
        requestData.put("product", null);
        requestData.put("promotion", null);

        ResponseEntity<?> response = productPromotionController.assignPromotionToProduct(requestData);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Product ID and Promotion ID are required", response.getBody());
    }

    @Test
    public void testGetPromotionsByProductId() {
        List<ProductPromotionDTO> promotions = new ArrayList<>();
        when(productPromotionService.getPromotionsByProductId(1L)).thenReturn(promotions);

        ResponseEntity<List<ProductPromotionDTO>> response = productPromotionController.getPromotionsByProductId(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(promotions, response.getBody());
    }

    @Test
    public void testGetProductsByPromotionId() {
        List<ProductPromotionDTO> products = new ArrayList<>();
        when(productPromotionService.getProductsByPromotionId(1L)).thenReturn(products);

        ResponseEntity<List<ProductPromotionDTO>> response = productPromotionController.getProductsByPromotionId(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(products, response.getBody());
    }
}
