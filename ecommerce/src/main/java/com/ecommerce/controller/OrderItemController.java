package com.ecommerce.controller;

import com.ecommerce.entity.OrderItem;
import com.ecommerce.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/order-items")
public class OrderItemController {
    
    @Autowired
    private OrderItemService orderItemService;

    // Create a new order item
    @PostMapping
    public ResponseEntity<OrderItem> createOrderItem(@RequestBody OrderItem orderItem) {
        OrderItem createdOrderItem = orderItemService.createOrderItem(orderItem);
        return new ResponseEntity<>(createdOrderItem, HttpStatus.CREATED);
    }

    // Get all order items
    @GetMapping
    public ResponseEntity<List<OrderItem>> getAllOrderItems() {
        List<OrderItem> orderItems = orderItemService.getAllOrderItems();
        return new ResponseEntity<>(orderItems, HttpStatus.OK);
    }

    // Get order item by ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderItem> getOrderItemById(@PathVariable Long id) {
        Optional<OrderItem> orderItem = orderItemService.getOrderItemById(id);
        return orderItem.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                       .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get order items by order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderItem>> getOrderItemsByOrderId(@PathVariable Long orderId) {
        List<OrderItem> orderItems = orderItemService.getOrderItemsByOrderId(orderId);
        return new ResponseEntity<>(orderItems, HttpStatus.OK);
    }

    // Get order items by product ID
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<OrderItem>> getOrderItemsByProductId(@PathVariable Long productId) {
        List<OrderItem> orderItems = orderItemService.getOrderItemsByProductId(productId);
        return new ResponseEntity<>(orderItems, HttpStatus.OK);
    }

    // Get order item by order ID and product ID
    @GetMapping("/order/{orderId}/product/{productId}")
    public ResponseEntity<List<OrderItem>> getOrderItemsByOrderIdAndProductId(
            @PathVariable Long orderId,
            @PathVariable Long productId) {
        List<OrderItem> orderItems = orderItemService.getOrderItemsByOrderIdAndProductId(orderId, productId);
        return new ResponseEntity<>(orderItems, HttpStatus.OK);
    }

    // Update an order item
    @PutMapping("/{id}")
    public ResponseEntity<OrderItem> updateOrderItem(@PathVariable Long id, @RequestBody OrderItem orderItemDetails) {
        OrderItem updatedOrderItem = orderItemService.updateOrderItem(id, orderItemDetails);
        if (updatedOrderItem != null) {
            return new ResponseEntity<>(updatedOrderItem, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete an order item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Long id) {
        orderItemService.deleteOrderItem(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Delete all order items for a specific order
    @DeleteMapping("/order/{orderId}")
    public ResponseEntity<Void> deleteOrderItemsByOrderId(@PathVariable Long orderId) {
        orderItemService.deleteOrderItemsByOrderId(orderId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Get total price for an order item
    @GetMapping("/{id}/total-price")
    public ResponseEntity<BigDecimal> getTotalPrice(@PathVariable Long id) {
        BigDecimal totalPrice = orderItemService.calculateTotalPrice(id);
        return new ResponseEntity<>(totalPrice, HttpStatus.OK);
    }
}
