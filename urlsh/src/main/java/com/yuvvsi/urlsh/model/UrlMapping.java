package com.yuvvsi.urlsh.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "url_mappings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UrlMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "long_url", nullable = false)
    private String longUrl;

    @Column(name = "short_code", nullable = false, unique = true)
    private String shortCode;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "username", nullable = false)
    private String username; // who owns this URL

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
}
