package com.yuvvsi.urlsh.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Click {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String shortCode;   // which short link was clicked

    private String username;    // owner of the short link

    private String ipAddress;   // visitor IP

    @Column(length = 1000)
    private String userAgent;   // browser/device info

    private LocalDateTime clickedAt;
}