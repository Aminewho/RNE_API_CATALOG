package com.RNE.RNE.dto;

import java.time.LocalDateTime;



public class SubscriptionDTO {
    private Long id ;
    private int allowedRequests ;
    private int usedRequests ;   
    private String status ; // Assuming SubscriptionStatus is a String for simplicity
    private LocalDateTime requestDate ;
    private LocalDateTime approvalDate;
    private String api;
    private String username; // Assuming user is represented as a String for simplicity
    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public int getAllowedRequests() {
        return allowedRequests;
    }

    public void setAllowedRequests(int allowedRequests) {
        this.allowedRequests = allowedRequests;
    }

    public int getUsedRequests() {
        return usedRequests;
    }

    public void setUsedRequests(int usedRequests) {
        this.usedRequests = usedRequests;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public LocalDateTime getApprovalDate() {
        return approvalDate;
    }

    public void setApprovalDate(LocalDateTime approvalDate) {
        this.approvalDate = approvalDate;
    }

    public String getApi() {
        return api;
    }

    public void setApi(String api) {
        this.api = api;
    }
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}