package com.RNE.RNE.controller;

import com.RNE.RNE.model.SignupRequest;
import com.RNE.RNE.service.SignupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/signup")
public class SignupController {

    @Autowired
    private SignupService signupService;

    @PostMapping
    public SignupRequest signup(@RequestBody SignupRequest request) {
        return signupService.submitSignup(request);
    }
}