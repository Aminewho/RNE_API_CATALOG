package com.RNE.RNE.service;

import com.RNE.RNE.model.SignupRequest;
import com.RNE.RNE.repository.SignupRequestRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class SignupService {

    @Autowired
    private SignupRequestRepository repository;

    public SignupRequest submitSignup(SignupRequest request) {
        return repository.save(request);
    }
    public List<SignupRequest> getAllSignupRequests() {
        return repository.findAll();
    }

}
