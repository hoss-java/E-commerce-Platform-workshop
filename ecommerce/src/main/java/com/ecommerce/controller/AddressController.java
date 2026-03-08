package com.ecommerce.controller;

import com.ecommerce.entity.Address;
import com.ecommerce.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {
    
    @Autowired
    private AddressService addressService;
    
    @PostMapping
    public Address createAddress(@RequestBody Address address) {
        return addressService.createAddress(address.getStreet(), 
                                           address.getCity(), 
                                           address.getZipCode());
    }
    
    @GetMapping("/{id}")
    public Address getAddressById(@PathVariable Long id) {
        return addressService.getAddressById(id);
    }
    
    @GetMapping
    public List<Address> getAllAddresses() {
        return addressService.getAllAddresses();
    }
    
    @PutMapping("/{id}")
    public Address updateAddress(@PathVariable Long id, @RequestBody Address address) {
        return addressService.updateAddress(id, address.getStreet(), 
                                           address.getCity(), 
                                           address.getZipCode());
    }
    
    @DeleteMapping("/{id}")
    public void deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
    }
}
