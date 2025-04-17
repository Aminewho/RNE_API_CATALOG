package com.RNE.RNE.controller;


import com.RNE.RNE.service.Wso2ApiService;
import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private Wso2ApiService wso2ApiService;
  
    @PostMapping("/token")
    public ResponseEntity<?> getToken() {
        try {
            return ResponseEntity.ok(wso2ApiService.getAccessToken());
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(500).body("Error processing JSON: " + e.getMessage());
        }
    }
}
