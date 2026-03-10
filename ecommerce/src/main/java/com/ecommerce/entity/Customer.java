package com.ecommerce.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

@Entity
@Table(name = "customers")
public class Customer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private java.time.LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.EAGER)  // ← Changed from LAZY to EAGER
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;
    
    @ManyToOne(fetch = FetchType.EAGER)  // ← Changed from LAZY to EAGER
    @JoinColumn(name = "profile_id")
    private UserProfile userProfile;
    
    // Constructors
    public Customer() {
    }
    
    public Customer(String firstName, String lastName, String email, Address address, UserProfile userProfile) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.address = address;
        this.userProfile = userProfile;
        this.createdAt = java.time.LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Address getAddress() {
        return address;
    }
    
    @JsonProperty("address")
    public void setAddressId(JsonNode addressNode) {
        if (addressNode != null && addressNode.has("id")) {
            this.address = new Address();
            this.address.setId(addressNode.get("id").asLong());
        }
    }
    
    public void setAddress(Address address) {
        this.address = address;
    }
    
    public UserProfile getUserProfile() {
        return userProfile;
    }
    
    @JsonProperty("userProfile")
    public void setUserProfileId(JsonNode profileNode) {
        if (profileNode != null && profileNode.has("id")) {
            this.userProfile = new UserProfile();
            this.userProfile.setId(profileNode.get("id").asLong());
        }
    }
    
    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }
    
    @Override
    public String toString() {
        return "Customer{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", createdAt=" + createdAt +
                ", address=" + address +
                ", userProfile=" + userProfile +
                '}';
    }
}
