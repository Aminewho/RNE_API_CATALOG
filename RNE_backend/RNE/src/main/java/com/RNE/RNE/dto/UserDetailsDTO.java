package com.RNE.RNE.dto;

import java.math.BigDecimal;
import java.util.List;
import com.RNE.RNE.model.Transaction;

public class UserDetailsDTO {
    private UserDto user;
    private List<SubscriptionDTO> subscriptions;
    private List<Transaction> transactions;

    public UserDetailsDTO(UserDto user, List<SubscriptionDTO> subscriptions, List<Transaction> transactions) {
        this.user = user;
   
        this.subscriptions = subscriptions;
        this.transactions = transactions;
    }

    // Getters and Setters
    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }


    public List<SubscriptionDTO> getSubscriptions() {
        return subscriptions;
    }

    public void setSubscriptions(List<SubscriptionDTO> subscriptions) {
        this.subscriptions = subscriptions;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }
}
