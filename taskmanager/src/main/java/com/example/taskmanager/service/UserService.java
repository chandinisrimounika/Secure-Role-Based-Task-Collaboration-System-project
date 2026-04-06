package com.example.taskmanager.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ REGISTER USER
    public User register(User user) {

        // 🔥 Check if email already exists
        if (repository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 🔥 Default role (if not provided)
        if (user.getRole() == null) {
            user.setRole("USER");
        }

        return repository.save(user);
    }

    // ✅ LOGIN USER
    public User login(String email, String password) {

        User user = repository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    // 🔥 ADMIN: GET ALL USERS
    public List<User> getAllUsers() {
        return repository.findAll();
    }

    // 🔥 ADMIN: DELETE USER
    public void deleteUser(Long id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        repository.deleteById(id);
    }
}