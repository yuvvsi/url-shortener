package com.yuvvsi.urlsh.controller;

import com.yuvvsi.urlsh.dto.AuthRequest;
import com.yuvvsi.urlsh.dto.AuthResponse;
import com.yuvvsi.urlsh.dto.RegisterRequest;
import com.yuvvsi.urlsh.model.User;
import com.yuvvsi.urlsh.security.JwtService;
import com.yuvvsi.urlsh.service.UserServiceImpl;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserServiceImpl userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // Constructor Injection
    public AuthController(UserServiceImpl userService,
                          JwtService jwtService,
                          AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    // 📝 REGISTER
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(
            @Valid @RequestBody RegisterRequest request
            ) {
        User registeredUser = userService.registerUser(request);
        return ResponseEntity.ok(registeredUser);
    }

    // 🔐 LOGIN
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {

        // Authenticate credentials (Spring Security checks password)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Load user details
        UserDetails userDetails = userService.loadUserByUsername(request.getUsername());

        // Generate JWT
        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(token));
    }
}