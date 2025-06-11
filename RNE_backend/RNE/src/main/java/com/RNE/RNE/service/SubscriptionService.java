package com.RNE.RNE.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.RNE.RNE.model.*;
import com.RNE.RNE.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ApiRepository apiRepository;

    // Create a new subscription with default values
    @Transactional
    public Subscription createSubscription(Long userId, String apiId, Integer customRequestLimit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new RuntimeException("API not found"));

        // Check for existing pending subscription
        boolean existingPending = subscriptionRepository.existsByUserAndApiAndStatus(
                user, api, SubscriptionStatus.PENDING);
        if (existingPending) {
            throw new RuntimeException("Pending subscription already exists");
        }

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setApi(api);
        subscription.setStatus(SubscriptionStatus.PENDING);
        subscription.setRequestDate(LocalDateTime.now());
        
        // Set custom request limit if provided, otherwise use default
        if (customRequestLimit != null && customRequestLimit > 0) {
            subscription.setAllowedRequests(customRequestLimit);
        }

        return subscriptionRepository.save(subscription);
    }

    // Get all subscriptions for a user
    public List<Subscription> getUserSubscriptions(Long userId) {
        return subscriptionRepository.findByUserId(userId);
    }

    // Get subscriptions by status
    public List<Subscription> getSubscriptionsByStatus(SubscriptionStatus status) {
        return subscriptionRepository.findByStatus(status);
    }

    // Approve a subscription
    @Transactional
    public Subscription approveSubscription(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        subscription.setStatus(SubscriptionStatus.APPROVED);
        subscription.setApprovalDate(LocalDateTime.now());
        
        return subscriptionRepository.save(subscription);
    }

    // Reject a subscription
    @Transactional
    public Subscription rejectSubscription(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        subscription.setStatus(SubscriptionStatus.REJECTED);
        subscription.setApprovalDate(LocalDateTime.now());
        
        return subscriptionRepository.save(subscription);
    }

    // Increment used requests counter
    @Transactional
    public Subscription incrementUsedRequests(Long subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        if (subscription.getStatus() != SubscriptionStatus.APPROVED) {
            throw new RuntimeException("Subscription is not active");
        }
        
        if (subscription.getUsedRequests() >= subscription.getAllowedRequests()) {
            throw new RuntimeException("Request limit exceeded");
        }
        
        subscription.setUsedRequests(subscription.getUsedRequests() + 1);
        return subscriptionRepository.save(subscription);
    }

    // Update request limit for a subscription
    @Transactional
    public Subscription updateRequestLimit(Long subscriptionId, int newLimit) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        if (newLimit <= 0) {
            throw new RuntimeException("Request limit must be positive");
        }
        
        subscription.setAllowedRequests(newLimit);
        return subscriptionRepository.save(subscription);
    }

    // Get subscription by ID
    public Subscription getSubscriptionById(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
    }
}