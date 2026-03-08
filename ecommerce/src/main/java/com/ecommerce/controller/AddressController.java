package com.ecommerce.controller;

import com.ecommerce.entity.Address;
import com.ecommerce.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {
    
    @Autowired
    private AddressService addressService;
    
    // Basic CRUD Operations
    @PostMapping
    public ResponseEntity<Address> createAddress(@RequestBody Address address) {
        Address createdAddress = addressService.createAddress(address);
        return new ResponseEntity<>(createdAddress, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<Address>> getAllAddresses() {
        List<Address> addresses = addressService.getAllAddresses();
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddressById(@PathVariable Long id) {
        Optional<Address> address = addressService.getAddressById(id);
        return address.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable Long id, @RequestBody Address addressDetails) {
        try {
            Address updatedAddress = addressService.updateAddress(id, addressDetails);
            return new ResponseEntity<>(updatedAddress, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    // Required Query Endpoints
    /**
     * Find all addresses in a specific zip code area.
     * GET /api/addresses/zip-code/{zipCode}
     */
    @GetMapping("/zip-code/{zipCode}")
    public ResponseEntity<List<Address>> getAddressesByZipCode(@PathVariable String zipCode) {
        List<Address> addresses = addressService.getAddressesByZipCode(zipCode);
        if (addresses.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }
    
    // Optional / Advanced Query Endpoints
    /**
     * Find all addresses in a specific city.
     * GET /api/addresses/city/{city}
     */
    @GetMapping("/city/{city}")
    public ResponseEntity<List<Address>> getAddressesByCity(@PathVariable String city) {
        List<Address> addresses = addressService.getAddressesByCity(city);
        if (addresses.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }
    
    /**
     * Find addresses by street name.
     * GET /api/addresses/street/{street}
     */
    @GetMapping("/street/{street}")
    public ResponseEntity<List<Address>> getAddressesByStreet(@PathVariable String street) {
        List<Address> addresses = addressService.getAddressesByStreet(street);
        if (addresses.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }
    
    /**
     * Count how many addresses exist in a given zip code.
     * GET /api/addresses/count/zip-code/{zipCode}
     */
    @GetMapping("/count/zip-code/{zipCode}")
    public ResponseEntity<Long> countAddressesByZipCode(@PathVariable String zipCode) {
        long count = addressService.countAddressesByZipCode(zipCode);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    /**
     * Find addresses where zip code starts with a prefix.
     * GET /api/addresses/zip-code-prefix/{prefix}
     */
    @GetMapping("/zip-code-prefix/{prefix}")
    public ResponseEntity<List<Address>> getAddressesByZipCodePrefix(@PathVariable String prefix) {
        List<Address> addresses = addressService.getAddressesByZipCodePrefix(prefix);
        if (addresses.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }
}
