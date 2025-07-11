package com.RNE.RNE.controller;

import org.springframework.security.core.Authentication;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import com.RNE.RNE.model.User;
import com.RNE.RNE.repository.UserRepository;
import com.RNE.RNE.service.KibanaQueryBuilder;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    @Autowired
    UserRepository userRepository;
    @Autowired 
    private RestTemplate restTemplate;

    @GetMapping("/user-usage")
    public ResponseEntity<?> getUserUsage (  Authentication authentication,  @RequestParam(required = false) String apiName) {
        String username = authentication.getName(); // from JWT
        User user=userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String wso2AppName = user.getWso2AppName();
      //  Instant createdAt = user.getCreatedAt().atStartOfDay(ZoneId.of("Africa/Tunis")).toInstant();
        String createdAt = "2025-05-01T23:00:00.000Z";
        //Instant now = Instant.now();
        String now= Instant.now().toString();
        String queryJson = (apiName == null)
            ? KibanaQueryBuilder.buildUserUsageQuery(wso2AppName, createdAt, now)
            : KibanaQueryBuilder.buildUserUsageQueryWithApi(wso2AppName, createdAt, now, apiName);
       
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(queryJson, headers);

        String elasticsearchUrl = "http://192.168.101.75:9200/apim_event_response/_search";
        ResponseEntity<String> esResponse = restTemplate.postForEntity(elasticsearchUrl, request, String.class);
        return ResponseEntity.ok(esResponse.getBody());
    }

}
