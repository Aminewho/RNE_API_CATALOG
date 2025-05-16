package com.RNE.RNE.controller;

import com.RNE.RNE.model.SignupRequest;
import com.RNE.RNE.service.SignupService;
import com.RNE.RNE.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")  //allow frontend dev environment
public class AdminController {

    @Autowired
    private SignupService signupService;
    @Autowired
    private AdminService adminService;

    @GetMapping("/signups")
    public List<SignupRequest> getAllSignupRequests() {
        return signupService.getAllSignupRequests();
    }
    @PutMapping("/signups/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long id, @RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");
            adminService.approveSignupRequest(id, username, password);
            return ResponseEntity.ok("Signup request approved.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
