package com.RNE.RNE.controller;

import com.RNE.RNE.model.Api;
import com.RNE.RNE.repository.ApiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/apis") // Base path can be adjusted
public class ApiController {

    private final ApiRepository apiRepository;

    @Autowired
    public ApiController(ApiRepository apiRepository) {
        this.apiRepository = apiRepository;
    }

    // Endpoint to list all APIs
    @GetMapping
    public List<Api> getAllApis() {
        return apiRepository.findAll();
    }

}
