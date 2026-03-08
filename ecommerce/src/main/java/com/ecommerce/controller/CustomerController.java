package com.ecommerce.controller;

import com.ecommerce.entity.Customer;
import com.ecommerce.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    
    @Autowired
    private CustomerService customerService;
    
    // Basic CRUD Operations
    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        Customer createdCustomer = customerService.createCustomer(customer);
        return new ResponseEntity<>(createdCustomer, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        Optional<Customer> customer = customerService.getCustomerById(id);
        return customer.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customerDetails) {
        try {
            Customer updatedCustomer = customerService.updateCustomer(id, customerDetails);
            return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    // Required Query Endpoints
    /**
     * Find a customer by their unique email.
     * GET /api/customers/email/{email}
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<Customer> getCustomerByEmail(@PathVariable String email) {
        Optional<Customer> customer = customerService.getCustomerByEmail(email);
        return customer.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    /**
     * Find customers by last name (case-insensitive).
     * GET /api/customers/last-name/{lastName}
     */
    @GetMapping("/last-name/{lastName}")
    public ResponseEntity<List<Customer>> getCustomersByLastName(@PathVariable String lastName) {
        List<Customer> customers = customerService.getCustomersByLastName(lastName);
        if (customers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }
    
    /**
     * Find customers living in a specific city.
     * GET /api/customers/city/{city}
     */
    @GetMapping("/city/{city}")
    public ResponseEntity<List<Customer>> getCustomersByCity(@PathVariable String city) {
        List<Customer> customers = customerService.getCustomersByCity(city);
        if (customers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }
    
    // Optional / Advanced Query Endpoints
    /**
     * Find customers whose email contains a given keyword.
     * GET /api/customers/search/email?keyword=example
     */
    @GetMapping("/search/email")
    public ResponseEntity<List<Customer>> searchCustomersByEmail(@RequestParam String keyword) {
        List<Customer> customers = customerService.searchCustomersByEmail(keyword);
        if (customers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }
    
    /**
     * Find customers created after a specific date.
     * GET /api/customers/created-after?date=2024-01-01T00:00:00
     */
    @GetMapping("/created-after")
    public ResponseEntity<List<Customer>> getCustomersCreatedAfter(@RequestParam LocalDateTime date) {
        List<Customer> customers = customerService.getCustomersCreatedAfter(date);
        if (customers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }
    
    /**
     * Find customers created between two dates.
     * GET /api/customers/created-between?startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59
     */
    @GetMapping("/created-between")
    public ResponseEntity<List<Customer>> getCustomersCreatedBetween(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<Customer> customers = customerService.getCustomersCreatedBetween(startDate, endDate);
        if (customers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }
    
    /**
     * Count how many customers live in a specific city.
     * GET /api/customers/count/city/{city}
     */
    @GetMapping("/count/city/{city}")
    public ResponseEntity<Long> countCustomersByCity(@PathVariable String city) {
        long count = customerService.countCustomersByCity(city);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    /**
     * Check if a customer exists by email.
     * GET /api/customers/exists/{email}
     */
    @GetMapping("/exists/{email}")
    public ResponseEntity<Boolean> customerExistsByEmail(@PathVariable String email) {
        boolean exists = customerService.customerExistsByEmail(email);
        return new ResponseEntity<>(exists, HttpStatus.OK);
    }
}
