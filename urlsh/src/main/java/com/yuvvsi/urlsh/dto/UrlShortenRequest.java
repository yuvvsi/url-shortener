package com.yuvvsi.urlsh.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UrlShortenRequest {
    private String longUrl;
    private Integer expiryMinutes;
}