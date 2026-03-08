package com.ecommerce.service;

import com.ecommerce.entity.UserProfile;
import com.ecommerce.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserProfileService {
    
    @Autowired
    private UserProfileRepository userProfileRepository;
    
    // Basic CRUD operations
    public UserProfile createUserProfile(String nickname, String phoneNumber, String bio) {
        UserProfile userProfile = new UserProfile(nickname, phoneNumber, bio);
        return userProfileRepository.save(userProfile);
    }
    
    public UserProfile getUserProfileById(Long id) {
        return userProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User profile not found with id: " + id));
    }
    
    public List<UserProfile> getAllUserProfiles() {
        return userProfileRepository.findAll();
    }
    
    public UserProfile updateUserProfile(Long id, String nickname, String phoneNumber, String bio) {
        return userProfileRepository.findById(id).map(userProfile -> {
            userProfile.setNickname(nickname);
            userProfile.setPhoneNumber(phoneNumber);
            userProfile.setBio(bio);
            return userProfileRepository.save(userProfile);
        }).orElseThrow(() -> new RuntimeException("User profile not found with id: " + id));
    }
    
    public void deleteUserProfile(Long id) {
        userProfileRepository.deleteById(id);
    }
    
    // Required Query Methods
    /**
     * Find a profile by nickname.
     */
    public Optional<UserProfile> getUserProfileByNickname(String nickname) {
        return userProfileRepository.findByNickname(nickname);
    }
    
    /**
     * Search for profiles by a partial phone number.
     */
    public List<UserProfile> searchProfilesByPhoneNumber(String phonePartial) {
        return userProfileRepository.findByPhoneNumberContaining(phonePartial);
    }
    
    // Optional / Advanced Query Methods
    /**
     * Find profiles where bio is not null.
     */
    public List<UserProfile> getProfilesWithBio() {
        return userProfileRepository.findProfilesWithBio();
    }
    
    /**
     * Find profiles by nickname starting with a prefix.
     */
    public List<UserProfile> getProfilesByNicknamePrefix(String prefix) {
        return userProfileRepository.findByNicknameStartingWithIgnoreCase(prefix);
    }
    
    /**
     * Count profiles with a specific phone number prefix.
     */
    public long countProfilesByPhoneNumberPrefix(String prefix) {
        return userProfileRepository.countByPhoneNumberPrefix(prefix);
    }
}
