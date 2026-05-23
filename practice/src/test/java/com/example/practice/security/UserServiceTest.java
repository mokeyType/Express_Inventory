package com.example.practice.security;

import com.example.practice.Entity.User;
import com.example.practice.Repo.UserRepo;
import com.example.practice.dto.LoginRequest;
import com.example.practice.dto.RegisterRequest;
import com.example.practice.exception.AuthenticationFailedException;
import com.example.practice.exception.ConflictException;
import com.example.practice.exception.WrongAuthProviderException;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private JWTService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtCookieService jwtCookieService;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private UserService userService;

    @Test
    void registerAlwaysCreatesUserRole() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Anuj");
        request.setEmail("Anuj@Example.com");
        request.setPassword("password123");

        when(userRepo.existsByEmail("anuj@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed");
        when(userRepo.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            ReflectionTestUtils.setField(saved, "id", 7);
            return saved;
        });
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");

        userService.register(request, response);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepo).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();

        assertThat(savedUser.getRole()).isEqualTo(User.Role.USER);
        assertThat(savedUser.getAuthProvider()).isEqualTo(User.AuthProvider.LOCAL);
        assertThat(savedUser.getEmail()).isEqualTo("anuj@example.com");
        verify(jwtCookieService).addJwtCookie(response, "jwt-token");
    }

    @Test
    void registerRejectsDuplicateLocalEmail() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Anuj");
        request.setEmail("anuj@example.com");
        request.setPassword("password123");

        User existing = new User();
        existing.setAuthProvider(User.AuthProvider.LOCAL);

        when(userRepo.existsByEmail("anuj@example.com")).thenReturn(true);
        when(userRepo.findByEmail("anuj@example.com")).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> userService.register(request, response))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Email already registered");
    }

    @Test
    void loginRejectsGoogleOnlyAccount() {
        LoginRequest request = new LoginRequest();
        request.setEmail("anuj@example.com");
        request.setPassword("password123");

        User existing = new User();
        existing.setAuthProvider(User.AuthProvider.GOOGLE);

        when(userRepo.findByEmail("anuj@example.com")).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> userService.verify(request, response))
                .isInstanceOf(WrongAuthProviderException.class);
    }

    @Test
    void loginMapsBadCredentialsToAuthenticationFailure() {
        LoginRequest request = new LoginRequest();
        request.setEmail("anuj@example.com");
        request.setPassword("wrong-password");

        User existing = new User();
        existing.setAuthProvider(User.AuthProvider.LOCAL);
        existing.setRole(User.Role.USER);
        existing.setEmail("anuj@example.com");
        existing.setName("Anuj");

        when(userRepo.findByEmail("anuj@example.com")).thenReturn(Optional.of(existing));
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThatThrownBy(() -> userService.verify(request, response))
                .isInstanceOf(AuthenticationFailedException.class)
                .hasMessage("Invalid email or password");
        verify(jwtCookieService, never()).addJwtCookie(eq(response), any());
    }
}
