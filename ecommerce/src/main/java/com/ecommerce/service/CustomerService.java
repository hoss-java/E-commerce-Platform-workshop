package com.ecommerce.service;

import com.ecommerce.entity.Customer;
import com.ecommerce.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    // Basic CRUD operations
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }
    
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }
    
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    
    public Customer updateCustomer(Long id, Customer customerDetails) {
        return customerRepository.findById(id).map(customer -> {
            customer.setFirstName(customerDetails.getFirstName());
            customer.setLastName(customerDetails.getLastName());
            customer.setEmail(customerDetails.getEmail());
            customer.setAddress(customerDetails.getAddress());
            customer.setUserProfile(customerDetails.getUserProfile());
            return customerRepository.save(customer);
        }).orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }
    
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
    
    // Required Query Methods
    /**
     * Find a customer by their unique email.
     */
    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }
    
    /**
     * Find customers by last name (case-insensitive).
     */
    public List<Customer> getCustomersByLastName(String lastName) {
        return customerRepository.findByLastNameIgnoreCase(lastName);
    }
    
    /**
     * Find customers living in a specific city.
     */
    public List<Customer> getCustomersByCity(String city) {
        return customerRepository.findCustomersByCity(city);
    }
    
    // Optional / Advanced Query Methods
    /**
     * Find customers whose email contains a given keyword.
     */
    public List<Customer> searchCustomersByEmail(String keyword) {
        return customerRepository.findByEmailContainingIgnoreCase(keyword);
    }
    
    /**
     * Find customers created after a specific date.
     */
    public List<Customer> getCustomersCreatedAfter(LocalDateTime date) {
        return customerRepository.findByCreatedAtAfter(date);
    }
    
    /**
     * Find customers created between two dates.
     */
    public List<Customer> getCustomersCreatedBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return customerRepository.findByCreatedAtBetween(startDate, endDate);
    }
    
    /**
     * Count how many customers live in a specific city.
     */
    public long countCustomersByCity(String city) {
        return customerRepository.countCustomersByCity(city);
    }
    
    /**
     * Check if a customer exists by email.
     */
    public boolean customerExistsByEmail(String email) {
        return customerRepository.existsByEmail(email);
    }
}
