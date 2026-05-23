package com.example.practice.security;

import com.example.practice.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger log =
            LoggerFactory.getLogger(JwtFilter.class);

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JWTService jwtService;

    // ─── Skip OAuth URLs completely ────────────────────
    // OAuth flow must never go through JWT filter
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/oauth2/")
                || path.startsWith("/login/oauth2/")
                || path.equals("/auth/logout")
                || path.startsWith("/swagger-ui/")
                || path.startsWith("/v3/api-docs");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = null;
        String email = null;

        // ─── Read from HttpOnly cookie ─────────────────
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("jwt")) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        // ─── Fallback to Authorization header (Postman) ─
        if (token == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null &&
                    authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        // ─── Validate token ────────────────────────────
        if (token != null) {
            try {
                email = jwtService.extractUserName(token);
            } catch (Exception e) {
                log.warn("Invalid JWT: {}", e.getMessage());
                filterChain.doFilter(request, response);
                return;
            }
        }

        if (email != null &&
                SecurityContextHolder.getContext()
                        .getAuthentication() == null) {

            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(email);

            if (jwtService.validateToken(token, userDetails)) {

                // check if login person is trying to login and register again
                if (request.getRequestURI().equals("/auth/login")
                        || request.getRequestURI().equals("/auth/register")
                        || request.getRequestURI().equals("/auth/google")) {
                    response.setStatus(HttpServletResponse.SC_CONFLICT);
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write(
                            "{\"status\":409,\"message\":\"You are already logged in. Please logout first.\"}"
                    );
                    response.getWriter().flush();
                    return;
                }
                //--------------------------------------------
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );
                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
                log.info("JWT authenticated: {}", email);
            }
        }

        filterChain.doFilter(request, response);
    }
}