package com.RNE.RNE.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import lombok.RequiredArgsConstructor;

import com.RNE.RNE.model.Subscription;
import com.RNE.RNE.model.SubscriptionStatus;
import com.RNE.RNE.repository.ConsumptionRepository;

@Service
@RequiredArgsConstructor
public class UsageService {

    private final ConsumptionRepository consumptionRepo;
    private final RestTemplate restTemplate;

  
    public int getUsedRequestsForSubscription(Subscription sub) {
        ZonedDateTime tunisNow = ZonedDateTime.now(ZoneId.of("Africa/Tunis"));
        int dbCount = consumptionRepo.totalBeforeToday(sub, tunisNow.toLocalDate());
       
          int todayCount = getUsedRequestsForSubscriptionToday(sub);
        
        return dbCount + todayCount;
    }

    public int getUsedRequestsForSubscriptionToday(Subscription sub) {
        ZonedDateTime tunisNow = ZonedDateTime.now(ZoneId.of("Africa/Tunis"));
        ZonedDateTime startOfDay = tunisNow.toLocalDate().atStartOfDay(ZoneId.of("Africa/Tunis"));
        if(startOfDay.toInstant().isBefore(sub.getApprovalDate().atZone(ZoneId.of("Africa/Tunis")).toInstant())) {
            startOfDay = sub.getApprovalDate().atZone(ZoneId.of("Africa/Tunis"));
            System.out.println("[!] Subscription approval date is after today's date. Using approval date as start of day., " + startOfDay.toString());
        }
        if(sub.getExpirationDate() != null && sub.getExpirationDate().isBefore(tunisNow.toLocalDateTime())) {
            tunisNow = sub.getExpirationDate().atZone(ZoneId.of("Africa/Tunis"));      
            System.out.println("[!] Subscription is expired. Using expiration date as end of day., " + tunisNow.toString());}  
        Instant gte = startOfDay.toInstant(); // beginning of day in UTC
        Instant lte = tunisNow.toInstant();   // now in UTC
        String today = gte.toString(); // e.g., "2025-07-12T23:00:00Z"
        String now = lte.toString();     
        String applicationName = sub.getUser().getWso2AppName();// map user to WSO2 app if needed
        String apiName = sub.getApi().getName();
        String queryJson = KibanaQueryBuilder.buildUserUsageQueryWithApi(applicationName, today, now, apiName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> requestEntity = new HttpEntity<>(queryJson, headers);
        String elasticUrl = "http://localhost:9200/apim_event_response/_search";
        ResponseEntity<String> response = restTemplate.postForEntity(elasticUrl, requestEntity, String.class);
        int todayCount = KibanaQueryBuilder.extractTotalHitsFromResponse(response.getBody());
        System.out.println("[!]  Todays usage for sub  " + sub.getApi().getName()+ " is  "+todayCount);
        return todayCount;
    }

}
