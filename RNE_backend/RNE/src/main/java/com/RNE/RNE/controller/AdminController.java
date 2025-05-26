package com.RNE.RNE.controller;

import com.RNE.RNE.model.SignupRequest;
import com.RNE.RNE.model.SignupRequest;
import com.RNE.RNE.model.User;
import com.RNE.RNE.model.Wso2Instance;
import com.RNE.RNE.service.SignupService;
import com.RNE.RNE.service.AdminService;
import com.RNE.RNE.service.UserService;
import com.RNE.RNE.service.Wso2InstanceService;

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
    @Autowired
    private UserService userService;
    @Autowired
    private Wso2InstanceService instanceService;


    @GetMapping("/signups")
    public List<SignupRequest> getAllSignupRequests() {
        return signupService.getAllSignupRequests();
    }
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
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


    // Add new instance
    @PostMapping("/instances")
    public ResponseEntity<String> addInstance(@RequestBody Wso2Instance instance) {
        instanceService.addInstance(instance);
        return ResponseEntity.ok("Instance added successfully");
    }

    // Delete instance by ID
    @DeleteMapping("/instances/{id}")
    public ResponseEntity<String> deleteInstance(@PathVariable Long id) {
        instanceService.deleteInstance(id);
        return ResponseEntity.ok("Instance deleted successfully");
    }

    // Get all instances
    @GetMapping("/instances")
    public ResponseEntity<List<Wso2Instance>> getAllInstances() {
        List<Wso2Instance> instances = instanceService.getAllInstances();
        return ResponseEntity.ok(instances);
    }

   
}
