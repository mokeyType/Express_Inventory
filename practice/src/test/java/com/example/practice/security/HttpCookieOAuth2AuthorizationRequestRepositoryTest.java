package com.example.practice.security;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

import static org.assertj.core.api.Assertions.assertThat;

class HttpCookieOAuth2AuthorizationRequestRepositoryTest {

    @Test
    void savesAndLoadsAuthorizationRequestWithoutSession() {
        HttpCookieOAuth2AuthorizationRequestRepository repository =
                new HttpCookieOAuth2AuthorizationRequestRepository();
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        OAuth2AuthorizationRequest authorizationRequest = OAuth2AuthorizationRequest
                .authorizationCode()
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .clientId("google-client")
                .redirectUri("http://localhost:8080/login/oauth2/code/google")
                .state("state-123")
                .authorizationRequestUri(
                        "http://localhost:8080/oauth2/authorization/google?state=state-123"
                )
                .build();

        repository.saveAuthorizationRequest(authorizationRequest, request, response);

        Cookie cookie = response.getCookie(
                HttpCookieOAuth2AuthorizationRequestRepository.OAUTH2_COOKIE_NAME
        );
        assertThat(cookie).isNotNull();

        MockHttpServletRequest callbackRequest = new MockHttpServletRequest();
        callbackRequest.setCookies(cookie);

        OAuth2AuthorizationRequest loadedRequest =
                repository.loadAuthorizationRequest(callbackRequest);

        assertThat(loadedRequest).isNotNull();
        assertThat(loadedRequest.getState()).isEqualTo("state-123");
        assertThat(loadedRequest.getClientId()).isEqualTo("google-client");
        assertThat(loadedRequest.getRedirectUri()).isEqualTo(
                "http://localhost:8080/login/oauth2/code/google"
        );
    }

    @Test
    void removeAuthorizationRequestReturnsRequestAndClearsCookie() {
        HttpCookieOAuth2AuthorizationRequestRepository repository =
                new HttpCookieOAuth2AuthorizationRequestRepository();
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        OAuth2AuthorizationRequest authorizationRequest = OAuth2AuthorizationRequest
                .authorizationCode()
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .clientId("google-client")
                .redirectUri("http://localhost:8080/login/oauth2/code/google")
                .state("state-456")
                .authorizationRequestUri(
                        "http://localhost:8080/oauth2/authorization/google?state=state-456"
                )
                .build();

        repository.saveAuthorizationRequest(authorizationRequest, request, response);
        Cookie savedCookie = response.getCookie(
                HttpCookieOAuth2AuthorizationRequestRepository.OAUTH2_COOKIE_NAME
        );

        MockHttpServletRequest callbackRequest = new MockHttpServletRequest();
        callbackRequest.setCookies(savedCookie);
        MockHttpServletResponse callbackResponse = new MockHttpServletResponse();

        OAuth2AuthorizationRequest removedRequest =
                repository.removeAuthorizationRequest(callbackRequest, callbackResponse);

        assertThat(removedRequest).isNotNull();
        assertThat(removedRequest.getState()).isEqualTo("state-456");
        assertThat(callbackResponse.getHeader("Set-Cookie"))
                .contains("oauth2_auth_request=")
                .contains("Max-Age=0");
    }
}
