package com.ecommerce.controller;

import com.ecommerce.dto.PromotionDTO;
import com.ecommerce.service.PromotionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class PromotionControllerTest {

    @InjectMocks
    private PromotionController promotionController;

    @Mock
    private PromotionService promotionService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreatePromotion() {
        PromotionDTO promotionDTO = new PromotionDTO();
        promotionDTO.setId(1L);

        when(promotionService.createPromotion(any(PromotionDTO.class))).thenReturn(promotionDTO);

        ResponseEntity<PromotionDTO> response = promotionController.createPromotion(promotionDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(promotionDTO, response.getBody());
        verify(promotionService).createPromotion(promotionDTO);
    }

    @Test
    public void testGetPromotionByIdFound() {
        PromotionDTO promotionDTO = new PromotionDTO();
        when(promotionService.getPromotionById(1L)).thenReturn(Optional.of(promotionDTO));

        ResponseEntity<PromotionDTO> response = promotionController.getPromotionById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(promotionDTO, response.getBody());
    }

    @Test
    public void testGetPromotionByIdNotFound() {
        when(promotionService.getPromotionById(1L)).thenReturn(Optional.empty());

        ResponseEntity<PromotionDTO> response = promotionController.getPromotionById(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testGetPromotionByCodeFound() {
        PromotionDTO promotionDTO = new PromotionDTO();
        when(promotionService.getPromotionByCode("PROMO2023")).thenReturn(Optional.of(promotionDTO));

        ResponseEntity<PromotionDTO> response = promotionController.getPromotionByCode("PROMO2023");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(promotionDTO, response.getBody());
    }

    @Test
    public void testGetPromotionByCodeNotFound() {
        when(promotionService.getPromotionByCode("PROMO2023")).thenReturn(Optional.empty());

        ResponseEntity<PromotionDTO> response = promotionController.getPromotionByCode("PROMO2023");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testGetAllPromotions() {
        List<PromotionDTO> promotions = new ArrayList<>();
        when(promotionService.getAllPromotions()).thenReturn(promotions);

        ResponseEntity<List<PromotionDTO>> response = promotionController.getAllPromotions();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(promotions, response.getBody());
    }

    @Test
    public void testUpdatePromotionSuccess() {
        PromotionDTO promotionDTO = new PromotionDTO();
        PromotionDTO updatedPromotionDTO = new PromotionDTO();
        when(promotionService.updatePromotion(1L, promotionDTO)).thenReturn(updatedPromotionDTO);

        ResponseEntity<PromotionDTO> response = promotionController.updatePromotion(1L, promotionDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedPromotionDTO, response.getBody());
    }

    @Test
    public void testUpdatePromotionNotFound() {
        PromotionDTO promotionDTO = new PromotionDTO();
        when(promotionService.updatePromotion(1L, promotionDTO)).thenReturn(null);

        ResponseEntity<PromotionDTO> response = promotionController.updatePromotion(1L, promotionDTO);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testDeletePromotionSuccess() {
        when(promotionService.deletePromotion(1L)).thenReturn(true);

        ResponseEntity<Void> response = promotionController.deletePromotion(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(promotionService).deletePromotion(1L);
    }

    @Test
    public void testDeletePromotionNotFound() {
        when(promotionService.deletePromotion(1L)).thenReturn(false);

        ResponseEntity<Void> response = promotionController.deletePromotion(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
