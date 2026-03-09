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

import java.util.Arrays;
import java.util.Optional;

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
    
    // CREATE TESTS
    @Test
    void testCreateUserProfile() throws Exception {
        when(userProfileService.createUserProfile(anyString(), anyString(), anyString()))
                .thenReturn(userProfile);
        
        mockMvc.perform(post("/api/user-profiles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userProfile)))
                .andExpect(status().isCreated()) // FIXED: Changed from isOk() to isCreated()
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nickname").value("john_doe"))
                .andExpect(jsonPath("$.phoneNumber").value("555-1234"))
                .andExpect(jsonPath("$.bio").value("I love ecommerce!"));
        
        verify(userProfileService, times(1)).createUserProfile(anyString(), anyString(), anyString());
    }
    
    // READ TESTS
    @Test
    void testGetUserProfileById() throws Exception {
        when(userProfileService.getUserProfileById(1L)).thenReturn(userProfile);
        
        mockMvc.perform(get("/api/user-profiles/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nickname").value("john_doe"))
                .andExpect(jsonPath("$.phoneNumber").value("555-1234"))
                .andExpect(jsonPath("$.bio").value("I love ecommerce!"));
        
        verify(userProfileService, times(1)).getUserProfileById(1L);
    }
    
    @Test
    void testGetUserProfileByIdNotFound() throws Exception {
        when(userProfileService.getUserProfileById(999L))
                .thenThrow(new RuntimeException("User profile not found"));
        
        mockMvc.perform(get("/api/user-profiles/999"))
                .andExpect(status().isNotFound());
    }
    
    @Test
    void testGetAllUserProfiles() throws Exception {
        when(userProfileService.getAllUserProfiles())
                .thenReturn(Arrays.asList(userProfile));
        
        mockMvc.perform(get("/api/user-profiles"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].nickname").value("john_doe"))
                .andExpect(jsonPath("$[0].phoneNumber").value("555-1234"));
        
        verify(userProfileService, times(1)).getAllUserProfiles();
    }
    
    @Test
    void testGetUserProfileByNickname() throws Exception {
        when(userProfileService.getUserProfileByNickname("john_doe"))
                .thenReturn(Optional.of(userProfile));
        
        mockMvc.perform(get("/api/user-profiles/nickname/john_doe"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.nickname").value("john_doe"));
        
        verify(userProfileService, times(1)).getUserProfileByNickname("john_doe");
    }
    
    @Test
    void testGetUserProfileByNicknameNotFound() throws Exception {
        when(userProfileService.getUserProfileByNickname("nonexistent"))
                .thenReturn(Optional.empty());
        
        mockMvc.perform(get("/api/user-profiles/nickname/nonexistent"))
                .andExpect(status().isNotFound());
    }
    
    @Test
    void testSearchProfilesByPhoneNumber() throws Exception {
        when(userProfileService.searchProfilesByPhoneNumber("555"))
                .thenReturn(Arrays.asList(userProfile));
        
        mockMvc.perform(get("/api/user-profiles/search/phone")
                .param("phonePartial", "555"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].phoneNumber").value("555-1234"));
        
        verify(userProfileService, times(1)).searchProfilesByPhoneNumber("555");
    }
    
    @Test
    void testSearchProfilesByPhoneNumberNotFound() throws Exception {
        when(userProfileService.searchProfilesByPhoneNumber("999"))
                .thenReturn(Arrays.asList());
        
        mockMvc.perform(get("/api/user-profiles/search/phone")
                .param("phonePartial", "999"))
                .andExpect(status().isNotFound());
    }
    
    @Test
    void testGetProfilesWithBio() throws Exception {
        when(userProfileService.getProfilesWithBio())
                .thenReturn(Arrays.asList(userProfile));
        
        mockMvc.perform(get("/api/user-profiles/with-bio"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].bio").value("I love ecommerce!"));
        
        verify(userProfileService, times(1)).getProfilesWithBio();
    }
    
    @Test
    void testGetProfilesWithBioNotFound() throws Exception {
        when(userProfileService.getProfilesWithBio())
                .thenReturn(Arrays.asList());
        
        mockMvc.perform(get("/api/user-profiles/with-bio"))
                .andExpect(status().isNotFound());
    }
    
    @Test
    void testGetProfilesByNicknamePrefix() throws Exception {
        when(userProfileService.getProfilesByNicknamePrefix("john"))
                .thenReturn(Arrays.asList(userProfile));
        
        mockMvc.perform(get("/api/user-profiles/nickname-prefix/john"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].nickname").value("john_doe"));
        
        verify(userProfileService, times(1)).getProfilesByNicknamePrefix("john");
    }
    
    @Test
    void testGetProfilesByNicknamePrefixNotFound() throws Exception {
        when(userProfileService.getProfilesByNicknamePrefix("xyz"))
                .thenReturn(Arrays.asList());
        
        mockMvc.perform(get("/api/user-profiles/nickname-prefix/xyz"))
                .andExpect(status().isNotFound());
    }
    
    @Test
    void testCountProfilesByPhoneNumberPrefix() throws Exception {
        when(userProfileService.countProfilesByPhoneNumberPrefix("555"))
                .thenReturn(1L);
        
        mockMvc.perform(get("/api/user-profiles/count/phone-prefix/555"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").value(1));
        
        verify(userProfileService, times(1)).countProfilesByPhoneNumberPrefix("555");
    }
    
    // UPDATE TESTS
    @Test
    void testUpdateUserProfile() throws Exception {
        UserProfile updatedProfile = new UserProfile("jane_doe", "555-5678", "Updated bio");
        updatedProfile.setId(1L);
        
        when(userProfileService.updateUserProfile(eq(1L), anyString(), anyString(), anyString()))
                .thenReturn(updatedProfile);
        
        mockMvc.perform(put("/api/user-profiles/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedProfile)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nickname").value("jane_doe"))
                .andExpect(jsonPath("$.phoneNumber").value("555-5678"))
                .andExpect(jsonPath("$.bio").value("Updated bio"));
        
        verify(userProfileService, times(1)).updateUserProfile(eq(1L), anyString(), anyString(), anyString());
    }
    
    @Test
    void testUpdateUserProfileNotFound() throws Exception {
        UserProfile updatedProfile = new UserProfile("jane_doe", "555-5678", "Updated bio");
        
        when(userProfileService.updateUserProfile(eq(999L), anyString(), anyString(), anyString()))
                .thenThrow(new RuntimeException("User profile not found"));
        
        mockMvc.perform(put("/api/user-profiles/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedProfile)))
                .andExpect(status().isNotFound());
    }
    
    // DELETE TESTS
    @Test
    void testDeleteUserProfile() throws Exception {
        doNothing().when(userProfileService).deleteUserProfile(1L);
        
        mockMvc.perform(delete("/api/user-profiles/1"))
                .andExpect(status().isNoContent()); // FIXED: Changed from isOk() to isNoContent()
        
        verify(userProfileService, times(1)).deleteUserProfile(1L);
    }
}
