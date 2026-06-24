package com.example.practice.Repo;

import com.example.practice.Entity.Product;
import com.example.practice.Entity.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;

public interface ProductRepo extends JpaRepository<Product, Integer> {

    Page<Product> findByOwnerAndIsDeleteTrue(User owner, Pageable pageable);

    Optional<Product> findByProductIdAndOwner(int productId, User owner);
    Optional<Product> findByProductIdAndOwnerAndIsDeleteTrue(int productId, User owner);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Product> findWithLockByProductIdAndOwnerAndIsDeleteTrue(int productId, User owner);

    boolean existsByProductIdAndOwner(int productId, User owner);

    Page<Product> findByStockLessThanAndOwnerAndIsDeleteTrue(int stock, User owner, Pageable pageable);

    Page<Product> findByCategoryAndOwnerAndIsDeleteTrue(String category, User owner, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndOwnerAndIsDeleteTrue(
            String name, User owner, Pageable pageable);
}
