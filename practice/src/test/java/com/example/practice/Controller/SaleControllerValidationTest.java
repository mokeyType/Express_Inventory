package com.example.practice.Controller;

import com.example.practice.exception.BadRequestException;
import com.example.practice.exception.GlobalExceptionHandler;
import com.example.practice.service.SalesService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class SaleControllerValidationTest {

    private MockMvc mockMvc;
    private SalesService service;
    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @BeforeEach
    void setUp() {
        service = Mockito.mock(SalesService.class);
        SaleController controller = new SaleController(service);

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void createSaleRejectsFutureDate() throws Exception {
        String requestBody = objectMapper.writeValueAsString(new SalePayload(
                LocalDate.now().plusDays(1),
                List.of(new SaleItemPayload(1, 2))
        ));

        mockMvc.perform(post("/sales/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                        .value("saleDate: Sale date cannot be in the future"));
    }

    @Test
    void salesBetweenDatesMapsBusinessRuleFailure() throws Exception {
        LocalDate today = LocalDate.now();
        when(service.SalesBetweenDate(today, today.minusDays(1), 0, 3, "saleDate"))
                .thenThrow(new BadRequestException("Start date cannot be after end date"));

        mockMvc.perform(get("/sales/between")
                        .param("date1", today.toString())
                        .param("date2", today.minusDays(1).toString())
                        .param("sortBy", "saleDate"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                        .value("Start date cannot be after end date"));
    }

    private record SalePayload(LocalDate saleDate, List<SaleItemPayload> items) {
    }

    private record SaleItemPayload(Integer productId, Integer quantity) {
    }
}
