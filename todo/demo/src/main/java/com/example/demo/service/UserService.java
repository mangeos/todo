package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Spara en ny användare
    public User saveUser(User user) {
        // Hasha lösenordet innan det sparas
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Hämta en användare baserat på användarnamn
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Kontrollera om en användare redan finns
    public boolean userExists(String username) {
        return userRepository.findByUsername(username) != null;
    }
}