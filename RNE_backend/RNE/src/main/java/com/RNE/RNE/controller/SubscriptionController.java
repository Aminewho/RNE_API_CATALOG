package com.RNE.RNE.controller;

import com.RNE.RNE.model.Subscription;
import com.RNE.RNE.model.SubscriptionStatus;
import com.RNE.RNE.model.User;
import com.RNE.RNE.repository.UserRepository;
import com.RNE.RNE.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private UserRepository userRepository;

    // Helper method to get user by username
    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<?> createSubscription(
            @RequestParam String username,
            @RequestBody SubscriptionRequest request) {
        try {
            User user = getUserByUsername(username);
            Subscription subscription = subscriptionService.createSubscription(
                user.getId(), 
                request.getApiId(), 
                request.getAllowedRequests()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(subscription);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage(),
                "timestamp", LocalDateTime.now()
            ));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<Subscription>> getUserSubscriptions(
            @RequestParam String username) {
        User user = getUserByUsername(username);
        return ResponseEntity.ok(subscriptionService.getUserSubscriptions(user.getId()));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Subscription>> getPendingSubscriptions() {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByStatus(SubscriptionStatus.PENDING));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveSubscription(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(subscriptionService.approveSubscription(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectSubscription(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(subscriptionService.rejectSubscription(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/limit")
    public ResponseEntity<?> updateRequestLimit(
            @PathVariable Long id,
            @RequestParam String username,
            @RequestBody Map<String, Integer> request) {
        try {
            int newLimit = request.get("limit");
            User currentUser = getUserByUsername(username);
            Subscription subscription = subscriptionService.getSubscriptionById(id);
            
            // Check if current user is owner
            if (!subscription.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(
                subscriptionService.updateRequestLimit(id, newLimit)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSubscription(
            @PathVariable Long id,
            @RequestParam String username) {
        try {
            Subscription subscription = subscriptionService.getSubscriptionById(id);
            User currentUser = getUserByUsername(username);
            
            // Verify ownership
            if (!subscription.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            return ResponseEntity.ok(subscription);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }

    public static class SubscriptionRequest {
        private String apiId;
        private Integer allowedRequests;

        // Getters and setters
        public String getApiId() { return apiId; }
        public void setApiId(String apiId) { this.apiId = apiId; }
        public Integer getAllowedRequests() { return allowedRequests; }
        public void setAllowedRequests(Integer allowedRequests) { 
            this.allowedRequests = allowedRequests; 
        }
    }
}