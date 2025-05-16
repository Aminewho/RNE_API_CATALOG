/*package com.RNE.RNE.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "signup_requests")
public class ApiSignupRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String reason;

    @Column(name = "api_id")
    private String apiId;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt = LocalDateTime.now();


    public enum Status {
        NEW,
        REJECTED,
        ACCEPTED
    }

    @Enumerated(EnumType.STRING)
    private Status status = Status.NEW;

    // Getters and Setters
    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getApiId() {
        return apiId;
    }

    public void setApiId(String apiId) {
        this.apiId = apiId;
    }
    
    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }
}*/