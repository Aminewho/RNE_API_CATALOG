package com.RNE.RNE.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Subscription state: PENDING, APPROVED, REJECTED
    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status = SubscriptionStatus.PENDING;

    // Optional: quota/limits
    private int allowedRequests = 1000;
    private int usedRequests = 0;

    // Timestamps
    private LocalDateTime requestDate = LocalDateTime.now();
    private LocalDateTime approvalDate;

    // Who?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "api_id")
    private Api api;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SubscriptionStatus getStatus() { return status; }
    public void setStatus(SubscriptionStatus status) { this.status = status; }

    public int getAllowedRequests() { return allowedRequests; }
    public void setAllowedRequests(int allowedRequests) { this.allowedRequests = allowedRequests;}

    public int getUsedRequests() { return usedRequests; }
    public void setUsedRequests(int usedRequests) { this.usedRequests = usedRequests; }

    public LocalDateTime getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDateTime requestDate) { this.requestDate = requestDate; }

    public LocalDateTime getApprovalDate() { return approvalDate; }
    public void setApprovalDate(LocalDateTime approvalDate) { this.approvalDate = approvalDate; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Api getApi() { return api; }
    public void setApi(Api api) { this.api = api; }
}

