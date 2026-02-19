package com.yuvvsi.urlsh.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
public class UrlShortenResponse {
    // getter
    private final String shortCode;
    private final String longUrl;
    private final LocalDateTime expiresAt;

    public UrlShortenResponse(String shortCode, String longUrl, LocalDateTime expiresAt) {
        this.shortCode = shortCode;
        this.longUrl=longUrl;
        this.expiresAt=expiresAt;
    }


}

