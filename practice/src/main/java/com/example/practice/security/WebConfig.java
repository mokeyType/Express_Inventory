package com.example.practice.security;

import com.example.practice.service.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.NullSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class WebConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private OAuthSuccessHandler successHandler;

    @Autowired
    private HttpCookieOAuth2AuthorizationRequestRepository
            cookieRepository;

    @Autowired
    private OAuthFailureHandler failureHandler;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())

                // ─── Fully stateless — no session ever ────
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // ─── Prevent Spring from saving SecurityContext in session
                .securityContext(ctx -> ctx
                        .securityContextRepository(
                                new NullSecurityContextRepository()
                        )
                )

                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                // ─── Public endpoints ──────────────────────
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/auth/**",
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/"
                        ).permitAll()
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )

                // ─── 401 JSON instead of redirect to login ─
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.setContentType("application/json");
                            res.setCharacterEncoding("UTF-8");
                            res.getWriter().write(
                                    "{\"error\": \"Unauthorized. Please login.\"}"
                            );
                            res.getWriter().flush();
                        })
                )

                // ─── OAuth2 with cookie based state storage ─
                // cookieRepository replaces session for storing OAuth state
                .oauth2Login(oauth -> oauth
                        .authorizationEndpoint(endpoint -> endpoint
                                .authorizationRequestRepository(cookieRepository)
                        )
                        .successHandler(successHandler)
                        .failureHandler(failureHandler)
                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(5);
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(
                List.of(allowedOrigins.split(","))
                        .stream()
                        .map(String::trim)
                        .filter(origin -> !origin.isBlank())
                        .toList()
        );
        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
