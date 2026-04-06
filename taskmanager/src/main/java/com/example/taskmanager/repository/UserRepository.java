package com.example.taskmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.taskmanager.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    // 🔥 NEW (for validation)
    boolean existsByEmail(String email);
}