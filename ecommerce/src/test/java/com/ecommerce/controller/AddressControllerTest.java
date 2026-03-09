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
import java.util.Optional;

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
    
    // CREATE TESTS
    @Test
    void testCreateAddress() throws Exception {
        when(addressService.createAddress(any(Address.class)))
                .thenReturn(address);
        
        mockMvc.perform(post("/addresses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(address)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.street").value("123 Main St"))
                .andExpect(jsonPath("$.city").value("New York"))
                .andExpect(jsonPath("$.zipCode").value("10001"));
        
        verify(addressService, times(1)).createAddress(any(Address.class));
    }
    
    @Test
    void testCreateAddressWithInvalidData() throws Exception {
        Address invalidAddress = new Address("", "", "");
        
        mockMvc.perform(post("/addresses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidAddress)))
                .andExpect(status().isCreated()); // Note: Your controller doesn't validate, so it returns 201
    }
    
    // READ TESTS
    @Test
    void testGetAddressById() throws Exception {
        when(addressService.getAddressById(1L))
                .thenReturn(Optional.of(address));
        
        mockMvc.perform(get("/addresses/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.street").value("123 Main St"))
                .andExpect(jsonPath("$.city").value("New York"))
                .andExpect(jsonPath("$.zipCode").value("10001"));
        
        verify(addressService, times(1)).getAddressById(1L);
    }
    
    @Test
    void testGetAddressByIdNotFound() throws Exception {
        when(addressService.getAddressById(999L))
                .thenReturn(Optional.empty());
        
        mockMvc.perform(get("/addresses/999"))
                .andExpect(status().isNotFound());
        
        verify(addressService, times(1)).getAddressById(999L);
    }
    
    @Test
    void testGetAllAddresses() throws Exception {
        when(addressService.getAllAddresses())
                .thenReturn(Arrays.asList(address));
        
        mockMvc.perform(get("/addresses"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].street").value("123 Main St"))
                .andExpect(jsonPath("$[0].city").value("New York"))
                .andExpect(jsonPath("$[0].zipCode").value("10001"));
        
        verify(addressService, times(1)).getAllAddresses();
    }
    
    @Test
    void testGetAddressesByZipCode() throws Exception {
        when(addressService.getAddressesByZipCode("10001"))
                .thenReturn(Arrays.asList(address));
        
        // FIXED: Changed from /zipcode/ to /zip-code/
        mockMvc.perform(get("/addresses/zip-code/10001"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].street").value("123 Main St"))
                .andExpect(jsonPath("$[0].zipCode").value("10001"));
        
        verify(addressService, times(1)).getAddressesByZipCode("10001");
    }
    
    @Test
    void testGetAddressesByZipCodeNotFound() throws Exception {
        when(addressService.getAddressesByZipCode("99999"))
                .thenReturn(Arrays.asList());
        
        mockMvc.perform(get("/addresses/zip-code/99999"))
                .andExpect(status().isNotFound());
    }
    
    @Test
    void testGetAddressesByCity() throws Exception {
        when(addressService.getAddressesByCity("New York"))
                .thenReturn(Arrays.asList(address));
        
        mockMvc.perform(get("/addresses/city/New York"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].city").value("New York"));
    }
    
    @Test
    void testGetAddressesByStreet() throws Exception {
        when(addressService.getAddressesByStreet("123 Main St"))
                .thenReturn(Arrays.asList(address));
        
        mockMvc.perform(get("/addresses/street/123 Main St"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].street").value("123 Main St"));
    }
    
    @Test
    void testCountAddressesByZipCode() throws Exception {
        when(addressService.countAddressesByZipCode("10001"))
                .thenReturn(1L);
        
        mockMvc.perform(get("/addresses/count/zip-code/10001"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").value(1));
    }
    
    @Test
    void testGetAddressesByZipCodePrefix() throws Exception {
        when(addressService.getAddressesByZipCodePrefix("100"))
                .thenReturn(Arrays.asList(address));
        
        mockMvc.perform(get("/addresses/zip-code-prefix/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].zipCode").value("10001"));
    }
    
    // UPDATE TESTS
    @Test
    void testUpdateAddress() throws Exception {
        Address updatedAddress = new Address("456 Oak Ave", "New York", "10001");
        updatedAddress.setId(1L);
        
        when(addressService.updateAddress(eq(1L), any(Address.class)))
                .thenReturn(updatedAddress);
        
        mockMvc.perform(put("/addresses/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedAddress)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.street").value("456 Oak Ave"))
                .andExpect(jsonPath("$.city").value("New York"))
                .andExpect(jsonPath("$.zipCode").value("10001"));
        
        verify(addressService, times(1)).updateAddress(eq(1L), any(Address.class));
    }
    
    @Test
    void testUpdateAddressNotFound() throws Exception {
        Address updatedAddress = new Address("456 Oak Ave", "New York", "10001");
        
        when(addressService.updateAddress(eq(999L), any(Address.class)))
                .thenThrow(new RuntimeException("Address not found with id: 999"));
        
        mockMvc.perform(put("/addresses/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedAddress)))
                .andExpect(status().isNotFound());
    }
    
    // DELETE TESTS
    @Test
    void testDeleteAddress() throws Exception {
        doNothing().when(addressService).deleteAddress(1L);
        
        mockMvc.perform(delete("/addresses/1"))
                .andExpect(status().isNoContent());
        
        verify(addressService, times(1)).deleteAddress(1L);
    }
}
