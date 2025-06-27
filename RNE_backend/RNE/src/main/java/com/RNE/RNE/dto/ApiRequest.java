package com.RNE.RNE.dto;

import com.RNE.RNE.model.Api;
 public class ApiRequest {
    private Api incomingApi;
    private String baseUrl;

    public ApiRequest(String id, String name, String endpoint, String input, String output, String description,
            boolean published, Long request_cost, String baseUrl2) {
        //TODO Auto-generated constructor stub
    }

    // Getters and setters
    public Api getIncomingApi() {
        return incomingApi;
    }

    public void setIncomingApi(Api incomingApi) {
        this.incomingApi = incomingApi;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }
}
 