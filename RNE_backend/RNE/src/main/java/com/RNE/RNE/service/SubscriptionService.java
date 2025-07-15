package com.RNE.RNE.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.RNE.RNE.model.*;
import com.RNE.RNE.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.math.BigDecimal;
import java.time.LocalDate;
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
    @Autowired
    private UsageService usageService;
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
    
        BigDecimal costPerRequest = api.getRequest_cost();
        Wallet wallet = walletService.getWalletByUser(user); 
        BigDecimal totalCost = costPerRequest.multiply(BigDecimal.valueOf(allowedRequests));
        BigDecimal costPendingRequests=this.getCostOfPendingSubscriptionsByUser(userId);
        if (wallet.getBalance().compareTo(totalCost) < 0) {
            throw new RuntimeException("Insufficient balance to subscribe to this API.");
        }
        else if(costPendingRequests.add(totalCost).compareTo(wallet.getBalance()) > 0) {
            throw new RuntimeException("Insufficient balance to subscribe to this API. Pending requests cost: " + costPendingRequests);
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
        List<Subscription> subscriptions = subscriptionRepository.findByUserId(userId);
        for (Subscription subscription : subscriptions) {
            if(SubscriptionStatus.APPROVED.equals(subscription.getStatus())) {
                int actualUsedRequests = usageService.getUsedRequestsForSubscription(subscription);
                subscription.setUsedRequests(actualUsedRequests);
                if(actualUsedRequests >= subscription.getAllowedRequests()) {
                    subscription.setStatus(SubscriptionStatus.EXPIRED);
                    subscription.setExpirationDate(LocalDateTime.now());
                }
                    subscriptionRepository.save(subscription);
            } 
        }
        return subscriptions;
    }
    
    // Get subscriptions by status
    public List<Subscription> getSubscriptionsByStatus(SubscriptionStatus status) {
        return subscriptionRepository.findByStatus(status);
    }

    public BigDecimal getCostOfPendingSubscriptionsByUser(Long userId) {
        List<Subscription> pendingSubscriptions = subscriptionRepository.findByUserIdAndStatus(userId, SubscriptionStatus.PENDING);
        BigDecimal totalCost = BigDecimal.ZERO;
        for (Subscription subscription : pendingSubscriptions) {
           
            BigDecimal costPerRequest = subscription.getApi().getRequest_cost();
            int allowedRequests = subscription.getAllowedRequests();
            totalCost = totalCost.add((costPerRequest).multiply(BigDecimal.valueOf(allowedRequests)));
        }
        return totalCost;
    }
    public List<Subscription> getSubscriptions() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        for (Subscription subscription : subscriptions) {
            if(SubscriptionStatus.APPROVED.equals(subscription.getStatus())) {
                int actualUsedRequests = usageService.getUsedRequestsForSubscription(subscription);
                subscription.setUsedRequests(actualUsedRequests);
                    if(actualUsedRequests >= subscription.getAllowedRequests()) {
                        subscription.setStatus(SubscriptionStatus.EXPIRED);
                        subscription.setExpirationDate(LocalDateTime.now());
                    }
                    subscriptionRepository.save(subscription); 
            }
        }
        return subscriptions;
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
        BigDecimal costPerRequest = api.getRequest_cost();
        int allowedRequests = subscription.getAllowedRequests();
        BigDecimal totalCost =costPerRequest.multiply(BigDecimal.valueOf(allowedRequests));
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