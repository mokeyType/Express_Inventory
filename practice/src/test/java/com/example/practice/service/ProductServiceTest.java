package com.example.practice.service;

import com.example.practice.Entity.User;
import com.example.practice.Repo.ProductRepo;
import com.example.practice.exception.BadRequestException;
import com.example.practice.security.AuthUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepo productRepo;

    @Mock
    private AuthUtil authUtil;

    @InjectMocks
    private ProductService productService;

    @Test
    void rejectsUnknownSortField() {
        User user = new User();
        when(authUtil.getCurrentUser()).thenReturn(user);

        assertThatThrownBy(() -> productService.getAllProductsPaginated(0, 10, "owner"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Invalid sortBy value");
    }

    @Test
    void rejectsUnknownSortFieldForCategoryQuery() {
        User user = new User();
        when(authUtil.getCurrentUser()).thenReturn(user);

        assertThatThrownBy(() -> productService.getAccCategory("Electronics", 0, 10, "createdAt"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Invalid sortBy value");
    }
}
