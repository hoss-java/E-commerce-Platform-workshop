package com.ecommerce.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ecommerce.entity.Address;
import com.ecommerce.service.AddressService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AddressController.class)
class AddressControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private AddressService addressService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private Address address;
    
    @BeforeEach
    void setUp() {
        address = new Address("123 Main St", "New York", "10001");
        address.setId(1L);
    }
    
    @Test
    void testCreateAddress() throws Exception {
        when(addressService.createAddress(anyString(), anyString(), anyString()))
                .thenReturn(address);
        
        mockMvc.perform(post("/api/addresses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(address)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.street").value("123 Main St"));
    }
    
    @Test
    void testGetAllAddresses() throws Exception {
        when(addressService.getAllAddresses()).thenReturn(java.util.Arrays.asList(address));
        
        mockMvc.perform(get("/api/addresses"))
                .andExpect(status().isOk());
    }
}
