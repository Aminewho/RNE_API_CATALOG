package com.RNE.RNE.dto;


public class LoginRequest {
    
    @NotBlank(message = "Username cannot be blank")
    private String username;
    
    @NotBlank(message = "Password cannot be blank")
    private String password;
    
    // Default constructor (required for JSON deserialization)
    public LoginRequest() {
    }
    
    // All-args constructor
    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }
    
    // Getters
    public String getUsername() {
        return username;
    }
    
    public String getPassword() {
        return password;
    }
    
    // Setters (optional - omit for immutability)
    public void setUsername(String username) {
        this.username = username;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}