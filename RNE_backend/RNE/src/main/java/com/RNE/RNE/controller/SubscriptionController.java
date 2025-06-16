package com.RNE.RNE.controller;

import com.RNE.RNE.config.JwtAuthenticationFilter;
import com.RNE.RNE.dto.SubscriptionDTO;
import com.RNE.RNE.dto.SubscriptionMapper;
import com.RNE.RNE.model.Subscription;
import com.RNE.RNE.model.SubscriptionStatus;
import com.RNE.RNE.model.User;
import com.RNE.RNE.repository.UserRepository;
import com.RNE.RNE.service.SubscriptionService;

import org.springframework.security.core.Authentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionController.class);

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private UserRepository userRepository;

    // Helper method to get user from authenticated principal
    private User getUserFromAuthentication(Authentication authentication) {
        String username = authentication.getName(); // from JWT
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<?> createSubscription(
            Authentication authentication,
            @RequestBody SubscriptionRequest request) {
        try {
            User user = getUserFromAuthentication(authentication);
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
    public ResponseEntity<List<SubscriptionDTO>> getUserSubscriptions(Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        List<Subscription> subscriptions = subscriptionService.getUserSubscriptions(user.getId());

        List<SubscriptionDTO> dtoList = subscriptions.stream()
            .map(SubscriptionMapper::toDto)
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @PutMapping("/{id}/limit")
    public ResponseEntity<?> updateRequestLimit(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request,
            Authentication authentication) {
        try {
            int newLimit = request.get("limit");
            User currentUser = getUserFromAuthentication(authentication);
            Subscription subscription = subscriptionService.getSubscriptionById(id);

            if (!subscription.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(subscriptionService.updateRequestLimit(id, newLimit));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /*@GetMapping("/{id}")
    public ResponseEntity<?> getSubscription(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            Subscription subscription = subscriptionService.getSubscriptionById(id);
            User currentUser = getUserFromAuthentication(authentication);

            if (!subscription.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(subscription);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }*/

    public static class SubscriptionRequest {
        private String apiId;
        private Integer allowedRequests;
        public String getApiId() { return apiId; }
        public void setApiId(String apiId) { this.apiId = apiId; }
        public Integer getAllowedRequests() { return allowedRequests; }
        public void setAllowedRequests(Integer allowedRequests) { 
            this.allowedRequests = allowedRequests; 
        }
    }
}
