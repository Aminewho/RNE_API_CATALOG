package com.RNE.RNE.model;
import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "subscription_consumption")
public class Consumption {

    @Id @GeneratedValue
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    private Subscription subscription;
    private LocalDate day;        // yyyy‑MM‑dd
    private int requests;    
    
    public Consumption() {
     
    }
    // requests counted for that day
    public Consumption(Subscription sub, LocalDate today, int i) {
        this.subscription=sub;
        this.day = today;
        this.requests = i;
    }
    /* getters / setters */
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Subscription getSubscription() {
        return subscription;
    }   
    public void setSubscription(Subscription subscription) {
        this.subscription = subscription;
    }
    public LocalDate getDay() {
        return day;
    }
    public void setDay(LocalDate day) {
        this.day = day;
    }
    public int getRequests() {
        return requests;
    }
    public void setRequests(int requests) {
        this.requests = requests;
    }
}