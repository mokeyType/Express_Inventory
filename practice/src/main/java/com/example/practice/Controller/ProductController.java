package com.example.practice.Controller;

import com.example.practice.dto.ProductRequest;
import com.example.practice.dto.ProductResponse;
import com.example.practice.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/product")
@Tag(name = "Product", description = "APIs for managing products and inventory")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @Operation(summary = "Add a new product")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Product created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping("/add")
    public ResponseEntity<ProductResponse> addP(
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(201).body(service.addProduct(request));
    }

    @Operation(summary = "Get all products with pagination")
    @ApiResponse(responseCode = "200", description = "Products fetched successfully")
    @GetMapping("/all/paginated")
    public ResponseEntity<Page<ProductResponse>> getAllPaginated(
            @RequestParam(defaultValue = "0")
            @Min(value = 0, message = "Page cannot be negative") int page,
            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "Size must be at least 1") int size,
            @RequestParam(defaultValue = "productId")
            @NotBlank(message = "SortBy cannot be blank") String sortBy) {
        return ResponseEntity.ok(service.getAllProductsPaginated(page, size, sortBy));
    }

    @Operation(summary = "Get products below minimum stock threshold")
    @ApiResponse(responseCode = "200", description = "Low stock products fetched")
    @GetMapping("/all/minstock")
    public ResponseEntity<Page<ProductResponse>> getLessThenMin(
            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "Min stock must be at least 1") int min,
            @RequestParam(defaultValue = "0")
            @Min(value = 0, message = "Page cannot be negative") int page,
            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "Size must be at least 1") int size,
            @RequestParam(defaultValue = "productId")
            @NotBlank(message = "SortBy cannot be blank") String sortBy) {
        return ResponseEntity.ok(service.getProductlessStock(min, page, size, sortBy));
    }

    @Operation(summary = "Get products by category")
    @ApiResponse(responseCode = "200", description = "Products fetched by category")
    @GetMapping("/category")
    public ResponseEntity<Page<ProductResponse>> getAccCategory(
            @RequestParam
            @NotBlank(message = "Category cannot be blank") String category,
            @RequestParam(defaultValue = "0")
            @Min(value = 0, message = "Page cannot be negative") int page,
            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "Size must be at least 1") int size,
            @RequestParam(defaultValue = "productId")
            @NotBlank(message = "SortBy cannot be blank") String sortBy) {
        return ResponseEntity.ok(service.getAccCategory(category, page, size, sortBy));
    }

    @Operation(summary = "Get product by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product found"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(
            @PathVariable
            @Min(value = 1, message = "ID must be greater than 0") int id) {
        return ResponseEntity.ok(service.getProductById(id));
    }

    @Operation(summary = "Delete product by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product deleted"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable
            @Min(value = 1, message = "ID must be greater than 0") int id) {
        service.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

    @Operation(summary = "Update or create product by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product updated or created"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PutMapping("/upsert/{id}")
    public ResponseEntity<ProductResponse> upsert(
            @Valid @RequestBody ProductRequest request,
            @PathVariable
            @Min(value = 1, message = "ID must be greater than 0") int id) {
        return ResponseEntity.ok(service.upsertProduct(id, request));
    }

    @Operation(summary = "Search products by name")
    @ApiResponse(responseCode = "200" , description = "Products Fetch by name")
    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> searchByName(
            @RequestParam
            @NotBlank(message = "name cannot be blank") String name,
            @RequestParam(defaultValue = "0")
            @Min(value = 0 , message = "page cannot be negative")int page,
            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "Size must be at least 1") int size,
            @RequestParam(defaultValue = "productId")
            @NotBlank(message = "SortBy cannot be blank") String sortBy){
        return ResponseEntity.ok(service.searchProductByName(name,page,size,sortBy));
    }
}
