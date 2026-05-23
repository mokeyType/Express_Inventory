package com.example.practice.service;

import com.example.practice.Entity.Product;
import com.example.practice.Entity.User;
import com.example.practice.Repo.ProductRepo;
import com.example.practice.Repo.SaleItemRepo;
import com.example.practice.Repo.SaleRepo;
import com.example.practice.dto.SaleItemRequest;
import com.example.practice.dto.SaleRequest;
import com.example.practice.dto.SaleResponse;
import com.example.practice.exception.BadRequestException;
import com.example.practice.security.AuthUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SalesServiceTest {

    @Mock
    private SaleRepo saleRepo;

    @Mock
    private ProductRepo productRepo;

    @Mock
    private SaleItemRepo itemRepo;

    @Mock
    private AuthUtil authUtil;

    @InjectMocks
    private SalesService salesService;

    @Test
    void rejectsUnknownSortField() {
        User user = new User();
        when(authUtil.getCurrentUser()).thenReturn(user);

        assertThatThrownBy(() -> salesService.fetchsales(0, 5, "owner"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Invalid sortBy value");
    }

    @Test
    void rejectsDateRangeInWrongOrder() {
        User user = new User();
        when(authUtil.getCurrentUser()).thenReturn(user);

        assertThatThrownBy(() -> salesService.SalesBetweenDate(
                LocalDate.now(),
                LocalDate.now().minusDays(1),
                0,
                5,
                "saleDate"
        )).isInstanceOf(BadRequestException.class)
                .hasMessage("Start date cannot be after end date");
    }

    @Test
    void createSaleAggregatesDuplicateItemsBeforeDeductingStock() {
        User user = new User();
        user.setEmail("anuj@example.com");
        when(authUtil.getCurrentUser()).thenReturn(user);

        Product product = new Product();
        ReflectionTestUtils.setField(product, "productId", 11);
        product.setName("Keyboard");
        product.setStock(5);
        product.setPrice(new BigDecimal("10.50"));

        when(productRepo.findWithLockByProductIdAndOwner(11, user))
                .thenReturn(Optional.of(product));
        when(saleRepo.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        SaleRequest request = new SaleRequest();
        request.setSaleDate(LocalDate.now());
        request.setItems(List.of(
                item(11, 2),
                item(11, 1)
        ));

        SaleResponse response = salesService.createSale(request);

        assertThat(product.getStock()).isEqualTo(2);
        assertThat(response.getItems()).hasSize(1);
        assertThat(response.getItems().get(0).getAmount()).isEqualByComparingTo("31.50");
        assertThat(response.getTotalAmount()).isEqualByComparingTo("31.50");
    }

    @Test
    void createSaleRejectsCombinedDuplicateQuantityWhenStockIsTooLow() {
        User user = new User();
        user.setEmail("anuj@example.com");
        when(authUtil.getCurrentUser()).thenReturn(user);

        Product product = new Product();
        product.setName("Mouse");
        product.setStock(2);
        product.setPrice(new BigDecimal("20.00"));

        when(productRepo.findWithLockByProductIdAndOwner(9, user))
                .thenReturn(Optional.of(product));

        SaleRequest request = new SaleRequest();
        request.setSaleDate(LocalDate.now());
        request.setItems(List.of(
                item(9, 1),
                item(9, 2)
        ));

        assertThatThrownBy(() -> salesService.createSale(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Not enough stock for: Mouse");
    }

    private SaleItemRequest item(int productId, int quantity) {
        SaleItemRequest item = new SaleItemRequest();
        item.setProductId(productId);
        item.setQuantity(quantity);
        return item;
    }
}
