package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.JwtService;
import com.example.demo.service.UserService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UserService userService;

    public AuthController(UserService userService, AuthenticationManager authenticationManager, JwtService jwtService,
            UserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String token = jwtService.generateToken(userDetails);

        return Map.of("token", token);
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        // String email = request.get("email");
        String password = request.get("password");

        // Skapa en ny användare
        User newUser = new User();
        newUser.setUsername(username);
        // newUser.setEmail(email);
        newUser.setPassword(password); // Se till att lösenordet hashas i UserService

        userService.saveUser(newUser);

        // Generera en JWT-token för den nya användaren
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String token = jwtService.generateToken(userDetails);

        return Map.of("message", "User registered successfully", "token", token);
    }

}
