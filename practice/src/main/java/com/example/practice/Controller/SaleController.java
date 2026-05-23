package com.example.practice.Controller;

import com.example.practice.dto.SaleItemResponse;
import com.example.practice.dto.SaleRequest;
import com.example.practice.dto.SaleResponse;
import com.example.practice.service.SalesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@Validated
@RestController
@RequestMapping("/sales")
@Tag(name = "Sales", description = "APIs for managing sales and transactions")
public class SaleController {

    private final SalesService service;

    public SaleController(SalesService service) {
        this.service = service;
    }

    @Operation(summary = "Create a new sale")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Sale created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or insufficient stock")
    })
    @PostMapping("/create")
    public ResponseEntity<SaleResponse> createSale(
            @Valid @RequestBody SaleRequest request) {
        return ResponseEntity.status(201).body(service.createSale(request));
    }

    @Operation(summary = "Get sale by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Sale found"),
            @ApiResponse(responseCode = "404", description = "Sale not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<SaleResponse> getSaleById(
            @PathVariable
            @Min(value = 1, message = "Sale ID must be greater than 0") int id) {
        return ResponseEntity.ok(service.byId(id));
    }

    @Operation(summary = "Get all sales with pagination")
    @ApiResponse(responseCode = "200", description = "Sales fetched successfully")
    @GetMapping("/paginated")
    public ResponseEntity<Page<SaleResponse>> getPaginatedSales(
            @RequestParam(defaultValue = "0")
            @Min(value = 0, message = "Page cannot be negative") int page,
            @RequestParam(defaultValue = "5")
            @Min(value = 1, message = "Size must be at least 1") int size,
            @RequestParam(defaultValue = "saleId")
            @NotBlank(message = "SortBy cannot be blank") String sortBy) {
        return ResponseEntity.ok(service.fetchsales(page, size, sortBy));
    }

    @Operation(summary = "Get sales by specific date")
    @ApiResponse(responseCode = "200", description = "Sales fetched by date")
    @GetMapping("/date")
    public ResponseEntity<List<SaleResponse>> salesOfParticularDate(
            @RequestParam LocalDate date) {
        return ResponseEntity.ok(service.salesOfParticularDate(date));
    }

    @Operation(summary = "Get sales between two dates with pagination")
    @ApiResponse(responseCode = "200", description = "Sales fetched between dates")
    @GetMapping("/between")
    public ResponseEntity<Page<SaleResponse>> salesBetweenDates(
            @RequestParam LocalDate date1,
            @RequestParam LocalDate date2,
            @RequestParam(defaultValue = "0")
            @Min(value = 0, message = "Page cannot be negative") int page,
            @RequestParam(defaultValue = "3")
            @Min(value = 1, message = "Size must be at least 1") int size,
            @RequestParam(defaultValue = "saleId")
            @NotBlank(message = "SortBy cannot be blank") String sortBy) {
        return ResponseEntity.ok(
                service.SalesBetweenDate(date1, date2, page, size, sortBy));
    }

    @Operation(summary = "Get all sales containing a specific product")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Sales fetched by product"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/product/{id}")
    public ResponseEntity<List<SaleItemResponse>> salesOfParticularProduct(
            @PathVariable
            @Min(value = 1, message = "Product ID must be greater than 0") int id) {
        return ResponseEntity.ok(service.salesOfParticularProduct(id));
    }



}
