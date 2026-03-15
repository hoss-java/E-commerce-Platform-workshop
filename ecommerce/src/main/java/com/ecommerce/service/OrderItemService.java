package com.ecommerce.service;

import com.ecommerce.entity.OrderItem;
import com.ecommerce.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService {
    
    @Autowired
    private OrderItemRepository orderItemRepository;

    // Create a new order item
    public OrderItem createOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    // Get all order items
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    // Get order item by ID
    public Optional<OrderItem> getOrderItemById(Long id) {
        return orderItemRepository.findById(id);
    }

    // Get order items by order ID
    public List<OrderItem> getOrderItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    // Get order items by product ID
    public List<OrderItem> getOrderItemsByProductId(Long productId) {
        return orderItemRepository.findByProductId(productId);
    }

    // Get order item by order ID and product ID
    public List<OrderItem> getOrderItemsByOrderIdAndProductId(Long orderId, Long productId) {
        return orderItemRepository.findByOrderIdAndProductId(orderId, productId);
    }

    // Update an order item
    public OrderItem updateOrderItem(Long id, OrderItem orderItemDetails) {
        Optional<OrderItem> existingOrderItem = orderItemRepository.findById(id);
        if (existingOrderItem.isPresent()) {
            OrderItem orderItem = existingOrderItem.get();
            orderItem.setQuantity(orderItemDetails.getQuantity());
            orderItem.setPriceAtPurchase(orderItemDetails.getPriceAtPurchase());
            orderItem.setOrder(orderItemDetails.getOrder());
            orderItem.setProduct(orderItemDetails.getProduct());
            return orderItemRepository.save(orderItem);
        }
        return null;
    }

    // Delete an order item
    public void deleteOrderItem(Long id) {
        orderItemRepository.deleteById(id);
    }

    // Delete all order items for a specific order
    public void deleteOrderItemsByOrderId(Long orderId) {
        orderItemRepository.deleteByOrderId(orderId);
    }

    // Calculate total price for an order item (quantity * price)
    public BigDecimal calculateTotalPrice(Long id) {
        Optional<OrderItem> orderItem = orderItemRepository.findById(id);
        if (orderItem.isPresent()) {
            OrderItem item = orderItem.get();
            return item.getPriceAtPurchase().multiply(new BigDecimal(item.getQuantity()));
        }
        return BigDecimal.ZERO;
    }
}
