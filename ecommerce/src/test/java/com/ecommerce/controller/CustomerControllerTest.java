package com.ecommerce.controller;

import com.ecommerce.entity.Address;
import com.ecommerce.entity.Customer;
import com.ecommerce.entity.UserProfile;
import com.ecommerce.service.CustomerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;
import java.util.Collections;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.containsString;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CustomerController.class)
class CustomerControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private CustomerService customerService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private Customer customer;
    private Address address;
    private UserProfile userProfile;
    
    @BeforeEach
    void setUp() {
        address = new Address("123 Main St", "New York", "10001");
        address.setId(1L);
        
        userProfile = new UserProfile();
        userProfile.setId(1L);
        userProfile.setNickname("john_doe");
        userProfile.setPhoneNumber("555-1234");
        userProfile.setBio("Software developer");
        
        customer = new Customer("John", "Doe", "john@example.com", address, userProfile);
        customer.setId(1L);
        customer.setCreatedAt(LocalDateTime.now());
    }
    
    @Test
    void testGetAllCustomers() throws Exception {
        Customer customer2 = new Customer("Jane", "Smith", "jane@example.com", address, userProfile);
        customer2.setId(2L);
        
        when(customerService.getAllCustomers()).thenReturn(Arrays.asList(customer, customer2));
        
        mockMvc.perform(get("/customers")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].firstName").value("John"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].firstName").value("Jane"));
        
        verify(customerService, times(1)).getAllCustomers();
    }

    @Test
    void testGetCustomerByEmail() throws Exception {
        when(customerService.getCustomerByEmail("john@example.com")).thenReturn(Optional.of(customer));
        
        mockMvc.perform(get("/customers/by-email/john@example.com")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.email").value("john@example.com"));
        
        verify(customerService, times(1)).getCustomerByEmail("john@example.com");
    }

    @Test
    void testGetCustomerById() throws Exception {
        when(customerService.getCustomerById(1L)).thenReturn(Optional.of(customer));
        
        mockMvc.perform(get("/customers/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("John"));
        
        verify(customerService, times(1)).getCustomerById(1L);
    }

    @Test
    void testGetCustomerByIdNotFound() throws Exception {
        when(customerService.getCustomerById(999L)).thenReturn(Optional.empty());
        
        mockMvc.perform(get("/customers/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
        
        verify(customerService, times(1)).getCustomerById(999L);
    }

    @Test
    void testUpdateCustomer() throws Exception {
        Map<String, Object> updateRequest = new HashMap<>();
        updateRequest.put("firstName", "John");
        updateRequest.put("lastName", "Updated");
        updateRequest.put("email", "john.updated@example.com");
        updateRequest.put("address", 1L);
        updateRequest.put("userProfile", 1L);
        
        Customer updatedCustomer = new Customer("John", "Updated", "john.updated@example.com", address, userProfile);
        updatedCustomer.setId(1L);
        
        when(customerService.updateCustomer(eq(1L), any(Customer.class))).thenReturn(updatedCustomer);
        
        mockMvc.perform(put("/customers/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastName").value("Updated"));
        
        verify(customerService, times(1)).updateCustomer(eq(1L), any(Customer.class));
    }

    @Test
    void testUpdateCustomerNotFound() throws Exception {
        Map<String, Object> updateRequest = new HashMap<>();
        updateRequest.put("firstName", "John");
        updateRequest.put("lastName", "Doe");
        updateRequest.put("email", "john@example.com");
        updateRequest.put("address", 1L);
        updateRequest.put("userProfile", 1L);
        
        when(customerService.updateCustomer(eq(999L), any(Customer.class)))
                .thenThrow(new RuntimeException("Customer not found with id: 999"));
        
        mockMvc.perform(put("/customers/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isNotFound());
        
        verify(customerService, times(1)).updateCustomer(eq(999L), any(Customer.class));
    }

    @Test
    void testDeleteCustomer() throws Exception {
        doNothing().when(customerService).deleteCustomer(1L);
        
        mockMvc.perform(delete("/customers/1"))
                .andExpect(status().isNoContent());
        
        verify(customerService, times(1)).deleteCustomer(1L);
    }

    @Test
    void testGetCustomersByLastNameNotFound() throws Exception {
        when(customerService.getCustomersByLastName("NonExistent")).thenReturn(Collections.emptyList());
        
        mockMvc.perform(get("/customers/by-last-name/NonExistent"))
                .andExpect(status().isNotFound());
    }
}
