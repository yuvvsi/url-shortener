package com.yuvvsi.urlsh.dto;

import lombok.Getter;

@Getter
public class UrlShortenResponse {
    // getter
    private final String shortCode;
    private final String longUrl;

    public UrlShortenResponse(String shortCode, String longUrl) {
        this.shortCode = shortCode;
        this.longUrl=longUrl;
    }

}

