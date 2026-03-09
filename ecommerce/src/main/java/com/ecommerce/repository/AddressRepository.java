package com.ecommerce.repository;

import com.ecommerce.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    
    // Required Queries
    /**
     * Find all addresses in a specific zip code area.
     */
    List<Address> findByZipCode(String zipCode);
    
    // Optional / Advanced Queries
    /**
     * Find all addresses in a specific city.
     */
    List<Address> findByCity(String city);
    
    /**
     * Find addresses by street name.
     */
    List<Address> findByStreet(String street);
    
    /**
     * Count how many addresses exist in a given zip code.
     */
    @Query("SELECT COUNT(a) FROM Address a WHERE a.zipCode = :zipCode")
    long countByZipCode(@Param("zipCode") String zipCode);
    
    /**
     * Find addresses where zip code starts with a prefix.
     */
    @Query("SELECT a FROM Address a WHERE a.zipCode LIKE CONCAT(:prefix, '%')")
    List<Address> findByZipCodeStartingWith(@Param("prefix") String prefix);
}
