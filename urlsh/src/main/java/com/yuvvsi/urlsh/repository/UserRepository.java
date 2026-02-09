package com.yuvvsi.urlsh.repository;

import com.yuvvsi.urlsh.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by username
    Optional<User> findByUsername(String username);

    // Optional: find a user by email
    Optional<User> findByEmail(String email);

    // Optional: check if username exists
    boolean existsByUsername(String username);

    // Optional: check if email exists
    boolean existsByEmail(String email);
}
