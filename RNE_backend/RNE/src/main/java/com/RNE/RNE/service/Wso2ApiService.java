package com.RNE.RNE.service;

import com.RNE.RNE.model.Wso2Instance;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class Wso2ApiService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private Wso2InstanceService instanceService;

    private final ObjectMapper objectMapper = new ObjectMapper();

public List<JsonNode> getAllApisFromAllInstances() {
    List<JsonNode> allApis = new ArrayList<>();
    List<Wso2Instance> instances = instanceService.getAllInstances();
    ObjectMapper mapper = new ObjectMapper();

    for (Wso2Instance instance : instances) {
        try {
            String token = getAccessToken(instance);
            List<JsonNode> apis = getApisFromInstance(instance.getBaseUrl(), token);

            for (JsonNode api : apis) {
                // Convert to ObjectNode to make it mutable
                ObjectNode apiWithInstance = (ObjectNode) api;
                apiWithInstance.put("baseUrl", instance.getBaseUrl());

                allApis.add(apiWithInstance);
            }

        } catch (Exception e) {
            System.err.println("Failed to fetch APIs from instance: " + instance.getBaseUrl());
            e.printStackTrace();
        }
    }

    return allApis;
}

    private String getAccessToken(Wso2Instance instance) throws Exception {
        String auth = instance.getClientId() + ":" + instance.getClientSecret();
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "Basic " + encodedAuth);

        String body = "grant_type=password&username=admin&password=admin&scope=apim:api_view apim:api_manage";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        String tokenUrl = instance.getBaseUrl() + "/oauth2/token";
        ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, entity, String.class);

        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        return jsonNode.get("access_token").asText();
    }

    private List<JsonNode> getApisFromInstance(String baseUrl, String accessToken) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        HttpEntity<String> entity = new HttpEntity<>(headers);

        String apiListUrl = baseUrl + "/api/am/publisher/v4/apis";
        ResponseEntity<String> response = restTemplate.exchange(apiListUrl, HttpMethod.GET, entity, String.class);

        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode list = root.get("list");

        List<JsonNode> apis = new ArrayList<>();
        if (list != null && list.isArray()) {
            for (JsonNode api : list) {
                apis.add(api);
            }
        }

        return apis;
    }
}
