package com.RNE.RNE.controller;

import com.RNE.RNE.model.ApiSignupRequest;
import com.RNE.RNE.service.SignupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")  // allow frontend dev environment
public class AdminController {

    @Autowired
    private SignupService signupService;

    @GetMapping("/signups")
    public List<ApiSignupRequest> getAllSignupRequests() {
        return signupService.getAllSignupRequests();
    }
}
