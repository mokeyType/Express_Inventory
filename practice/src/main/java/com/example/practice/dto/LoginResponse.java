package com.example.practice.dto;

public class LoginResponse {

    private final String name;
    private final String email;
    private final int userId;
    private final String authProvider;

    public LoginResponse(String name, String email, int userId, String authProvider) {
        this.name = name;
        this.email = email;
        this.userId = userId;
        this.authProvider = authProvider;
    }

    public String getName() { return name; }
    public String getEmail() { return email; }
    public int getUserId() { return userId; }
    public String getAuthProvider() { return authProvider; }
}
