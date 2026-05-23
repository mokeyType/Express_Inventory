package com.example.practice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Schema(description = "Request body for creating or updating a product")
public class ProductRequest {


    @Schema(description = "Product category", example = "Electronics")
    @NotBlank(message = "Category must not be blank")
    @Size(max = 100, message = "Category must be at most 100 characters")
    private String category;

    @Schema(description = "Product name", example = "Laptop")
    @NotBlank(message = "Name must not be blank")
    @Size(max = 150, message = "Name must be at most 150 characters")
    private String name;

    @Schema(description = "Product brand", example = "Dell")
    @NotBlank(message = "Brand must not be blank")
    @Size(max = 100, message = "Brand must be at most 100 characters")
    private String brand;

    @Schema(description = "Product price", example = "75000.0")
    @NotNull(message = "Price must not be null")
    @DecimalMin(value = "0.1", message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Price must have up to 10 digits and 2 decimals")
    private BigDecimal price;

    @Schema(description = "Available stock quantity", example = "10")
    @NotNull(message = "Stock must not be null")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    // Getters and Setters

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}
