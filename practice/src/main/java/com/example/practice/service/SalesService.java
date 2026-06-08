package com.example.practice.service;

import com.example.practice.Entity.Product;
import com.example.practice.Entity.Sale;
import com.example.practice.Entity.SalesItem;
import com.example.practice.Entity.User;
import com.example.practice.Repo.ProductRepo;
import com.example.practice.Repo.SaleItemRepo;
import com.example.practice.Repo.SaleRepo;
import com.example.practice.dto.SaleItemRequest;
import com.example.practice.dto.SaleItemResponse;
import com.example.practice.dto.SaleRequest;
import com.example.practice.dto.SaleResponse;
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
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class SalesService {

    private static final Logger log = LoggerFactory.getLogger(SalesService.class);
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("saleId", "saleDate");

    @Autowired
    private SaleRepo saleRepository;

    @Autowired
    private ProductRepo productRepository;

    @Autowired
    private SaleItemRepo itemRepo;

    @Autowired
    private AuthUtil authUtil;

    @Transactional
    public SaleResponse createSale(SaleRequest request) {
        User user = authUtil.getCurrentUser();
        Map<Product, Integer> requestedProducts = lockAndAggregateProducts(user, request.getItems());

        log.info("Creating sale with {} items for user: {}",
                request.getItems().size(), user.getEmail());

        Sale sale = new Sale();
        sale.setSaleDate(request.getSaleDate());
        sale.setSaleTime(request.getSaleTime() != null ? request.getSaleTime() : LocalTime.now());
        sale.setOwner(user);

        List<SalesItem> itemEntities = new ArrayList<>();
        requestedProducts.forEach((product, quantity) -> {
            product.setStock(product.getStock() - quantity);

            SalesItem item = new SalesItem();
            item.setSale(sale);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setAmount(calculateAmount(product.getPrice(), quantity));
            itemEntities.add(item);

            log.info("Stock updated for: {}. Remaining: {}",
                    product.getName(), product.getStock());
        });

        sale.setItems(itemEntities);
        Sale savedSale = saleRepository.save(sale);
        log.info("Sale {} created by user {}", savedSale.getSaleId(), user.getEmail());

        return toResponse(savedSale);
    }

    @Transactional(readOnly = true)
    public Page<SaleResponse> fetchsales(int page, int size, String sortBy) {
        User user = authUtil.getCurrentUser();
        log.info("Fetching sales for user: {}", user.getId());
        Pageable pageable = buildPageable(page, size, sortBy);

        return saleRepository.findByOwner(user, pageable)
                .map(this::toSummaryResponse);
    }

    @Transactional(readOnly = true)
    public SaleResponse byId(int id) {
        User user = authUtil.getCurrentUser();

        Sale sale = saleRepository.findBySaleIdAndOwner(id, user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sale with id " + id + " not found"
                ));
        return toResponse(sale);
    }

    @Transactional(readOnly = true)
    public List<SaleResponse> salesOfParticularDate(LocalDate date) {
        User user = authUtil.getCurrentUser();

        return saleRepository.findBySaleDateAndOwner(date, user)
                .stream()
                .map(this::toSummaryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<SaleResponse> SalesBetweenDate(
            LocalDate d1, LocalDate d2, int page, int size, String sortBy) {
        User user = authUtil.getCurrentUser();

        if (d1.isAfter(d2)) {
            throw new BadRequestException("Start date cannot be after end date");
        }

        Pageable pageable = buildPageable(page, size, sortBy);

        return saleRepository.findBySaleDateBetweenAndOwner(d1, d2, user, pageable)
                .map(this::toSummaryResponse);
    }

    @Transactional(readOnly = true)
    public List<SaleItemResponse> salesOfParticularProduct(int productId) {
        User user = authUtil.getCurrentUser();

        Product product = productRepository.findByProductIdAndOwner(productId, user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product with id " + productId + " not found"
                ));

        return itemRepo.findByProduct_ProductId(product.getProductId())
                .stream()
                .map(this::toSaleItemResponse)
                .collect(Collectors.toList());
    }


    private Pageable buildPageable(int page, int size, String sortBy) {
        String normalizedSort = sortBy == null ? "" : sortBy.trim();
        if (!ALLOWED_SORT_FIELDS.contains(normalizedSort)) {
            throw new BadRequestException(
                    "Invalid sortBy value. Allowed values: " + String.join(", ", ALLOWED_SORT_FIELDS)
            );
        }
        return PageRequest.of(page, size, Sort.by(normalizedSort).descending());
    }

    private Map<Product, Integer> lockAndAggregateProducts(
            User user, List<SaleItemRequest> items) {
        Map<Integer, Integer> requestedQuantitiesByProductId = new TreeMap<>();
        for (SaleItemRequest itemRequest : items) {
            requestedQuantitiesByProductId.merge(
                    itemRequest.getProductId(),
                    itemRequest.getQuantity(),
                    Integer::sum
            );
        }

        Map<Product, Integer> requestedProducts = new LinkedHashMap<>();

        for (Map.Entry<Integer, Integer> entry : requestedQuantitiesByProductId.entrySet()) {
            int productId = entry.getKey();
            int requestedQuantity = entry.getValue();

            Product product = productRepository
                    .findWithLockByProductIdAndOwner(productId, user)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product with id " + productId + " not found"
                    ));

            if (product.getStock() < requestedQuantity) {
                log.warn("Insufficient stock for: {}. Available: {}, Requested: {}",
                        product.getName(), product.getStock(), requestedQuantity);
                throw new BadRequestException(
                        "Not enough stock for: " + product.getName()
                                + " | Available: " + product.getStock()
                                + " | Requested: " + requestedQuantity
                );
            }

            requestedProducts.put(product, requestedQuantity);
        }

        return requestedProducts;
    }

    private SaleResponse toResponse(Sale sale) {
        SaleResponse response = new SaleResponse();
        response.setSaleId(sale.getSaleId());
        response.setSaleDate(sale.getSaleDate());
        response.setSaleTime(sale.getSaleTime());

        List<SaleItemResponse> itemResponses = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (SalesItem item : sale.getItems()) {
            SaleItemResponse itemResponse = new SaleItemResponse();
            itemResponse.setId(item.getId());
            itemResponse.setSaleId(sale.getSaleId());
            itemResponse.setSaleDate(sale.getSaleDate());
            itemResponse.setSaleTime(sale.getSaleTime());
            itemResponse.setProductId(item.getProduct().getProductId());
            itemResponse.setProductName(item.getProduct().getName());
            itemResponse.setCategory(item.getProduct().getCategory());
            itemResponse.setBrand(item.getProduct().getBrand());
            itemResponse.setPrice(item.getProduct().getPrice());
            itemResponse.setQuantity(item.getQuantity());
            itemResponse.setAmount(item.getAmount());
            total = total.add(item.getAmount());
            itemResponses.add(itemResponse);
        }

        response.setItems(itemResponses);
        response.setItemCount(itemResponses.size());
        response.setTotalAmount(total.setScale(2, RoundingMode.HALF_UP));
        return response;
    }

    private SaleResponse toSummaryResponse(Sale sale) {
        SaleResponse response = new SaleResponse();
        response.setSaleId(sale.getSaleId());
        response.setSaleDate(sale.getSaleDate());
        response.setSaleTime(sale.getSaleTime());
        response.setItems(List.of());
        response.setItemCount(itemRepo.countBySale_SaleId(sale.getSaleId()));
        response.setTotalAmount(
                itemRepo.sumAmountBySaleId(sale.getSaleId())
                        .setScale(2, RoundingMode.HALF_UP)
        );
        return response;
    }

    private SaleItemResponse toSaleItemResponse(SalesItem salesItem) {
        SaleItemResponse response = new SaleItemResponse();
        response.setId(salesItem.getId());
        response.setSaleId(salesItem.getSale().getSaleId());
        response.setSaleDate(salesItem.getSale().getSaleDate());
        response.setSaleTime(salesItem.getSale().getSaleTime());
        response.setProductId(salesItem.getProduct().getProductId());
        response.setProductName(salesItem.getProduct().getName());
        response.setCategory(salesItem.getProduct().getCategory());
        response.setBrand(salesItem.getProduct().getBrand());
        response.setPrice(salesItem.getProduct().getPrice());
        response.setAmount(salesItem.getAmount());
        response.setQuantity(salesItem.getQuantity());
        return response;
    }

    private BigDecimal calculateAmount(BigDecimal price, int quantity) {
        return price.multiply(BigDecimal.valueOf(quantity))
                .setScale(2, RoundingMode.HALF_UP);
    }
}
