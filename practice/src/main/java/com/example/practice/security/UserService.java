package com.example.practice.security;

import com.example.practice.Entity.User;
import com.example.practice.Entity.User.AuthProvider;
import com.example.practice.Repo.UserRepo;
import com.example.practice.dto.LoginRequest;
import com.example.practice.dto.LoginResponse;
import com.example.practice.dto.RegisterRequest;
import com.example.practice.exception.AuthenticationFailedException;
import com.example.practice.exception.ConflictException;
import com.example.practice.exception.WrongAuthProviderException;
import com.example.practice.service.EmailService;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final Logger log =
            LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtCookieService jwtCookieService;

    @Autowired
    private EmailService emailService;
    public LoginResponse register(RegisterRequest request,
                                  HttpServletResponse response) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        log.info("Register attempt: {}", normalizedEmail);

        if (userRepo.existsByEmail(normalizedEmail)) {
            User existing = userRepo.findByEmail(normalizedEmail)
                    .orElseThrow();

            if (existing.getAuthProvider() == AuthProvider.GOOGLE) {
                throw new WrongAuthProviderException(
                        "This email is already registered via Google. " +
                                "Please log in using Google."
                );
            }

            throw new ConflictException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAuthProvider(AuthProvider.LOCAL);
        user.setRole(User.Role.USER);

        User saved = userRepo.save(user);
        log.info("LOCAL user registered: {}", normalizedEmail);

        String token = jwtService.generateToken(saved);
        jwtCookieService.addJwtCookie(response, token);
        try {
            emailService.sendWelcomeEmail(saved.getEmail(), saved.getName());
        } catch (Exception e) {
            log.warn("Failed to send welcome email to {}", saved.getEmail(), e);
        }
        return new LoginResponse(
                saved.getName(),
                saved.getEmail(),
                saved.getId(),
                saved.getAuthProvider().name()
        );
    }

    public LoginResponse verify(LoginRequest request,
                                HttpServletResponse response) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        log.info("Login attempt: {}", normalizedEmail);

        User user = userRepo.findByEmail(normalizedEmail)
                .orElseThrow(() -> new AuthenticationFailedException(
                        "Invalid email or password"
                ));

        if (user.getAuthProvider() == AuthProvider.GOOGLE) {
            throw new WrongAuthProviderException(
                    "This account uses Google login. " +
                            "Please log in using Google."
            );
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            normalizedEmail,
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException ex) {
            throw new AuthenticationFailedException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);
        jwtCookieService.addJwtCookie(response, token);

        log.info("LOCAL login successful: {}", normalizedEmail);

        return new LoginResponse(
                user.getName(),
                user.getEmail(),
                user.getId(),
                user.getAuthProvider().name()
        );
    }

    public void logout(HttpServletResponse response) {
        jwtCookieService.clearJwtCookie(response);
    }
}
