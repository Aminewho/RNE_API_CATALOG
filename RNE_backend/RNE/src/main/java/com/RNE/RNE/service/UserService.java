package com.RNE.RNE.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.RNE.RNE.model.User;
import com.RNE.RNE.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

   
    public List<User> getAllUsers() {
        return repository.findAll();
    }

}
