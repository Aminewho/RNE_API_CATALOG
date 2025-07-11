package com.RNE.RNE.service;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.RNE.RNE.model.Subscription;
import com.RNE.RNE.repository.SubscriptionRepository;

@Service
public class UsageSyncService {

    private final SubscriptionRepository subscriptionRepository;
    private final UsageService usageService;

    public UsageSyncService(SubscriptionRepository subscriptionRepository,
                            UsageService usageService) {
        this.subscriptionRepository = subscriptionRepository;
        this.usageService = usageService;
    }

    // Runs every 3 hours
    @Scheduled(fixedRate = 3 * 60 * 60 * 1000) // in milliseconds
    @Transactional
    public void updateAllUsedRequests() {
        List<Subscription> allSubscriptions = subscriptionRepository.findAll();
        for (Subscription subscription : allSubscriptions) {
            Long userId = subscription.getUser().getId();
            int actualUsed = usageService.getUsedRequestsForSubscription(userId, subscription);
            if (subscription.getUsedRequests() != actualUsed) {
                subscription.setUsedRequests(actualUsed);
                subscriptionRepository.save(subscription);
            }
        }
        System.out.println("[✓] UsedRequests updated from Kibana for all subscriptions.");
    }
}
