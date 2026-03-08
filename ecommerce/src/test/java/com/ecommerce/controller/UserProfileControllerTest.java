package com.ecommerce.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ecommerce.entity.UserProfile;
import com.ecommerce.service.UserProfileService;
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

@WebMvcTest(UserProfileController.class)
class UserProfileControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserProfileService userProfileService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private UserProfile userProfile;
    
    @BeforeEach
    void setUp() {
        userProfile = new UserProfile("john_doe", "555-1234", "I love ecommerce!");
        userProfile.setId(1L);
    }
    
    @Test
    void testCreateUserProfile() throws Exception {
        when(userProfileService.createUserProfile(anyString(), anyString(), anyString()))
                .thenReturn(userProfile);
        
        mockMvc.perform(post("/api/user-profiles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userProfile)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nickname").value("john_doe"));
    }
    
    @Test
    void testGetUserProfileById() throws Exception {
        when(userProfileService.getUserProfileById(1L)).thenReturn(userProfile);
        
        mockMvc.perform(get("/api/user-profiles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nickname").value("john_doe"))
                .andExpect(jsonPath("$.phoneNumber").value("555-1234"));
    }
    
    @Test
    void testGetAllUserProfiles() throws Exception {
        when(userProfileService.getAllUserProfiles()).thenReturn(java.util.Arrays.asList(userProfile));
        
        mockMvc.perform(get("/api/user-profiles"))
                .andExpect(status().isOk());
    }
    
    @Test
    void testUpdateUserProfile() throws Exception {
        when(userProfileService.updateUserProfile(eq(1L), anyString(), anyString(), anyString()))
                .thenReturn(userProfile);
        
        mockMvc.perform(put("/api/user-profiles/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userProfile)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nickname").value("john_doe"));
    }
    
    @Test
    void testDeleteUserProfile() throws Exception {
        mockMvc.perform(delete("/api/user-profiles/1"))
                .andExpect(status().isOk());
        
        verify(userProfileService, times(1)).deleteUserProfile(1L);
    }
}
