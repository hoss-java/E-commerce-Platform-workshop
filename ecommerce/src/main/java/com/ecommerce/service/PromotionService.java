package com.ecommerce.service;

import com.ecommerce.entity.Promotion;
import com.ecommerce.dto.PromotionDTO;
import com.ecommerce.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PromotionService {
    
    @Autowired
    private PromotionRepository promotionRepository;

    public PromotionDTO createPromotion(PromotionDTO promotionDTO) {
        Promotion promotion = convertToEntity(promotionDTO);
        Promotion savedPromotion = promotionRepository.save(promotion);
        return convertToDTO(savedPromotion);
    }

    public Optional<PromotionDTO> getPromotionById(Long id) {
        return promotionRepository.findById(id).map(this::convertToDTO);
    }

    public Optional<PromotionDTO> getPromotionByCode(String code) {
        return promotionRepository.findByCode(code).map(this::convertToDTO);
    }

    public List<PromotionDTO> getAllPromotions() {
        return promotionRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PromotionDTO updatePromotion(Long id, PromotionDTO promotionDTO) {
        Optional<Promotion> promotion = promotionRepository.findById(id);
        if (promotion.isPresent()) {
            Promotion existingPromotion = promotion.get();
            existingPromotion.setCode(promotionDTO.getCode());
            existingPromotion.setStartDate(promotionDTO.getStartDate());
            existingPromotion.setEndDate(promotionDTO.getEndDate());
            Promotion updatedPromotion = promotionRepository.save(existingPromotion);
            return convertToDTO(updatedPromotion);
        }
        return null;
    }

    public boolean deletePromotion(Long id) {
        if (promotionRepository.existsById(id)) {
            promotionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private PromotionDTO convertToDTO(Promotion promotion) {
        return new PromotionDTO(
                promotion.getId(),
                promotion.getCode(),
                promotion.getStartDate(),
                promotion.getEndDate()
        );
    }

    private Promotion convertToEntity(PromotionDTO promotionDTO) {
        return new Promotion(
                promotionDTO.getCode(),
                promotionDTO.getStartDate(),
                promotionDTO.getEndDate()
        );
    }
}
