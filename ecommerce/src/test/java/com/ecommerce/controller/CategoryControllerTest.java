package com.ecommerce.controller;

import com.ecommerce.entity.Category;
import com.ecommerce.service.CategoryService;
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

@WebMvcTest(CategoryController.class)
class CategoryControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private CategoryService categoryService;
    
    private Category category;

    @BeforeEach
    void setUp() {
        category = new Category("Electronics");
        category.setId(1L);
    }
    
    @Test
    void testGetAllCategories() throws Exception {
        when(categoryService.findAll()).thenReturn(Arrays.asList(category));
        
        mockMvc.perform(get("/categories"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Electronics"));
        
        verify(categoryService, times(1)).findAll();
    }

    @Test
    void testGetCategoryById() throws Exception {
        when(categoryService.findById(1L)).thenReturn(Optional.of(category));
        
        mockMvc.perform(get("/categories/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Electronics"));
        
        verify(categoryService, times(1)).findById(1L);
    }

    @Test
    void testGetCategoryByIdNotFound() throws Exception {
        when(categoryService.findById(999L)).thenReturn(Optional.empty());
        
        mockMvc.perform(get("/categories/999"))
                .andExpect(status().isNotFound());
        
        verify(categoryService, times(1)).findById(999L);
    }

    @Test
    void testCreateCategory() throws Exception {
        when(categoryService.save(any(Category.class))).thenReturn(category);
        
        mockMvc.perform(post("/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Electronics\"}"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Electronics"));
        
        verify(categoryService, times(1)).save(any(Category.class));
    }

    @Test
    void testUpdateCategory() throws Exception {
        when(categoryService.findById(1L)).thenReturn(Optional.of(category));
        when(categoryService.save(any(Category.class))).thenAnswer(invocation -> invocation.getArgument(0));
        
        mockMvc.perform(put("/categories/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Home Appliances\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Home Appliances"));

        verify(categoryService, times(1)).save(any(Category.class));
    }

    @Test
    void testUpdateCategoryNotFound() throws Exception {
        when(categoryService.findById(999L)).thenReturn(Optional.empty());
        
        mockMvc.perform(put("/categories/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Home Appliances\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteCategory() throws Exception {
        doNothing().when(categoryService).deleteById(1L);
        
        mockMvc.perform(delete("/categories/1"))
                .andExpect(status().isNoContent());
        
        verify(categoryService, times(1)).deleteById(1L);
    }
    
    @Test
    void testGetCategoryByName() throws Exception {
        when(categoryService.findByName("Electronics")).thenReturn(Optional.of(category));
        
        mockMvc.perform(get("/categories/name/Electronics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Electronics"));
        
        verify(categoryService, times(1)).findByName("Electronics");
    }

    @Test
    void testGetCategoryByNameNotFound() throws Exception {
        when(categoryService.findByName("NonExistent")).thenReturn(Optional.empty());
        
        mockMvc.perform(get("/categories/name/NonExistent"))
                .andExpect(status().isNotFound());
    }
}
