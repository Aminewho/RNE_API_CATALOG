package com.RNE.RNE.service;

import com.RNE.RNE.model.ApiSignupRequest;
import com.RNE.RNE.repository.ApiSignupRequestRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SignupService {

    @Autowired
    private ApiSignupRequestRepository repository;

    public ApiSignupRequest submitSignup(ApiSignupRequest request) {
        return repository.save(request);
    }
    public List<ApiSignupRequest> getAllSignupRequests() {
        return repository.findAll();
    }
}
