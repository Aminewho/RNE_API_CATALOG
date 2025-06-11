
package com.RNE.RNE.repository;

import com.RNE.RNE.model.Subscription;
import com.RNE.RNE.model.SubscriptionStatus;
import com.RNE.RNE.model.User;
import com.RNE.RNE.model.Api;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    // Existing methods
    List<Subscription> findByStatus(SubscriptionStatus status);
    List<Subscription> findByUserId(Long userId);
    List<Subscription> findByApiId(String apiId);
    List<Subscription> findByUserIdAndStatus(Long userId, SubscriptionStatus status);

    // New methods for enhanced functionality
    boolean existsByUserAndApiAndStatus(User user, Api api, SubscriptionStatus status);
    
    boolean existsByUserAndApiAndStatusIn(User user, Api api, List<SubscriptionStatus> statuses);
    
    List<Subscription> findByUserAndApi(User user, Api api);
    
    List<Subscription> findByUserAndStatusIn(User user, List<SubscriptionStatus> statuses);
    
    List<Subscription> findByApiAndStatusIn(Api api, List<SubscriptionStatus> statuses);
    
    int countByUserAndStatus(User user, SubscriptionStatus status);
    
    int countByApiAndStatus(Api api, SubscriptionStatus status);
}