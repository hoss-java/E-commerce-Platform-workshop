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

import java.util.Arrays;
import java.util.List;

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
    void testGetAddressById() throws Exception {
        when(addressService.getAddressById(1L)).thenReturn(address);
        
        mockMvc.perform(get("/api/addresses/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.street").value("123 Main St"))
                .andExpect(jsonPath("$.city").value("New York"));
    }
    
    @Test
    void testGetAllAddresses() throws Exception {
        Address address2 = new Address("456 Oak Ave", "Los Angeles", "90001");
        List<Address> addresses = Arrays.asList(address, address2);
        
        when(addressService.getAllAddresses()).thenReturn(addresses);
        
        mockMvc.perform(get("/api/addresses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }
    
    @Test
    void testUpdateAddress() throws Exception {
        when(addressService.updateAddress(eq(1L), anyString(), anyString(), anyString()))
                .thenReturn(address);
        
        mockMvc.perform(put("/api/addresses/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(address)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.street").value("123 Main St"));
    }
    
    @Test
    void testDeleteAddress() throws Exception {
        mockMvc.perform(delete("/api/addresses/1"))
                .andExpect(status().isOk());
        
        verify(addressService, times(1)).deleteAddress(1L);
    }
}
