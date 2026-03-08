package com.ecommerce.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.ecommerce.model.HelloResponse;

@RestController
public class HelloController {
    
    @GetMapping("/hello")
    public HelloResponse hello() {
        return new HelloResponse("Hello from Spring Boot E-Commerce API!", 200);
    }
}
