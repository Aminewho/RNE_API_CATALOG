package com.RNE.RNE.service;

import com.RNE.RNE.model.Subscription;
import com.RNE.RNE.model.User;
import com.RNE.RNE.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Optional;

@Service
public class UsageService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestTemplate restTemplate;

    public int getUsedRequestsForSubscription(Long userId, Subscription subscription) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();
        String applicationName = user.getWso2AppName(); // map user to WSO2 app if needed
        String apiName = subscription.getApi().getName();
        String createdAt = "2025-05-01T23:00:00.000Z";
        String now = Instant.now().toString();
        // Build query
        String queryJson = KibanaQueryBuilder.buildUserUsageQueryWithApi(applicationName, createdAt, now, apiName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> requestEntity = new HttpEntity<>(queryJson, headers);
        String elasticUrl = "http://192.168.101.75:9200/apim_event_response/_search";
        ResponseEntity<String> response = restTemplate.postForEntity(elasticUrl, requestEntity, String.class);

        // Process the response to extract the total count
        return KibanaQueryBuilder.extractTotalHitsFromResponse(response.getBody());
    }
}
