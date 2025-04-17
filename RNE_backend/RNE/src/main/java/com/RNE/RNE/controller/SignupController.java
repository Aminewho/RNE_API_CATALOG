package com.RNE.RNE.controller;

import com.RNE.RNE.model.ApiSignupRequest;
import com.RNE.RNE.service.SignupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/signup")
public class SignupController {

    @Autowired
    private SignupService signupService;

    @PostMapping("/{apiId}")
    public ApiSignupRequest signup(@PathVariable String apiId, @RequestBody ApiSignupRequest request) {
        request.setApiId(apiId);
    System.out.println("request**" + request);
    return signupService.submitSignup(request);
    }
}
