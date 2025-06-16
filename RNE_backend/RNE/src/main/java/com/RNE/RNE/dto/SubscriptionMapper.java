package com.RNE.RNE.dto;
import com.RNE.RNE.model.Subscription;  


public class SubscriptionMapper {

    public static SubscriptionDTO toDto(Subscription subscription) {
        SubscriptionDTO dto = new SubscriptionDTO();
        dto.setAllowedRequests(subscription.getAllowedRequests());
        dto.setUsedRequests(subscription.getUsedRequests());
        dto.setStatus(subscription.getStatus().name());
        if (subscription.getApi() != null) {
            dto.setApi(subscription.getApi().getName());
        }
        if (subscription.getUser() != null) {
            dto.setUsername(subscription.getUser().getUsername());
        }
        return dto;
    }
}
