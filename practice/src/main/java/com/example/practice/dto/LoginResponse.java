package com.example.practice.dto;

public class LoginResponse {

    private final String name;
    private final int userId;

    public LoginResponse(String name, int userId) {
        this.name = name;
        this.userId = userId;
    }

    public String getName() { return name; }
    public int getUserId() { return userId; }
}
