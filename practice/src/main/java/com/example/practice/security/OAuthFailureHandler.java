package com.example.practice.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuthFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuthFailureHandler.class);

    private final JwtCookieService jwtCookieService;

    public OAuthFailureHandler(JwtCookieService jwtCookieService) {
        this.jwtCookieService = jwtCookieService;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception)
            throws IOException {
        log.warn("OAuth login failed: {}", exception.getMessage());
        clearOAuthCookie(response);
        jwtCookieService.clearJwtCookie(response);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"error\": \"OAuth authentication failed\"}");
        response.getWriter().flush();
    }

    private void clearOAuthCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie
                .from(HttpCookieOAuth2AuthorizationRequestRepository.OAUTH2_COOKIE_NAME, "")
                .path("/")
                .httpOnly(true)
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
