package com.example.practice.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class SaleRequest {

    @NotNull(message = "Sale date must not be null")
    @PastOrPresent(message = "Sale date cannot be in the future")
    private LocalDate saleDate;

    private LocalTime saleTime;

    @NotEmpty(message = "Sale must have at least one item")
    @Valid
    private List<SaleItemRequest> items;

    public LocalDate getSaleDate() { return saleDate; }
    public void setSaleDate(LocalDate saleDate) { this.saleDate = saleDate; }

    public LocalTime getSaleTime() { return saleTime; }
    public void setSaleTime(LocalTime saleTime) { this.saleTime = saleTime; }

    public List<SaleItemRequest> getItems() { return items; }
    public void setItems(List<SaleItemRequest> items) { this.items = items; }
}
