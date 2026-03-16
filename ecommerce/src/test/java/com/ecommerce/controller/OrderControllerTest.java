package com.ecommerce.controller;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.Customer;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class OrderControllerTest {

    @InjectMocks
    private OrderController orderController;

    @Mock
    private OrderService orderService;

    @Mock
    private CustomerService customerService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateOrderSuccess() {
        HashMap<String, Object> requestData = new HashMap<>();
        requestData.put("customer.id", 1L);
        requestData.put("orderDate", LocalDateTime.now().toString());
        requestData.put("status", "PENDING");

        Customer customer = new Customer();
        customer.setId(1L);

        when(customerService.getCustomerById(1L)).thenReturn(Optional.of(customer));
        when(orderService.createOrder(any(Order.class))).thenReturn(new Order());

        ResponseEntity<Order> response = orderController.createOrder(requestData);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(orderService).createOrder(any(Order.class));
    }

    @Test
    public void testCreateOrderCustomerNotFound() {
        HashMap<String, Object> requestData = new HashMap<>();
        requestData.put("customer.id", 2L);

        when(customerService.getCustomerById(2L)).thenReturn(Optional.empty());

        ResponseEntity<Order> response = orderController.createOrder(requestData);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(orderService, never()).createOrder(any(Order.class));
    }

    @Test
    public void testGetAllOrders() {
        List<Order> orders = new ArrayList<>();
        when(orderService.getAllOrders()).thenReturn(orders);

        ResponseEntity<List<Order>> response = orderController.getAllOrders();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(orders, response.getBody());
    }

    @Test
    public void testGetOrderByIdFound() {
        Order order = new Order();
        when(orderService.getOrderById(1L)).thenReturn(Optional.of(order));

        ResponseEntity<Order> response = orderController.getOrderById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(order, response.getBody());
    }

    @Test
    public void testGetOrderByIdNotFound() {
        when(orderService.getOrderById(1L)).thenReturn(Optional.empty());

        ResponseEntity<Order> response = orderController.getOrderById(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    // Add more tests for the rest of the endpoints as necessary

    // Example for the updateOrder method
    @Test
    public void testUpdateOrderSuccess() {
        HashMap<String, Object> requestData = new HashMap<>();
        requestData.put("customer.id", 1L);
        requestData.put("status", "SHIPPED");

        Customer customer = new Customer();
        customer.setId(1L);
        
        Order existingOrder = new Order();
        existingOrder.setId(1L);
        
        when(orderService.getOrderById(1L)).thenReturn(Optional.of(existingOrder));
        when(customerService.getCustomerById(1L)).thenReturn(Optional.of(customer));
        when(orderService.updateOrder(1L, existingOrder)).thenReturn(existingOrder);

        ResponseEntity<Order> response = orderController.updateOrder(1L, requestData);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(orderService).updateOrder(1L, existingOrder);
    }

    // More test methods...
}
