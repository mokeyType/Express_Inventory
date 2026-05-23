package com.example.practice.config;

import com.example.practice.Entity.User;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Inventory Management System API")
                        .version("1.0")
                        .description("Backend API for managing products, stock and sales")
                        .contact(new Contact()
                                .name("ANUJ MEHTA")
                                .email("asmehta667@gmail.com")
                        )
                );
    }

    @Component
    public static class AuthUtil {

        public User getCurrentUser() {
            // JwtFilter sets the User object as principal
            // so we can cast it directly — no DB call needed
            return (User) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();
        }
    }
}