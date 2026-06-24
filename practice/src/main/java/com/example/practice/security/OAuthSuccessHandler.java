package com.example.practice.security;

import com.example.practice.Entity.User;
import com.example.practice.Repo.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuthSuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger log =
            LoggerFactory.getLogger(OAuthSuccessHandler.class);

    @Autowired
    private JWTService jwtService;

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private HttpCookieOAuth2AuthorizationRequestRepository
            cookieRepository;

    @Autowired
    private JwtCookieService jwtCookieService;

    @Value("${app.oauth.success-redirect:https://express-inventory.vercel.app/}")
    private String successRedirect;

    @Value("${app.security.cookies.secure:false}")
    private boolean secureCookies;

    @Value("${app.security.cookies.same-site:Lax}")
    private String sameSite;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException {

        // Step 1 — get user info from Google
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name  = oauthUser.getAttribute("name");

        log.info("OAuth success for: {}", email);

        // Step 2 — find or register user
        User user = userRepository.findByEmail(email).orElse(null);

        // Step 3 — handle provider mismatch
        // LOCAL user trying to login via Google
        if (user != null &&
                user.getAuthProvider() == User.AuthProvider.LOCAL) {

            log.warn("LOCAL user tried OAuth: {}", email);

            clearOAuthCookie(response);

            // ← mastikaley end response — return JSON, no redirect
            writeJsonResponse(
                    response,
                    HttpServletResponse.SC_FORBIDDEN,
                    "error",
                    "This email is registered with email and password. " +
                            "Please log in using your email and password."
            );
            return;  // ← stop here, nothing else runs
        }

        // Step 4 — register new Google user if not exists
        if (user == null) {
            log.info("New OAuth user registering: {}", email);

            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setPassword(null);            // OAuth users have no password
            user.setRole(User.Role.USER);      // ← must set role
            user.setAuthProvider(User.AuthProvider.GOOGLE);

            user = userRepository.save(user);
            log.info("OAuth user registered: {}", email);
        }

        // Step 5 — generate JWT
        String token = jwtService.generateToken(user);

        // Step 6 — set JWT in HttpOnly cookie
        jwtCookieService.addJwtCookie(response, token);

        // Step 7 — clean up OAuth state cookie
        clearOAuthCookie(response);

        clearAuthenticationAttributes(request);

        log.info("OAuth login complete for: {}", email);

        // Step 8 — mastikaley end response — return JSON, no redirect
//        writeJsonResponse(
//                response,
//                HttpServletResponse.SC_OK,
//                "message",
//                "OAuth login successful"
//        );
        response.sendRedirect(successRedirect);
        // ← no redirect, no further code, response ends here ✅
    }

    // ─── Helpers ───────────────────────────────────────

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

    private void writeJsonResponse(HttpServletResponse response,
                                   int status,
                                   String key,
                                   String value)
            throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(
                "{\"" + key + "\": \"" + value + "\"}"
        );
        response.getWriter().flush();
        // ← flush ends the response completely
        // nothing can be written after this
    }
}
