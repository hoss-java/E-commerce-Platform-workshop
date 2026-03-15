package com.ecommerce.controller;

import com.ecommerce.dto.PromotionDTO;
import com.ecommerce.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/promotions")
public class PromotionController {
    
    @Autowired
    private PromotionService promotionService;

    @PostMapping
    public ResponseEntity<PromotionDTO> createPromotion(@RequestBody PromotionDTO promotionDTO) {
        PromotionDTO createdPromotion = promotionService.createPromotion(promotionDTO);
        return new ResponseEntity<>(createdPromotion, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromotionDTO> getPromotionById(@PathVariable Long id) {
        Optional<PromotionDTO> promotion = promotionService.getPromotionById(id);
        return promotion.map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<PromotionDTO> getPromotionByCode(@PathVariable String code) {
        Optional<PromotionDTO> promotion = promotionService.getPromotionByCode(code);
        return promotion.map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<PromotionDTO>> getAllPromotions() {
        List<PromotionDTO> promotions = promotionService.getAllPromotions();
        return new ResponseEntity<>(promotions, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionDTO> updatePromotion(@PathVariable Long id, @RequestBody PromotionDTO promotionDTO) {
        PromotionDTO updatedPromotion = promotionService.updatePromotion(id, promotionDTO);
        if (updatedPromotion != null) {
            return new ResponseEntity<>(updatedPromotion, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        if (promotionService.deletePromotion(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
