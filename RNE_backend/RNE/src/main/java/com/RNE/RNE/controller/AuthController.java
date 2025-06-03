package com.RNE.RNE.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("username", authentication.getName());
        return ResponseEntity.ok(userInfo);
    }
}
