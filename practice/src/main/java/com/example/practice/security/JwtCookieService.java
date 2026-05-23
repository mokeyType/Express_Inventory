package com.example.practice.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class JwtCookieService {

    private final boolean secureCookies;
    private final String sameSite;
    private final long jwtExpiration;

    public JwtCookieService(
            @Value("${app.security.cookies.secure:false}") boolean secureCookies,
            @Value("${app.security.cookies.same-site:Lax}") String sameSite,
            @Value("${jwt.expiration}") long jwtExpiration) {
        this.secureCookies = secureCookies;
        this.sameSite = sameSite;
        this.jwtExpiration = jwtExpiration;
    }

    public void addJwtCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(secureCookies)
                .sameSite(sameSite)
                .path("/")
                .maxAge(jwtExpiration / 1000)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void clearJwtCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(secureCookies)
                .sameSite(sameSite)
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
