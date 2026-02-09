package com.yuvvsi.urlsh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ClickDetailResponse {
    private LocalDateTime timestamp;
    private String ipAddress;
    private String userAgent;
}
