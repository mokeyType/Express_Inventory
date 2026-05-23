package com.example.practice.Repo;

import com.example.practice.Entity.Sale;
import com.example.practice.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SaleRepo extends JpaRepository<Sale, Integer> {

    // all sales for this owner
    Page<Sale> findByOwner(User owner, Pageable pageable);

    // by id AND owner
    Optional<Sale> findBySaleIdAndOwner(int saleId, User owner);

    // by date for this owner
    List<Sale> findBySaleDateAndOwner(LocalDate date, User owner);

    // between dates for this owner
    Page<Sale> findBySaleDateBetweenAndOwner(
            LocalDate start, LocalDate end, User owner, Pageable pageable);
}