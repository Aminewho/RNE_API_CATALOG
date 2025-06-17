package com.RNE.RNE.controller;

import com.RNE.RNE.dto.SubscriptionDTO;
import com.RNE.RNE.dto.SubscriptionMapper;
import com.RNE.RNE.model.Api;
import com.RNE.RNE.model.SignupRequest;
import com.RNE.RNE.model.Subscription;
import com.RNE.RNE.model.SubscriptionStatus;
import com.RNE.RNE.model.SignupRequest;
import com.RNE.RNE.model.User;
import com.RNE.RNE.model.Wso2Instance;
import com.RNE.RNE.service.SignupService;
import com.RNE.RNE.service.SubscriptionService;
import com.RNE.RNE.service.AdminService;
import com.RNE.RNE.service.UserService;
import com.RNE.RNE.service.Wso2InstanceService;
import com.RNE.RNE.service.Wso2ApiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.RNE.RNE.repository.Wso2InstanceRepository;
import com.RNE.RNE.repository.ApiRepository;
import com.RNE.RNE.repository.UserRepository;

import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @Autowired
    private Wso2ApiService wso2ApiService;
    @Autowired
    private Wso2InstanceRepository wso2InstanceRepository;
    @Autowired
    private ApiRepository apiRepository;

      
    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private UserRepository userRepository;


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

   @GetMapping("/apis")
    public ResponseEntity<List<JsonNode>> getAllApisFromAllInstances() {
        List<JsonNode> apis = wso2ApiService.getAllApisFromAllInstances();
        return ResponseEntity.ok(apis);
    }
    @GetMapping("/catalog/apis")
    public ResponseEntity<List<Api>> getCatalogApis() {
        List<Api> apis = apiRepository.findAll();
        if (apis.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(apis);
    }
    @DeleteMapping("/catalog/apis/{id}")
    public ResponseEntity<String> deleteApiFromCatalog(@PathVariable String id) {
        Optional<Api> apiOptional = apiRepository.findById(id);
        if (apiOptional.isPresent()) {
            apiRepository.delete(apiOptional.get());
            return ResponseEntity.ok("API deleted from catalog");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("API not found in catalog");
        }
    }
    @PostMapping("/catalog/add")
    public ResponseEntity<?> addApi(@RequestBody Api incomingApi) {
        List<JsonNode> availableApis = wso2ApiService.getAllApisFromAllInstances();

        Optional<JsonNode> matchingApi = availableApis.stream()
            .filter(node -> node.get("id").asText().equals(incomingApi.getId()))
            .findFirst();

        if (matchingApi.isEmpty()) {
            return ResponseEntity.badRequest().body("API not found in WSO2 instances");
        }

        // Find Wso2Instance by baseUrl
        String baseUrl = matchingApi.get().get("baseUrl").asText();
        Wso2Instance instance = wso2InstanceRepository.findByBaseUrl(baseUrl);
        if (instance == null) {
            return ResponseEntity.badRequest().body("WSO2 instance not found for base URL");
        }

        Api api = new Api();
        api.setId(matchingApi.get().get("id").asText());
        api.setName(matchingApi.get().get("name").asText());
        api.setVersion(matchingApi.get().get("version").asText());
        api.setContext(matchingApi.get().get("context").asText());
        api.setProvider(matchingApi.get().get("provider").asText());
        api.setInstance(instance); 

        apiRepository.save(api);
        return ResponseEntity.ok("API added to catalog");
    }
    @GetMapping("/subscriptions")
    public ResponseEntity<List<SubscriptionDTO>> getSubscriptions() {
        List<Subscription> subscriptions  = subscriptionService.getSubscriptions();
        List<SubscriptionDTO> dtoList = subscriptions.stream()
            .map(SubscriptionMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }
    @GetMapping("/subscriptions/pending")
    public ResponseEntity<List<SubscriptionDTO>> getPendingSubscriptions() {
        List<Subscription> subscriptions  = subscriptionService.getSubscriptionsByStatus(SubscriptionStatus.PENDING);
        List<SubscriptionDTO> dtoList = subscriptions.stream()
            .map(SubscriptionMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @PutMapping("/subscriptions/{id}/approve")
    public ResponseEntity<?> approveSubscription(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(subscriptionService.approveSubscription(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/subscriptions/{id}/reject")
    public ResponseEntity<?> rejectSubscription(@PathVariable Long id) {
        try {
            Subscription subscription=subscriptionService.rejectSubscription(id);
            SubscriptionDTO dto = SubscriptionMapper.toDto(subscription);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
  

}
