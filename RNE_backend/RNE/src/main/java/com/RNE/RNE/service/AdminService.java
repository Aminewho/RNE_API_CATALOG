package com.RNE.RNE.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.RNE.RNE.model.Api;
import com.RNE.RNE.model.ApiSignupRequest;
import com.RNE.RNE.model.User;
import com.RNE.RNE.repository.ApiRepository;
import com.RNE.RNE.repository.ApiSignupRequestRepository;
import com.RNE.RNE.repository.UserRepository;
@Service
public class AdminService {
    @Autowired
    private ApiSignupRequestRepository repository;
    private PasswordEncoder passwordEncoder;
    @Autowired
    private ApiRepository apiRepository;
    @Autowired
    private UserRepository userRepository;

    
    @Transactional
    public void approveSignupRequest(Long requestId) {
    ApiSignupRequest request = repository.findById(requestId)
        .orElseThrow(() -> new RuntimeException("Request not found"));

    if (!"New".equalsIgnoreCase(request.getStatus().toString())) {
        throw new RuntimeException("Request already processed");
    }
    // Create new user
    User user = new User();
    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode("defaultPassword")); // Use secure password or temporary one
    user.setFullName(request.getUsername());
    // Assign user to API
    Api api = apiRepository.findById(Long.parseLong(request.getApiId()))
        .orElseThrow(() -> new RuntimeException("API not found"));

    user.getApis().add(api); // Many-to-many logic
    userRepository.save(user);

    // Update signup request status
    request.setStatus(ApiSignupRequest.Status.ACCEPTED);
    repository.save(request);
}
}
