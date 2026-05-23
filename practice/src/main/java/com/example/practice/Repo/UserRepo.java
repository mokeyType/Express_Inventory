package com.example.practice.Repo;

import com.example.practice.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);  // ← Optional, not plain User
    boolean existsByEmail(String email);        // ← for register check
}