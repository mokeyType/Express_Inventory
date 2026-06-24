package com.example.practice.security;

import com.example.practice.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.util.ReflectionTestUtils;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtFilterTest {

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private JWTService jwtService;

    @Mock
    private JwtCookieService jwtCookieService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Test
    void staleJwtIsClearedAndRequestContinuesWhenUserWasDeleted() throws Exception {
        JwtFilter filter = new JwtFilter();
        ReflectionTestUtils.setField(filter, "userDetailsService", userDetailsService);
        ReflectionTestUtils.setField(filter, "jwtService", jwtService);
        ReflectionTestUtils.setField(filter, "jwtCookieService", jwtCookieService);

        when(request.getCookies()).thenReturn(new Cookie[]{new Cookie("jwt", "stale-token")});
        when(jwtService.extractUserName("stale-token")).thenReturn("deleted@example.com");
        when(userDetailsService.loadUserByUsername("deleted@example.com"))
                .thenThrow(new UsernameNotFoundException("User not found"));

        filter.doFilterInternal(request, response, filterChain);

        verify(jwtCookieService).clearJwtCookie(response);
        verify(filterChain).doFilter(request, response);
    }
}
