package com.RNE.RNE.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.RNE.RNE.model.User;
import com.RNE.RNE.repository.UserRepository;

import jakarta.annotation.PostConstruct;

@Component
public class AdminUserInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void createAdminIfNotExists() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");

            userRepository.save(admin);
            System.out.println("Admin user created with username=admin and password=admin123");
        }
    }
}
