package com.RNE.RNE.controller;

import com.RNE.RNE.dto.SubscriptionDTO;
import com.RNE.RNE.dto.SubscriptionMapper;
import com.RNE.RNE.dto.UserDetailsDTO;
import com.RNE.RNE.dto.UserDto;
import com.RNE.RNE.dto.UserMapper;
import com.RNE.RNE.model.Api;
import com.RNE.RNE.dto.ApiRequest;
import com.RNE.RNE.dto.AddFundsRequest;
import com.RNE.RNE.model.SignupRequest;
import com.RNE.RNE.model.Subscription;
import com.RNE.RNE.model.SubscriptionStatus;
import com.RNE.RNE.model.Transaction;
import com.RNE.RNE.model.User;
import com.RNE.RNE.service.ApiService;
import com.RNE.RNE.model.Wso2Instance;
import com.RNE.RNE.service.SignupService;
import com.RNE.RNE.service.SubscriptionService;
import com.RNE.RNE.service.AdminService;
import com.RNE.RNE.service.UserService;
import com.RNE.RNE.service.Wso2InstanceService;
import com.RNE.RNE.service.Wso2ApiService;
import com.RNE.RNE.service.WalletService;
import com.fasterxml.jackson.databind.JsonNode;
import com.RNE.RNE.repository.ApiRepository;
import com.RNE.RNE.repository.UserRepository;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Objects;

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
    WalletService walletService;
    @Autowired
    private ApiRepository apiRepository;
    @Autowired
    private ApiService apiService;

      
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
    @GetMapping("/users/{id}")
        public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        UserDto dto = UserMapper.toDTO(user);
        return ResponseEntity.ok(dto);
    }
    @GetMapping("/user-details/{userId}")
    public ResponseEntity<UserDetailsDTO> getUserDetails(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));
        List<Subscription> subscriptions = subscriptionService.getUserSubscriptions(userId);
        List<Transaction> transactions = walletService.getTransactions(user);
        List<SubscriptionDTO> subscriptionsDto = subscriptions.stream()
        .map(SubscriptionMapper::toDto)
        .collect(Collectors.toList());  
        UserDto userDto = UserMapper.toDTO(user);
      
        return ResponseEntity.ok(new UserDetailsDTO(userDto, subscriptionsDto, transactions));
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
        return ResponseEntity.ok(apis); // always return 200 with the list, even if empty
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
    public ResponseEntity<?> addApi(@RequestBody ApiRequest request) {
        try {
            apiService.addApiToCatalog(request.getIncomingApi(), request.getBaseUrl());
            return ResponseEntity.ok(" API added to catalog successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add API to catalog");
        }
    }
    @GetMapping("/subscriptions")
    public ResponseEntity<List<SubscriptionDTO>> getSubscriptions() {
        try {
            List<Subscription> subscriptions = subscriptionService.getSubscriptions();
            
            if (subscriptions == null || subscriptions.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            
            List<SubscriptionDTO> dtoList = subscriptions.stream()
                .map(SubscriptionMapper::toDto)
                .filter(Objects::nonNull)  // Filter out any null DTOs
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/subscriptions/pending")
    public ResponseEntity<List<SubscriptionDTO>> getPendingSubscriptions() {
        List<Subscription> subscriptions  = subscriptionService.getSubscriptionsByStatus(SubscriptionStatus.PENDING);
        List<SubscriptionDTO> dtoList = subscriptions.stream()
            .map(SubscriptionMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }
    
    @GetMapping("/subscriptions/{id}")
    public ResponseEntity<SubscriptionDTO> getSubscriptionById(@PathVariable Long  id) {
        Subscription subscriptions  = subscriptionService.getSubscriptionById(id);
        SubscriptionDTO dtoList = subscriptions == null ? null : SubscriptionMapper.toDto(subscriptions);
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/subscriptions/user/{id}")
    public ResponseEntity<List<SubscriptionDTO>> getSubscriptionsByUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        List<Subscription> subscriptions = subscriptionService.getUserSubscriptions(user.getId());
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

    @PutMapping("/add-funds/{userId}")
    public ResponseEntity<String> addFunds(@RequestBody AddFundsRequest request,@PathVariable Long userId) {
       
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            walletService.addFunds(user, request.getAmount());
            return ResponseEntity.ok("Funds added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to add funds: " + e.getMessage());
        }
    }
     @GetMapping("/transactions/{userId}")
     public ResponseEntity<?> getTransactions(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        List<Transaction> transactions = walletService.getTransactions(user);
        if (transactions.isEmpty()) {
            return ResponseEntity.status(404).body("No transactions found for user");
        }
        return ResponseEntity.ok(transactions);
    }
}
