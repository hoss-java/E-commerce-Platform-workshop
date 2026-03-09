package com.ecommerce.repository;

import com.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    // Required Queries
    /**
     * Find a customer by their unique email.
     */
    Optional<Customer> findByEmail(String email);
    
    /**
     * Find customers by last name (case-insensitive).
     */
    List<Customer> findByLastNameIgnoreCase(String lastName);
    
    /**
     * Find customers living in a specific city.
     */
    @Query("SELECT c FROM Customer c WHERE c.address.city = :city")
    List<Customer> findCustomersByCity(@Param("city") String city);
    
    // Optional / Advanced Queries
    /**
     * Find customers whose email contains a given keyword.
     */
    @Query("SELECT c FROM Customer c WHERE LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Customer> findByEmailContainingIgnoreCase(@Param("keyword") String keyword);
    
    /**
     * Find customers created after a specific date.
     */
    List<Customer> findByCreatedAtAfter(LocalDateTime date);
    
    /**
     * Find customers created between two dates.
     */
    @Query("SELECT c FROM Customer c WHERE c.createdAt BETWEEN :startDate AND :endDate")
    List<Customer> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    /**
     * Count how many customers live in a specific city.
     */
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.address.city = :city")
    long countCustomersByCity(@Param("city") String city);
    
    /**
     * Check if a customer exists by email.
     */
    boolean existsByEmail(String email);
}
