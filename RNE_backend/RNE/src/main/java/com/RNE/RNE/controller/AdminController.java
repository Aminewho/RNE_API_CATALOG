package com.RNE.RNE.controller;

import com.RNE.RNE.model.ApiSignupRequest;
import com.RNE.RNE.service.SignupService;
import com.RNE.RNE.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")  // allow frontend dev environment
public class AdminController {

    @Autowired
    private SignupService signupService;
    @Autowired
    private AdminService adminService;

    @GetMapping("/signups")
    public List<ApiSignupRequest> getAllSignupRequests() {
        return signupService.getAllSignupRequests();
    }
    @PutMapping("/signups/{id}/approve")
public ResponseEntity<?> approveRequest(@PathVariable Long id) {
    try {
        adminService.approveSignupRequest(id);
        return ResponseEntity.ok("Signup request approved.");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}
}
