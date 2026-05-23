package com.example.practice.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.SerializationUtils;

import java.util.Base64;

@Component
public class HttpCookieOAuth2AuthorizationRequestRepository
        implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

    private static final Logger log = LoggerFactory.getLogger(
            HttpCookieOAuth2AuthorizationRequestRepository.class
    );
    public static final String OAUTH2_COOKIE_NAME = "oauth2_auth_request";
    private static final int COOKIE_EXPIRE_SECONDS = 180;

    @Override
    public void saveAuthorizationRequest(
            OAuth2AuthorizationRequest authorizationRequest,
            HttpServletRequest request,
            HttpServletResponse response) {

        if (authorizationRequest == null) {
            deleteCookie(response, OAUTH2_COOKIE_NAME);
            return;
        }

        try {
            byte[] serialized = SerializationUtils.serialize(authorizationRequest);
            if (serialized == null) {
                throw new IllegalStateException("OAuth2 request serialization returned null");
            }
            String encoded = Base64.getUrlEncoder().encodeToString(serialized);

            Cookie cookie = new Cookie(OAUTH2_COOKIE_NAME, encoded);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(COOKIE_EXPIRE_SECONDS);
            response.addCookie(cookie);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to save OAuth2 state in cookie", e
            );
        }
    }

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(
            HttpServletRequest request) {

        String value = getCookieValue(request, OAUTH2_COOKIE_NAME);
        if (value == null) return null;

        try {
            byte[] decoded = Base64.getUrlDecoder().decode(value);
            Object deserialized = SerializationUtils.deserialize(decoded);
            if (deserialized instanceof OAuth2AuthorizationRequest authorizationRequest) {
                return authorizationRequest;
            }
            log.warn("OAuth2 cookie did not contain an OAuth2AuthorizationRequest");
            return null;
        } catch (Exception e) {
            log.warn("Failed to load OAuth2 authorization request from cookie", e);
            return null;
        }
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(
            HttpServletRequest request,
            HttpServletResponse response) {

        OAuth2AuthorizationRequest authRequest =
                loadAuthorizationRequest(request);
        deleteCookie(response, OAUTH2_COOKIE_NAME);
        return authRequest;
    }

    private String getCookieValue(HttpServletRequest request,
                                  String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    private void deleteCookie(HttpServletResponse response,
                              String name) {
        Cookie cookie = new Cookie(name, "");
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}
