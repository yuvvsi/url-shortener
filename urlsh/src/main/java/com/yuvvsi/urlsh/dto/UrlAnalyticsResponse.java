package com.yuvvsi.urlsh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class UrlAnalyticsResponse {
    private String shortCode;
    private long totalClicks;
    private Map<String, Long> clicksByDate;
}