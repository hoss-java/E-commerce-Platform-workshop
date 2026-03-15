package com.ecommerce.controller;

import com.ecommerce.entity.Order;
import com.ecommerce.service.OrderService;
import com.ecommerce.entity.Customer;
import com.ecommerce.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;

    @Autowired
    private CustomerService customerService;

    // Create a new order
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> requestData) {
        try {
            Order order = new Order();
            
            // Handle customer.id (flat key format)
            if (requestData.containsKey("customer.id")) {
                Long customerId = Long.valueOf(requestData.get("customer.id").toString());
                Optional<Customer> customer = customerService.getCustomerById(customerId);
                if (customer.isPresent()) {
                    order.setCustomer(customer.get());
                } else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }
            
            // Set order date
            if (requestData.containsKey("orderDate")) {
                order.setOrderDate(LocalDateTime.parse(requestData.get("orderDate").toString()));
            } else {
                order.setOrderDate(LocalDateTime.now());
            }
            
            // Set status with default value if null
            String status = (String) requestData.get("status");
            order.setStatus(status != null ? status : "PENDING");
            
            Order createdOrder = orderService.createOrder(order);
            return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Get all orders
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                   .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get orders by customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getOrdersByCustomerId(@PathVariable Long customerId) {
        List<Order> orders = orderService.getOrdersByCustomerId(customerId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Get orders by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Get orders by date range
    @GetMapping("/date-range")
    public ResponseEntity<List<Order>> getOrdersByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<Order> orders = orderService.getOrdersByDateRange(startDate, endDate);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Get orders by customer ID and status
    @GetMapping("/customer/{customerId}/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByCustomerIdAndStatus(
            @PathVariable Long customerId,
            @PathVariable String status) {
        List<Order> orders = orderService.getOrdersByCustomerIdAndStatus(customerId, status);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Update an order
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Map<String, Object> requestData) {
        try {
            Optional<Order> existingOrder = orderService.getOrderById(id);
            if (!existingOrder.isPresent()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            Order order = existingOrder.get();
            
            // Handle customer.id
            if (requestData.containsKey("customer.id")) {
                Long customerId = Long.valueOf(requestData.get("customer.id").toString());
                Optional<Customer> customer = customerService.getCustomerById(customerId);
                if (customer.isPresent()) {
                    order.setCustomer(customer.get());
                } else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }
            
            // Set order date if provided
            if (requestData.containsKey("orderDate")) {
                order.setOrderDate(LocalDateTime.parse(requestData.get("orderDate").toString()));
            }
            
            // Set status if provided
            if (requestData.containsKey("status") && requestData.get("status") != null) {
                order.setStatus(requestData.get("status").toString());
            }
            
            Order updatedOrder = orderService.updateOrder(id, order);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Delete an order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

