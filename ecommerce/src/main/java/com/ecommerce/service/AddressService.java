package com.ecommerce.service;

import com.ecommerce.entity.Address;
import com.ecommerce.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AddressService {
    
    @Autowired
    private AddressRepository addressRepository;
    
    // Create/Save
    public Address createAddress(String street, String city, String zipCode) {
        Address address = new Address(street, city, zipCode);
        return addressRepository.save(address);  // Saves to database
    }
    
    // Read
    public Address getAddressById(Long id) {
        return addressRepository.findById(id).orElse(null);  // Gets from database
    }
    
    // Read all
    public List<Address> getAllAddresses() {
        return addressRepository.findAll();  // Gets all from database
    }
    
    // Update
    public Address updateAddress(Long id, String street, String city, String zipCode) {
        Address address = addressRepository.findById(id).orElse(null);
        if (address != null) {
            address.setStreet(street);
            address.setCity(city);
            address.setZipCode(zipCode);
            return addressRepository.save(address);  // Updates in database
        }
        return null;
    }
    
    // Delete
    public void deleteAddress(Long id) {
        addressRepository.deleteById(id);  // Deletes from database
    }
}
