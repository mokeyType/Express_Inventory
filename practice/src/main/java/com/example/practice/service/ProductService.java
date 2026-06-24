package com.example.practice.service;

import com.example.practice.Entity.Product;
import com.example.practice.Entity.User;
import com.example.practice.Repo.ProductRepo;
import com.example.practice.dto.ProductRequest;
import com.example.practice.dto.ProductResponse;
import com.example.practice.exception.BadRequestException;
import com.example.practice.exception.ResourceNotFoundException;
import com.example.practice.security.AuthUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Set;

@Service
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);
    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("productId", "category", "name", "brand", "price", "stock");

    @Autowired
    private ProductRepo productRepository;

    @Autowired
    private AuthUtil authUtil;

    public ProductResponse addProduct(ProductRequest request) {
        User user = authUtil.getCurrentUser();
        log.info("Adding product for user: {}", user.getId());

        Product product = toEntity(request);
        product.setOwner(user);

        Product saved = productRepository.save(product);
        log.info("Product saved with id: {}", saved.getProductId());
        return toResponse(saved);
    }

    public Page<ProductResponse> getAllProductsPaginated(int page, int size, String sortBy) {
        User user = authUtil.getCurrentUser();
        Pageable pageable = buildPageable(page, size, sortBy);

        return productRepository.findByOwnerAndIsDeleteTrue(user, pageable)
                .map(this::toResponse);
    }

    public Page<ProductResponse> getAccCategory(
            String category, int page, int size, String sortBy) {
        User user = authUtil.getCurrentUser();
        Pageable pageable = buildPageable(page, size, sortBy);

        return productRepository.findByCategoryAndOwnerAndIsDeleteTrue(
                        normalizeText(category), user, pageable)
                .map(this::toResponse);
    }

    public ProductResponse getProductById(int id) {
        User user = authUtil.getCurrentUser();

        Product product = productRepository
                .findByProductIdAndOwnerAndIsDeleteTrue(id, user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product with id " + id + " not found"
                ));
        return toResponse(product);
    }

    public Page<ProductResponse> getProductlessStock(
            int minStock, int page, int size, String sortBy) {
        User user = authUtil.getCurrentUser();
        Pageable pageable = buildPageable(page, size, sortBy);

        return productRepository.findByStockLessThanAndOwnerAndIsDeleteTrue(
                        minStock, user, pageable)
                .map(this::toResponse);
    }

    public void deleteProduct(int id) {
        User user = authUtil.getCurrentUser();

        Product product = productRepository.findByProductIdAndOwnerAndIsDeleteTrue(id, user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product with id " + id + " not found"
                ));

        product.setIsDelete(false);
        productRepository.save(product);
        log.info("Product {} soft-deleted by user {}", id, user.getId());
    }

    public ProductResponse upsertProduct(int id, ProductRequest request) {
        User user = authUtil.getCurrentUser();

        Product product = productRepository
                .findByProductIdAndOwnerAndIsDeleteTrue(id, user)
                .orElse(new Product());

        applyRequest(product, request);
        product.setOwner(user);

        return toResponse(productRepository.save(product));
    }
    public Page<ProductResponse> searchProductByName(
            String name,int page,int size,String sortBy){
        User user = authUtil.getCurrentUser();
        Pageable pageable = buildPageable(page,size,sortBy);

        return productRepository.findByNameContainingIgnoreCaseAndOwnerAndIsDeleteTrue(
                normalizeText(name), user,pageable
        ).map(this::toResponse);
    }
    private Pageable buildPageable(int page, int size, String sortBy) {
        String normalizedSort = normalizeText(sortBy);
        if (!ALLOWED_SORT_FIELDS.contains(normalizedSort)) {
            throw new BadRequestException(
                    "Invalid sortBy value. Allowed values: " + String.join(", ", ALLOWED_SORT_FIELDS)
            );
        }
        return PageRequest.of(page, size, Sort.by(normalizedSort).ascending());
    }

    private Product toEntity(ProductRequest request) {
        Product product = new Product();
        applyRequest(product, request);
        return product;
    }

    private void applyRequest(Product product, ProductRequest request) {
        product.setCategory(normalizeText(request.getCategory()));
        product.setName(normalizeText(request.getName()));
        product.setBrand(normalizeText(request.getBrand()));
        product.setPrice(normalizePrice(request.getPrice()));
        product.setStock(request.getStock());
    }

    private ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setProductId(product.getProductId());
        response.setCategory(product.getCategory());
        response.setName(product.getName());
        response.setBrand(product.getBrand());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        return response;
    }

    private String normalizeText(String value) {
        return value == null ? null : value.trim();
    }

    private BigDecimal normalizePrice(BigDecimal price) {
        return price.setScale(2, RoundingMode.HALF_UP);
    }
}
