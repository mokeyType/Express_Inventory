package com.example.practice.Controller;

import com.example.practice.exception.BadRequestException;
import com.example.practice.exception.GlobalExceptionHandler;
import com.example.practice.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ProductControllerValidationTest {

    private MockMvc mockMvc;
    private ProductService service;
    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @BeforeEach
    void setUp() {
        service = Mockito.mock(ProductService.class);
        ProductController controller = new ProductController(service);

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void addProductRejectsTooManyPriceDecimals() throws Exception {
        String requestBody = objectMapper.writeValueAsString(new ProductPayload(
                "Electronics",
                "Laptop",
                "Dell",
                new BigDecimal("12.999"),
                10
        ));

        mockMvc.perform(post("/product/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                        .value("price: Price must have up to 10 digits and 2 decimals"));
    }

    @Test
    void paginatedProductsMapsInvalidSortToBadRequest() throws Exception {
        when(service.getAllProductsPaginated(0, 10, "owner"))
                .thenThrow(new BadRequestException("Invalid sortBy value. Allowed values: productId"));

        mockMvc.perform(get("/product/all/paginated")
                        .param("sortBy", "owner"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                        .value("Invalid sortBy value. Allowed values: productId"));
    }

    private record ProductPayload(
            String category,
            String name,
            String brand,
            BigDecimal price,
            Integer stock) {
    }
}
