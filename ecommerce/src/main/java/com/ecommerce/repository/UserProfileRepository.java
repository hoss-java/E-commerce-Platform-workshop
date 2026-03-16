package com.ecommerce.repository;

import com.ecommerce.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    
    // Required Queries
    /**
     * Find a profile by nickname.
     */
    Optional<UserProfile> findByNickname(String nickname);
    
    /**
     * Search for profiles by a partial phone number.
     */
    @Query("SELECT up FROM UserProfile up WHERE up.phoneNumber LIKE CONCAT('%', :phonePartial, '%')")
    List<UserProfile> findByPhoneNumberContaining(@Param("phonePartial") String phonePartial);
    
    // Optional / Advanced Queries
    /**
     * Find profiles where bio is not null.
     */
    @Query("SELECT up FROM UserProfile up WHERE up.bio IS NOT NULL")
    List<UserProfile> findProfilesWithBio();
    
    /**
     * Find profiles by nickname starting with a prefix.
     */
    List<UserProfile> findByNicknameStartingWithIgnoreCase(String prefix);
    
    /**
     * Count profiles with a specific phone number prefix.
     */
    @Query("SELECT COUNT(up) FROM UserProfile up WHERE up.phoneNumber LIKE CONCAT(:prefix, '%')")
    long countByPhoneNumberPrefix(@Param("prefix") String prefix);
}
