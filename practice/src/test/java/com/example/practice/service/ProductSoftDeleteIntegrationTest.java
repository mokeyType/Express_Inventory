package com.example.practice.service;

import com.example.practice.Entity.Product;
import com.example.practice.Entity.Sale;
import com.example.practice.Entity.SalesItem;
import com.example.practice.Entity.User;
import com.example.practice.Repo.ProductRepo;
import com.example.practice.Repo.SaleItemRepo;
import com.example.practice.Repo.SaleRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
        "app.oauth.success-redirect=http://localhost/success",
        "app.oauth.failure-redirect=http://localhost/failure",
        "app.cors.allowed-origins=http://localhost:5173",
        "spring.mail.username=test@example.com"
})
@Transactional
class ProductSoftDeleteIntegrationTest {

    @MockitoBean
    private JavaMailSender javaMailSender;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private SaleRepo saleRepo;

    @Autowired
    private SaleItemRepo saleItemRepo;

    @Autowired
    private com.example.practice.Repo.UserRepo userRepo;

    @Test
    void softDeletedProductDisappearsFromInventoryButRemainsInSalesHistory() {
        User owner = new User();
        owner.setEmail("soft-delete@example.com");
        owner.setPassword("password");
        owner.setName("Soft Delete Test");
        owner.setRole(User.Role.USER);
        owner.setAuthProvider(User.AuthProvider.LOCAL);
        owner = userRepo.save(owner);

        Product product = new Product("Accessories", "Keyboard", "Acme",
                new BigDecimal("50.00"), 10);
        product.setOwner(owner);
        product = productRepo.save(product);

        Sale sale = new Sale(LocalDate.now());
        sale.setOwner(owner);
        SalesItem item = new SalesItem(sale, product, 1, new BigDecimal("50.00"));
        sale.setItems(List.of(item));
        saleRepo.saveAndFlush(sale);

        product.setIsDelete(false);
        productRepo.saveAndFlush(product);

        assertThat(productRepo.findByOwnerAndIsDeleteTrue(owner, PageRequest.of(0, 10)))
                .isEmpty();
        assertThat(productRepo.findWithLockByProductIdAndOwnerAndIsDeleteTrue(
                product.getProductId(), owner)).isEmpty();
        assertThat(productRepo.findByProductIdAndOwner(product.getProductId(), owner))
                .isPresent();
        assertThat(saleItemRepo.findByProduct_ProductId(product.getProductId()))
                .hasSize(1);
    }
}
