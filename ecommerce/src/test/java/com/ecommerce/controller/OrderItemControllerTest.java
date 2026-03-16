package com.ecommerce.controller;

import com.ecommerce.entity.OrderItem;
import com.ecommerce.service.OrderItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class OrderItemControllerTest {

    @InjectMocks
    private OrderItemController orderItemController;

    @Mock
    private OrderItemService orderItemService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateOrderItem() {
        OrderItem orderItem = new OrderItem();
        orderItem.setId(1L);
        
        when(orderItemService.createOrderItem(any(OrderItem.class))).thenReturn(orderItem);

        ResponseEntity<OrderItem> response = orderItemController.createOrderItem(orderItem);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(orderItem, response.getBody());
        verify(orderItemService).createOrderItem(orderItem);
    }

    @Test
    public void testGetAllOrderItems() {
        List<OrderItem> orderItems = new ArrayList<>();
        when(orderItemService.getAllOrderItems()).thenReturn(orderItems);

        ResponseEntity<List<OrderItem>> response = orderItemController.getAllOrderItems();
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(orderItems, response.getBody());
    }

    @Test
    public void testGetOrderItemByIdFound() {
        OrderItem orderItem = new OrderItem();
        when(orderItemService.getOrderItemById(1L)).thenReturn(Optional.of(orderItem));

        ResponseEntity<OrderItem> response = orderItemController.getOrderItemById(1L);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(orderItem, response.getBody());
    }

    @Test
    public void testGetOrderItemByIdNotFound() {
        when(orderItemService.getOrderItemById(1L)).thenReturn(Optional.empty());

        ResponseEntity<OrderItem> response = orderItemController.getOrderItemById(1L);
        
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testGetOrderItemsByOrderId() {
        List<OrderItem> orderItems = new ArrayList<>();
        when(orderItemService.getOrderItemsByOrderId(1L)).thenReturn(orderItems);

        ResponseEntity<List<OrderItem>> response = orderItemController.getOrderItemsByOrderId(1L);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(orderItems, response.getBody());
    }

    @Test
    public void testGetOrderItemsByProductId() {
        List<OrderItem> orderItems = new ArrayList<>();
        when(orderItemService.getOrderItemsByProductId(1L)).thenReturn(orderItems);

        ResponseEntity<List<OrderItem>> response = orderItemController.getOrderItemsByProductId(1L);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(orderItems, response.getBody());
    }

    @Test
    public void testUpdateOrderItemSuccess() {
        OrderItem orderItem = new OrderItem();
        when(orderItemService.updateOrderItem(1L, orderItem)).thenReturn(orderItem);

        ResponseEntity<OrderItem> response = orderItemController.updateOrderItem(1L, orderItem);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(orderItem, response.getBody());
    }

    @Test
    public void testUpdateOrderItemNotFound() {
        OrderItem orderItem = new OrderItem();
        when(orderItemService.updateOrderItem(1L, orderItem)).thenReturn(null);

        ResponseEntity<OrderItem> response = orderItemController.updateOrderItem(1L, orderItem);
        
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testDeleteOrderItem() {
        ResponseEntity<Void> response = orderItemController.deleteOrderItem(1L);
        
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(orderItemService).deleteOrderItem(1L);
    }

    @Test
    public void testDeleteOrderItemsByOrderId() {
        ResponseEntity<Void> response = orderItemController.deleteOrderItemsByOrderId(1L);
        
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(orderItemService).deleteOrderItemsByOrderId(1L);
    }

    @Test
    public void testGetTotalPrice() {
        BigDecimal totalPrice = BigDecimal.valueOf(100.00);
        when(orderItemService.calculateTotalPrice(1L)).thenReturn(totalPrice);

        ResponseEntity<BigDecimal> response = orderItemController.getTotalPrice(1L);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(totalPrice, response.getBody());
    }
}
