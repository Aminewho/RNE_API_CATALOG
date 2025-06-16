package com.RNE.RNE.controller;

import com.RNE.RNE.config.JwtTokenUtil;
import com.RNE.RNE.dto.ErrorResponse;
import com.RNE.RNE.dto.JwtResponse;
import com.RNE.RNE.dto.LoginRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
/* 
@RestController
public class AuthController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("username", authentication.getName());
        userInfo.put("authorities", authentication.getAuthorities());
        return ResponseEntity.ok(userInfo);
    }
}*/
@RestController
@RequestMapping("/auth")  // Good practice to version and group auth endpoints
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;

    // Constructor injection (recommended over @Autowired)
    public AuthController(AuthenticationManager authenticationManager,
                        JwtTokenUtil jwtTokenUtil ){
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
        
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Validated LoginRequest loginRequest) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            
            // Generate token
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenUtil.generateToken(userDetails);
            
            // Return response
            return ResponseEntity.ok(new JwtResponse(
                token,
                userDetails.getUsername(),
                userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList())
            ));
            
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Account disabled"));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Invalid username or password"));
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication auth) {
    if (auth == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    Map<String, Object> data = new HashMap<>();
    data.put("username", auth.getName());
    data.put("authorities", auth.getAuthorities());
    return ResponseEntity.ok(data);
}
}