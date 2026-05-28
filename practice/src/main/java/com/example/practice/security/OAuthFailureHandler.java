package com.example.practice.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${app.oauth.failure-redirect}")
    private String failureRedirect;

    @Value("${app.security.cookies.secure:false}")
    private boolean secureCookies;

    @Value("${app.security.cookies.same-site:Lax}")
    private String sameSite;

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
        response.sendRedirect(failureRedirect);
    }

    private void clearOAuthCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie
                .from(HttpCookieOAuth2AuthorizationRequestRepository.OAUTH2_COOKIE_NAME, "")
                .path("/")
                .httpOnly(true)
                .secure(secureCookies)
                .sameSite(sameSite)
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
