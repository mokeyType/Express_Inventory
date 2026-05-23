package com.example.practice.security;

import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class OAuthFailureHandlerTest {

    @Mock
    private JwtCookieService jwtCookieService;

    @Test
    void writesConsistentUnauthorizedJsonResponse() throws Exception {
        OAuthFailureHandler handler = new OAuthFailureHandler(jwtCookieService);

        MockHttpServletResponse response = new MockHttpServletResponse();
        handler.onAuthenticationFailure(
                new MockHttpServletRequest(),
                response,
                new AuthenticationException("boom") { }
        );

        assertThat(response.getStatus()).isEqualTo(HttpServletResponse.SC_UNAUTHORIZED);
        assertThat(response.getContentType()).startsWith("application/json");
        assertThat(response.getContentAsString()).contains("OAuth authentication failed");
        verify(jwtCookieService).clearJwtCookie(response);
    }
}
