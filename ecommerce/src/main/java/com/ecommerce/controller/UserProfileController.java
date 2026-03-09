package com.ecommerce.controller;

import com.ecommerce.entity.UserProfile;
import com.ecommerce.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user-profiles")
public class UserProfileController {
    
    @Autowired
    private UserProfileService userProfileService;
    
    // Basic CRUD Operations
    @PostMapping
    public ResponseEntity<UserProfile> createUserProfile(@RequestBody UserProfile userProfile) {
        UserProfile createdProfile = userProfileService.createUserProfile(
                userProfile.getNickname(),
                userProfile.getPhoneNumber(),
                userProfile.getBio()
        );
        return new ResponseEntity<>(createdProfile, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<UserProfile>> getAllUserProfiles() {
        List<UserProfile> profiles = userProfileService.getAllUserProfiles();
        return new ResponseEntity<>(profiles, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getUserProfileById(@PathVariable Long id) {
        try {
            UserProfile profile = userProfileService.getUserProfileById(id);
            return new ResponseEntity<>(profile, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserProfile> updateUserProfile(
            @PathVariable Long id,
            @RequestBody UserProfile userProfile) {
        try {
            UserProfile updatedProfile = userProfileService.updateUserProfile(
                    id,
                    userProfile.getNickname(),
                    userProfile.getPhoneNumber(),
                    userProfile.getBio()
            );
            return new ResponseEntity<>(updatedProfile, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserProfile(@PathVariable Long id) {
        userProfileService.deleteUserProfile(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    // Required Query Endpoints
    /**
     * Find a profile by nickname.
     * GET /api/user-profiles/nickname/{nickname}
     */
    @GetMapping("/nickname/{nickname}")
    public ResponseEntity<UserProfile> getUserProfileByNickname(@PathVariable String nickname) {
        Optional<UserProfile> profile = userProfileService.getUserProfileByNickname(nickname);
        return profile.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    /**
     * Search for profiles by a partial phone number.
     * GET /api/user-profiles/search/phone?phonePartial=555
     */
    @GetMapping("/search/phone")
    public ResponseEntity<List<UserProfile>> searchProfilesByPhoneNumber(@RequestParam String phonePartial) {
        List<UserProfile> profiles = userProfileService.searchProfilesByPhoneNumber(phonePartial);
        if (profiles.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(profiles, HttpStatus.OK);
    }
    
    // Optional / Advanced Query Endpoints
    /**
     * Find profiles where bio is not null.
     * GET /api/user-profiles/with-bio
     */
    @GetMapping("/with-bio")
    public ResponseEntity<List<UserProfile>> getProfilesWithBio() {
        List<UserProfile> profiles = userProfileService.getProfilesWithBio();
        if (profiles.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(profiles, HttpStatus.OK);
    }
    
    /**
     * Find profiles by nickname starting with a prefix.
     * GET /api/user-profiles/nickname-prefix/{prefix}
     */
    @GetMapping("/nickname-prefix/{prefix}")
    public ResponseEntity<List<UserProfile>> getProfilesByNicknamePrefix(@PathVariable String prefix) {
        List<UserProfile> profiles = userProfileService.getProfilesByNicknamePrefix(prefix);
        if (profiles.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(profiles, HttpStatus.OK);
    }
    
    /**
     * Count profiles with a specific phone number prefix.
     * GET /api/user-profiles/count/phone-prefix/{prefix}
     */
    @GetMapping("/count/phone-prefix/{prefix}")
    public ResponseEntity<Long> countProfilesByPhoneNumberPrefix(@PathVariable String prefix) {
        long count = userProfileService.countProfilesByPhoneNumberPrefix(prefix);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
}
