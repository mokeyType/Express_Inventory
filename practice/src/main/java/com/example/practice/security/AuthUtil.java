package com.example.practice.security;

import com.example.practice.Entity.User;
import com.example.practice.Repo.UserRepo;
import com.example.practice.exception.AuthenticationFailedException;
import com.example.practice.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    @Autowired
    private UserRepo userRepo;

    public User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthenticationFailedException("Authentication required");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            return user;
        }

        if (principal instanceof UserDetails userDetails) {
            return userRepo.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "User not found"
                    ));
        }

        throw new AuthenticationFailedException("Authentication required");
    }
}
