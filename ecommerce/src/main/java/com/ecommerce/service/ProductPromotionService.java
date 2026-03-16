package com.ecommerce.service;

import com.ecommerce.entity.ProductPromotion;
import com.ecommerce.entity.ProductPromotionId;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.Promotion;
import com.ecommerce.dto.ProductPromotionDTO;
import com.ecommerce.dto.ProductDTO;
import com.ecommerce.dto.PromotionDTO;
import com.ecommerce.repository.ProductPromotionRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductPromotionService {
    
    @Autowired
    private ProductPromotionRepository productPromotionRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    public ProductPromotionDTO assignPromotionToProduct(Long productId, Long promotionId) {
        Optional<Product> product = productRepository.findById(productId);
        Optional<Promotion> promotion = promotionRepository.findById(promotionId);
        
        if (product.isPresent() && promotion.isPresent()) {
            ProductPromotion productPromotion = new ProductPromotion(product.get(), promotion.get());
            ProductPromotion savedProductPromotion = productPromotionRepository.save(productPromotion);
            return convertToDTO(savedProductPromotion);
        }
        return null;
    }

    public Optional<ProductPromotionDTO> getProductPromotion(Long productId, Long promotionId) {
        return productPromotionRepository.findById(new ProductPromotionId(productId, promotionId))
                .map(this::convertToDTO);
    }

    public List<ProductPromotionDTO> getPromotionsByProductId(Long productId) {
        return productPromotionRepository.findByProductId(productId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductPromotionDTO> getProductsByPromotionId(Long promotionId) {
        return productPromotionRepository.findByPromotionId(promotionId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductPromotionDTO> getAllProductPromotions() {
        return productPromotionRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean removePromotionFromProduct(Long productId, Long promotionId) {
        ProductPromotionId id = new ProductPromotionId(productId, promotionId);
        if (productPromotionRepository.existsById(id)) {
            productPromotionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private ProductPromotionDTO convertToDTO(ProductPromotion productPromotion) {
        ProductDTO productDTO = new ProductDTO(
                productPromotion.getProduct().getId(),
                productPromotion.getProduct().getName(),
                productPromotion.getProduct().getPrice(),
                null // Set category if needed
        );
        PromotionDTO promotionDTO = new PromotionDTO(
                productPromotion.getPromotion().getId(),
                productPromotion.getPromotion().getCode(),
                productPromotion.getPromotion().getStartDate(),
                productPromotion.getPromotion().getEndDate()
        );
        return new ProductPromotionDTO(
                productPromotion.getProduct().getId(),
                productPromotion.getPromotion().getId(),
                productDTO,
                promotionDTO
        );
    }
}
