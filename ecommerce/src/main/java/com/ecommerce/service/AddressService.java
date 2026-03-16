package com.ecommerce.service;

import com.ecommerce.entity.Address;
import com.ecommerce.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddressService {
    
    @Autowired
    private AddressRepository addressRepository;
    
    // Basic CRUD operations
    public Address createAddress(Address address) {
        return addressRepository.save(address);
    }
    
    public Optional<Address> getAddressById(Long id) {
        return addressRepository.findById(id);
    }
    
    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }
    
    public Address updateAddress(Long id, Address addressDetails) {
        return addressRepository.findById(id).map(address -> {
            address.setStreet(addressDetails.getStreet());
            address.setCity(addressDetails.getCity());
            address.setZipCode(addressDetails.getZipCode());
            return addressRepository.save(address);
        }).orElseThrow(() -> new RuntimeException("Address not found with id: " + id));
    }
    
    public void deleteAddress(Long id) {
        addressRepository.deleteById(id);
    }
    
    // Required Query Methods
    /**
     * Find all addresses in a specific zip code area.
     */
    public List<Address> getAddressesByZipCode(String zipCode) {
        return addressRepository.findByZipCode(zipCode);
    }
    
    // Optional / Advanced Query Methods
    /**
     * Find all addresses in a specific city.
     */
    public List<Address> getAddressesByCity(String city) {
        return addressRepository.findByCity(city);
    }
    
    /**
     * Find addresses by street name.
     */
    public List<Address> getAddressesByStreet(String street) {
        return addressRepository.findByStreet(street);
    }
    
    /**
     * Count how many addresses exist in a given zip code.
     */
    public long countAddressesByZipCode(String zipCode) {
        return addressRepository.countByZipCode(zipCode);
    }
    
    /**
     * Find addresses where zip code starts with a prefix.
     */
    public List<Address> getAddressesByZipCodePrefix(String prefix) {
        return addressRepository.findByZipCodeStartingWith(prefix);
    }

    public Address findById(Integer id) {
        return addressRepository.findById((long) id).orElse(null);
    }
}
