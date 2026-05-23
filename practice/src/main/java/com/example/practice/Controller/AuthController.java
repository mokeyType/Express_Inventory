package com.example.practice.Controller;

import com.example.practice.Entity.User;
import com.example.practice.dto.LoginRequest;
import com.example.practice.dto.LoginResponse;
import com.example.practice.dto.RegisterRequest;
import com.example.practice.security.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Register and Login")
public class AuthController {

    private final UserService service;

    public AuthController(UserService service) {
        this.service = service;
    }

    @Operation(summary = "Register new user with email and password")
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        return ResponseEntity.status(201)
                .body(service.register(request, response));
    }

    @Operation(summary = "Login with email and password")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        return ResponseEntity.ok(service.verify(request, response));
    }

    @Operation(summary = "Logout")
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        service.logout(response);
        return ResponseEntity.ok("Logged out successfully");
    }

    @Operation(summary = "Get current authenticated user")
    @GetMapping("/me")
    public ResponseEntity<LoginResponse> currentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(new LoginResponse(user.getName(), user.getId()));
    }

    @Operation(summary = "Logout")
    @GetMapping("/logout")
    public ResponseEntity<String> logoutWithGet(HttpServletResponse response) {
        service.logout(response);
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/google")
    public void googleLogin(HttpServletResponse response) throws IOException {
        response.sendRedirect("/oauth2/authorization/google");
    }
}
