package com.RNE.RNE.service;

import java.util.Optional;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.RNE.RNE.model.Api;
import com.RNE.RNE.model.Wso2Instance;
import com.RNE.RNE.repository.ApiRepository;
import com.RNE.RNE.repository.Wso2InstanceRepository;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class ApiService {

    private final Wso2ApiService wso2ApiService;
    private final Wso2InstanceRepository wso2InstanceRepository;
    private final ApiRepository apiRepository;

    @Autowired
    public ApiService(Wso2ApiService wso2ApiService, Wso2InstanceRepository wso2InstanceRepository, ApiRepository apiRepository) {
        this.wso2ApiService = wso2ApiService;
        this.wso2InstanceRepository = wso2InstanceRepository;
        this.apiRepository = apiRepository;
    }

    public void addApiToCatalog(Api incomingApi,String baseUrl) {
        Wso2Instance instance = wso2InstanceRepository.findByBaseUrl(baseUrl);
        if (instance == null) {
            throw new IllegalArgumentException("WSO2 instance not found for base URL");
        }

        Api api = new Api();
        api.setId(incomingApi.getId());
        api.setName(incomingApi.getName());
        api.setEndpoint(incomingApi.getEndpoint());
        api.setInput(incomingApi.getInput());
        api.setOutput(incomingApi.getOutput());
        api.setRequest_cost(incomingApi.getRequest_cost());
        api.setDescription(incomingApi.getDescription());
        api.setPublished(incomingApi.getPublished());
        api.setInstance(instance);

        apiRepository.save(api);
       
    }
}
