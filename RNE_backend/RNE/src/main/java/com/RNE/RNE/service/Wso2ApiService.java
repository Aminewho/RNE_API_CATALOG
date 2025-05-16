package com.RNE.RNE.service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

@Service
public class Wso2ApiService {

    @Autowired
    private RestTemplate restTemplate;

   public String getAccessToken() throws JsonProcessingException {
    String clientId = "Gxev01mBnnZzueZQT4YFB64mtE8a";
    String clientSecret = "5Io6BnTd3lb6aH8Hcm1m2miTZYca";
    String username = "admin";
    String password = "admin";

    String auth = clientId + ":" + clientSecret;
    String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
    headers.set("Authorization", "Basic " + encodedAuth);

    String body = "grant_type=password&username=" + username +
                  "&password=" + password +
                  "&scope=apim:api_view apim:api_manage";

    HttpEntity<String> entity = new HttpEntity<>(body, headers);

    String tokenUrl = "https://localhost:9443/oauth2/token";
    ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, entity, String.class);

    // Extract access_token from JSON
    ObjectMapper mapper = new ObjectMapper();
    JsonNode jsonNode = mapper.readTree(response.getBody()); // This line may throw JsonProcessingException
    return jsonNode.get("access_token").asText();
}

public String getApiList() throws JsonProcessingException {
   // String accessToken = getAccessToken();
    String accessToken = getAccessToken();

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + accessToken);
    headers.setAccept(List.of(MediaType.APPLICATION_JSON));

    HttpEntity<String> entity = new HttpEntity<>(headers);

    String apiListUrl = "https://localhost:9443/api/am/publisher/v4/apis"; // adjust this if needed
    ResponseEntity<String> response = restTemplate.exchange(apiListUrl, HttpMethod.GET, entity, String.class);

    return response.getBody();
}

    
}
