/*package com.RNE.RNE.controller;

import com.RNE.RNE.service.Wso2ApiService;
import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wso2")
public class ApiController {

    @Autowired
    private Wso2ApiService wso2ApiService;

    @GetMapping("/list")
    public ResponseEntity<?> listApis() throws JsonProcessingException {
        return ResponseEntity.ok(wso2ApiService.getApiList());
    }
 }*/
