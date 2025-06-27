package com.RNE.RNE.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.RNE.RNE.model.*;
import com.RNE.RNE.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ApiRepository apiRepository;
    @Autowired
    private WalletService walletService;
    // Create a new subscription with default values
    @Transactional
    public Subscription createSubscription(Long userId, String apiId, Integer allowedRequests) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new RuntimeException("API not found"));
    
        // Check for existing subscription
        boolean existingPending = subscriptionRepository.existsByUserAndApiAndStatus(user, api, SubscriptionStatus.PENDING);
        boolean existingApproved = subscriptionRepository.existsByUserAndApiAndStatus(user, api, SubscriptionStatus.APPROVED);
        if (existingPending) {
            throw new RuntimeException("Pending subscription already exists");
        } else if (existingApproved) {
            throw new RuntimeException("Approved subscription already exists");
        }
    
        long costPerRequest = api.getRequest_cost();
        Wallet wallet = walletService.getWalletByUser(user); 
        BigDecimal totalCost = BigDecimal.valueOf(costPerRequest).multiply(BigDecimal.valueOf(allowedRequests));
        if (wallet.getBalance().compareTo(totalCost) < 0) {
            throw new RuntimeException("Insufficient balance to subscribe to this API.");
        }
    
        // All good — create the subscription
        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setApi(api);
        subscription.setStatus(SubscriptionStatus.PENDING);
        subscription.setRequestDate(LocalDateTime.now());
        subscription.setAllowedRequests(allowedRequests);
    
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
    public List<Subscription> getSubscriptions() {
        return subscriptionRepository.findAll();
    }

    @Transactional
    public Subscription approveSubscription(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
    
        if (subscription.getStatus() == SubscriptionStatus.APPROVED) {
            throw new RuntimeException("Subscription is already approved.");
        }
    
        User user = subscription.getUser();
        Api api = subscription.getApi();
    
        // Determine the cost: request_cost * allowed_requests
        long costPerRequest = api.getRequest_cost();
        int allowedRequests = subscription.getAllowedRequests();
        BigDecimal totalCost = BigDecimal.valueOf(costPerRequest).multiply(BigDecimal.valueOf(allowedRequests));
        // Deduct funds from the user's wallet
        walletService.deductFunds(user, totalCost, "Subscription to API: " + api.getName());
    
        // Update subscription status
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